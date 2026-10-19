import React from 'react';
import { useTranslation } from '../i18n';
import { Leaf, FlaskConical, Sparkles } from 'lucide-react';

export default function NPKInput({ formData, onChange }) {
  const { t } = useTranslation();

  const nutrients = [
    {
      key: 'N',
      label: t('form.nitrogen'),
      hint: t('form.nitrogen_hint'),
      min: 0,
      max: 200,
      step: 1,
      unit: t('form.unit_kgha'),
      color: 'emerald',
      badge: 'Leaf & Stem Growth'
    },
    {
      key: 'P',
      label: t('form.phosphorus'),
      hint: t('form.phosphorus_hint'),
      min: 0,
      max: 150,
      step: 1,
      unit: t('form.unit_kgha'),
      color: 'amber',
      badge: 'Root & Bloom'
    },
    {
      key: 'K',
      label: t('form.potassium'),
      hint: t('form.potassium_hint'),
      min: 0,
      max: 200,
      step: 1,
      unit: t('form.unit_kgha'),
      color: 'blue',
      badge: 'Stress & Yield'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
            1
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900">
              {t('form.section_nutrients')}
            </h3>
            <p className="text-xs text-stone-500">
              {t('form.nutrients_hint')}
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-600">
          <FlaskConical className="w-3.5 h-3.5 text-stone-500" />
          <span>Macro Nutrients (N-P-K)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {nutrients.map((item) => {
          const value = formData[item.key] ?? '';
          return (
            <div
              key={item.key}
              className="p-4 rounded-xl bg-stone-50/70 border border-stone-200/80 hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor={`input-${item.key}`}
                  className="text-sm font-semibold text-stone-800 flex items-center gap-1.5"
                >
                  <span>{item.label}</span>
                </label>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white border border-stone-200 text-stone-600">
                  {item.badge}
                </span>
              </div>

              {/* Number Input Box with Unit */}
              <div className="relative mt-1">
                <input
                  id={`input-${item.key}`}
                  type="number"
                  name={item.key}
                  min={item.min}
                  max={item.max}
                  step={item.step}
                  value={value}
                  onChange={(e) => onChange(item.key, e.target.value)}
                  placeholder="0"
                  className="w-full pl-3 pr-16 py-2.5 text-lg font-bold text-stone-900 bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400">
                  {item.unit}
                </span>
              </div>

              {/* Slider for smooth visual adjustment */}
              <div className="mt-3">
                <input
                  type="range"
                  min={item.min}
                  max={item.max}
                  step={item.step}
                  value={value !== '' ? value : 0}
                  onChange={(e) => onChange(item.key, e.target.value)}
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-mono">
                  <span>{item.min}</span>
                  <span>Max: {item.max} {item.unit}</span>
                </div>
              </div>

              <p className="mt-2 text-[11px] text-stone-500 leading-tight">
                {item.hint}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
