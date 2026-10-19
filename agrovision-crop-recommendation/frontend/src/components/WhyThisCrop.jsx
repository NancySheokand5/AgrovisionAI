import React from 'react';
import { useTranslation } from '../i18n';
import { CheckCircle2, AlertTriangle, HelpCircle, Check } from 'lucide-react';

export default function WhyThisCrop({ factors = [] }) {
  const { t } = useTranslation();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'optimal':
        return {
          icon: CheckCircle2,
          color: 'text-emerald-700 bg-emerald-100/70 border-emerald-300',
          dot: 'bg-emerald-500',
          text: t('result.status_optimal')
        };
      case 'good':
        return {
          icon: Check,
          color: 'text-blue-700 bg-blue-100/70 border-blue-300',
          dot: 'bg-blue-500',
          text: t('result.status_good')
        };
      case 'moderate':
      default:
        return {
          icon: AlertTriangle,
          color: 'text-amber-700 bg-amber-100/70 border-amber-300',
          dot: 'bg-amber-500',
          text: t('result.status_moderate')
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-xs">
      <div className="mb-5 pb-3 border-b border-stone-100">
        <h3 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
          <span>{t('result.why_title')}</span>
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          {t('result.why_subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {factors.map((item) => {
          const badge = getStatusBadge(item.status);
          const Icon = badge.icon;

          return (
            <div
              key={item.parameter}
              className="p-4 rounded-xl bg-stone-50/70 border border-stone-200/80 hover:border-emerald-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-bold text-stone-900">
                    {item.label}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{badge.text}</span>
                  </span>
                </div>

                <div className="flex items-baseline gap-2 text-xs text-stone-500 mb-2">
                  <span className="font-semibold text-stone-700">
                    {t('result.entered')}:
                  </span>
                  <span className="font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded-md border border-stone-200 text-sm">
                    {item.entered_value} {item.unit}
                  </span>
                  <span className="text-stone-300">•</span>
                  <span>{t('result.ideal_range')}: <strong className="text-stone-700 font-mono">{item.ideal_range}</strong></span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed bg-white/60 p-2.5 rounded-lg border border-stone-100">
                  {item.explanation}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
