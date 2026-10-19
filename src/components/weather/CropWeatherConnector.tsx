import React, { useState } from 'react';
import { Sprout, Sparkles, Droplets, Thermometer, Wind, CheckCircle2 } from 'lucide-react';
import { CROP_THERMAL_CONFIGS, calculateDailyGDD } from '../../data/cropRules';
import cropCoefficientsData from '../../data/cropCoefficients.json';
import type { NormalizedAgroVisionWeather } from '../../services/weatherService';

interface CropWeatherConnectorProps {
  weather: NormalizedAgroVisionWeather;
}

export const CropWeatherConnector: React.FC<CropWeatherConnectorProps> = ({ weather }) => {
  const [selectedCrop, setSelectedCrop] = useState<string>('wheat');
  const [selectedStage, setSelectedStage] = useState<string>('vegetative');

  const crops = Object.values((cropCoefficientsData as any).crops || {});
  const currentCrop = (cropCoefficientsData as any).crops[selectedCrop] || crops[0];
  const stages = Object.keys(currentCrop.stages || {});
  const currentStageInfo = currentCrop.stages[selectedStage] || Object.values(currentCrop.stages)[0];

  const thermal = CROP_THERMAL_CONFIGS[selectedCrop] || {
    baseTemp: 10,
    upperTemp: 32,
    optimalMin: 18,
    optimalMax: 28,
    waterSensitivity: 'Moderate'
  };

  const todayMax = weather.daily[0]?.maxTemp || 30;
  const todayMin = weather.daily[0]?.minTemp || 20;
  const gddResult = calculateDailyGDD(todayMax, todayMin, selectedCrop);

  // Crop water demand estimation
  const kc = Number(currentStageInfo.kc) || 1.0;
  const estimatedETc = Math.round(weather.agriculture.todayET0 * kc * 10) / 10;

  // Temperature compatibility check
  const isTempComfortable =
    todayMax <= thermal.optimalMax + 3 && todayMin >= thermal.optimalMin - 3;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-600" />
            <span>Crop Weather Connection</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate how current microclimate and forecast impact your specific crop
          </p>
        </div>

        {/* Crop and Stage Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Crop Selector */}
          <select
            value={selectedCrop}
            onChange={(e) => {
              setSelectedCrop(e.target.value);
              const newCrop = (cropCoefficientsData as any).crops[e.target.value];
              if (newCrop?.stages) {
                setSelectedStage(Object.keys(newCrop.stages)[0]);
              }
            }}
            className="px-3 py-1.5 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            {crops.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.name} ({c.hindi_name})
              </option>
            ))}
          </select>

          {/* Growth Stage Selector */}
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            {stages.map((st) => (
              <option key={st} value={st}>
                Stage: {currentCrop.stages[st].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Crop Insight Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
        
        {/* Thermal & GDD card */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
          <div className="flex items-center justify-between text-xs text-amber-900 font-bold mb-1">
            <span>Thermal Accumulation</span>
            <Thermometer className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-950 font-mono mt-1">
            {gddResult.gdd} <span className="text-xs font-semibold">GDD/day</span>
          </div>
          <div className="text-[11px] text-amber-800 mt-1">
            Base temp T<sub>base</sub> = {thermal.baseTemp}°C • Opt: {thermal.optimalMin}-{thermal.optimalMax}°C
          </div>
        </div>

        {/* Daily Crop Water Demand (ETc) */}
        <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
          <div className="flex items-center justify-between text-xs text-sky-900 font-bold mb-1">
            <span>Stage Water Demand</span>
            <Droplets className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-sky-950 font-mono mt-1">
            {estimatedETc} <span className="text-xs font-semibold">mm/day</span>
          </div>
          <div className="text-[11px] text-sky-800 mt-1">
            Kc = {kc} • Sensitivity: {thermal.waterSensitivity}
          </div>
        </div>

        {/* Temperature compatibility */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
          <div className="flex items-center justify-between text-xs text-emerald-900 font-bold mb-1">
            <span>Thermal Comfort</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-base font-bold text-emerald-950 mt-1">
            {isTempComfortable ? '🟢 Favorable' : '🟡 Moderate Stress'}
          </div>
          <div className="text-[11px] text-emerald-800 mt-1">
            High {todayMax}°C / Low {todayMin}°C
          </div>
        </div>

        {/* Spray Window for Selected Crop */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-800 font-bold mb-1">
            <span>Foliar Application</span>
            <Wind className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-sm font-bold text-slate-900 mt-1">
            {weather.agriculture.spraySuitability.status}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Wind {weather.current.windSpeed} km/h • Rain {weather.daily[0]?.rainChance}%
          </div>
        </div>

      </div>

      {/* Stage-specific agronomic advice note */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900">{currentCrop.name} ({currentStageInfo.label}): </strong>
          <span>{currentStageInfo.description}</span>
        </div>
      </div>

    </div>
  );
};
