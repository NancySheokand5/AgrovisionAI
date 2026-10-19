import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';
import type { SpraySuitabilityResult } from '../../data/weatherRules';

interface SpraySuitabilityCardProps {
  spray: SpraySuitabilityResult;
}

export const SpraySuitabilityCard: React.FC<SpraySuitabilityCardProps> = ({ spray }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Suitable':
        return CheckCircle2;
      case 'Caution':
        return AlertTriangle;
      default:
        return XCircle;
    }
  };

  const Icon = getStatusIcon(spray.status);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Spray Suitability Window
            </h2>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${spray.badgeClass}`}
            >
              {spray.status === 'Suitable' ? '🟢 Suitable' : spray.status === 'Caution' ? '🟡 Caution' : '🔴 Not Suitable'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Pesticide, fungicide & foliar spray application weather check
          </p>
        </div>
      </div>

      {/* Primary recommendation headline */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${
          spray.status === 'Suitable' ? 'text-emerald-600' : spray.status === 'Caution' ? 'text-amber-600' : 'text-rose-600'
        }`} />
        <div>
          <div className="text-sm font-bold text-slate-900">
            {spray.headline}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluates wind drift hazards, atmospheric drying, and wash-off risks.
          </p>
        </div>
      </div>

      {/* Detailed factor breakdown */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Field Factors Considered:
        </span>
        <div className="space-y-1.5">
          {spray.details.map((detail, idx) => (
            <div
              key={idx}
              className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span>{detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Time Window */}
      <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-2.5 text-xs">
        <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
        <div>
          <span className="font-bold text-emerald-900">Suggested Spray Window: </span>
          <span className="text-emerald-800">{spray.recommendedWindow}</span>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 italic">
        * Advisory Note: Check specific chemical label directions and required rainfast interval prior to spraying.
      </div>
    </div>
  );
};
