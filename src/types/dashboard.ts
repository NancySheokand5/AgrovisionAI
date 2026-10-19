// ============================================================
// AgroVision AI – Farmer Dashboard Types
// Structured for future API/MongoDB backend integration
// ============================================================

// ── Farmer & Farm Profile ────────────────────────────────────
export interface FarmerProfile {
  id: string;
  name: string;
  avatarInitials: string;
  location: string;         // City/District, State
  state: string;
  district: string;
  farmSize: number;         // in acres
  farmSizeUnit: 'acres' | 'hectares' | 'bigha';
  currentSeason: 'Kharif' | 'Rabi' | 'Zaid';
  seasonYear: string;
  primaryLanguage: 'en' | 'hi' | 'pa' | 'hr';
  lastActive: string;       // ISO datetime
}

// ── Farm Health ──────────────────────────────────────────────
export interface FarmHealthSummary {
  overallScore: number;     // 0–100
  label: 'Excellent' | 'Good' | 'Healthy' | 'Needs Attention' | 'Critical';
  cropHealthScore: number;
  soilMoistureScore: number;
  waterLevelScore: number;
  weatherScore: number;
  healthyCrops: number;
  cropsNeedingAttention: number;
  totalCrops: number;
  lastUpdated: string;      // ISO datetime
}

// ── Weather ──────────────────────────────────────────────────
export type WeatherCondition =
  | 'Sunny'
  | 'Partly Cloudy'
  | 'Cloudy'
  | 'Light Rain'
  | 'Heavy Rain'
  | 'Foggy'
  | 'Windy'
  | 'Thunderstorm';

export interface WeatherData {
  temperature: number;      // Celsius
  feelsLike: number;
  humidity: number;         // %
  windSpeed: number;        // km/h
  windDirection: string;
  rainProbability: number;  // %
  condition: WeatherCondition;
  uvIndex: number;
  visibility: number;       // km
  activitySuitability: string;  // "Good conditions for field activity"
  forecast: WeatherForecastDay[];
  lastUpdated: string;
}

export interface WeatherForecastDay {
  day: string;              // "Mon", "Tue", etc.
  icon: string;             // emoji or icon key
  high: number;
  low: number;
  rainChance: number;
}

// ── Crop Health ──────────────────────────────────────────────
export type CropHealthStatus = 'Healthy' | 'Needs Attention' | 'Critical' | 'Excellent';

export interface CropHealthItem {
  id: string;
  cropName: string;
  cropEmoji: string;
  variety: string;
  healthScore: number;      // 0–100
  status: CropHealthStatus;
  area: number;             // acres
  growthStage: string;      // "Vegetative", "Flowering", etc.
  daysToHarvest?: number;
  lastChecked: string;
  issues?: string[];
}

// ── AI Advisor ───────────────────────────────────────────────
export interface AIAdvisorMessage {
  id: string;
  title: string;
  summary: string;
  recommendation: string;
  priority: 'High' | 'Medium' | 'Low';
  category: 'Disease' | 'Weather' | 'Irrigation' | 'Fertilizer' | 'Market' | 'Pest' | 'General';
  timestamp: string;
  affectedCrops: string[];
}

// ── Mandi Price Summary ───────────────────────────────────────
export interface MandiPriceSummaryItem {
  cropId: string;
  cropName: string;
  cropEmoji: string;
  unit: string;
  currentPrice: number;
  predictedPrice: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  mandi: string;
}

// ── Disease Alert ─────────────────────────────────────────────
export type AlertSeverity = 'High' | 'Medium' | 'Low';

export interface DiseaseAlert {
  id: string;
  cropName: string;
  cropEmoji: string;
  alertTitle: string;
  description: string;
  severity: AlertSeverity;
  detectedDate: string;
  affectedArea?: number;    // acres
  recommendedAction: string;
}

// ── Soil Condition ────────────────────────────────────────────
export type SoilMoistureStatus = 'Dry' | 'Optimal' | 'Wet' | 'Saturated';
export type NutrientLevel = 'Low' | 'Adequate' | 'Good' | 'High';

export interface SoilConditionData {
  moisture: number;         // %
  moistureStatus: SoilMoistureStatus;
  ph: number;               // 0–14
  phStatus: 'Acidic' | 'Neutral' | 'Alkaline';
  nitrogen: NutrientLevel;
  phosphorus: NutrientLevel;
  potassium: NutrientLevel;
  organicMatter: number;    // %
  temperature: number;      // soil temp Celsius
  lastUpdated: string;
}

// ── Irrigation ────────────────────────────────────────────────
export interface IrrigationData {
  currentMoisture: number;  // %
  optimalMoisture: number;  // %
  lastIrrigation: string;   // ISO datetime
  nextIrrigationRecommended: string;  // human-readable
  waterUsedToday: number;   // liters
  dailyWaterTarget: number; // liters
  irrigationMethod: string; // "Drip", "Sprinkler", "Flood"
  scheduleToday: boolean;
  scheduleNote: string;
}

// ── Recent Activity ───────────────────────────────────────────
export interface ActivityItem {
  id: string;
  action: string;
  details: string;
  timestamp: string;        // ISO datetime
  icon: string;             // emoji or icon key
  category: 'Health' | 'Market' | 'Irrigation' | 'Disease' | 'AI' | 'Weather';
}

// ── Farm Map ──────────────────────────────────────────────────
export interface FarmSection {
  id: string;
  label: string;
  cropName: string;
  cropEmoji: string;
  area: number;             // acres
  healthStatus: CropHealthStatus;
  x: number;               // grid position (0-based col)
  y: number;               // grid position (0-based row)
  w: number;               // grid width
  h: number;               // grid height
}

// ── Dashboard State (root composite) ─────────────────────────
export interface DashboardData {
  farmer: FarmerProfile;
  farmHealth: FarmHealthSummary;
  weather: WeatherData;
  cropHealth: CropHealthItem[];
  aiAdvisor: AIAdvisorMessage[];
  mandiPrices: MandiPriceSummaryItem[];
  diseaseAlerts: DiseaseAlert[];
  soilCondition: SoilConditionData;
  irrigation: IrrigationData;
  recentActivity: ActivityItem[];
  farmSections: FarmSection[];
}
