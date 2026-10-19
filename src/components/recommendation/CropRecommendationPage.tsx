import React, { useState } from 'react';
import {
  Sprout,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Droplets,
  Thermometer,
  CloudRain,
  Layers,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Clock,
  Info,
  ChevronRight
} from 'lucide-react';
import type {
  CropRecommendationInput,
  CropRecommendationResult,
  SampleConditionPreset
} from '../../types/cropRecommendation';
import {
  SAMPLE_PRESETS,
  getCropRecommendation,
  validateCropInputs
} from '../../services/cropRecommendationService';

interface CropRecommendationPageProps {
  onBackToDashboard: () => void;
  onNavigateToDisease?: () => void;
  onNavigateToMandi?: () => void;
}

export const CropRecommendationPage: React.FC<CropRecommendationPageProps> = ({
  onBackToDashboard,
  onNavigateToDisease,
  onNavigateToMandi
}) => {
  const [formData, setFormData] = useState<CropRecommendationInput>({
    N: 90,
    P: 42,
    K: 43,
    temperature: 24,
    humidity: 82,
    ph: 6.8,
    rainfall: 210,
    soil_type: 'Clayey Loam',
    state: 'Haryana',
    district: 'Karnal',
    farm_size: '4',
    season: 'Kharif'
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [result, setResult] = useState<CropRecommendationResult | null>(null);

  const handleInputChange = (field: keyof CropRecommendationInput, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === 'number' ? value : value
    }));
    setValidationError(null);
  };

  const handlePresetSelect = (preset: SampleConditionPreset) => {
    setFormData({
      ...preset.data,
      soil_type: preset.soil_type,
      state: preset.state,
      district: preset.district,
      farm_size: preset.farm_size,
      season: preset.season
    });
    setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateCropInputs(formData);
    if (error) {
      setValidationError(error);
      return;
    }

    setIsLoading(true);
    setValidationError(null);

    try {
      const rec = await getCropRecommendation(formData);
      setResult(rec);
      window.scrollTo({ top: 380, behavior: 'smooth' });
    } catch (err) {
      setValidationError(err instanceof Error ? err.message : 'Failed to generate recommendation. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setValidationError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPhColor = (ph: number) => {
    if (ph < 6.0) return 'text-amber-700 bg-amber-50 border-amber-200';
    if (ph <= 7.5) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    return 'text-blue-700 bg-blue-50 border-blue-200';
  };

  const getPhDescription = (ph: number) => {
    if (ph < 5.5) return 'Strongly Acidic';
    if (ph < 6.5) return 'Moderately Acidic';
    if (ph <= 7.3) return 'Neutral & Optimal';
    if (ph <= 8.2) return 'Slightly Alkaline';
    return 'Strongly Alkaline';
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* ── Top Header Bar ── */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold backdrop-blur-xs border border-emerald-400/30">
              <Sprout className="w-3.5 h-3.5" />
              <span>Feature 3 · AI Precision Agronomy</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI Crop Recommendation
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              Identify the most profitable, climate-resilient crop for your field based on primary soil nutrients (N-P-K), soil pH, and seasonal weather patterns.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onBackToDashboard}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-xs border border-white/20"
            >
              ← Back to Dashboard
            </button>
            {onNavigateToDisease && (
              <button
                onClick={onNavigateToDisease}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md flex items-center gap-1.5"
              >
                <span>Crop Disease Detection</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── 1-Click Realistic Farm Presets ── */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>1-Click Test Presets (Realistic Indian Farm Conditions)</span>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">Tap to fill inputs instantly</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {SAMPLE_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetSelect(p)}
              className="text-left p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/60 transition-all group bg-slate-50/60"
            >
              <div className="font-semibold text-xs text-slate-900 group-hover:text-emerald-800 truncate">
                {p.name}
              </div>
              <div className="text-[11px] text-slate-600 truncate mt-0.5">
                {p.region}
              </div>
              <div className="text-[10px] text-emerald-600 font-medium mt-1">
                N:{p.data.N} P:{p.data.P} K:{p.data.K} pH:{p.data.ph}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Input Form ── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Soil Nutrients (NPK) Card */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                NPK
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Primary Soil Nutrients (kg/ha)</h2>
                <p className="text-xs text-slate-600">Available nitrogen, phosphorus, and potassium from soil test</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Nitrogen */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="input-nitrogen" className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    Nitrogen (N)
                  </label>
                  <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md text-xs">
                    {formData.N} kg/ha
                  </span>
                </div>
                <input
                  id="input-nitrogen"
                  type="range"
                  min="0"
                  max="200"
                  step="1"
                  value={formData.N}
                  onChange={(e) => handleInputChange('N', Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>0 (Very Low)</span>
                  <span>100 (Optimal Cereal)</span>
                  <span>200 (High)</span>
                </div>
              </div>

              {/* Phosphorus */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="input-phosphorus" className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                    Phosphorus (P)
                  </label>
                  <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md text-xs">
                    {formData.P} kg/ha
                  </span>
                </div>
                <input
                  id="input-phosphorus"
                  type="range"
                  min="0"
                  max="150"
                  step="1"
                  value={formData.P}
                  onChange={(e) => handleInputChange('P', Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>0 (Deficient)</span>
                  <span>50 (Moderate)</span>
                  <span>150 (Rich)</span>
                </div>
              </div>

              {/* Potassium */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="input-potassium" className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-600"></span>
                    Potassium (K)
                  </label>
                  <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md text-xs">
                    {formData.K} kg/ha
                  </span>
                </div>
                <input
                  id="input-potassium"
                  type="range"
                  min="0"
                  max="200"
                  step="1"
                  value={formData.K}
                  onChange={(e) => handleInputChange('K', Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>0 (Low)</span>
                  <span>80 (Adequate)</span>
                  <span>200 (Excess)</span>
                </div>
              </div>

              {/* Soil pH Slider with reaction badge */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="input-ph" className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    Soil pH Level
                  </label>
                  <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getPhColor(formData.ph)}`}>
                    {formData.ph.toFixed(1)} · {getPhDescription(formData.ph)}
                  </div>
                </div>
                <input
                  id="input-ph"
                  type="range"
                  min="3.5"
                  max="9.5"
                  step="0.1"
                  value={formData.ph}
                  onChange={(e) => handleInputChange('ph', Number(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>3.5 (Acidic)</span>
                  <span>6.5 - 7.5 (Neutral)</span>
                  <span>9.5 (Alkaline)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Environmental Climate Card */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                <Thermometer className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Climate & Environmental Factors</h2>
                <p className="text-xs text-slate-600">Seasonal temperature, air humidity, and rainfall</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Temperature */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="input-temperature" className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-amber-500" />
                    Temperature (°C)
                  </label>
                  <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md text-xs">
                    {formData.temperature}°C
                  </span>
                </div>
                <input
                  id="input-temperature"
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={formData.temperature}
                  onChange={(e) => handleInputChange('temperature', Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>5°C (Cool)</span>
                  <span>25°C (Mild)</span>
                  <span>50°C (Hot)</span>
                </div>
              </div>

              {/* Humidity */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="input-humidity" className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    Relative Humidity (%)
                  </label>
                  <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md text-xs">
                    {formData.humidity}%
                  </span>
                </div>
                <input
                  id="input-humidity"
                  type="range"
                  min="10"
                  max="100"
                  step="1"
                  value={formData.humidity}
                  onChange={(e) => handleInputChange('humidity', Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>10% (Arid/Dry)</span>
                  <span>60% (Moderate)</span>
                  <span>100% (Saturated)</span>
                </div>
              </div>

              {/* Rainfall */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="input-rainfall" className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <CloudRain className="w-4 h-4 text-indigo-500" />
                    Rainfall (mm)
                  </label>
                  <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md text-xs">
                    {formData.rainfall} mm
                  </span>
                </div>
                <input
                  id="input-rainfall"
                  type="range"
                  min="10"
                  max="400"
                  step="5"
                  value={formData.rainfall}
                  onChange={(e) => handleInputChange('rainfall', Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>10 mm (Drought)</span>
                  <span>150 mm (Average Monsoon)</span>
                  <span>400 mm (High Rain)</span>
                </div>
              </div>

              {/* Soil Type & Context */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="select-soil-type" className="text-xs font-semibold text-slate-700 block mb-1">Soil Texture</label>
                  <select
                    id="select-soil-type"
                    value={formData.soil_type || ''}
                    onChange={(e) => handleInputChange('soil_type', e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white text-slate-800"
                  >
                    <option value="Clayey Loam">Clayey Loam</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                    <option value="Black Cotton Soil">Black Cotton Soil</option>
                    <option value="Red Laterite Soil">Red Laterite Soil</option>
                    <option value="Alluvial Silt">Alluvial Silt</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="select-season" className="text-xs font-semibold text-slate-700 block mb-1">Cropping Season</label>
                  <select
                    id="select-season"
                    value={formData.season || ''}
                    onChange={(e) => handleInputChange('season', e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white text-slate-800"
                  >
                    <option value="Kharif">Kharif (Monsoon)</option>
                    <option value="Rabi">Rabi (Winter)</option>
                    <option value="Zaid">Zaid (Summer)</option>
                    <option value="Annual">Annual / Perennial</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Input Error:</strong> {validationError}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {result && (
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all flex items-center gap-2.5 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Running Agronomic ML Model...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Recommend Best Crop</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* ── Recommendation Result Presentation ── */}
      {result && (
        <section className="space-y-6 pt-4 animate-fadeIn" id="recommendation-result">
          {/* Main Crop Hero Card */}
          <div className="bg-gradient-to-br from-white to-emerald-50/50 rounded-3xl border-2 border-emerald-500/30 p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-emerald-100">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-4xl shadow-lg shadow-emerald-600/30 flex-shrink-0">
                  {result.icon}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{result.suitability_badge} · {result.suitability_score}% Match</span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {result.display_name} <span className="text-slate-500 text-xl font-normal">({result.hindi_name})</span>
                  </h2>
                  <p className="text-xs text-slate-500 italic mt-0.5">
                    {result.crop_info.botanical_name} · {result.category}
                  </p>
                </div>
              </div>

              <div className="bg-white px-5 py-3.5 rounded-2xl border border-emerald-200/80 shadow-xs text-right w-full md:w-auto">
                <div className="text-xs text-slate-500 font-medium">Agronomic Suitability</div>
                <div className="text-2xl font-black text-emerald-700">{result.suitability_score}%</div>
                <div className="text-[11px] text-emerald-600 font-semibold">{result.suitability_level}</div>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-emerald-100">
              <div className="space-y-0.5">
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  Growing Season
                </div>
                <div className="text-sm font-bold text-slate-800">{result.crop_info.growing_season}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  Crop Duration
                </div>
                <div className="text-sm font-bold text-slate-800">{result.crop_info.duration}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-600" />
                  Water Requirement
                </div>
                <div className="text-sm font-bold text-slate-800 truncate" title={result.crop_info.water_requirement}>
                  {result.crop_info.water_requirement}
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  Major Production States
                </div>
                <div className="text-sm font-bold text-slate-800 truncate" title={result.crop_info.major_states}>
                  {result.crop_info.major_states}
                </div>
              </div>
            </div>

            {/* Crop Description & Care Tips */}
            <div className="pt-5 space-y-4">
              <p className="text-sm text-slate-700 leading-relaxed">
                {result.crop_info.description}
              </p>

              <div className="bg-emerald-50/80 rounded-xl p-4 border border-emerald-200/70">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-700" />
                  Recommended Agronomic Field Practices
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-emerald-950">
                  {result.crop_info.care_tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── "Why This Crop?" Factor Comparison ── */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Why This Crop? Condition Alignment Analysis</h3>
                <p className="text-xs text-slate-600">Comparison of your entered field conditions against optimal crop thresholds</p>
              </div>
              <div className="text-xs text-slate-600 font-medium hidden sm:block">
                Model: Support Vector Classifier (SVC)
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600">
                    <th className="pb-2.5 font-semibold">Parameter</th>
                    <th className="pb-2.5 font-semibold">Your Field Value</th>
                    <th className="pb-2.5 font-semibold">Optimal Range</th>
                    <th className="pb-2.5 font-semibold">Status</th>
                    <th className="pb-2.5 font-semibold">Agronomic Assessment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.why_this_crop.map((factor, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="py-2.5 font-bold text-slate-800">{factor.label}</td>
                      <td className="py-2.5 font-semibold text-slate-900">
                        {factor.entered_value} {factor.unit}
                      </td>
                      <td className="py-2.5 text-slate-600">{factor.ideal_range}</td>
                      <td className="py-2.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            factor.status === 'optimal'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              factor.status === 'optimal' ? 'bg-emerald-600' : 'bg-amber-600'
                            }`}
                          />
                          {factor.status === 'optimal' ? 'Optimal' : 'Moderate'}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-600">{factor.explanation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Alternative Crop Choices ── */}
          {result.alternative_crops && result.alternative_crops.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Alternative Viable Crops</h3>
              <p className="text-xs text-slate-600">If market demand or rotation requires, these crops also align with your field parameters</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.alternative_crops.map((alt, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{alt.icon}</span>
                        <div>
                          <div className="font-bold text-sm text-slate-900">{alt.name}</div>
                          <div className="text-[11px] text-slate-600">{alt.hindi_name}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        Rank #{alt.rank}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 pt-1 border-t border-slate-200/60 flex flex-col gap-1">
                      <span><strong>Duration:</strong> {alt.duration}</span>
                      <span><strong>Water:</strong> {alt.water_requirement}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Action Buttons Footer ── */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
            {onNavigateToMandi && (
              <button
                onClick={onNavigateToMandi}
                className="px-5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200 transition-colors flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <span>Check Mandi Market Prices for {result.display_name}</span>
              </button>
            )}

            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors ml-auto"
            >
              Test Another Field Condition
            </button>
          </div>

          {/* Legal Notice */}
          <p className="text-[11px] text-slate-600 text-center leading-relaxed max-w-3xl mx-auto">
            {result.model_info.disclaimer}
          </p>
        </section>
      )}
    </div>
  );
};
