import React from 'react';
import { useTranslation } from '../i18n';
import { Sprout, Printer, X, ShieldAlert, CheckCircle2, FileText } from 'lucide-react';

export default function ReportModal({ isOpen, onClose, recommendation, rawInputs }) {
  const { t } = useTranslation();

  if (!isOpen || !recommendation) return null;

  const handlePrint = () => {
    window.print();
  };

  const reportId = 'AGV-REC-' + (recommendation.recommended_crop || 'CROP').toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
  const dateFormatted = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(new Date());

  const crop = recommendation.crop_info || {};
  const meta = rawInputs?.farm_meta || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 my-6">
        
        {/* Modal Action Header (Excluded when printing) */}
        <div className="no-print p-4 sm:p-5 bg-stone-50 border-b border-stone-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-700" />
            <span className="font-bold text-stone-900 text-sm sm:text-base">
              AgroVision AI Recommendation Dossier
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t('report.print_btn')}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div className="p-6 sm:p-10 space-y-6 print:p-0 print:space-y-4">
          
          {/* Letterhead */}
          <div className="flex items-start justify-between pb-6 border-b-2 border-emerald-700">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                  <Sprout className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-emerald-950 font-serif">
                  AgroVision <span className="text-emerald-600">AI</span>
                </h1>
              </div>
              <p className="text-xs text-stone-500 font-medium mt-1">
                Precision Agricultural Decision Support System
              </p>
            </div>

            <div className="text-right text-xs">
              <div className="font-mono font-bold text-stone-900">{reportId}</div>
              <div className="text-stone-500 mt-0.5">{dateFormatted}</div>
              <div className="text-emerald-700 font-semibold mt-1">
                {meta.state ? `${meta.district ? meta.district + ', ' : ''}${meta.state}` : 'Farm Location'}
              </div>
            </div>
          </div>

          {/* Recommended Crop Showcase */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <span className="text-5xl">{recommendation.icon || '🌾'}</span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Primary Recommendation
                </span>
                <div className="text-2xl sm:text-3xl font-black text-stone-900">
                  {recommendation.display_name}
                </div>
                {recommendation.hindi_name && (
                  <div className="text-sm font-semibold text-emerald-800">
                    {recommendation.hindi_name}
                  </div>
                )}
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="text-xs text-stone-500">Suitability Index</div>
              <div className="text-2xl font-black text-emerald-800 font-mono">
                {recommendation.suitability_score}%
              </div>
              <div className="text-xs font-semibold text-stone-700">
                {recommendation.suitability_level}
              </div>
            </div>
          </div>

          {/* Farm Conditions Input Matrix */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 mb-2">
              Analyzed Farm Conditions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-stone-500 block">Nitrogen (N)</span>
                <span className="font-bold text-stone-900 font-mono text-sm">{rawInputs.N} kg/ha</span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-stone-500 block">Phosphorus (P)</span>
                <span className="font-bold text-stone-900 font-mono text-sm">{rawInputs.P} kg/ha</span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-stone-500 block">Potassium (K)</span>
                <span className="font-bold text-stone-900 font-mono text-sm">{rawInputs.K} kg/ha</span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-stone-500 block">Soil pH</span>
                <span className="font-bold text-stone-900 font-mono text-sm">{rawInputs.ph} pH</span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-stone-500 block">Temperature</span>
                <span className="font-bold text-stone-900 font-mono text-sm">{rawInputs.temperature} °C</span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-stone-500 block">Relative Humidity</span>
                <span className="font-bold text-stone-900 font-mono text-sm">{rawInputs.humidity} %</span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-stone-500 block">Rainfall</span>
                <span className="font-bold text-stone-900 font-mono text-sm">{rawInputs.rainfall} mm</span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-stone-500 block">Farm Size / Season</span>
                <span className="font-bold text-stone-900 text-sm">
                  {meta.farm_size ? `${meta.farm_size} Acres` : 'Standard'} • {meta.season || 'Kharif'}
                </span>
              </div>
            </div>
          </div>

          {/* Agronomic Guidance */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 mb-2">
              Agronomic Profile & Advisory
            </h3>
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2 border-b border-stone-200">
                <div><strong>Season:</strong> {crop.growing_season || 'Seasonal'}</div>
                <div><strong>Duration:</strong> {crop.duration || '90-120 days'}</div>
                <div><strong>Water Need:</strong> {crop.water_requirement || 'Moderate'}</div>
                <div><strong>Soil Preference:</strong> {crop.soil_preference || 'Well-drained loam'}</div>
              </div>

              {crop.care_tips && (
                <div className="pt-1">
                  <div className="font-semibold text-stone-800 mb-1">Key Field Care Instructions:</div>
                  <ul className="list-disc pl-4 space-y-1 text-stone-600">
                    {crop.care_tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Official Disclaimer */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-stone-700 text-[11px] leading-relaxed flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-900">{t('report.disclaimer_title')}: </strong>
              {t('report.disclaimer_text')}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
