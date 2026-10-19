/**
 * AgroVision AI - Agricultural Weather Rules Engine Configuration
 * Defines transparent, scientifically documented decision-support thresholds.
 */

export interface SpraySuitabilityResult {
  status: 'Suitable' | 'Caution' | 'Not Suitable';
  score: number; // 0 - 100
  badgeClass: string;
  headline: string;
  details: string[];
  recommendedWindow: string;
}

export interface WeatherRiskAlert {
  type: 'heat' | 'frost' | 'wind' | 'rain' | 'disease';
  level: 'Normal' | 'Attention' | 'High Risk';
  title: string;
  description: string;
  actionAdvice: string;
  badgeClass: string;
}

export const WEATHER_THRESHOLDS = {
  spray: {
    wind: {
      optimal_max: 14,      // km/h - ideal for low drift
      caution_max: 20,      // km/h - moderate drift risk
      unsuitable_above: 20  // km/h - high drift risk, pesticide loss
    },
    rainChance: {
      optimal_max: 25,      // %
      caution_max: 45,      // %
      unsuitable_above: 45  // % - chemical washout risk
    },
    precipitationUpcoming: {
      unsuitable_above: 1.0 // mm in next 6h
    }
  },
  heat: {
    attention_min: 35,     // °C
    high_risk_min: 40      // °C
  },
  frost: {
    high_risk_below: 1.5,  // °C
    attention_below: 4.5   // °C
  },
  disease: {
    high_humidity_min: 80, // %
    temp_range_min: 20,    // °C
    temp_range_max: 32     // °C
  }
};

/**
 * Evaluates field spray suitability based on current & upcoming conditions
 */
export function evaluateSpraySuitability(
  windSpeed: number,
  rainChance: number,
  precipitationSum: number,
  temperature: number
): SpraySuitabilityResult {
  const details: string[] = [];
  let penalty = 0;

  // Wind evaluation
  if (windSpeed <= WEATHER_THRESHOLDS.spray.wind.optimal_max) {
    details.push(`Wind speed (${windSpeed} km/h) is calm, minimizing droplet drift.`);
  } else if (windSpeed <= WEATHER_THRESHOLDS.spray.wind.caution_max) {
    details.push(`Moderate breeze (${windSpeed} km/h); use low-drift nozzles and lower boom height.`);
    penalty += 25;
  } else {
    details.push(`Strong wind (${windSpeed} km/h) creates significant spray drift risk.`);
    penalty += 55;
  }

  // Rain probability & precipitation evaluation
  if (precipitationSum >= WEATHER_THRESHOLDS.spray.precipitationUpcoming.unsuitable_above) {
    details.push(`Expected rain (${precipitationSum} mm) will wash off contact protectants.`);
    penalty += 50;
  } else if (rainChance > WEATHER_THRESHOLDS.spray.rainChance.unsuitable_above) {
    details.push(`High rain probability (${rainChance}%) reduces required drying/rainfast time.`);
    penalty += 40;
  } else if (rainChance > WEATHER_THRESHOLDS.spray.rainChance.optimal_max) {
    details.push(`Moderate rain probability (${rainChance}%); verify rainfast period (2-4 hrs).`);
    penalty += 15;
  } else {
    details.push(`Low rain probability (${rainChance}%); adequate chemical adhesion expected.`);
  }

  // Temperature inversion / extreme heat check
  if (temperature > 34) {
    details.push(`High temperature (${temperature}°C) increases droplet evaporation before reaching canopy.`);
    penalty += 20;
  }

  const score = Math.max(10, 100 - penalty);

  let status: 'Suitable' | 'Caution' | 'Not Suitable';
  let badgeClass: string;
  let headline: string;
  let recommendedWindow: string;

  if (score >= 75) {
    status = 'Suitable';
    badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    headline = 'Weather conditions appear suitable for spraying';
    recommendedWindow = 'Early morning (6:00 - 9:00 AM) or late afternoon';
  } else if (score >= 50) {
    status = 'Caution';
    badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
    headline = 'Spraying possible with caution & drift reduction';
    recommendedWindow = 'Early morning when winds are typically calmest';
  } else {
    status = 'Not Suitable';
    badgeClass = 'bg-red-100 text-red-800 border-red-300';
    headline = 'Spraying not recommended due to adverse weather';
    recommendedWindow = 'Delay application until wind subsides or rain window clears';
  }

  return {
    status,
    score,
    badgeClass,
    headline,
    details,
    recommendedWindow
  };
}

