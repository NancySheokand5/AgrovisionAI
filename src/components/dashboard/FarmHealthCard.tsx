import React from 'react';
import { Leaf, Droplets, Waves, Cloud, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import type { FarmHealthSummary } from '../../types/dashboard';

interface FarmHealthCardProps {
  farmHealth: FarmHealthSummary;
  totalAcres: number;
}

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

const ScoreRing: React.FC<ScoreRingProps> = ({ score, size = 100, strokeWidth = 8 }) => {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color =
    score >= 80 ? '#059669' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  );
};

interface MetricBarProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  color: string;
  bg: string;
}

const MetricBar: React.FC<MetricBarProps> = ({ label, icon, value, suffix = '%', color, bg }) => (
  <div className="flex items-center gap-3">
    <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-slate-600">{label}</span>
        <span className="text-xs font-bold text-slate-800">{value}{suffix}</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  </div>
);

export const FarmHealthCard: React.FC<FarmHealthCardProps> = ({ farmHealth, totalAcres }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6 flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Farm Health</h2>
          <p className="text-xs text-slate-500 mt-0.5">{totalAcres} acres monitored</p>
        </div>
        <Clock className="w-4 h-4 text-slate-300" />
      </div>

      {/* Circular Score + Crop Stats */}
      <div className="flex items-center gap-5">
        {/* Ring */}
        <div className="relative flex-shrink-0">
          <ScoreRing score={farmHealth.overallScore} size={96} strokeWidth={9} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-slate-800 leading-none">
              {farmHealth.overallScore}
            </span>
            <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide">Score</span>
          </div>
        </div>

        {/* Crop summary */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <div>
              <div className="text-lg font-bold text-emerald-700 leading-none">
                {farmHealth.healthyCrops}
              </div>
              <div className="text-[11px] text-emerald-600">Healthy Crops</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-100">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <div>
              <div className="text-lg font-bold text-amber-700 leading-none">
                {farmHealth.cropsNeedingAttention}
              </div>
              <div className="text-[11px] text-amber-600">Need Attention</div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="space-y-3 pt-1">
        <MetricBar
          label="Crop Health"
          icon={<Leaf className="w-4 h-4 text-emerald-600" />}
          value={farmHealth.cropHealthScore}
          color="bg-emerald-500"
          bg="bg-emerald-50"
        />
        <MetricBar
          label="Soil Moisture"
          icon={<Droplets className="w-4 h-4 text-sky-600" />}
          value={farmHealth.soilMoistureScore}
          color="bg-sky-500"
          bg="bg-sky-50"
        />
        <MetricBar
          label="Water Level"
          icon={<Waves className="w-4 h-4 text-blue-600" />}
          value={farmHealth.waterLevelScore}
          color="bg-blue-500"
          bg="bg-blue-50"
        />
        <MetricBar
          label="Weather"
          icon={<Cloud className="w-4 h-4 text-indigo-500" />}
          value={farmHealth.weatherScore}
          color="bg-indigo-500"
          bg="bg-indigo-50"
        />
      </div>
    </div>
  );
};
