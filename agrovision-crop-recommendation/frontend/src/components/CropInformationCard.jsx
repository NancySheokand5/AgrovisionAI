import React from 'react';
import { useTranslation } from '../i18n';
import { Calendar, Droplets, Mountain, Lightbulb, CheckCircle, MapPin } from 'lucide-react';

export default function CropInformationCard({ cropInfo }) {
  const { t } = useTranslation();

  if (!cropInfo || Object.keys(cropInfo).length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-6">
      <div className="pb-3 border-b border-stone-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-stone-900">
            {t('result.crop_info_title')}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {cropInfo.botanical_name ? `${cropInfo.name} (${cropInfo.botanical_name})` : cropInfo.name}
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          {cropInfo.category || 'Agronomic Crop'}
        </span>
      </div>

      {/* Primary Agronomic Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Season & Duration */}
        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold mb-1">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>{t('result.season')}</span>
          </div>
          <div className="text-sm font-bold text-stone-900">
            {cropInfo.growing_season}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Duration: <strong className="text-stone-700">{cropInfo.duration}</strong>
          </div>
        </div>

        {/* Water Requirement */}
        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold mb-1">
            <Droplets className="w-4 h-4 text-sky-600" />
            <span>{t('result.water_req')}</span>
          </div>
          <div className="text-sm font-bold text-stone-900">
            {cropInfo.water_requirement}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Ensure irrigation during critical growth stages.
          </div>
        </div>

        {/* Soil Preference */}
        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold mb-1">
            <Mountain className="w-4 h-4 text-amber-600" />
            <span>{t('result.soil_pref')}</span>
          </div>
          <div className="text-xs font-medium text-stone-800 leading-snug">
            {cropInfo.soil_preference}
          </div>
        </div>

      </div>

      {/* Care & Advisory Tips */}
      {cropInfo.care_tips && cropInfo.care_tips.length > 0 && (
        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2.5">
            <Lightbulb className="w-4 h-4 text-emerald-700" />
            <span>{t('result.care_tips')}</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
            {cropInfo.care_tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-white/70 p-2 rounded-lg border border-emerald-100/60">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional Agronomic Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {cropInfo.harvest_indicators && (
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
            <span className="font-semibold text-stone-700 block mb-0.5">
              🌾 {t('result.harvest_indicators')}:
            </span>
            <span className="text-stone-600">{cropInfo.harvest_indicators}</span>
          </div>
        )}

        {cropInfo.major_states && (
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
            <span className="font-semibold text-stone-700 block mb-0.5">
              📍 {t('result.major_states')}:
            </span>
            <span className="text-stone-600">{cropInfo.major_states}</span>
          </div>
        )}
      </div>
    </div>
  );
}
