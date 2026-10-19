import React from 'react';
import { useTranslation } from '../i18n';
import { Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function SuitabilityIndicator({ score = 90, level = "High Suitability", label }) {
  const { t } = useTranslation();

  // Color scheme based on score
  const getColor = (s) => {
    if (s >= 85) {
      return {
        bg: 'bg-emerald-500',
        text: 'text-emerald-800',
        border: 'border-emerald-200',
        lightBg: 'bg-emerald-50',
        badge: 'Optimal Condition Match'
      };
    } else if (s >= 70) {
      return {
        bg: 'bg-amber-500',
        text: 'text-amber-800',
        border: 'border-amber-200',
        lightBg: 'bg-amber-50',
        badge: 'Favorable Agronomic Match'
      };
    } else {
      return {
        bg: 'bg-orange-500',
        text: 'text-orange-800',
        border: 'border-orange-200',
        lightBg: 'bg-orange-50',
        badge: 'Moderate Match (Field Management Needed)'
      };
    }
  };

  const scheme = getColor(score);

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border ${scheme.border} ${scheme.lightBg} flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs`}>
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-stone-200/80 flex items-center justify-center text-emerald-700 shrink-0">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {t('result.suitability')}
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white border border-stone-200 text-stone-700">
              {scheme.badge}
            </span>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-stone-900 mt-0.5">
            {level}
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            {label || t('result.subheading')}
          </p>
        </div>
      </div>

      {/* Progress Bar & Meter */}
      <div className="w-full sm:w-44 text-right">
        <div className="flex items-baseline justify-end gap-1 mb-1.5">
          <span className="text-2xl font-black text-stone-900 font-mono">{score}%</span>
          <span className="text-xs text-stone-500">Agronomic Index</span>
        </div>
        <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-stone-200 shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-700 ${scheme.bg}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
}
