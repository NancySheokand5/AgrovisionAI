import React from 'react';
import { useTranslation } from '../i18n';
import { Edit3, CheckCircle, MapPin } from 'lucide-react';

export default function ConditionSummary({ inputs, onEditInputs }) {
  const { t } = useTranslation();

  if (!inputs) return null;

  const summaryItems = [
    { label: 'Nitrogen (N)', value: `${inputs.N} kg/ha` },
    { label: 'Phosphorus (P)', value: `${inputs.P} kg/ha` },
    { label: 'Potassium (K)', value: `${inputs.K} kg/ha` },
    { label: 'Soil pH', value: `${inputs.ph} pH` },
    { label: 'Temperature', value: `${inputs.temperature} °C` },
    { label: 'Humidity', value: `${inputs.humidity} %` },
    { label: 'Rainfall', value: `${inputs.rainfall} mm` },
  ];

  const meta = inputs.farm_meta || {};

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900">
            {t('result.summary_title')}
          </h3>
          {meta.state && (
            <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{meta.district ? `${meta.district}, ` : ''}{meta.state} • {meta.season || 'Current Season'}</span>
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onEditInputs}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{t('result.edit_inputs')}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
        {summaryItems.map((item, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 text-center"
          >
            <div className="text-[10px] text-stone-400 font-medium truncate">
              {item.label}
            </div>
            <div className="text-xs sm:text-sm font-bold text-stone-900 font-mono mt-0.5">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
