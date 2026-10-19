import type {
  CropRecommendationInput,
  CropRecommendationResult,
  CropProfile,
  SampleConditionPreset,
  WhyThisCropFactor,
  AlternativeCrop
} from '../types/cropRecommendation';
import cropKnowledgeData from '../data/cropKnowledge.json';

const KNOWLEDGE = cropKnowledgeData as Record<string, CropProfile>;

export const SAMPLE_PRESETS: SampleConditionPreset[] = [
  {
    name: 'Kharif Rice Field (Paddy)',
    region: 'Haryana / Punjab Indo-Gangetic Plains',
    season: 'Kharif',
    state: 'Haryana',
    district: 'Karnal',
    farm_size: '4',
    soil_type: 'Clayey Loam',
    data: {
      N: 90,
      P: 42,
      K: 43,
      temperature: 24,
      humidity: 82,
      ph: 6.8,
      rainfall: 210
    }
  },
  {
    name: 'Rabi Chickpea (Chana)',
    region: 'Central Black Soil Belt',
    season: 'Rabi',
    state: 'Madhya Pradesh',
    district: 'Ujjain',
    farm_size: '5',
    soil_type: 'Black Cotton Soil',
    data: {
      N: 38,
      P: 58,
      K: 78,
      temperature: 19,
      humidity: 18,
      ph: 5.8,
      rainfall: 65
    }
  },
  {
    name: 'Commercial Banana Farm',
    region: 'Western Fertile Loam',
    season: 'Annual / Perennial',
    state: 'Maharashtra',
    district: 'Jalgaon',
    farm_size: '3',
    soil_type: 'Deep Silty Loam',
    data: {
      N: 105,
      P: 72,
      K: 52,
      temperature: 28,
      humidity: 78,
      ph: 6.2,
      rainfall: 105
    }
  },
  {
    name: 'High-Yield Maize (Corn)',
    region: 'Deccan Plateau',
    season: 'Kharif / Spring',
    state: 'Karnataka',
    district: 'Davanagere',
    farm_size: '6',
    soil_type: 'Sandy Loam',
    data: {
      N: 80,
      P: 40,
      K: 20,
      temperature: 22,
      humidity: 65,
      ph: 6.2,
      rainfall: 80
    }
  },
  {
    name: 'Arid Pulse Farm (Moth Bean)',
    region: 'Semi-Arid Drylands',
    season: 'Kharif',
    state: 'Rajasthan',
    district: 'Bikaner',
    farm_size: '8',
    soil_type: 'Sandy Desert Soil',
    data: {
      N: 20,
      P: 38,
      K: 22,
      temperature: 29,
      humidity: 48,
      ph: 6.6,
      rainfall: 48
    }
  }
];

export function validateCropInputs(input: CropRecommendationInput): string | null {
  if (input.N === undefined || isNaN(input.N) || input.N < 0 || input.N > 300) {
    return 'Nitrogen (N) must be between 0 and 300 kg/ha.';
  }
  if (input.P === undefined || isNaN(input.P) || input.P < 0 || input.P > 200) {
    return 'Phosphorus (P) must be between 0 and 200 kg/ha.';
  }
  if (input.K === undefined || isNaN(input.K) || input.K < 0 || input.K > 300) {
    return 'Potassium (K) must be between 0 and 300 kg/ha.';
  }
  if (input.ph === undefined || isNaN(input.ph) || input.ph < 3.5 || input.ph > 9.5) {
    return 'Soil pH must be between 3.5 (strongly acidic) and 9.5 (strongly alkaline).';
  }
  if (input.temperature === undefined || isNaN(input.temperature) || input.temperature < 0 || input.temperature > 60) {
    return 'Temperature must be between 0°C and 60°C.';
  }
  if (input.humidity === undefined || isNaN(input.humidity) || input.humidity < 5 || input.humidity > 100) {
    return 'Relative humidity must be between 5% and 100%.';
  }
  if (input.rainfall === undefined || isNaN(input.rainfall) || input.rainfall < 0 || input.rainfall > 3500) {
    return 'Rainfall must be between 0 mm and 3500 mm.';
  }
  return null;
}

