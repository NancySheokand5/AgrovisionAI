/**
 * API client service for AgroVision AI Backend.
 */

const API_BASE = '/api';

export async function submitCropRecommendation(data) {
  try {
    const res = await fetch(`${API_BASE}/crop-recommendation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to analyze farm conditions.');
    }
    return json;
  } catch (err) {
    console.error('API Error in submitCropRecommendation:', err);
    throw err;
  }
}

export async function fetchSampleConditions() {
  try {
    const res = await fetch(`${API_BASE}/sample-conditions`);
    if (!res.ok) throw new Error('Could not fetch sample presets');
    return await res.json();
  } catch (err) {
    console.warn('Using local fallback for sample conditions:', err);
    // Offline / fallback presets
    return {
      success: true,
      samples: [
        {
          name: 'Kharif Rice Field (Paddy)',
          region: 'Indo-Gangetic Plains',
          season: 'Kharif',
          state: 'Haryana',
          district: 'Karnal',
          farm_size: '4',
          farm_size_unit: 'Acres',
          data: { N: 90, P: 42, K: 43, temperature: 24, humidity: 82, ph: 6.8, rainfall: 210 }
        },
        {
          name: 'Rabi Chickpea (Chana)',
          region: 'Central Black Soil Belt',
          season: 'Rabi',
          state: 'Madhya Pradesh',
          district: 'Ujjain',
          farm_size: '5',
          farm_size_unit: 'Acres',
          data: { N: 38, P: 58, K: 78, temperature: 19, humidity: 18, ph: 5.8, rainfall: 65 }
        },
        {
          name: 'Commercial Banana Farm',
          region: 'Western Fertile Loam',
          season: 'Annual',
          state: 'Maharashtra',
          district: 'Jalgaon',
          farm_size: '3',
          farm_size_unit: 'Acres',
          data: { N: 105, P: 72, K: 52, temperature: 28, humidity: 78, ph: 6.2, rainfall: 105 }
        },
        {
          name: 'Arid Pulse Farm (Moth Bean)',
          region: 'Semi-Arid Drylands',
          season: 'Kharif',
          state: 'Rajasthan',
          district: 'Bikaner',
          farm_size: '8',
          farm_size_unit: 'Acres',
          data: { N: 20, P: 38, K: 22, temperature: 29, humidity: 48, ph: 6.6, rainfall: 48 }
        }
      ]
    };
  }
}

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) return false;
    const json = await res.json();
    return json.status === 'healthy';
  } catch {
    return false;
  }
}
