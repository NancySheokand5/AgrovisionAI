export type CropCategory = 'Cereals' | 'Pulses' | 'Oilseeds' | 'Vegetables' | 'Commercial';

export interface Crop {
  id: string;
  name: string;
  hindiName: string;
  category: CropCategory;
  standardUnit: string;
  typicalSeason: string;
  msp?: number; // Minimum Support Price benchmark in ₹/Quintal
}

export interface State {
  id: string;
  name: string;
  code: string;
}

export interface Mandi {
  id: string;
  name: string;
  stateId: string;
  district: string;
  majorCommodities: string[];
}

export interface MandiPriceRecord {
  cropId: string;
  mandiId: string;
  stateId: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  arrivalQuantity: number; // in Quintals
  tradeDate: string;
  grade: string;
  variety: string;
}

export interface HistoricalPricePoint {
  date: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  arrivals: number;
}

export interface MandiComparisonItem {
  mandiId: string;
  mandiName: string;
  district: string;
  stateName: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  arrivalQuantity: number;
  differenceVsSelected: number;
  percentDiffVsSelected: number;
  isSelected: boolean;
}

export type TrendDirection = 'increase' | 'decrease' | 'stable';

export interface PredictionInput {
  cropId: string;
  stateId: string;
  mandiId: string;
  currentPrice: number;
  previousPrice: number;
  season: string;
  horizonDays: number;
}

export interface PredictionResult {
  cropId: string;
  cropName: string;
  mandiId: string;
  mandiName: string;
  currentPrice: number;
  predictedPrice: number;
  changeAmount: number;
  changePercent: number;
  trend: TrendDirection;
  confidenceLabel: string;
  modelStatus: string;
  explanation: string;
  marketInsight: string;
  predictedDate: string;
  keyFactors: string[];
}
