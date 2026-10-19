import React from 'react';
import { Gauge, CheckCircle2, ShieldCheck } from 'lucide-react';
import type { IrrigationAdviceResult } from '../../services/irrigationService';

interface SoilMoistureGaugeProps {
  result: IrrigationAdviceResult;
}

export const SoilMoistureGauge: React.FC<SoilMoistureGaugeProps> = ({ result }) => {
  const { soilHydrology, inputs } = result;
  const moisture = Math.min(100, Math.max(0, soilHydrology.currentMoisturePct));

  // Determine moisture zone
  const getZone = (val: number) => {
    if (val < 30) return { label: 'Severe Depletion (Below Wilting Point)', color: 'text-red-600', bg: 'bg-red-500' };
    if (val < 45) return { label: 'Depletion Threshold (Needs Refill)', color: 'text-amber-600', bg: 'bg-amber-500' };
    if (val <= 75) return { label: 'Optimal Moisture (Field Capacity)', color: 'text-emerald-600', bg: 'bg-emerald-500' };
    return { label: 'Saturated (High Waterlogging Risk)', color: 'text-blue-600', bg: 'bg-blue-500' };
  };

  const zone = getZone(moisture);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Gauge className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Soil Moisture & Hydrology</h2>
            <p className="text-xs text-slate-500">
              Root zone water dynamics and Readily Available Water (RAW)
            </p>
          </div>
        </div>

        {/* Source badge */}
        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
          Source: {inputs.soilMoistureSource}
        </span>
      </div>

      {/* Main Meter */}
      <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 space-y-4">
        
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Current Root Zone Moisture</span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-0.5">
              {moisture}%
            </div>
          </div>
          <div className={`text-xs font-bold ${zone.color} text-right`}>
            {zone.label}
          </div>
        </div>

        {/* Multi-segment progress bar */}
        <div className="relative pt-2 pb-1">
          {/* Track background with color bands */}
          <div className="h-4 rounded-full overflow-hidden flex bg-slate-200 border border-slate-300/60 shadow-inner">
            <div className="w-[30%] bg-red-400" title="Wilting Point (0-30%)" />
            <div className="w-[15%] bg-amber-400" title="Management Allowed Depletion (30-45%)" />
            <div className="w-[30%] bg-emerald-500" title="Optimal Field Capacity (45-75%)" />
            <div className="w-[25%] bg-blue-500" title="Saturation (>75%)" />
          </div>

          {/* Indicator Needle Marker */}
          <div
            className="absolute top-0 bottom-0 -ml-1 transition-all duration-700 pointer-events-none"
            style={{ left: `${moisture}%` }}
          >
            <div className="w-3 h-8 -mt-2 bg-slate-900 border-2 border-white rounded-full shadow-md flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-white" />
            </div>
          </div>
        </div>

        {/* Labels underneath */}
        <div className="grid grid-cols-4 text-[10px] font-semibold text-slate-500 pt-1 text-center">
          <span className="text-red-600">0% Wilting</span>
          <span className="text-amber-600">45% Refill Threshold</span>
          <span className="text-emerald-700">75% Field Cap.</span>
          <span className="text-blue-600">100% Saturated</span>
        </div>

      </div>

      {/* Hydrology stats (AWC & RAW) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">
              Total Available Water (AWC)
            </div>
            <div className="text-lg font-bold text-slate-900">
              {soilHydrology.awcMm} mm
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Total water capacity in active root zone based on {inputs.soilType}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">
              Readily Available Water (RAW)
            </div>
            <div className="text-lg font-bold text-emerald-700">
              {soilHydrology.rawMm} mm
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Water readily extracted before crop experiences yield-reducing stress
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
