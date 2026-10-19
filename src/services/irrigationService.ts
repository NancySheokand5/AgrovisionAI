/**
 * AgroVision AI - Smart Irrigation Advice Service
 * Implements FAO-56 Penman-Monteith & Crop Coefficient (Kc) water balance methodology.
 * Reuses normalized weather data from weatherService.
 */

import { weatherService } from './weatherService';
import cropCoefficientsData from '../data/cropCoefficients.json';

export interface IrrigationInput {
  crop: string;
  growthStage: string;
  area: number;
  areaUnit: 'acre' | 'hectare' | 'sqm';
  soilType: 'sandy' | 'loamy' | 'clay';
  lastIrrigationDate: string; // YYYY-MM-DD
  soilMoisture?: number;      // %
  irrigationMethod: 'drip' | 'sprinkler' | 'flood' | 'furrow';
  latitude?: number;
  longitude?: number;
}

export interface IrrigationAdviceResult {
  id: string;
  timestamp: string;
  crop: {
    id: string;
    name: string;
    hindiName: string;
    emoji: string;
  };
  growthStage: {
    id: string;
    label: string;
    description: string;
  };
  inputs: {
    area: number;
    areaUnit: string;
    soilType: string;
    lastIrrigationDate: string;
    daysSinceIrrigation: number;
    irrigationMethod: string;
    soilMoistureInput: number | null;
    soilMoistureSource: 'Sensor / Weather Estimate' | 'Manual Input' | 'Calculated Balance';
  };
  weatherSummary: {
    locationName: string;
    temperature: number;
    humidity: number;
    todayET0: number; // mm/day
    expectedRainfall: number; // mm
    effectiveRainfall: number; // mm
  };
  calculations: {
    kc: number;
    etcDaily: number; // mm/day
    etcAccumulated: number; // mm over period
    netIrrigationMm: number; // mm
    applicationEfficiency: number; // 0 - 1
    grossIrrigationMm: number; // mm
    litresPerAcre: number;
    litresPerHectare: number;
    litresPerSqm: number;
    totalWaterLitres: number;
  };
  recommendation: {
    status: 'No irrigation needed' | 'Monitor' | 'Irrigation recommended' | 'High water stress';
    badgeClass: string;
    actionPhrase: string; // "Irrigate now", "Wait 2 days", "Monitor soil moisture"
    urgencyText: string;
    suggestedWindow: string; // "Early Morning (6:00 - 9:00 AM)"
    nextCheckDate: string;
    whyExplanation: string[];
  };
  timeline: {
    previous: { date: string; label: string };
    current: { date: string; status: string };
    next: { date: string; projectedAction: string };
  };
  soilHydrology: {
    awcMm: number; // Available water capacity
    rawMm: number; // Readily available water
    currentMoisturePct: number;
  };
}

export const IRRIGATION_METHODS_EFFICIENCY: Record<string, { label: string; efficiency: number }> = {
  drip: { label: 'Drip Irrigation', efficiency: 0.90 },
  sprinkler: { label: 'Sprinkler Irrigation', efficiency: 0.75 },
  furrow: { label: 'Furrow Irrigation', efficiency: 0.60 },
  flood: { label: 'Flood / Basin Irrigation', efficiency: 0.50 }
};

export const SOIL_AVAILABLE_WATER_CAPACITY: Record<string, { label: string; awcPerMeter: number }> = {
  sandy: { label: 'Sandy Soil', awcPerMeter: 90 },   // mm/m
  loamy: { label: 'Loamy Soil', awcPerMeter: 150 },  // mm/m
  clay: { label: 'Clay Soil', awcPerMeter: 190 }     // mm/m
};

const STORAGE_KEY_IRRIGATION_HISTORY = 'agrovision_irrigation_history';

