import React from 'react';
import { Droplets, FlaskConical, ChevronRight, Thermometer } from 'lucide-react';
import type { SoilConditionData, NutrientLevel } from '../../types/dashboard';

interface SoilConditionCardProps {
  soil: SoilConditionData;
  onViewDetails?: () => void;
}

function getNutrientColor(level: NutrientLevel): string {
  switch (level) {
    case 'Low': return 'bg-red-100 text-red-700';
    case 'Adequate': return 'bg-amber-100 text-amber-700';
    case 'Good': return 'bg-emerald-100 text-emerald-700';
    case 'High': return 'bg-blue-100 text-blue-700';
  }
}

function getNutrientDotColor(level: NutrientLevel): string {
  switch (level) {
    case 'Low': return 'bg-red-500';
    case 'Adequate': return 'bg-amber-500';
    case 'Good': return 'bg-emerald-500';
    case 'High': return 'bg-blue-500';
  }
}

function getMoistureColor(pct: number): string {
  if (pct < 30) return 'bg-red-500';
  if (pct < 55) return 'bg-amber-400';
  if (pct <= 80) return 'bg-emerald-500';
  return 'bg-blue-500';
}

function getPhLabel(ph: number): string {
  if (ph < 6) return 'Acidic';
  if (ph > 7.5) return 'Alkaline';
  return 'Neutral';
}

function getPhColor(ph: number): string {
  if (ph < 5.5) return 'text-red-600 bg-red-50 border-red-200';
  if (ph < 6) return 'text-amber-600 bg-amber-50 border-amber-200';
  if (ph <= 7.5) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  return 'text-blue-600 bg-blue-50 border-blue-200';
}

interface NutrientRowProps {
  symbol: string;
  label: string;
  level: NutrientLevel;
}

const NutrientRow: React.FC<NutrientRowProps> = ({ symbol, label, level }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${getNutrientColor(level)}`}>
        {symbol}
      </div>
      <span className="text-xs text-slate-600">{label}</span>
    </div>
    <div className="flex items-center gap-1.5">
      <div className={`w-1.5 h-1.5 rounded-full ${getNutrientDotColor(level)}`} />
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getNutrientColor(level)}`}>
        {level}
      </span>
    </div>
  </div>
);

export const SoilConditionCard: React.FC<SoilConditionCardProps> = ({ soil, onViewDetails }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <FlaskConical className="w-4.5 h-4.5 text-amber-600" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Soil Condition</h2>
        </div>
        <button
          onClick={onViewDetails}
          className="flex items-center gap-1 text-xs text-amber-600 font-semibold hover:text-amber-700 transition-colors"
        >
          Details <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Moisture */}
      <div className="bg-slate-50 rounded-xl p-3.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-sky-500" />
            <span className="text-sm font-medium text-slate-700">Soil Moisture</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-slate-800">{soil.moisture}%</span>
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-medium ${
              soil.moistureStatus === 'Optimal'
                ? 'bg-emerald-100 text-emerald-700'
                : soil.moistureStatus === 'Dry'
                ? 'bg-red-100 text-red-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {soil.moistureStatus}
            </span>
          </div>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${getMoistureColor(soil.moisture)}`}
            style={{ width: `${soil.moisture}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>0%</span>
          <span className="text-emerald-600 font-medium">Optimal: 55–80%</span>
          <span>100%</span>
        </div>
      </div>

      {/* pH */}
      <div className="flex items-center justify-between px-1">
        <div>
          <div className="text-xs text-slate-500 mb-0.5">pH Level</div>
          <div className="text-2xl font-bold text-slate-800">{soil.ph}</div>
        </div>
        <div className={`px-3 py-1.5 rounded-xl border text-sm font-semibold ${getPhColor(soil.ph)}`}>
          {getPhLabel(soil.ph)}
        </div>
      </div>

      {/* NPK */}
      <div className="space-y-2.5">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Nutrients (NPK)</div>
        <NutrientRow symbol="N" label="Nitrogen" level={soil.nitrogen} />
        <NutrientRow symbol="P" label="Phosphorus" level={soil.phosphorus} />
        <NutrientRow symbol="K" label="Potassium" level={soil.potassium} />
      </div>

      {/* Soil temp */}
      <div className="flex items-center gap-2 bg-orange-50 rounded-xl px-3 py-2.5 border border-orange-100">
        <Thermometer className="w-4 h-4 text-orange-500 flex-shrink-0" />
        <div>
          <span className="text-xs text-orange-700 font-medium">Soil Temperature</span>
          <span className="ml-2 text-sm font-bold text-orange-800">{soil.temperature}°C</span>
        </div>
      </div>

      {/* View details button */}
      <button
        onClick={onViewDetails}
        className="w-full py-2.5 rounded-xl border-2 border-amber-200 text-amber-700 text-sm font-semibold hover:bg-amber-50 transition-colors active:scale-[0.98]"
      >
        View Soil Details
      </button>
    </div>
  );
};
