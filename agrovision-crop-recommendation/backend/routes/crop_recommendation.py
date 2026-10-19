"""
Crop recommendation API blueprint.
Handles POST /api/crop-recommendation and related agricultural metadata routes.
"""

from flask import Blueprint, request, jsonify
from ..services.crop_predictor import predictor_service
from ..utils.validators import validate_crop_inputs

crop_bp = Blueprint('crop_recommendation', __name__)

@crop_bp.route('/crop-recommendation', methods=['POST'])
def recommend_crop():
    """
    Main crop recommendation endpoint.
    Expects JSON with N, P, K, temperature, humidity, ph, rainfall.
    """
    if not request.is_json:
        return jsonify({
            'success': False,
            'error': 'Please provide JSON data with farm conditions.'
        }), 400

    raw_data = request.get_json()
    cleaned_data, error_msg = validate_crop_inputs(raw_data)

    if error_msg:
        return jsonify({
            'success': False,
            'error': error_msg
        }), 400

    try:
        result = predictor_service.predict(cleaned_data)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f"Unable to process crop recommendation: {str(e)}"
        }), 500

@crop_bp.route('/crops', methods=['GET'])
def get_all_crops():
    """Returns available crop profiles from the knowledge base."""
    return jsonify({
        'success': True,
        'crops': predictor_service.crop_knowledge
    }), 200

@crop_bp.route('/sample-conditions', methods=['GET'])
def get_sample_conditions():
    """
    Returns pre-configured realistic farm condition presets
    to allow 1-click test fill for farmers and evaluators.
    """
    samples = [
        {
            'name': 'Kharif Rice Field (Paddy)',
            'region': 'Haryana / Punjab Indo-Gangetic Plains',
            'season': 'Kharif',
            'state': 'Haryana',
            'district': 'Karnal',
            'farm_size': '4',
            'farm_size_unit': 'Acres',
            'data': {
                'N': 90,
                'P': 42,
                'K': 43,
                'temperature': 24,
                'humidity': 82,
                'ph': 6.8,
                'rainfall': 210
            }
        },
        {
            'name': 'Rabi Chickpea (Chana)',
            'region': 'Central Black Soil Belt',
            'season': 'Rabi',
            'state': 'Madhya Pradesh',
            'district': 'Ujjain',
            'farm_size': '5',
            'farm_size_unit': 'Acres',
            'data': {
                'N': 38,
                'P': 58,
                'K': 78,
                'temperature': 19,
                'humidity': 18,
                'ph': 5.8,
                'rainfall': 65
            }
        },
        {
            'name': 'Commercial Banana Farm',
            'region': 'Western Fertile Loam',
            'season': 'Annual / Perennial',
            'state': 'Maharashtra',
            'district': 'Jalgaon',
            'farm_size': '3',
            'farm_size_unit': 'Acres',
            'data': {
                'N': 105,
                'P': 72,
                'K': 52,
                'temperature': 28,
                'humidity': 78,
                'ph': 6.2,
                'rainfall': 105
            }
        },
        {
            'name': 'Arid Pulse Farm (Moth Bean)',
            'region': 'Semi-Arid Drylands',
            'season': 'Kharif',
            'state': 'Rajasthan',
            'district': 'Bikaner',
            'farm_size': '8',
            'farm_size_unit': 'Acres',
            'data': {
                'N': 20,
                'P': 38,
                'K': 22,
                'temperature': 29,
                'humidity': 48,
                'ph': 6.6,
                'rainfall': 48
            }
        }
    ]
    return jsonify({
        'success': True,
        'samples': samples
    }), 200

@crop_bp.route('/health', methods=['GET'])
def health_check():
    """Health check for service and ML model availability."""
    model_loaded = predictor_service.model is not None
    knowledge_count = len(predictor_service.crop_knowledge)
    return jsonify({
        'status': 'healthy' if model_loaded else 'degraded',
        'model_loaded': model_loaded,
        'knowledge_crops_count': knowledge_count,
        'feature_count': 7
    }), 200