export const irrigationService = {
  /**
   * Retrieves all supported crops with stage metadata
   */
  getCropsList() {
    const cropsObj = (cropCoefficientsData as any).crops || {};
    return Object.keys(cropsObj).map((k) => ({
      id: k,
      name: cropsObj[k].name,
      hindiName: cropsObj[k].hindi_name,
      emoji: cropsObj[k].emoji,
      stages: cropsObj[k].stages
    }));
  },

  /**
   * Calculates effective rainfall using USDA Soil Conservation Service method
   */
  calculateEffectiveRainfall(totalRainMm: number): number {
    if (totalRainMm <= 3.0) return 0; // Light showers evaporate off canopy
    if (totalRainMm <= 75.0) {
      const peff = totalRainMm * ((125 - 0.2 * totalRainMm) / 125);
      return Math.round(peff * 10) / 10;
    } else {
      const peff = 125 + 0.1 * totalRainMm;
      return Math.round(peff * 10) / 10;
    }
  },

  /**
   * Main Smart Irrigation Calculation Engine
   */
  async calculateIrrigationAdvice(input: IrrigationInput): Promise<IrrigationAdviceResult> {
    // 1. Fetch live shared weather data for the farm location
    const weather = await weatherService.getWeather(
      input.latitude,
      input.longitude,
      undefined,
      input.crop
    );

    const cropsObj = (cropCoefficientsData as any).crops || {};
    const cropData = cropsObj[input.crop.toLowerCase()] || cropsObj.wheat;
    const stageKey = input.growthStage.toLowerCase();
    const stageData = cropData.stages[stageKey] || cropData.stages.vegetative || Object.values(cropData.stages)[0];

    const kc = Number(stageData.kc) || 1.0;
    const rootDepth = Number(cropData.root_depth_m) || 1.0;
    const pFrac = Number(cropData.depletion_fraction_p) || 0.5;

    // 2. Weather variables
    const todayET0 = weather.agriculture.todayET0 || 4.2;
    const todayRainMm = weather.current.rain || weather.current.precipitation || 0;
    const effectiveRainfall = this.calculateEffectiveRainfall(todayRainMm);

    // 3. Days since last irrigation
    let daysSince = 1;
    if (input.lastIrrigationDate) {
      const diffMs = Date.now() - new Date(input.lastIrrigationDate).getTime();
      daysSince = Math.max(0, Math.min(15, Math.floor(diffMs / (24 * 3600 * 1000))));
    }

    // 4. ETc Calculation (FAO-56: ETc = ET0 * Kc)
    const etcDaily = Math.round(todayET0 * kc * 100) / 100;
    const etcAccumulated = Math.round(etcDaily * Math.max(1, daysSince) * 10) / 10;

    // 5. Soil hydrology
    const soilInfo = SOIL_AVAILABLE_WATER_CAPACITY[input.soilType.toLowerCase()] || SOIL_AVAILABLE_WATER_CAPACITY.loamy;
    const awcMm = Math.round(soilInfo.awcPerMeter * rootDepth);
    const rawMm = Math.round(awcMm * pFrac); // Readily Available Water threshold

    // Determine soil moisture
    let currentMoisturePct: number;
    let moistureSource: 'Sensor / Weather Estimate' | 'Manual Input' | 'Calculated Balance';

    if (input.soilMoisture !== undefined && input.soilMoisture !== null && input.soilMoisture > 0) {
      currentMoisturePct = input.soilMoisture;
      moistureSource = 'Manual Input';
    } else if (weather.current.soilMoisture !== null && weather.current.soilMoisture > 0) {
      currentMoisturePct = weather.current.soilMoisture;
      moistureSource = 'Sensor / Weather Estimate';
    } else {
      // Estimated water depletion balance
      const estimatedMoisture = Math.max(25, 75 - (daysSince * (etcDaily / 3.0)));
      currentMoisturePct = Math.round(estimatedMoisture);
      moistureSource = 'Calculated Balance';
    }

    // 6. Net Irrigation Requirement (NIR)
    // Depletion buffer (mm deficit from field capacity)
    const fieldDeficit = Math.max(0, ((70 - currentMoisturePct) / 100) * awcMm);
    const rawNet = etcAccumulated - effectiveRainfall + (fieldDeficit * 0.4);
    let netIrrigationMm = Math.max(0, Math.round(rawNet * 10) / 10);

    // If rainfall is heavy, no irrigation needed
    if (effectiveRainfall >= etcDaily * 1.5 || currentMoisturePct > 68) {
      netIrrigationMm = 0;
    }

    // 7. Method Efficiency & Gross Requirement (GIR = NIR / Efficiency)
    const methodInfo = IRRIGATION_METHODS_EFFICIENCY[input.irrigationMethod] || IRRIGATION_METHODS_EFFICIENCY.drip;
    const efficiency = methodInfo.efficiency;
    const grossIrrigationMm = netIrrigationMm > 0 ? Math.round((netIrrigationMm / efficiency) * 10) / 10 : 0;

    // 8. Unit conversions:
    // 1 mm depth = 4,046.86 litres per acre
    // 1 mm depth = 10,000 litres per hectare
    // 1 mm depth = 1 litre per sq metre
    const litresPerAcre = Math.round(grossIrrigationMm * 4046.86);
    const litresPerHectare = Math.round(grossIrrigationMm * 10000);
    const litresPerSqm = Math.round(grossIrrigationMm * 1.0);

    let totalWaterLitres = 0;
    if (input.areaUnit === 'acre') {
      totalWaterLitres = Math.round(litresPerAcre * input.area);
    } else if (input.areaUnit === 'hectare') {
      totalWaterLitres = Math.round(litresPerHectare * input.area);
    } else {
      totalWaterLitres = Math.round(litresPerSqm * input.area);
    }

    // 9. Recommendation status & actionable phrase
    let status: 'No irrigation needed' | 'Monitor' | 'Irrigation recommended' | 'High water stress';
    let badgeClass: string;
    let actionPhrase: string;
    let urgencyText: string;

    const whyExplanation: string[] = [];

    whyExplanation.push(
      `Crop evapotranspiration (ETc) is ${etcDaily} mm/day based on reference ET0 (${todayET0} mm) and crop coefficient Kc (${kc}).`
    );

    if (effectiveRainfall > 0) {
      whyExplanation.push(
        `Effective rainfall of ${effectiveRainfall} mm offset moisture consumption.`
      );
    }

    // Rule evaluation
    if (netIrrigationMm === 0 || currentMoisturePct >= 65) {
      status = 'No irrigation needed';
      badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
      const daysUntilDepletion = Math.max(2, Math.round((rawMm / etcDaily) - daysSince));
      actionPhrase = daysUntilDepletion > 2 ? `Wait ${daysUntilDepletion} days` : 'Monitor soil moisture and check again tomorrow';
      urgencyText = 'Soil moisture is optimal. Immediate watering is not required.';
      whyExplanation.push(`Soil moisture (${currentMoisturePct}%) is adequate for current ${stageData.label} stage.`);
    } else if (currentMoisturePct < 35 || netIrrigationMm > rawMm * 0.8) {
      status = 'High water stress';
      badgeClass = 'bg-red-100 text-red-800 border-red-300';
      actionPhrase = 'Irrigate now';
      urgencyText = 'Soil moisture has dropped below refill threshold; immediate irrigation required.';
      whyExplanation.push(`Soil moisture (${currentMoisturePct}%) indicates severe depletion. Root zone needs replenishment.`);
    } else if (netIrrigationMm > 0) {
      status = 'Irrigation recommended';
      badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
      actionPhrase = 'Irrigate within 24 hours';
      urgencyText = 'Transpiration depletion has reached threshold. Schedule irrigation.';
      whyExplanation.push(`Accumulated crop water loss (${etcAccumulated} mm) since last irrigation exceeds allowable soil buffer.`);
    } else {
      status = 'Monitor';
      badgeClass = 'bg-blue-100 text-blue-800 border-blue-300';
      actionPhrase = 'Monitor soil moisture and check again tomorrow';
      urgencyText = 'Crop water status is balanced. Monitor daily weather changes.';
    }

    // Suggested watering window
    let suggestedWindow = 'Early Morning (6:00 - 9:00 AM)';
    if (weather.current.windSpeed > 16) {
      suggestedWindow = 'Late Evening (5:00 - 7:30 PM) after wind subsides';
    } else if (weather.daily[0]?.maxTemp > 35) {
      suggestedWindow = 'Early Morning before 8:30 AM to avoid high evaporative loss';
    }

    // Next check date calculation
    const nextCheckDateObj = new Date();
    const daysToAdd = status === 'No irrigation needed' ? 2 : 1;
    nextCheckDateObj.setDate(nextCheckDateObj.getDate() + daysToAdd);
    const nextCheckDate = nextCheckDateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    // Timeline construction
    const prevDateLabel = input.lastIrrigationDate
      ? new Date(input.lastIrrigationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : `${daysSince} days ago`;

    const result: IrrigationAdviceResult = {
      id: 'IRR-' + Date.now().toString(36).toUpperCase(),
      timestamp: new Date().toISOString(),
      crop: {
        id: cropData.id,
        name: cropData.name,
        hindiName: cropData.hindi_name,
        emoji: cropData.emoji
      },
      growthStage: {
        id: stageKey,
        label: stageData.label,
        description: stageData.description
      },
      inputs: {
        area: input.area,
        areaUnit: input.areaUnit,
        soilType: soilInfo.label,
        lastIrrigationDate: input.lastIrrigationDate,
        daysSinceIrrigation: daysSince,
        irrigationMethod: methodInfo.label,
        soilMoistureInput: input.soilMoisture ?? null,
        soilMoistureSource: moistureSource
      },
      weatherSummary: {
        locationName: weather.location.name,
        temperature: weather.current.temperature,
        humidity: weather.current.humidity,
        todayET0,
        expectedRainfall: todayRainMm,
        effectiveRainfall
      },
      calculations: {
        kc,
        etcDaily,
        etcAccumulated,
        netIrrigationMm,
        applicationEfficiency: efficiency,
        grossIrrigationMm,
        litresPerAcre,
        litresPerHectare,
        litresPerSqm,
        totalWaterLitres
      },
      recommendation: {
        status,
        badgeClass,
        actionPhrase,
        urgencyText,
        suggestedWindow,
        nextCheckDate,
        whyExplanation
      },
      timeline: {
        previous: { date: prevDateLabel, label: 'Previous Irrigation' },
        current: { date: 'Today', status: actionPhrase },
        next: { date: nextCheckDate, projectedAction: 'Next Soil Moisture Review' }
      },
      soilHydrology: {
        awcMm,
        rawMm,
        currentMoisturePct
      }
    };

    // Save to history in localStorage
    this.saveToHistory(result);

    return result;
  },

  /**
   * Save advice result to localStorage
   */
  saveToHistory(advice: IrrigationAdviceResult): void {
    try {
      const history = this.getHistory();
      const updated = [advice, ...history.filter(h => h.id !== advice.id)].slice(0, 15);
      localStorage.setItem(STORAGE_KEY_IRRIGATION_HISTORY, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  },

  /**
   * Retrieve history
   */
  getHistory(): IrrigationAdviceResult[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_IRRIGATION_HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  /**
   * Clear history
   */
  clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_IRRIGATION_HISTORY);
    } catch {
      // Ignore
    }
  }
};
