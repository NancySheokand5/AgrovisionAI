import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { Sprout, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

export default function AnalysisLoader() {
  const { t } = useTranslation();
  const [stage, setStage] = useState(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(2), 400);
    const timer2 = setTimeout(() => setStage(3), 900);
    const timer3 = setTimeout(() => setStage(4), 1400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const steps = [
    { num: 1, label: t('analysis.step_1') },
    { num: 2, label: t('analysis.step_2') },
    { num: 3, label: t('analysis.step_3') },
    { num: 4, label: t('analysis.step_4') }
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-emerald-100 shadow-xl p-8 sm:p-10 text-center relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-emerald-100/60 blur-3xl -z-10 rounded-full" />

        {/* Central Animated AI Icon */}
        <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-100 rounded-2xl animate-ping opacity-30" />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
            <Sprout className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2">
          {t('analysis.loading_title')}
        </h3>
        <p className="text-sm text-stone-500 mb-8 max-w-md mx-auto">
          Comparing your soil nutrients and climate readings against agronomic crop requirements.
        </p>

        {/* Sequential Step Progress Feedback */}
        <div className="max-w-md mx-auto space-y-3 text-left">
          {steps.map((st) => {
            const isCompleted = stage > st.num;
            const isCurrent = stage === st.num;

            return (
              <div
                key={st.num}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : isCurrent
                    ? 'bg-stone-50 border-stone-300 text-stone-800 shadow-2xs'
                    : 'bg-transparent border-transparent text-stone-300'
                }`}
              >
                <div className="shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-stone-200 flex items-center justify-center text-[10px] text-stone-400">
                      {st.num}
                    </div>
                  )}
                </div>
                <div className="text-xs sm:text-sm font-medium">
                  {st.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
