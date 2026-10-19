import type { Crop, State, Mandi, MandiPriceRecord, HistoricalPricePoint } from '../types';

export const CROPS: Crop[] = [
  {
    id: 'wheat',
    name: 'Wheat',
    hindiName: 'गेहूं',
    category: 'Cereals',
    standardUnit: '₹ / Quintal',
    typicalSeason: 'Rabi (Oct - Apr)',
    msp: 2275,
  },
  {
    id: 'rice',
    name: 'Rice (Paddy)',
    hindiName: 'धान / चावल',
    category: 'Cereals',
    standardUnit: '₹ / Quintal',
    typicalSeason: 'Kharif (Jun - Nov)',
    msp: 2300,
  },
  {
    id: 'mustard',
    name: 'Mustard Seeds',
    hindiName: 'सरसों',
    category: 'Oilseeds',
    standardUnit: '₹ / Quintal',
    typicalSeason: 'Rabi (Oct - Mar)',
    msp: 5650,
  },
  {
    id: 'cotton',
    name: 'Cotton (Kapas)',
    hindiName: 'कपास',
    category: 'Commercial',
    standardUnit: '₹ / Quintal',
    typicalSeason: 'Kharif (May - Dec)',
    msp: 7122,
  },
  {
    id: 'maize',
    name: 'Maize (Corn)',
    hindiName: 'मक्का',
    category: 'Cereals',
    standardUnit: '₹ / Quintal',
    typicalSeason: 'Kharif & Rabi',
    msp: 2090,
  },
  {
    id: 'soybean',
    name: 'Soybean',
    hindiName: 'सोयाबीन',
    category: 'Oilseeds',
    standardUnit: '₹ / Quintal',
    typicalSeason: 'Kharif (Jun - Oct)',
    msp: 4600,
  },
  {
    id: 'gram',
    name: 'Gram (Chana)',
    hindiName: 'चना',
    category: 'Pulses',
    standardUnit: '₹ / Quintal',
    typicalSeason: 'Rabi (Oct - Apr)',
    msp: 5440,
  },
  {
    id: 'bajra',
    name: 'Bajra (Pearl Millet)',
    hindiName: 'बाजरा',
    category: 'Cereals',
    standardUnit: '₹ / Quintal',
    typicalSeason: 'Kharif (Jul - Nov)',
    msp: 2500,
  },
  {
    id: 'tomato',
    name: 'Tomato',
    hindiName: 'टमाटर',
    category: 'Vegetables',
    standardUnit: '₹ / Quintal',
    typicalSeason: 'Year-round',
  },
  {
    id: 'potato',
    name: 'Potato',
    hindiName: 'आलू',
    category: 'Vegetables',
    standardUnit: '₹ / Quintal',
    typicalSeason: 'Rabi (Nov - Mar)',
  },
  {
    id: 'onion',
    name: 'Onion',
    hindiName: 'प्याज',
    category: 'Vegetables',
    standardUnit: '₹ / Quintal',
    typicalSeason: 'Kharif & Late Kharif',
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    hindiName: 'गन्ना',
    category: 'Commercial',
    standardUnit: '₹ / Quintal',
    typicalSeason: 'Annual (Oct - May)',
    msp: 315, // Fair & Remunerative Price
  },
];

export const STATES: State[] = [
  { id: 'haryana', name: 'Haryana', code: 'HR' },
  { id: 'punjab', name: 'Punjab', code: 'PB' },
  { id: 'uttar-pradesh', name: 'Uttar Pradesh', code: 'UP' },
  { id: 'rajasthan', name: 'Rajasthan', code: 'RJ' },
  { id: 'madhya-pradesh', name: 'Madhya Pradesh', code: 'MP' },
  { id: 'maharashtra', name: 'Maharashtra', code: 'MH' },
  { id: 'gujarat', name: 'Gujarat', code: 'GJ' },
  { id: 'bihar', name: 'Bihar', code: 'BR' },
  { id: 'karnataka', name: 'Karnataka', code: 'KA' },
];

