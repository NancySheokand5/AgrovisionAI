import React from 'react';
import { useTranslation } from '../i18n';
import { Activity, Info } from 'lucide-react';

export default function PHSlider({ value, onChange }) {
  const { t } = useTranslation();
  const currentVal = parseFloat(value) || 6.5;

  // Determine pH category and badge
  const getPHCategory = (ph) => {
    if (ph < 5.5) {
      return {
        label: 'Strongly Acidic',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
        advice: 'May limit phosphorus and calcium availability; liming may be recommended for certain crops.'
      };
    } else if (ph < 6.5) {
      return {
        label: 'Slightly Acidic (Good for most crops)',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        advice: 'Optimal for potatoes, tea, and many cereals and pulses.'
      };
    } else if (ph <= 7.5) {
      return {
        label: 'Neutral (Optimal Zone)',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        advice: 'Maximum nutrient availability for nearly all Indian field crops.'
      };
    } else if (ph <= 8.5) {
      return {
        label: 'Moderately Alkaline',
        badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
        advice: 'Common in calcareous soils; ensure adequate zinc and iron micronutrients.'
      };
    } else {
      return {
        label: 'Strongly Alkaline',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        advice: 'High salinity/alkalinity; gypsum application and salt-tolerant varieties may be needed.'
      };
    }
  };

  const status = getPHCategory(currentVal);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900">
              {t('form.section_soil_condition')}
            </h3>
            <p className="text-xs text-stone-500">
              {t('form.ph_hint')}
            </p>
          </div>
        </div>

        {/* Live pH Readout */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 hidden sm:inline">{t('form.ph_current')}</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 text-white font-mono font-bold text-base shadow-xs">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>pH {currentVal.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Interactive Slider & Manual Input */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="md:col-span-3">
            <div className="relative pt-2 pb-1">
              {/* Visual Gradient Track */}
              <div 
                className="h-3 w-full rounded-full shadow-inner relative"
                style={{
                  background: 'linear-gradient(to right, #ef4444 0%, #f97316 20%, #eab308 40%, #10b981 55%, #06b6d4 75%, #6366f1 90%, #a855f7 100%)'
                }}
              />
              <input
                type="range"
                min="3.5"
                max="9.5"
                step="0.1"
                value={currentVal}
                onChange={(e) => onChange('ph', e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Soil pH Slider"
              />
            </div>

            {/* pH Spectrum Labels */}
            <div className="flex justify-between items-center text-xs font-semibold text-stone-500 mt-2">
              <span className="text-rose-600 font-medium">← Acidic (3.5 - 5.5)</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Neutral (6.0 - 7.5)
              </span>
              <span className="text-purple-600 font-medium">Alkaline (8.0 - 9.5) →</span>
            </div>
          </div>

          {/* Quick Input Numeric Box */}
          <div className="flex items-center gap-2">
            <div className="relative w-full">
              <input
                type="number"
                min="3.5"
                max="9.5"
                step="0.1"
                value={value}
                onChange={(e) => onChange('ph', e.target.value)}
                className="w-full px-3 py-2 text-base font-bold text-center text-stone-900 bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-stone-400 block text-center mt-1">Manual entry</span>
            </div>
          </div>
        </div>

        {/* Dynamic Soil Condition Feedback Card */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200/80">
          <Info className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <div className="text-xs">
            <span className={`inline-block font-semibold px-2 py-0.5 rounded-full border text-[11px] mr-2 ${status.badgeColor}`}>
              {status.label}
            </span>
            <span className="text-stone-600">{status.advice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