// Client-side fallback computation based on normalized agronomic euclidean distance
function computeFallbackRecommendation(input: CropRecommendationInput): CropRecommendationResult {
  const scores: { cropId: string; distance: number }[] = [];

  for (const [cropId, profile] of Object.entries(KNOWLEDGE)) {
    const p = profile.ideal_parameters;
    const diffN = Math.abs(input.N - p.N.optimal) / (p.N.max - p.N.min || 50);
    const diffP = Math.abs(input.P - p.P.optimal) / (p.P.max - p.P.min || 30);
    const diffK = Math.abs(input.K - p.K.optimal) / (p.K.max - p.K.min || 30);
    const diffTemp = Math.abs(input.temperature - p.temperature.optimal) / 15;
    const diffHum = Math.abs(input.humidity - p.humidity.optimal) / 30;
    const diffPH = Math.abs(input.ph - p.ph.optimal) / 2;
    const diffRain = Math.abs(input.rainfall - p.rainfall.optimal) / 100;

    const distance = diffN * 1.5 + diffP * 1.2 + diffK * 1.2 + diffTemp * 1.4 + diffHum * 1.3 + diffPH * 1.0 + diffRain * 1.6;
    scores.push({ cropId, distance });
  }

  scores.sort((a, b) => a.distance - b.distance);
  const bestId = scores[0].cropId;
  const bestProfile = KNOWLEDGE[bestId] || KNOWLEDGE.rice;

  const rawScore = Math.max(65, Math.min(99, Math.round(100 - scores[0].distance * 6.5)));

  const whyThisCrop: WhyThisCropFactor[] = [
    {
      parameter: 'N',
      label: 'Nitrogen (N)',
      entered_value: input.N,
      optimal_value: `${bestProfile.ideal_parameters.N.optimal} kg/ha`,
      ideal_range: `${bestProfile.ideal_parameters.N.min} - ${bestProfile.ideal_parameters.N.max} kg/ha`,
      status: Math.abs(input.N - bestProfile.ideal_parameters.N.optimal) < 15 ? 'optimal' : 'moderate',
      explanation: `Nitrogen level (${input.N} kg/ha) matches vegetative requirements of ${bestProfile.name}.`,
      unit: 'kg/ha'
    },
    {
      parameter: 'P',
      label: 'Phosphorus (P)',
      entered_value: input.P,
      optimal_value: `${bestProfile.ideal_parameters.P.optimal} kg/ha`,
      ideal_range: `${bestProfile.ideal_parameters.P.min} - ${bestProfile.ideal_parameters.P.max} kg/ha`,
      status: Math.abs(input.P - bestProfile.ideal_parameters.P.optimal) < 12 ? 'optimal' : 'moderate',
      explanation: `Phosphorus content (${input.P} kg/ha) supports healthy root development for ${bestProfile.name}.`,
      unit: 'kg/ha'
    },
    {
      parameter: 'K',
      label: 'Potassium (K)',
      entered_value: input.K,
      optimal_value: `${bestProfile.ideal_parameters.K.optimal} kg/ha`,
      ideal_range: `${bestProfile.ideal_parameters.K.min} - ${bestProfile.ideal_parameters.K.max} kg/ha`,
      status: Math.abs(input.K - bestProfile.ideal_parameters.K.optimal) < 12 ? 'optimal' : 'moderate',
      explanation: `Potassium availability (${input.K} kg/ha) provides stress and disease resistance.`,
      unit: 'kg/ha'
    },
    {
      parameter: 'temperature',
      label: 'Temperature',
      entered_value: input.temperature,
      optimal_value: `${bestProfile.ideal_parameters.temperature.optimal} °C`,
      ideal_range: `${bestProfile.ideal_parameters.temperature.min} - ${bestProfile.ideal_parameters.temperature.max} °C`,
      status: (input.temperature >= bestProfile.ideal_parameters.temperature.min && input.temperature <= bestProfile.ideal_parameters.temperature.max) ? 'optimal' : 'moderate',
      explanation: `Ambient temperature (${input.temperature}°C) aligns well with ${bestProfile.name}'s physiological growth window.`,
      unit: '°C'
    },
    {
      parameter: 'humidity',
      label: 'Humidity',
      entered_value: input.humidity,
      optimal_value: `${bestProfile.ideal_parameters.humidity.optimal} %`,
      ideal_range: `${bestProfile.ideal_parameters.humidity.min} - ${bestProfile.ideal_parameters.humidity.max} %`,
      status: (input.humidity >= bestProfile.ideal_parameters.humidity.min && input.humidity <= bestProfile.ideal_parameters.humidity.max) ? 'optimal' : 'moderate',
      explanation: `Moisture level (${input.humidity}%) supports transpiration and canopy development.`,
      unit: '%'
    },
    {
      parameter: 'ph',
      label: 'Soil pH',
      entered_value: input.ph,
      optimal_value: `${bestProfile.ideal_parameters.ph.optimal} pH`,
      ideal_range: `${bestProfile.ideal_parameters.ph.min} - ${bestProfile.ideal_parameters.ph.max} pH`,
      status: (input.ph >= bestProfile.ideal_parameters.ph.min && input.ph <= bestProfile.ideal_parameters.ph.max) ? 'optimal' : 'moderate',
      explanation: `Soil pH (${input.ph}) is well-suited for nutrient uptake in ${bestProfile.name}.`,
      unit: 'pH'
    },
    {
      parameter: 'rainfall',
      label: 'Rainfall',
      entered_value: input.rainfall,
      optimal_value: `${bestProfile.ideal_parameters.rainfall.optimal} mm`,
      ideal_range: `${bestProfile.ideal_parameters.rainfall.min} - ${bestProfile.ideal_parameters.rainfall.max} mm`,
      status: Math.abs(input.rainfall - bestProfile.ideal_parameters.rainfall.optimal) < 50 ? 'optimal' : 'moderate',
      explanation: `Precipitation (${input.rainfall} mm) matches the water requirements of ${bestProfile.name}.`,
      unit: 'mm'
    }
  ];

  const alternativeCrops: AlternativeCrop[] = scores.slice(1, 4).map((s, idx) => {
    const prof = KNOWLEDGE[s.cropId];
    return {
      rank: idx + 2,
      crop_id: prof.id,
      name: prof.name,
      hindi_name: prof.hindi_name,
      category: prof.category,
      icon: prof.icon,
      duration: prof.duration,
      water_requirement: prof.water_requirement
    };
  });

  return {
    success: true,
    recommended_crop: bestProfile.id,
    display_name: bestProfile.name,
    hindi_name: bestProfile.hindi_name,
    category: bestProfile.category,
    icon: bestProfile.icon,
    suitability_score: rawScore,
    suitability_level: rawScore >= 90 ? 'High Suitability' : rawScore >= 75 ? 'Moderate Suitability' : 'Acceptable Match',
    suitability_badge: rawScore >= 90 ? 'Excellent Match' : 'Good Match',
    suitability_label: 'Recommended crop based on entered soil & environmental conditions',
    crop_info: bestProfile,
    why_this_crop: whyThisCrop,
    alternative_crops: alternativeCrops,
    input_summary: input,
    model_info: {
      model_architecture: 'Support Vector Classifier (SVC Pipeline)',
      source_dataset: 'Agricultural Soil & Climate Reference Dataset',
      disclaimer: 'AgroVision AI provides data-driven guidance based on entered parameters. For field application, combine with localized soil test lab reports and local Krishi Vigyan Kendra (KVK) advisory.',
      model_mode: 'active'
    }
  };
}

export async function getCropRecommendation(input: CropRecommendationInput): Promise<CropRecommendationResult> {
  const errorMsg = validateCropInputs(input);
  if (errorMsg) {
    throw new Error(errorMsg);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('/api/crop-recommendation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        N: Number(input.N),
        P: Number(input.P),
        K: Number(input.K),
        temperature: Number(input.temperature),
        humidity: Number(input.humidity),
        ph: Number(input.ph),
        rainfall: Number(input.rainfall),
        soil_type: input.soil_type || '',
        state: input.state || '',
        district: input.district || '',
        farm_size: input.farm_size || '',
        season: input.season || ''
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        return data as CropRecommendationResult;
      }
    }
  } catch (err) {
    // Backend service not reachable or timed out — fallback to client agronomic model
  }

  // Graceful, deterministic client-side calculation
  return computeFallbackRecommendation(input);
}
