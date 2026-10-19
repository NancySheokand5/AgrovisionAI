import React from 'react';
import { useTranslation } from '../i18n';
import { Sparkles, ArrowUpRight } from 'lucide-react';

export default function AlternativeCropCard({ alternatives = [] }) {
  const { t } = useTranslation();

  if (!alternatives || alternatives.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-xs">
      <div className="mb-4 pb-3 border-b border-stone-100">
        <h3 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
          <span>{t('result.alternatives_title')}</span>
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          {t('result.alternatives_subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {alternatives.map((alt) => (
          <div
            key={alt.crop_id}
            className="p-4 rounded-xl bg-stone-50/80 border border-stone-200/80 hover:border-emerald-300 transition-all hover:shadow-xs group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{alt.icon}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-stone-200 text-stone-600">
                Option #{alt.rank}
              </span>
            </div>

            <div className="font-bold text-base text-stone-900 group-hover:text-emerald-800 transition-colors">
              {alt.name}
            </div>
            {alt.hindi_name && (
              <div className="text-xs text-stone-500 font-medium">
                {alt.hindi_name}
              </div>
            )}

            <div className="mt-2.5 pt-2.5 border-t border-stone-200/60 text-[11px] text-stone-600 space-y-1">
              <div>Type: <strong className="text-stone-800">{alt.category}</strong></div>
              <div>Water: <strong className="text-stone-800">{alt.water_requirement}</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