export const MANDIS: Mandi[] = [
  // Haryana
  { id: 'karnal', name: 'Karnal Mandi', stateId: 'haryana', district: 'Karnal', majorCommodities: ['wheat', 'rice', 'mustard'] },
  { id: 'hisar', name: 'Hisar Mandi', stateId: 'haryana', district: 'Hisar', majorCommodities: ['wheat', 'cotton', 'mustard', 'bajra'] },
  { id: 'sirsa', name: 'Sirsa Mandi', stateId: 'haryana', district: 'Sirsa', majorCommodities: ['cotton', 'wheat', 'mustard'] },
  { id: 'panipat', name: 'Panipat Mandi', stateId: 'haryana', district: 'Panipat', majorCommodities: ['wheat', 'rice', 'vegetables'] },
  { id: 'ambala', name: 'Ambala Mandi', stateId: 'haryana', district: 'Ambala', majorCommodities: ['wheat', 'rice', 'maize'] },
  { id: 'rohtak', name: 'Rohtak Mandi', stateId: 'haryana', district: 'Rohtak', majorCommodities: ['wheat', 'bajra', 'mustard'] },

  // Punjab
  { id: 'ludhiana', name: 'Ludhiana Mandi', stateId: 'punjab', district: 'Ludhiana', majorCommodities: ['wheat', 'rice', 'maize'] },
  { id: 'khanna', name: 'Khanna Grain Market', stateId: 'punjab', district: 'Ludhiana', majorCommodities: ['wheat', 'rice'] },
  { id: 'jalandhar', name: 'Jalandhar Mandi', stateId: 'punjab', district: 'Jalandhar', majorCommodities: ['potato', 'wheat', 'rice'] },
  { id: 'amritsar', name: 'Amritsar Mandi', stateId: 'punjab', district: 'Amritsar', majorCommodities: ['rice', 'wheat'] },
  { id: 'bathinda', name: 'Bathinda Mandi', stateId: 'punjab', district: 'Bathinda', majorCommodities: ['cotton', 'wheat', 'mustard'] },

  // Uttar Pradesh
  { id: 'azadpur', name: 'Azadpur Mandi (NCR)', stateId: 'uttar-pradesh', district: 'NCR Border', majorCommodities: ['tomato', 'potato', 'onion', 'fruits'] },
  { id: 'agra', name: 'Agra Mandi', stateId: 'uttar-pradesh', district: 'Agra', majorCommodities: ['potato', 'mustard', 'wheat'] },
  { id: 'meerut', name: 'Meerut Mandi', stateId: 'uttar-pradesh', district: 'Meerut', majorCommodities: ['sugarcane', 'wheat', 'potato'] },
  { id: 'bareilly', name: 'Bareilly Mandi', stateId: 'uttar-pradesh', district: 'Bareilly', majorCommodities: ['rice', 'wheat', 'mustard'] },
  { id: 'aligarh', name: 'Aligarh Mandi', stateId: 'uttar-pradesh', district: 'Aligarh', majorCommodities: ['wheat', 'mustard', 'bajra'] },

  // Rajasthan
  { id: 'jaipur', name: 'Jaipur (Muhana) Mandi', stateId: 'rajasthan', district: 'Jaipur', majorCommodities: ['mustard', 'bajra', 'wheat', 'vegetables'] },
  { id: 'kota', name: 'Kota Mandi', stateId: 'rajasthan', district: 'Kota', majorCommodities: ['soybean', 'wheat', 'mustard', 'coriander'] },
  { id: 'alwar', name: 'Alwar Mandi', stateId: 'rajasthan', district: 'Alwar', majorCommodities: ['mustard', 'onion', 'bajra', 'wheat'] },
  { id: 'sri-ganganagar', name: 'Sri Ganganagar Mandi', stateId: 'rajasthan', district: 'Sri Ganganagar', majorCommodities: ['cotton', 'wheat', 'mustard', 'gram'] },
  { id: 'bikaner', name: 'Bikaner Mandi', stateId: 'rajasthan', district: 'Bikaner', majorCommodities: ['gram', 'bajra', 'groundnut'] },

  // Madhya Pradesh
  { id: 'indore', name: 'Indore Mandi', stateId: 'madhya-pradesh', district: 'Indore', majorCommodities: ['soybean', 'wheat', 'onion', 'potato'] },
  { id: 'ujjain', name: 'Ujjain Mandi', stateId: 'madhya-pradesh', district: 'Ujjain', majorCommodities: ['soybean', 'wheat', 'gram'] },
  { id: 'neemuch', name: 'Neemuch Mandi', stateId: 'madhya-pradesh', district: 'Neemuch', majorCommodities: ['soybean', 'mustard', 'garlic', 'wheat'] },
  { id: 'bhopal', name: 'Bhopal (Karond) Mandi', stateId: 'madhya-pradesh', district: 'Bhopal', majorCommodities: ['wheat', 'gram', 'soybean'] },

  // Maharashtra
  { id: 'lasalgaon', name: 'Lasalgaon Mandi (Asia Largest)', stateId: 'maharashtra', district: 'Nashik', majorCommodities: ['onion', 'tomato', 'soybean'] },
  { id: 'nashik', name: 'Nashik APMC Mandi', stateId: 'maharashtra', district: 'Nashik', majorCommodities: ['onion', 'tomato', 'grapes'] },
  { id: 'pune', name: 'Pune (Gultekdi) APMC', stateId: 'maharashtra', district: 'Pune', majorCommodities: ['vegetables', 'sugarcane', 'soybean'] },
  { id: 'nagpur', name: 'Nagpur APMC Mandi', stateId: 'maharashtra', district: 'Nagpur', majorCommodities: ['cotton', 'soybean', 'oranges', 'gram'] },

  // Gujarat
  { id: 'rajkot', name: 'Rajkot APMC Mandi', stateId: 'gujarat', district: 'Rajkot', majorCommodities: ['cotton', 'groundnut', 'wheat'] },
  { id: 'gondal', name: 'Gondal APMC Mandi', stateId: 'gujarat', district: 'Rajkot', majorCommodities: ['chilli', 'groundnut', 'cotton', 'onion'] },
  { id: 'surat', name: 'Surat APMC Mandi', stateId: 'gujarat', district: 'Surat', majorCommodities: ['sugarcane', 'vegetables', 'rice'] },
  { id: 'unjha', name: 'Unjha Mandi', stateId: 'gujarat', district: 'Mehsana', majorCommodities: ['spices', 'mustard', 'bajra'] },

  // Bihar
  { id: 'patna', name: 'Patna (Bazar Samiti)', stateId: 'bihar', district: 'Patna', majorCommodities: ['rice', 'wheat', 'potato', 'maize'] },
  { id: 'muzaffarpur', name: 'Muzaffarpur Mandi', stateId: 'bihar', district: 'Muzaffarpur', majorCommodities: ['maize', 'rice', 'vegetables'] },
  { id: 'purnea', name: 'Gulabbagh Mandi (Purnea)', stateId: 'bihar', district: 'Purnea', majorCommodities: ['maize', 'jute', 'rice'] },

  // Karnataka
  { id: 'yeshwanthpur', name: 'Bengaluru (Yeshwanthpur) APMC', stateId: 'karnataka', district: 'Bengaluru Urban', majorCommodities: ['tomato', 'potato', 'onion', 'ragi'] },
  { id: 'hubballi', name: 'Hubballi APMC Mandi', stateId: 'karnataka', district: 'Dharwad', majorCommodities: ['cotton', 'onion', 'chilli', 'maize'] },
  { id: 'belagavi', name: 'Belagavi APMC Mandi', stateId: 'karnataka', district: 'Belagavi', majorCommodities: ['sugarcane', 'vegetables', 'maize'] },
];

