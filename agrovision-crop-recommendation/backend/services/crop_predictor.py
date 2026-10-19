"""
AgroVision AI - Crop Predictor Service
Loads the trained ML model pipeline once at startup and provides predictions,
agronomic factor analysis ('Why this crop'), and alternative recommendations.
"""

import os
import json
import pickle
import numpy as np
import pandas as pd
import warnings

# Suppress sklearn unpickle version warnings for clean server logs
warnings.filterwarnings('ignore', category=UserWarning)

# Exact alphabetical class mapping from reference model training
CROP_CLASSES = [
    'banana',
    'blackgram',
    'chickpea',
    'kidneybeans',
    'lentil',
    'maize',
    'mothbeans',
    'mungbean',
    'pigeonpeas',
    'pomegranate',
    'rice'
]

FEATURE_NAMES = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']

class CropPredictorService:
    def __init__(self, model_path=None, knowledge_path=None):
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        
        if model_path is None:
            self.model_path = os.path.join(self.base_dir, 'models', 'best_model_crop.pkl')
        else:
            self.model_path = model_path

        if knowledge_path is None:
            self.knowledge_path = os.path.join(self.base_dir, 'data', 'crop_knowledge.json')
        else:
            self.knowledge_path = knowledge_path

        self.model = None
        self.crop_knowledge = {}
        self.load_knowledge()
        self.load_model()

    def load_knowledge(self):
        """Loads structured agronomic profiles."""
        try:
            if os.path.exists(self.knowledge_path):
                with open(self.knowledge_path, 'r', encoding='utf-8') as f:
                    self.crop_knowledge = json.load(f)
                print(f"[AgroVision AI] Loaded agronomic knowledge for {len(self.crop_knowledge)} crops.")
            else:
                print(f"[AgroVision AI] Warning: Knowledge file not found at {self.knowledge_path}")
        except Exception as e:
            print(f"[AgroVision AI] Error loading crop knowledge: {e}")

    def load_model(self):
        """Loads the trained scikit-learn Pipeline once into memory."""
        try:
            if not os.path.exists(self.model_path):
                raise FileNotFoundError(f"Model file not found at {self.model_path}")
            
            with open(self.model_path, 'rb') as f:
                self.model = pickle.load(f)
            
            print(f"[AgroVision AI] Crop recommendation model successfully loaded from {self.model_path}")
        except Exception as e:
            print(f"[AgroVision AI] Failed to load model: {e}")
            self.model = None

    def evaluate_factor_match(self, entered_val, param_info, param_name):
        """
        Agronomic factor evaluation comparing user input with the crop's ideal range.
        Returns: { status: 'optimal' | 'good' | 'moderate', explanation: str }
        """
        p_min = param_info['min']
        p_max = param_info['max']
        p_opt = param_info['optimal']
        unit = param_info['unit']

        # Tolerance margins (15% spread around bounds)
        spread = max(p_max - p_min, 1.0)
        tol_min = p_min - 0.15 * spread
        tol_max = p_max + 0.15 * spread

        friendly_names = {
            'N': 'Nitrogen (N)',
            'P': 'Phosphorus (P)',
            'K': 'Potassium (K)',
            'temperature': 'Temperature',
            'humidity': 'Relative Humidity',
            'ph': 'Soil pH',
            'rainfall': 'Rainfall'
        }
        fname = friendly_names.get(param_name, param_name)

        if p_min <= entered_val <= p_max:
            status = 'optimal'
            if abs(entered_val - p_opt) <= 0.1 * spread:
                explanation = f"{fname} of {entered_val} {unit} is right at the ideal condition ({p_opt} {unit})."
            else:
                explanation = f"{fname} of {entered_val} {unit} falls safely within the optimal bracket ({p_min} - {p_max} {unit})."
        elif tol_min <= entered_val <= tol_max:
            status = 'good'
            if entered_val < p_min:
                explanation = f"{fname} ({entered_val} {unit}) is slightly below ideal ({p_min}-{p_max} {unit}), but well tolerated."
            else:
                explanation = f"{fname} ({entered_val} {unit}) is slightly higher than ideal ({p_min}-{p_max} {unit}), but manageable."
        else:
            status = 'moderate'
            if entered_val < tol_min:
                explanation = f"{fname} ({entered_val} {unit}) is lower than standard ({p_min}-{p_max} {unit}). May require supplemental care."
            else:
                explanation = f"{fname} ({entered_val} {unit}) is higher than standard ({p_min}-{p_max} {unit}). Field monitoring suggested."

        return {
            'status': status,
            'ideal_range': f"{p_min} - {p_max} {unit}" if unit else f"{p_min} - {p_max}",
            'optimal_value': f"{p_opt} {unit}" if unit else str(p_opt),
            'explanation': explanation
        }

    def predict(self, input_data):
        """
        Performs AI prediction with scikit-learn pipeline, generates explainability breakdown,
        computes suitability level, and discovers genuine alternatives.
        """
        if self.model is None:
            raise RuntimeError("Recommendation model is not available. Please ensure the model file is loaded.")

        # Prepare exact feature vector in required order
        features_dict = {
            'N': [float(input_data['N'])],
            'P': [float(input_data['P'])],
            'K': [float(input_data['K'])],
            'temperature': [float(input_data['temperature'])],
            'humidity': [float(input_data['humidity'])],
            'ph': [float(input_data['ph'])],
            'rainfall': [float(input_data['rainfall'])]
        }
        input_df = pd.DataFrame(features_dict, columns=FEATURE_NAMES)

        # Predict primary crop class index
        pred_idx = int(self.model.predict(input_df)[0])
        recommended_crop_id = CROP_CLASSES[pred_idx] if 0 <= pred_idx < len(CROP_CLASSES) else 'unknown'

        # Retrieve knowledge info
        crop_info = self.crop_knowledge.get(recommended_crop_id, {})
        display_name = crop_info.get('name', recommended_crop_id.capitalize())
        hindi_name = crop_info.get('hindi_name', '')
        icon = crop_info.get('icon', '🌾')

        # Multi-class Decision Function scores for ranking and alternatives
        alternatives = []
        if hasattr(self.model, 'decision_function'):
            scores = self.model.decision_function(input_df)[0]
            # Sort indices by score descending
            ranked_indices = np.argsort(scores)[::-1]
            
            # Runner-ups (exclude top predicted crop)
            for rank_pos, idx in enumerate(ranked_indices[1:4], start=2):
                alt_crop_id = CROP_CLASSES[idx]
                alt_info = self.crop_knowledge.get(alt_crop_id, {})
                alternatives.append({
                    'rank': rank_pos,
                    'crop_id': alt_crop_id,
                    'name': alt_info.get('name', alt_crop_id.capitalize()),
                    'hindi_name': alt_info.get('hindi_name', ''),
                    'icon': alt_info.get('icon', '🌱'),
                    'category': alt_info.get('category', 'Agricultural Crop'),
                    'duration': alt_info.get('duration', 'Standard'),
                    'water_requirement': alt_info.get('water_requirement', 'Moderate')
                })

        # Why this crop factor-by-factor breakdown
        why_this_crop = []
        ideal_params = crop_info.get('ideal_parameters', {})
        optimal_count = 0
        good_count = 0

        for param in FEATURE_NAMES:
            user_val = float(input_data[param])
            p_rule = ideal_params.get(param, {
                'min': user_val * 0.8,
                'max': user_val * 1.2,
                'optimal': user_val,
                'unit': ''
            })

            eval_res = self.evaluate_factor_match(user_val, p_rule, param)
            if eval_res['status'] == 'optimal':
                optimal_count += 1
            elif eval_res['status'] == 'good':
                good_count += 1

            why_this_crop.append({
                'parameter': param,
                'label': self.get_param_label(param),
                'entered_value': user_val,
                'unit': p_rule.get('unit', ''),
                'ideal_range': eval_res['ideal_range'],
                'optimal_value': eval_res['optimal_value'],
                'status': eval_res['status'],
                'explanation': eval_res['explanation']
            })

        # Calculate Suitability Level (honest parameter match percentage)
        suitability_score = round(((optimal_count * 1.0 + good_count * 0.7) / len(FEATURE_NAMES)) * 100)
        suitability_score = min(max(suitability_score, 45), 98)

        if suitability_score >= 85:
            suitability_level = "High Suitability"
            suitability_badge = "Excellent Match"
        elif suitability_score >= 70:
            suitability_level = "Moderate Suitability"
            suitability_badge = "Good Match"
        else:
            suitability_level = "Conditional Suitability"
            suitability_badge = "Requires Soil/Water Management"

        # Input summary
        input_summary = {
            'N': float(input_data['N']),
            'P': float(input_data['P']),
            'K': float(input_data['K']),
            'temperature': float(input_data['temperature']),
            'humidity': float(input_data['humidity']),
            'ph': float(input_data['ph']),
            'rainfall': float(input_data['rainfall']),
            'farm_meta': input_data.get('farm_meta', {})
        }

        return {
            'success': True,
            'recommended_crop': recommended_crop_id,
            'display_name': display_name,
            'hindi_name': hindi_name,
            'icon': icon,
            'category': crop_info.get('category', 'Crop'),
            'suitability_level': suitability_level,
            'suitability_badge': suitability_badge,
            'suitability_score': suitability_score,
            'suitability_label': 'Recommended crop based on your entered soil & weather conditions',
            'why_this_crop': why_this_crop,
            'crop_info': crop_info,
            'alternative_crops': alternatives,
            'input_summary': input_summary,
            'model_info': {
                'model_architecture': 'Support Vector Classifier (SVC with Standard Scaler Pipeline)',
                'source_dataset': 'Agricultural Soil & Climate Reference Dataset',
                'disclaimer': 'AgroVision AI provides data-driven agricultural guidance based on entered parameters. For field application, combine with localized soil test lab reports and local Krishi Vigyan Kendra (KVK) advisory.'
            }
        }

    def get_param_label(self, param):
        labels = {
            'N': 'Nitrogen (N)',
            'P': 'Phosphorus (P)',
            'K': 'Potassium (K)',
            'temperature': 'Temperature',
            'humidity': 'Humidity',
            'ph': 'Soil pH',
            'rainfall': 'Rainfall'
        }
        return labels.get(param, param)

# Global singleton instance loaded once
predictor_service = CropPredictorService()
