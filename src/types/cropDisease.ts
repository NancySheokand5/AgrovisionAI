export interface CropDiseaseResult {
  success: boolean;
  crop: string;
  disease: string;
  confidence: number;
  severity: 'None' | 'Low' | 'Moderate' | 'High' | 'Severe' | 'Unknown';
  summary: string;
  symptoms: string[];
  possible_causes: string[];
  treatment: string[];
  treatment_plan: {
    immediate: string[];
    guidance: string[];
    followup: string[];
  };
  prevention: string[];
  confidence_message?: string;
  model_mode?: 'mock' | 'real' | 'client_fallback';
  model_note?: string;
  disclaimer?: string;
  imageData?: string;
}

export interface SampleLeaf {
  id: string;
  name: string;
  crop: string;
  disease: string;
  badge: string;
  badgeColor: string;
  dataUrl: string;
  fileName: string;
}