/**
 * Generates transparent agricultural risk alerts from current and forecast data
 */
export function generateWeatherAlerts(
  maxTemp: number,
  minTemp: number,
  humidity: number,
  windSpeed: number,
  rainChance: number
): WeatherRiskAlert[] {
  const alerts: WeatherRiskAlert[] = [];

  // 1. Heat stress alert
  if (maxTemp >= WEATHER_THRESHOLDS.heat.high_risk_min) {
    alerts.push({
      type: 'heat',
      level: 'High Risk',
      title: 'Severe Heat Stress Alert',
      description: `Forecasted maximum temperature of ${maxTemp}°C significantly exceeds the critical threshold for flowering crops.`,
      actionAdvice: 'Provide light protective irrigation during early morning hours to cool crop microclimate and prevent pollen desiccation.',
      badgeClass: 'bg-red-100 text-red-800 border-red-300'
    });
  } else if (maxTemp >= WEATHER_THRESHOLDS.heat.attention_min) {
    alerts.push({
      type: 'heat',
      level: 'Attention',
      title: 'Moderate Heat Warning',
      description: `Maximum temperatures near ${maxTemp}°C will accelerate plant transpiration and water depletion.`,
      actionAdvice: 'Monitor root-zone moisture closely; ensure irrigation schedule is not delayed.',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300'
    });
  }

  // 2. Frost risk alert
  if (minTemp <= WEATHER_THRESHOLDS.frost.high_risk_below) {
    alerts.push({
      type: 'frost',
      level: 'High Risk',
      title: 'Hard Frost Warning',
      description: `Overnight minimum temperatures dropping near ${minTemp}°C pose severe freezing risk to tender foliage and blossoms.`,
      actionAdvice: 'Apply evening flood/furrow irrigation or smoke covers in orchards to buffer radiant temperature drop.',
      badgeClass: 'bg-red-100 text-red-800 border-red-300'
    });
  } else if (minTemp <= WEATHER_THRESHOLDS.frost.attention_below) {
    alerts.push({
      type: 'frost',
      level: 'Attention',
      title: 'Radiation Frost Advisory',
      description: `Night temperatures expected around ${minTemp}°C with calm skies may trigger localized ground frost in low-lying pockets.`,
      actionAdvice: 'Check sensitive vegetable seedlings; ensure light surface soil moisture.',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300'
    });
  }

  // 3. Fungal pathogen favorability alert
  if (
    humidity >= WEATHER_THRESHOLDS.disease.high_humidity_min &&
    maxTemp >= WEATHER_THRESHOLDS.disease.temp_range_min &&
    minTemp <= WEATHER_THRESHOLDS.disease.temp_range_max
  ) {
    alerts.push({
      type: 'disease',
      level: 'Attention',
      title: 'Fungal Disease Microclimate Advisory',
      description: `Prolonged relative humidity (${humidity}%) paired with warm temperatures (${minTemp}°C - ${maxTemp}°C) favors spore germination.`,
      actionAdvice: 'Scout regularly for early signs of blast, blight, or downy mildew on lower leaves; ensure good field drainage.',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300'
    });
  }

  // 4. Strong wind alert
  if (windSpeed >= 28) {
    alerts.push({
      type: 'wind',
      level: 'High Risk',
      title: 'High Wind Velocity Alert',
      description: `Surface winds of ${windSpeed} km/h risk mechanical lodging in tall stands and severe pesticide spray drift.`,
      actionAdvice: 'Suspend all foliar spraying operations and inspect physical greenhouse/trellis structures.',
      badgeClass: 'bg-red-100 text-red-800 border-red-300'
    });
  }

  // 5. High precipitation alert
  if (rainChance >= 80) {
    alerts.push({
      type: 'rain',
      level: 'Attention',
      title: 'High Rain Probability Warning',
      description: `${rainChance}% chance of precipitation. Natural soil recharge expected.`,
      actionAdvice: 'Delay planned fertilizer broadcast and top-dressing to avoid surface runoff or leaching.',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300'
    });
  }

  // If no high risk or attention alerts, provide normal status
  if (alerts.length === 0) {
    alerts.push({
      type: 'heat',
      level: 'Normal',
      title: 'Favorable Crop Weather',
      description: `Temperature (${minTemp}°C to ${maxTemp}°C) and weather conditions fall within standard agronomic comfort ranges.`,
      actionAdvice: 'Routine field operations and scheduled cultural practices can proceed normally.',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    });
  }

  return alerts;
}
