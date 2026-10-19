/**
 * Local storage manager for AgroVision AI Recommendation History.
 * Designed with a clean structure ready for future MongoDB / REST sync.
 */

const STORAGE_KEY = 'agrovision_recommendation_history';

export function getSavedRecommendations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to parse history from storage:', err);
    return [];
  }
}

export function saveRecommendationRecord(recommendationResult, rawInputs) {
  try {
    const history = getSavedRecommendations();
    
    const record = {
      id: 'AGV-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      dateFormatted: new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date()),
      cropId: recommendationResult.recommended_crop,
      cropName: recommendationResult.display_name,
      hindiName: recommendationResult.hindi_name,
      icon: recommendationResult.icon || '🌾',
      suitabilityLevel: recommendationResult.suitability_level,
      suitabilityScore: recommendationResult.suitability_score,
      keyConditions: `pH ${rawInputs.ph} | Rain ${rawInputs.rainfall} mm | Temp ${rawInputs.temperature}°C`,
      location: rawInputs.farm_meta?.state 
        ? `${rawInputs.farm_meta.district ? rawInputs.farm_meta.district + ', ' : ''}${rawInputs.farm_meta.state}`
        : 'Farm Site',
      inputs: rawInputs,
      result: recommendationResult
    };

    // Keep newest first, up to 20 records
    const updated = [record, ...history.filter(item => item.id !== record.id)].slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return record;
  } catch (err) {
    console.error('Failed to save recommendation to storage:', err);
    return null;
  }
}

export function deleteRecommendationRecord(id) {
  try {
    const history = getSavedRecommendations();
    const updated = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete history record:', err);
    return [];
  }
}

export function clearAllHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (err) {
    console.error('Failed to clear history:', err);
    return [];
  }
}