// Baseline price anchors in ₹/Quintal
const CROP_BASE_PRICES: Record<string, { base: number; spread: number; defaultArrival: number }> = {
  wheat: { base: 2450, spread: 140, defaultArrival: 1250 },
  rice: { base: 2680, spread: 180, defaultArrival: 1800 },
  mustard: { base: 5820, spread: 260, defaultArrival: 620 },
  cotton: { base: 7350, spread: 350, defaultArrival: 940 },
  maize: { base: 2180, spread: 130, defaultArrival: 1400 },
  soybean: { base: 4720, spread: 220, defaultArrival: 880 },
  gram: { base: 5680, spread: 240, defaultArrival: 520 },
  bajra: { base: 2540, spread: 150, defaultArrival: 760 },
  tomato: { base: 1850, spread: 450, defaultArrival: 2400 },
  potato: { base: 1420, spread: 210, defaultArrival: 3100 },
  onion: { base: 2150, spread: 380, defaultArrival: 2850 },
  sugarcane: { base: 340, spread: 25, defaultArrival: 5600 },
};

// State-level realistic adjustments (logistics, local production surplus vs deficit)
const STATE_PRICE_MODIFIERS: Record<string, number> = {
  haryana: 1.0,
  punjab: 0.99,
  'uttar-pradesh': 0.97,
  rajasthan: 1.02,
  'madhya-pradesh': 0.98,
  maharashtra: 1.04,
  gujarat: 1.03,
  bihar: 0.96,
  karnataka: 1.06,
};

