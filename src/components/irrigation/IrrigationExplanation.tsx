import React from 'react';
import { HelpCircle, Check, BookOpen, AlertCircle } from 'lucide-react';
import type { IrrigationAdviceResult } from '../../services/irrigationService';

interface IrrigationExplanationProps {
  result: IrrigationAdviceResult;
}

export const IrrigationExplanation: React.FC<IrrigationExplanationProps> = ({ result }) => {
  const { recommendation, calculations, inputs } = result;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <HelpCircle className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Why This Recommendation?</h2>
            <p className="text-xs text-slate-500">
              Complete agronomic and water balance reasoning breakdown
            </p>
          </div>
        </div>
      </div>

      {/* Explanatory points */}
      <div className="space-y-3">
        {recommendation.whyExplanation.map((point, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {point}
            </p>
          </div>
        ))}

        {/* Efficiency rationale */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100">
          <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            <strong>Application Efficiency: </strong>
            Gross irrigation requirement ({calculations.grossIrrigationMm} mm) compensates for a {Math.round((1 - calculations.applicationEfficiency) * 100)}% distribution and evaporation loss inherent to {inputs.irrigationMethod}.
          </p>
        </div>
      </div>

      {/* Scientific Citation & Agricultural Advisory Disclaimer */}
      <div className="pt-2 border-t border-slate-100 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>Scientific Grounding & Methodology</span>
        </div>
        
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Calculations are computed using the globally accepted <strong>FAO-56 Penman-Monteith equation</strong> (Allen et al., Food and Agriculture Organization of the United Nations, Paper 56) and the <strong>USDA Soil Conservation Service (SCS)</strong> effective rainfall hydrology.
        </p>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-800 leading-relaxed flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Agricultural Advisory Disclaimer:</strong> AgroVision AI recommendations are decision-support guidance modeled for disease-free crops in standard conditions. Always verify with in-field soil feel, root depth inspects, and local Krishi Vigyan Kendra (KVK) advisories before irrigation.
          </span>
        </div>
      </div>

    </div>
  );
};
