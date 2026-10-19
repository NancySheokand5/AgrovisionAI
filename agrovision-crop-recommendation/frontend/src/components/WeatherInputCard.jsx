import React from 'react';
import { useTranslation } from '../i18n';
import { Thermometer, Droplets, CloudRain } from 'lucide-react';

export default function WeatherInputCard({ formData, onChange }) {
  const { t } = useTranslation();

  const weatherFields = [
    {
      key: 'temperature',
      label: t('form.temperature'),
      hint: t('form.temperature_hint'),
      unit: '°C',
      min: 0,
      max: 50,
      step: 1,
      icon: Thermometer,
      iconColor: 'text-amber-600 bg-amber-100',
      placeholder: 'e.g. 26'
    },
    {
      key: 'humidity',
      label: t('form.humidity'),
      hint: t('form.humidity_hint'),
      unit: '%',
      min: 10,
      max: 100,
      step: 1,
      icon: Droplets,
      iconColor: 'text-sky-600 bg-sky-100',
      placeholder: 'e.g. 75'
    },
    {
      key: 'rainfall',
      label: t('form.rainfall'),
      hint: t('form.rainfall_hint'),
      unit: 'mm',
      min: 0,
      max: 400,
      step: 5,
      icon: CloudRain,
      iconColor: 'text-blue-600 bg-blue-100',
      placeholder: 'e.g. 150'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
            3
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900">
              {t('form.section_weather')}
            </h3>
            <p className="text-xs text-stone-500">
              {t('form.weather_hint')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {weatherFields.map((field) => {
          const Icon = field.icon;
          const value = formData[field.key] ?? '';
          return (
            <div
              key={field.key}
              className="p-4 rounded-xl bg-stone-50/70 border border-stone-200/80 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${field.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <label
                  htmlFor={`weather-${field.key}`}
                  className="text-sm font-semibold text-stone-800"
                >
                  {field.label}
                </label>
              </div>

              {/* Number Input with unit */}
              <div className="relative mt-1">
                <input
                  id={`weather-${field.key}`}
                  type="number"
                  name={field.key}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={value}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full pl-3 pr-16 py-2.5 text-lg font-bold text-stone-900 bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-2xs"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400">
                  {field.unit}
                </span>
              </div>

              {/* Range slider */}
              <div className="mt-3">
                <input
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={value !== '' ? value : field.min}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-mono">
                  <span>{field.min} {field.unit}</span>
                  <span>{field.max} {field.unit}</span>
                </div>
              </div>

              <p className="mt-2 text-[11px] text-stone-500 leading-tight">
                {field.hint}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
