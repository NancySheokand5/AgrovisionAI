import React from 'react';
import {
  Droplets,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  FileText
} from 'lucide-react';
import type { IrrigationAdviceResult } from '../../services/irrigationService';

interface IrrigationResultCardProps {
  result: IrrigationAdviceResult;
  onOpenReportModal: () => void;
}

export const IrrigationResultCard: React.FC<IrrigationResultCardProps> = ({
  result,
  onOpenReportModal
}) => {
  const { recommendation, calculations, crop, growthStage, weatherSummary } = result;

  // Status visual mapping
  const getStatusTheme = (status: string) => {
    switch (status) {
      case 'No irrigation needed':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900',
          badge: 'bg-emerald-600 text-white',
          icon: CheckCircle,
          ring: 'ring-emerald-500/20'
        };
      case 'High water stress':
        return {
          bg: 'bg-red-500/10 border-red-500/30 text-red-900',
          badge: 'bg-red-600 text-white',
          icon: AlertTriangle,
          ring: 'ring-red-500/20'
        };
      case 'Irrigation recommended':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-900',
          badge: 'bg-amber-600 text-white',
          icon: Droplets,
          ring: 'ring-amber-500/20'
        };
      case 'Monitor':
      default:
        return {
          bg: 'bg-blue-500/10 border-blue-500/30 text-blue-900',
          badge: 'bg-blue-600 text-white',
          icon: AlertCircle,
          ring: 'ring-blue-500/20'
        };
    }
  };

  const theme = getStatusTheme(recommendation.status);
  const StatusIcon = theme.icon;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
      
      {/* Header bar with Crop and Report button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="text-3xl sm:text-4xl p-2 bg-slate-50 rounded-2xl border border-slate-100">
            {crop.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{crop.name}</h2>
              <span className="text-xs text-slate-500 font-medium">({crop.hindiName})</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                {growthStage.label}
              </span>
              <span>•</span>
              <span>{result.inputs.area} {result.inputs.areaUnit}s</span>
              <span>•</span>
              <span>{result.inputs.soilType}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenReportModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>View Farm Water Report</span>
        </button>
      </div>

      {/* Main Recommendation Status Banner */}
      <div className={`p-5 sm:p-6 rounded-2xl border ${theme.bg} ${theme.ring} ring-1 space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${theme.badge} flex items-center gap-1.5 shadow-xs`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {recommendation.status}
            </span>
            <span className="text-xs text-slate-500">
              Advisory ID: #{result.id}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-white/80 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-200/60">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Next Review: <strong>{recommendation.nextCheckDate}</strong></span>
          </div>
        </div>

        {/* Action phrase */}
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{recommendation.actionPhrase}</span>
          </div>
          <p className="text-sm font-medium text-slate-700 mt-1">
            {recommendation.urgencyText}
          </p>
        </div>

        {/* Suggested Window */}
        <div className="flex items-center gap-2.5 bg-white/90 backdrop-blur rounded-xl p-3 border border-slate-200/60 text-xs text-slate-800">
          <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <div>
            <span className="font-bold text-slate-900">Optimal Application Window: </span>
            <span>{recommendation.suggestedWindow}</span>
          </div>
        </div>
      </div>

      {/* Key Water Balances (NIR vs GIR) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* ETc */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Crop Water Need (ETc)
            </span>
            <div className="text-2xl font-bold text-slate-800 mt-1">
              {calculations.etcDaily} <span className="text-xs font-normal text-slate-500">mm/day</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            ET0 ({weatherSummary.todayET0} mm) × Kc ({calculations.kc})
          </div>
        </div>

        {/* Effective Rain */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Effective Rain
            </span>
            <div className="text-2xl font-bold text-emerald-700 mt-1">
              {weatherSummary.effectiveRainfall} <span className="text-xs font-normal text-slate-500">mm</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            USDA SCS precipitation offset
          </div>
        </div>

        {/* Net Irrigation (NIR) */}
        <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-100 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
              Net Irrigation (NIR)
            </span>
            <div className="text-2xl font-bold text-blue-900 mt-1">
              {calculations.netIrrigationMm} <span className="text-xs font-normal text-blue-600">mm</span>
            </div>
          </div>
          <div className="text-[11px] text-blue-600 mt-2">
            Soil moisture deficit to replenish
          </div>
        </div>

        {/* Gross Irrigation (GIR) */}
        <div className="bg-indigo-50/70 rounded-2xl p-4 border border-indigo-100 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
              Gross Water Depth
            </span>
            <div className="text-2xl font-bold text-indigo-900 mt-1">
              {calculations.grossIrrigationMm} <span className="text-xs font-normal text-indigo-600">mm</span>
            </div>
          </div>
          <div className="text-[11px] text-indigo-600 mt-2">
            Factoring {Math.round(calculations.applicationEfficiency * 100)}% {result.inputs.irrigationMethod} efficiency
          </div>
        </div>

      </div>

    </div>
  );
};
