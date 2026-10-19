import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import NPKInput from './NPKInput';
import PHSlider from './PHSlider';
import WeatherInputCard from './WeatherInputCard';
import OptionalFarmCard from './OptionalFarmCard';
import { Sparkles, AlertCircle, RotateCcw, ArrowRight } from 'lucide-react';

export default function FarmInputForm({ 
  formData, 
  onChange, 
  onSubmit, 
  onReset, 
  isLoading,
  formRef 
}) {
  const { t } = useTranslation();
  const [validationError, setValidationError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError(null);

    // Friendly client-side pre-validation
    const requiredKeys = [
      { key: 'N', label: 'Nitrogen (N)', min: 0, max: 250, unit: 'kg/ha' },
      { key: 'P', label: 'Phosphorus (P)', min: 0, max: 200, unit: 'kg/ha' },
      { key: 'K', label: 'Potassium (K)', min: 0, max: 250, unit: 'kg/ha' },
      { key: 'temperature', label: 'Temperature', min: 0, max: 55, unit: '°C' },
      { key: 'humidity', label: 'Humidity', min: 10, max: 100, unit: '%' },
      { key: 'ph', label: 'Soil pH', min: 3.5, max: 10.0, unit: 'pH' },
      { key: 'rainfall', label: 'Rainfall', min: 0, max: 500, unit: 'mm' },
    ];

    for (const item of requiredKeys) {
      const val = formData[item.key];
      if (val === undefined || val === null || String(val).trim() === '') {
        setValidationError(`Please enter a value for ${item.label}.`);
        return;
      }
      const num = Number(val);
      if (isNaN(num)) {
        setValidationError(`Please enter a valid numeric number for ${item.label}.`);
        return;
      }
      if (num < item.min) {
        setValidationError(`${item.label} cannot be less than ${item.min} ${item.unit}.`);
        return;
      }
      if (num > item.max) {
        setValidationError(`${item.label} cannot exceed ${item.max} ${item.unit}.`);
        return;
      }
    }

    onSubmit();
  };

  return (
    <div ref={formRef} className="scroll-mt-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-gradient-to-b from-stone-50 to-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
        
        {/* Card Header */}
        <div className="p-6 sm:p-8 bg-white border-b border-stone-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Agricultural Diagnostic Input</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                {t('form.title')}
              </h2>
              <p className="text-sm text-stone-500 mt-1 max-w-xl">
                {t('form.subtitle')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('form.reset_btn')}</span>
              </button>
            </div>
          </div>

          {/* Validation Alert Banner */}
          {validationError && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-rose-900">Please check your inputs</div>
                <div>{validationError}</div>
              </div>
              <button
                type="button"
                onClick={() => setValidationError(null)}
                className="text-xs text-rose-600 hover:text-rose-900 font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Input Sections */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* SECTION 1: Soil Nutrients */}
          <NPKInput formData={formData} onChange={onChange} />

          {/* SECTION 2: Soil pH Condition */}
          <PHSlider value={formData.ph} onChange={onChange} />

          {/* SECTION 3: Weather Conditions */}
          <WeatherInputCard formData={formData} onChange={onChange} />

          {/* SECTION 4: Optional Location & Season details */}
          <OptionalFarmCard formData={formData} onChange={onChange} />

          {/* Submit Action Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-stone-400 text-center sm:text-left">
              Data is processed locally through the AgroVision AI prediction engine.
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-base text-white shadow-lg transition-all cursor-pointer ${
                isLoading
                  ? 'bg-emerald-400 cursor-not-allowed shadow-none'
                  : 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-800/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t('analysis.loading_title')}</span>
                </>
              ) : (
                <>
                  <span>{t('form.submit_btn')}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
