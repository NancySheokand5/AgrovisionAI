// ============================================================
// AgroVision AI – Farmer Dashboard Mock Data
// All data is structured for drop-in API replacement.
// To connect live data: replace each exported constant with
// an async service call (see src/services/ pattern).
// ============================================================

import type { DashboardData } from '../types/dashboard';

export const mockDashboardData: DashboardData = {

  // ── Farmer Profile ────────────────────────────────────────
  farmer: {
    id: 'farmer-001',
    name: 'Ramesh Kumar',
    avatarInitials: 'RK',
    location: 'Karnal, Haryana',
    state: 'Haryana',
    district: 'Karnal',
    farmSize: 12,
    farmSizeUnit: 'acres',
    currentSeason: 'Kharif',
    seasonYear: '2026',
    primaryLanguage: 'hi',
    lastActive: new Date().toISOString(),
  },

  // ── Farm Health Summary ───────────────────────────────────
  farmHealth: {
    overallScore: 82,
    label: 'Healthy',
    cropHealthScore: 85,
    soilMoistureScore: 72,
    waterLevelScore: 68,
    weatherScore: 90,
    healthyCrops: 3,
    cropsNeedingAttention: 1,
    totalCrops: 4,
    lastUpdated: new Date().toISOString(),
  },

  // ── Weather ────────────────────────────────────────────────
  weather: {
    temperature: 28,
    feelsLike: 31,
    humidity: 72,
    windSpeed: 12,
    windDirection: 'NW',
    rainProbability: 20,
    condition: 'Partly Cloudy',
    uvIndex: 6,
    visibility: 8,
    activitySuitability: 'Good conditions for field activity',
    forecast: [
      { day: 'Mon', icon: '⛅', high: 29, low: 22, rainChance: 10 },
      { day: 'Tue', icon: '🌧', high: 25, low: 20, rainChance: 70 },
      { day: 'Wed', icon: '🌤', high: 27, low: 21, rainChance: 15 },
      { day: 'Thu', icon: '☀️', high: 31, low: 23, rainChance: 5 },
      { day: 'Fri', icon: '⛅', high: 30, low: 22, rainChance: 20 },
    ],
    lastUpdated: new Date().toISOString(),
  },

  // ── Crop Health ────────────────────────────────────────────
  cropHealth: [
    {
      id: 'crop-wheat',
      cropName: 'Wheat',
      cropEmoji: '🌾',
      variety: 'HD-3086',
      healthScore: 91,
      status: 'Healthy',
      area: 5,
      growthStage: 'Vegetative',
      daysToHarvest: 62,
      lastChecked: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      issues: [],
    },
    {
      id: 'crop-tomato',
      cropName: 'Tomato',
      cropEmoji: '🍅',
      variety: 'Pusa Ruby',
      healthScore: 68,
      status: 'Needs Attention',
      area: 2,
      growthStage: 'Flowering',
      daysToHarvest: 28,
      lastChecked: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
      issues: ['Early signs of fungal disease', 'Humidity stress'],
    },
    {
      id: 'crop-rice',
      cropName: 'Rice',
      cropEmoji: '🌱',
      variety: 'Pusa Basmati',
      healthScore: 87,
      status: 'Healthy',
      area: 4,
      growthStage: 'Tillering',
      daysToHarvest: 80,
      lastChecked: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
      issues: [],
    },
    {
      id: 'crop-onion',
      cropName: 'Onion',
      cropEmoji: '🧅',
      variety: 'Nasik Red',
      healthScore: 79,
      status: 'Healthy',
      area: 1,
      growthStage: 'Bulb Development',
      daysToHarvest: 45,
      lastChecked: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      issues: [],
    },
  ],

  // ── AI Advisor Messages ────────────────────────────────────
  aiAdvisor: [
    {
      id: 'ai-001',
      title: 'Tomato Crop Needs Attention',
      summary: 'Your tomato crop may need attention due to increased humidity over the past 48 hours.',
      recommendation: 'Check the leaves for early signs of fungal disease. Apply a preventive copper-based fungicide and ensure adequate ventilation between plants.',
      priority: 'High',
      category: 'Disease',
      timestamp: new Date(Date.now() - 3600 * 1000).toISOString(),
      affectedCrops: ['Tomato'],
    },
    {
      id: 'ai-002',
      title: 'Good Wheat Growth Outlook',
      summary: 'Weather conditions this week are favorable for wheat growth.',
      recommendation: 'Consider applying the second dose of nitrogen fertilizer in the next 3–5 days to support the vegetative stage.',
      priority: 'Medium',
      category: 'Fertilizer',
      timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      affectedCrops: ['Wheat'],
    },
    {
      id: 'ai-003',
      title: 'Light Rain Forecast Tomorrow',
      summary: 'Rain is expected tomorrow with 70% probability.',
      recommendation: 'You may skip scheduled irrigation for Wednesday. Check drainage around the tomato field to avoid waterlogging.',
      priority: 'Medium',
      category: 'Weather',
      timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      affectedCrops: ['Tomato', 'Onion'],
    },
  ],

  // ── Mandi Price Summary ────────────────────────────────────
  mandiPrices: [
    {
      cropId: 'tomato',
      cropName: 'Tomato',
      cropEmoji: '🍅',
      unit: 'quintal',
      currentPrice: 2450,
      predictedPrice: 2680,
      trend: 'up',
      changePercent: 9.4,
      mandi: 'Karnal Mandi',
    },
    {
      cropId: 'wheat',
      cropName: 'Wheat',
      cropEmoji: '🌾',
      unit: 'quintal',
      currentPrice: 2275,
      predictedPrice: 2210,
      trend: 'down',
      changePercent: -2.9,
      mandi: 'Karnal Mandi',
    },
    {
      cropId: 'rice',
      cropName: 'Rice',
      cropEmoji: '🌱',
      unit: 'quintal',
      currentPrice: 3150,
      predictedPrice: 3220,
      trend: 'up',
      changePercent: 2.2,
      mandi: 'Karnal Mandi',
    },
  ],

  // ── Disease Alerts ─────────────────────────────────────────
  diseaseAlerts: [
    {
      id: 'alert-001',
      cropName: 'Tomato',
      cropEmoji: '🍅',
      alertTitle: 'Possible Fungal Disease Detected',
      description: 'High humidity in the past 2 days has created conditions suitable for early blight or leaf mold on your tomato plants.',
      severity: 'Medium',
      detectedDate: new Date().toISOString(),
      affectedArea: 2,
      recommendedAction: 'Inspect leaves for yellowing or dark spots. Apply fungicide and improve drainage.',
    },
  ],

  // ── Soil Condition ─────────────────────────────────────────
  soilCondition: {
    moisture: 68,
    moistureStatus: 'Optimal',
    ph: 6.5,
    phStatus: 'Neutral',
    nitrogen: 'Good',
    phosphorus: 'Adequate',
    potassium: 'Good',
    organicMatter: 2.4,
    temperature: 24,
    lastUpdated: new Date().toISOString(),
  },

  // ── Irrigation ─────────────────────────────────────────────
  irrigation: {
    currentMoisture: 64,
    optimalMoisture: 70,
    lastIrrigation: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    nextIrrigationRecommended: 'Tomorrow morning (6–8 AM)',
    waterUsedToday: 1800,
    dailyWaterTarget: 2400,
    irrigationMethod: 'Drip',
    scheduleToday: false,
    scheduleNote: 'Rain forecast tomorrow — monitor moisture levels',
  },

  // ── Recent Activity ────────────────────────────────────────
  recentActivity: [
    {
      id: 'act-001',
      action: 'Crop Health Checked',
      details: 'Tomato field – 2 acres',
      timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      icon: '🌱',
      category: 'Health',
    },
    {
      id: 'act-002',
      action: 'Mandi Price Viewed',
      details: 'Wheat – Karnal Mandi',
      timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      icon: '💰',
      category: 'Market',
    },
    {
      id: 'act-003',
      action: 'AI Advisory Received',
      details: 'Tomato disease risk assessment',
      timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      icon: '🤖',
      category: 'AI',
    },
    {
      id: 'act-004',
      action: 'Irrigation Recommendation',
      details: 'Rice field – 4 acres',
      timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000 - 3600 * 1000).toISOString(),
      icon: '💧',
      category: 'Irrigation',
    },
    {
      id: 'act-005',
      action: 'Weather Alert Viewed',
      details: 'Rain forecast – Karnal',
      timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      icon: '🌦',
      category: 'Weather',
    },
  ],

  // ── Farm Sections (visual map) ─────────────────────────────
  farmSections: [
    {
      id: 'sec-wheat',
      label: 'Field A',
      cropName: 'Wheat',
      cropEmoji: '🌾',
      area: 5,
      healthStatus: 'Healthy',
      x: 0, y: 0, w: 2, h: 2,
    },
    {
      id: 'sec-rice',
      label: 'Field B',
      cropName: 'Rice',
      cropEmoji: '🌱',
      area: 4,
      healthStatus: 'Healthy',
      x: 2, y: 0, w: 2, h: 2,
    },
    {
      id: 'sec-tomato',
      label: 'Field C',
      cropName: 'Tomato',
      cropEmoji: '🍅',
      area: 2,
      healthStatus: 'Needs Attention',
      x: 0, y: 2, w: 2, h: 1,
    },
    {
      id: 'sec-onion',
      label: 'Field D',
      cropName: 'Onion',
      cropEmoji: '🧅',
      area: 1,
      healthStatus: 'Healthy',
      x: 2, y: 2, w: 1, h: 1,
    },
  ],
};

// ── Dashboard Service Shell ────────────────────────────────────
// Replace this with API calls when backend is ready:
// export async function fetchDashboardData(farmerId: string): Promise<DashboardData> {
//   const res = await fetch(`${import.meta.env.VITE_DASHBOARD_API_URL}/farmer/${farmerId}/dashboard`);
//   return res.json();
// }
