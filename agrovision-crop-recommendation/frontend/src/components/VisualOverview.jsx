import React from 'react';
import { useTranslation } from '../i18n';
import { BarChart3 } from 'lucide-react';

export default function VisualOverview({ factors = [] }) {
  const { t } = useTranslation();

  // Calculate percentage within standard display range for visual bar
  const getParamBar = (param, val) => {
    const limits = {
      N: { max: 150, unit: 'kg/ha' },
      P: { max: 100, unit: 'kg/ha' },
      K: { max: 120, unit: 'kg/ha' },
      temperature: { max: 45, unit: '°C' },
      humidity: { max: 100, unit: '%' },
      ph: { max: 10, unit: 'pH' },
      rainfall: { max: 300, unit: 'mm' }
    };

    const config = limits[param] || { max: 100, unit: '' };
    const pct = Math.min(Math.max((val / config.max) * 100, 5), 100);
    return { pct, maxLabel: `${config.max} ${config.unit}` };
  };

  const getBarColor = (status) => {
    switch (status) {
      case 'optimal':
        return 'bg-emerald-600';
      case 'good':
        return 'bg-blue-600';
      case 'moderate':
      default:
        return 'bg-amber-500';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
        <div>
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <span>{t('result.overview_title')}</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {t('result.overview_subtitle')}
          </p>
        </div>
      </div>

      <div className="space-y-3.5">
        {factors.map((item) => {
          const { pct, maxLabel } = getParamBar(item.parameter, item.entered_value);
          const barColor = getBarColor(item.status);

          return (
            <div key={item.parameter} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-stone-800">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-stone-900">
                    {item.entered_value} {item.unit}
                  </span>
                  <span className="text-[11px] text-stone-400">
                    (Target: {item.optimal_value})
                  </span>
                </div>
              </div>

              {/* Range bar */}
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden relative shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
