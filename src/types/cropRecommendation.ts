export interface CropRecommendationInput {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
  soil_type?: string;
  state?: string;
  district?: string;
  farm_size?: string;
  season?: string;
}

export interface IdealParameter {
  min: number;
  max: number;
  optimal: number;
  unit: string;
}

export interface CropProfile {
  id: string;
  name: string;
  hindi_name: string;
  botanical_name: string;
  category: string;
  icon: string;
  banner_color: string;
  description: string;
  growing_season: string;
  duration: string;
  water_requirement: string;
  soil_preference: string;
  ideal_parameters: Record<string, IdealParameter>;
  care_tips: string[];
  harvest_indicators: string;
  major_states: string;
}

export interface WhyThisCropFactor {
  parameter: string;
  label: string;
  entered_value: number;
  optimal_value: string;
  ideal_range: string;
  status: 'optimal' | 'moderate' | 'suboptimal';
  explanation: string;
  unit: string;
}

export interface AlternativeCrop {
  rank: number;
  crop_id: string;
  name: string;
  hindi_name: string;
  category: string;
  icon: string;
  duration: string;
  water_requirement: string;
}

export interface CropRecommendationResult {
  success: boolean;
  recommended_crop: string;
  display_name: string;
  hindi_name: string;
  category: string;
  icon: string;
  suitability_score: number;
  suitability_level: string;
  suitability_badge: string;
  suitability_label: string;
  crop_info: CropProfile;
  why_this_crop: WhyThisCropFactor[];
  alternative_crops: AlternativeCrop[];
  input_summary: CropRecommendationInput;
  model_info: {
    model_architecture: string;
    source_dataset: string;
    disclaimer: string;
    model_mode?: string;
  };
}

export interface SampleConditionPreset {
  name: string;
  region: string;
  season: string;
  state: string;
  district: string;
  farm_size: string;
  soil_type: string;
  data: {
    N: number;
    P: number;
    K: number;
    temperature: number;
    humidity: number;
    ph: number;
    rainfall: number;
  };
}
