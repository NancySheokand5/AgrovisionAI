import React from 'react';
import { useTranslation } from '../i18n';
import { ArrowDown, Sprout, ShieldCheck, Cpu, Sliders } from 'lucide-react';

export default function HeroSection({ onScrollToForm, onLoadPreset }) {
  const { t } = useTranslation();

  const presets = [
    { id: 'rice', label: t('hero.rice_sample'), icon: '🌾' },
    { id: 'chickpea', label: t('hero.chickpea_sample'), icon: '🌱' },
    { id: 'banana', label: t('hero.banana_sample'), icon: '🍌' },
    { id: 'moth', label: t('hero.moth_sample'), icon: '🪴' }
  ];

  return (
    <section className="relative pt-8 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Decorative subtle ambient backdrop */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 bg-gradient-to-b from-emerald-100/40 via-emerald-50/20 to-transparent blur-3xl rounded-full"></div>
      </div>

      <div className="text-center max-w-3xl mx-auto">
        {/* Compact Agriculture Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-300 text-emerald-900 text-xs font-semibold tracking-wide mb-4 shadow-2xs">
          <Sprout className="w-3.5 h-3.5 text-emerald-700" />
          <span>Precision Agriculture Module • Smart AI Model</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight sm:leading-tight">
          {t('hero.title')}
        </h1>

        {/* Subheading */}
        <p className="mt-3 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
          {t('hero.subtitle')}
        </p>

        {/* Primary CTA and Key Stats Pill */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onScrollToForm}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm sm:text-base shadow-md shadow-emerald-800/20 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus:outline-hidden focus:ring-3 focus:ring-emerald-500/50 cursor-pointer"
          >
            <span>{t('hero.cta_btn')}</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>

        {/* Compact Feature Indicators Strip */}
        <div className="mt-6 pt-5 border-t border-stone-200/80 grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto text-left">
          <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg bg-white/70 border border-stone-200/70 shadow-2xs">
            <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-800 shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">{t('hero.stat_crops')}</div>
              <div className="text-[11px] text-stone-500">Cereals, pulses, fruits</div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg bg-white/70 border border-stone-200/70 shadow-2xs">
            <div className="p-1.5 rounded-md bg-blue-100 text-blue-800 shrink-0">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">{t('hero.stat_factors')}</div>
              <div className="text-[11px] text-stone-500">N-P-K, pH & weather</div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg bg-white/70 border border-stone-200/70 shadow-2xs">
            <div className="p-1.5 rounded-md bg-amber-100 text-amber-800 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">{t('hero.stat_ai')}</div>
              <div className="text-[11px] text-stone-500">Transparent guidance</div>
            </div>
          </div>
        </div>

        {/* Quick Sample Selector for 1-Click Evaluation */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-medium text-stone-500">
            {t('hero.quick_samples')}
          </span>
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onLoadPreset(p.id)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 border border-stone-200 hover:border-emerald-300 shadow-2xs transition-colors cursor-pointer"
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
