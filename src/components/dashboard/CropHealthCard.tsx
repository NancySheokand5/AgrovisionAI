import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, ChevronRight } from 'lucide-react';
import type { CropHealthItem, CropHealthStatus } from '../../types/dashboard';

interface CropHealthCardProps {
  crops: CropHealthItem[];
  onViewAll?: () => void;
}

function getStatusConfig(status: CropHealthStatus) {
  switch (status) {
    case 'Excellent':
      return {
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
        badge: 'bg-emerald-100 text-emerald-700',
        bar: 'bg-emerald-500',
        pill: 'bg-emerald-50 border-emerald-200',
      };
    case 'Healthy':
      return {
        icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
        badge: 'bg-green-100 text-green-700',
        bar: 'bg-green-500',
        pill: 'bg-green-50 border-green-200',
      };
    case 'Needs Attention':
      return {
        icon: <AlertCircle className="w-4 h-4 text-amber-500" />,
        badge: 'bg-amber-100 text-amber-700',
        bar: 'bg-amber-400',
        pill: 'bg-amber-50 border-amber-200',
      };
    case 'Critical':
      return {
        icon: <XCircle className="w-4 h-4 text-red-500" />,
        badge: 'bg-red-100 text-red-700',
        bar: 'bg-red-500',
        pill: 'bg-red-50 border-red-200',
      };
  }
}

export const CropHealthCard: React.FC<CropHealthCardProps> = ({ crops, onViewAll }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">Crop Health</h2>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
        >
          View All <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Crop List */}
      <div className="space-y-3">
        {crops.map((crop) => {
          const cfg = getStatusConfig(crop.status);
          return (
            <div
              key={crop.id}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:scale-[1.01] cursor-pointer ${cfg.pill}`}
            >
              {/* Emoji */}
              <div className="text-2xl flex-shrink-0 w-9 h-9 flex items-center justify-center bg-white rounded-xl shadow-sm">
                {crop.cropEmoji}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-sm font-semibold text-slate-800">{crop.cropName}</span>
                    <span className="ml-1.5 text-[10px] text-slate-400">{crop.variety}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {cfg.icon}
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${cfg.badge}`}>
                      {crop.healthScore}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-white/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${cfg.bar}`}
                    style={{ width: `${crop.healthScore}%` }}
                  />
                </div>

                {/* Status + area */}
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[11px] text-slate-500">{crop.status} · {crop.area} acres</span>
                  {crop.daysToHarvest !== undefined && (
                    <span className="text-[11px] text-slate-400">
                      🌾 {crop.daysToHarvest}d to harvest
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View Crop Health button */}
      <button
        onClick={onViewAll}
        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors active:scale-[0.98] shadow-sm shadow-emerald-600/20"
      >
        View Crop Health
      </button>
    </div>
  );
};