// Deterministic pseudo-random seed helper for consistent prototype data
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Calculates current market price record for a given crop & mandi
 */
export function generateCurrentPriceRecord(cropId: string, mandiId: string): MandiPriceRecord {
  const cropConfig = CROP_BASE_PRICES[cropId] || { base: 2200, spread: 150, defaultArrival: 800 };
  const mandi = MANDIS.find((m) => m.id === mandiId) || MANDIS[0];
  const stateMod = STATE_PRICE_MODIFIERS[mandi.stateId] || 1.0;

  const seed = stringToSeed(`${cropId}-${mandiId}`);
  const mandiVariation = (pseudoRandom(seed) - 0.5) * 0.08; // ±4% variation per mandi
  
  const modalPrice = Math.round((cropConfig.base * stateMod * (1 + mandiVariation)) / 10) * 10;
  const spreadHalf = Math.round((cropConfig.spread * (0.8 + pseudoRandom(seed + 1) * 0.4)) / 2);
  const minPrice = modalPrice - spreadHalf;
  const maxPrice = modalPrice + spreadHalf;

  const arrivalQuantity = Math.round(
    cropConfig.defaultArrival * (0.7 + pseudoRandom(seed + 2) * 0.6)
  );

  return {
    cropId,
    mandiId: mandi.id,
    stateId: mandi.stateId,
    minPrice,
    maxPrice,
    modalPrice,
    arrivalQuantity,
    tradeDate: 'Today (Live Session Demo)',
    grade: 'FAQ (Fair Average Quality)',
    variety: 'Standard / Hybrid',
  };
}

/**
 * Generates historical trend data points for chart
 */
export function generateHistoricalPrices(
  cropId: string,
  mandiId: string,
  days: number = 30
): HistoricalPricePoint[] {
  const baseRecord = generateCurrentPriceRecord(cropId, mandiId);
  const points: HistoricalPricePoint[] = [];
  const seed = stringToSeed(`${cropId}-${mandiId}-history`);

  // Target current price is baseRecord.modalPrice on day 0 (today)
  let currentWalkingPrice = baseRecord.modalPrice;

  // We walk backward in time, then reverse
  const rawPoints: { daysAgo: number; price: number; arrivals: number }[] = [];
  rawPoints.push({ daysAgo: 0, price: currentWalkingPrice, arrivals: baseRecord.arrivalQuantity });

  for (let i = 1; i < days; i++) {
    const daySeed = seed + i * 17;
    // Periodic wave + gentle random walk
    const wave = Math.sin((i / days) * Math.PI * 2) * 0.02;
    const randomDelta = (pseudoRandom(daySeed) - 0.48) * 0.035; // slight upward drift toward today
    const stepChange = (wave + randomDelta);
    currentWalkingPrice = Math.round((currentWalkingPrice / (1 + stepChange)) / 10) * 10;
    
    // Arrival inversely correlates with price jumps often
    const arrivalFactor = 1 - (randomDelta * 2);
    const dayArrival = Math.round(baseRecord.arrivalQuantity * Math.max(0.5, Math.min(1.8, arrivalFactor)));

    rawPoints.push({ daysAgo: i, price: currentWalkingPrice, arrivals: dayArrival });
  }

  // Today is at the end of the array
  rawPoints.reverse();

  const now = new Date();
  for (const pt of rawPoints) {
    const d = new Date(now);
    d.setDate(d.getDate() - pt.daysAgo);
    const dateStr = d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });

    const spread = Math.round(pt.price * 0.04);
    points.push({
      date: dateStr,
      modalPrice: pt.price,
      minPrice: pt.price - spread,
      maxPrice: pt.price + spread,
      arrivals: pt.arrivals,
    });
  }

  return points;
}
