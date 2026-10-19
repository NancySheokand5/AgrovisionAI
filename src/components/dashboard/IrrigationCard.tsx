import React from 'react';
import { Droplets, CalendarClock, ChevronRight, Waves } from 'lucide-react';
import type { IrrigationData } from '../../types/dashboard';

interface IrrigationCardProps {
  irrigation: IrrigationData;
  onViewDetails?: () => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / (24 * 3600 * 1000));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

export const IrrigationCard: React.FC<IrrigationCardProps> = ({ irrigation, onViewDetails }) => {
  const moisturePct = irrigation.currentMoisture;
  const optimalPct = irrigation.optimalMoisture;
  const waterUsedPct = Math.round((irrigation.waterUsedToday / irrigation.dailyWaterTarget) * 100);

  const moistureColor =
    moisturePct < 40 ? 'bg-red-500' :
    moisturePct < 60 ? 'bg-amber-400' :
    'bg-sky-500';

  const needsIrrigation = moisturePct < optimalPct - 10;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
            <Waves className="w-4.5 h-4.5 text-sky-600" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Water & Irrigation</h2>
        </div>
        <button
          onClick={onViewDetails}
          className="flex items-center gap-1 text-xs text-sky-600 font-semibold hover:text-sky-700 transition-colors"
        >
          Details <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Current moisture with visual */}
      <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs text-sky-600 font-medium mb-0.5">Soil Moisture</div>
            <div className="text-3xl font-bold text-sky-700">{moisturePct}%</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 mb-0.5">Target</div>
            <div className="text-lg font-bold text-slate-600">{optimalPct}%</div>
          </div>
        </div>

        {/* Progress */}
        <div className="relative h-3 bg-sky-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${moistureColor}`}
            style={{ width: `${moisturePct}%` }}
          />
          {/* Target indicator */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-sky-400/70"
            style={{ left: `${optimalPct}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-sky-500 mt-1">
          <span>Dry</span>
          <span className="font-medium">Optimal: {optimalPct}%</span>
          <span>Saturated</span>
        </div>
      </div>

      {/* Status indicators */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <div className="flex items-center gap-1.5 mb-1">
            <CalendarClock className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[10px] text-slate-500 font-medium">Last Irrigation</span>
          </div>
          <div className="text-sm font-bold text-slate-700">{formatDate(irrigation.lastIrrigation)}</div>
          <div className="text-[10px] text-slate-400">{irrigation.irrigationMethod}</div>
        </div>
        <div className={`rounded-xl p-3 border ${needsIrrigation ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
          <div className="flex items-center gap-1.5 mb-1">
            <Droplets className={`w-3.5 h-3.5 ${needsIrrigation ? 'text-amber-500' : 'text-emerald-500'}`} />
            <span className={`text-[10px] font-medium ${needsIrrigation ? 'text-amber-600' : 'text-emerald-600'}`}>
              Next Irrigation
            </span>
          </div>
          <div className={`text-xs font-bold ${needsIrrigation ? 'text-amber-700' : 'text-emerald-700'}`}>
            {irrigation.nextIrrigationRecommended}
          </div>
        </div>
      </div>

      {/* Water used today */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-600 font-medium">Water Used Today</span>
          <span className="text-xs font-bold text-slate-700">
            {irrigation.waterUsedToday.toLocaleString()} / {irrigation.dailyWaterTarget.toLocaleString()} L
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-700"
            style={{ width: `${Math.min(waterUsedPct, 100)}%` }}
          />
        </div>
        <div className="text-[10px] text-slate-400 mt-1 text-right">{waterUsedPct}% of daily target</div>
      </div>

      {/* Schedule note */}
      {irrigation.scheduleNote && (
        <div className="flex items-start gap-2 px-3 py-2 bg-blue-50 rounded-xl border border-blue-100">
          <Droplets className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-700">{irrigation.scheduleNote}</p>
        </div>
      )}
    </div>
  );
};
