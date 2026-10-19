import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import SuitabilityIndicator from './SuitabilityIndicator';
import WhyThisCrop from './WhyThisCrop';
import VisualOverview from './VisualOverview';
import ConditionSummary from './ConditionSummary';
import CropInformationCard from './CropInformationCard';
import AlternativeCropCard from './AlternativeCropCard';
import VoiceButton from './VoiceButton';
import ReportModal from './ReportModal';
import { 
  FileText, 
  RotateCcw, 
  Sparkles, 
  Share2, 
  Check, 
  ChevronRight,
  ShieldCheck,
  TrendingUp 
} from 'lucide-react';

export default function RecommendationResult({ 
  result, 
  rawInputs, 
  onTryAnother, 
  onEditInputs 
}) {
  const { t } = useTranslation();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!result || !result.success) return null;

  const handleShare = () => {
    const text = `AgroVision AI Crop Recommendation: ${result.display_name} (${result.hindi_name || ''}) - Suitability: ${result.suitability_level} (${result.suitability_score}%)`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner / Heading */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle geometric pattern */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row">
            <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-5xl shadow-inner">
              {result.icon || '🌾'}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-100 text-xs font-semibold mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>{t('result.heading')}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {result.display_name}
              </h2>
              {result.hindi_name && (
                <div className="text-emerald-200 text-lg sm:text-xl font-semibold mt-0.5">
                  {result.hindi_name}
                </div>
              )}
              <div className="text-emerald-100 text-xs sm:text-sm mt-1">
                {result.crop_info?.category || 'Field Crop'} • {t('result.subheading')}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <VoiceButton
              recommendation={result}
              cropInfo={result.crop_info}
              whyFactors={result.why_this_crop}
            />

            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-white text-emerald-900 hover:bg-emerald-50 border border-transparent shadow-xs transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>{t('result.report_btn')}</span>
            </button>

            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-sm transition-all hover:scale-105"
              title="Check live mandi prices for this crop in Feature 1"
            >
              <TrendingUp className="w-4 h-4 text-stone-950" />
              <span>Check Mandi Prices</span>
            </a>

            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors cursor-pointer"
              aria-label="Share recommendation"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Suitability Level Indicator Card */}
      <SuitabilityIndicator
        score={result.suitability_score}
        level={result.suitability_level}
        label={result.suitability_label}
      />

      {/* Why This Crop? Explainable factor breakdown */}
      <WhyThisCrop factors={result.why_this_crop} />

      {/* Soil & Weather Visual Overview meters */}
      <VisualOverview factors={result.why_this_crop} />

      {/* Crop Agronomic Guide & Cultural Practices */}
      <CropInformationCard cropInfo={result.crop_info} />

      {/* Other Possible Options (Runner-up model classes) */}
      <AlternativeCropCard alternatives={result.alternative_crops} />

      {/* Input Summary with quick edit */}
      <ConditionSummary inputs={rawInputs} onEditInputs={onEditInputs} />

      {/* Bottom Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-stone-100/80 border border-stone-200">
        <div className="text-xs text-stone-500 text-center sm:text-left">
          Need to re-evaluate for a different field plot or season?
        </div>
        <button
          type="button"
          onClick={onTryAnother}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-stone-900 hover:bg-stone-800 text-white shadow-xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t('result.try_again_btn')}</span>
        </button>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        recommendation={result}
        rawInputs={rawInputs}
      />
    </div>
  );
}
