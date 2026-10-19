/**
 * Crop-Specific Agronomic Rules and Thermal Parameters
 * Configures base temperatures for Growing Degree Days (GDD) and thermal thresholds.
 */

export interface CropThermalConfig {
  cropId: string;
  name: string;
  baseTemp: number;   // °C
  upperTemp: number;  // °C
  optimalMin: number; // °C
  optimalMax: number; // °C
  waterSensitivity: 'High' | 'Moderate' | 'Low';
}

export const CROP_THERMAL_CONFIGS: Record<string, CropThermalConfig> = {
  wheat: {
    cropId: 'wheat',
    name: 'Wheat',
    baseTemp: 5.0,
    upperTemp: 30.0,
    optimalMin: 15.0,
    optimalMax: 24.0,
    waterSensitivity: 'High'
  },
  paddy: {
    cropId: 'paddy',
    name: 'Paddy (Rice)',
    baseTemp: 10.0,
    upperTemp: 35.0,
    optimalMin: 22.0,
    optimalMax: 32.0,
    waterSensitivity: 'High'
  },
  soybean: {
    cropId: 'soybean',
    name: 'Soybean',
    baseTemp: 10.0,
    upperTemp: 32.0,
    optimalMin: 20.0,
    optimalMax: 30.0,
    waterSensitivity: 'Moderate'
  },
  maize: {
    cropId: 'maize',
    name: 'Maize (Corn)',
    baseTemp: 10.0,
    upperTemp: 34.0,
    optimalMin: 18.0,
    optimalMax: 30.0,
    waterSensitivity: 'High'
  },
  cotton: {
    cropId: 'cotton',
    name: 'Cotton',
    baseTemp: 15.0,
    upperTemp: 38.0,
    optimalMin: 24.0,
    optimalMax: 35.0,
    waterSensitivity: 'Moderate'
  },
  tomato: {
    cropId: 'tomato',
    name: 'Tomato',
    baseTemp: 10.0,
    upperTemp: 32.0,
    optimalMin: 18.0,
    optimalMax: 28.0,
    waterSensitivity: 'High'
  },
  chilli: {
    cropId: 'chilli',
    name: 'Chilli (Hot Pepper)',
    baseTemp: 12.0,
    upperTemp: 35.0,
    optimalMin: 20.0,
    optimalMax: 32.0,
    waterSensitivity: 'High'
  },
  capsicum: {
    cropId: 'capsicum',
    name: 'Capsicum (Bell Pepper)',
    baseTemp: 12.0,
    upperTemp: 32.0,
    optimalMin: 18.0,
    optimalMax: 28.0,
    waterSensitivity: 'High'
  },
  pomegranate: {
    cropId: 'pomegranate',
    name: 'Pomegranate',
    baseTemp: 10.0,
    upperTemp: 38.0,
    optimalMin: 20.0,
    optimalMax: 35.0,
    waterSensitivity: 'Moderate'
  },
  banana: {
    cropId: 'banana',
    name: 'Banana',
    baseTemp: 14.0,
    upperTemp: 36.0,
    optimalMin: 22.0,
    optimalMax: 33.0,
    waterSensitivity: 'High'
  },
  sugarcane: {
    cropId: 'sugarcane',
    name: 'Sugarcane',
    baseTemp: 12.0,
    upperTemp: 38.0,
    optimalMin: 24.0,
    optimalMax: 35.0,
    waterSensitivity: 'High'
  }
};

/**
 * Calculates daily Growing Degree Days (GDD) using standard modified method:
 * GDD = max(0, ((min(Tmax, Tupper) + max(Tmin, Tbase)) / 2) - Tbase)
 */
export function calculateDailyGDD(maxTemp: number, minTemp: number, cropId: string): {
  gdd: number;
  baseTemp: number;
  upperTemp: number;
  isAvailable: boolean;
} {
  const config = CROP_THERMAL_CONFIGS[cropId.toLowerCase()];
  if (!config) {
    return { gdd: 0, baseTemp: 10, upperTemp: 30, isAvailable: false };
  }

  const cappedMax = Math.min(maxTemp, config.upperTemp);
  const flooredMin = Math.max(minTemp, config.baseTemp);
  const meanTemp = (cappedMax + flooredMin) / 2;
  const gdd = Math.max(0, Math.round((meanTemp - config.baseTemp) * 10) / 10);

  return {
    gdd,
    baseTemp: config.baseTemp,
    upperTemp: config.upperTemp,
    isAvailable: true
  };
}
