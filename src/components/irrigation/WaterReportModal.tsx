import React from 'react';
import {
  X,
  Printer,
  Sprout,
  Clock,
  MapPin,
  FileText
} from 'lucide-react';
import type { IrrigationAdviceResult } from '../../services/irrigationService';

interface WaterReportModalProps {
  result: IrrigationAdviceResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WaterReportModal: React.FC<WaterReportModalProps> = ({
  result,
  isOpen,
  onClose
}) => {
  if (!isOpen || !result) return null;

  const handlePrint = () => {
    window.print();
  };

  const {
    crop,
    growthStage,
    inputs,
    weatherSummary,
    calculations,
    recommendation
  } = result;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      
      {/* Modal Card */}
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar (Hidden when printing) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold tracking-wide">Farm Water Advisory Report</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div className="p-6 sm:p-10 space-y-6 text-slate-900">
          
          {/* Letterhead */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md">
                <Sprout className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  AgroVision <span className="text-emerald-600">AI</span>
                </h1>
                <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
                  Climate-Smart Agricultural Decision Support System
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-slate-500">
              <div className="font-bold text-slate-800">REPORT #{result.id}</div>
              <div>Date: {new Date(result.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              <div>Time: {new Date(result.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>

          {/* Farm & Crop Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Farm Location</span>
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                {weatherSummary.locationName}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Crop & Stage</span>
              <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                {crop.name} ({growthStage.label})
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Field Area</span>
              <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                {inputs.area} {inputs.areaUnit}s ({inputs.soilType})
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Irrigation Method</span>
              <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                {inputs.irrigationMethod} ({Math.round(calculations.applicationEfficiency * 100)}% Eff.)
              </span>
            </div>
          </div>

          {/* Recommendation Banner in Report */}
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-slate-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Official Advisory Decision
              </span>
              <span className="text-xs font-bold text-emerald-900 bg-white px-3 py-1 rounded-full border border-emerald-200">
                Status: {recommendation.status}
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {recommendation.actionPhrase}
            </div>
            <div className="text-xs text-slate-600 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Recommended Application Window: <strong>{recommendation.suggestedWindow}</strong></span>
            </div>
          </div>

          {/* Water Budget Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              FAO-56 Crop Water Balance Summary
            </h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="py-2.5 px-4 font-bold">Metric Parameter</th>
                    <th className="py-2.5 px-4 font-bold">Value</th>
                    <th className="py-2.5 px-4 font-bold">Reference / Standard Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2.5 px-4 font-medium">Reference Evapotranspiration (ET0)</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">{weatherSummary.todayET0} mm/day</td>
                    <td className="py-2.5 px-4 text-slate-500">FAO-56 Penman-Monteith (Open-Meteo live)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium">Crop Coefficient (Kc)</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">{calculations.kc}</td>
                    <td className="py-2.5 px-4 text-slate-500">FAO-56 Table 12 ({growthStage.label})</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium">Crop Evapotranspiration (ETc)</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">{calculations.etcDaily} mm/day</td>
                    <td className="py-2.5 px-4 text-slate-500">ETc = ET0 × Kc</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium">Effective Rainfall Offset</td>
                    <td className="py-2.5 px-4 font-bold text-emerald-700">{weatherSummary.effectiveRainfall} mm</td>
                    <td className="py-2.5 px-4 text-slate-500">USDA Soil Conservation Service method</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium">Net Irrigation Requirement (NIR)</td>
                    <td className="py-2.5 px-4 font-bold text-blue-800">{calculations.netIrrigationMm} mm</td>
                    <td className="py-2.5 px-4 text-slate-500">Root zone depletion deficit</td>
                  </tr>
                  <tr className="bg-slate-50 font-semibold">
                    <td className="py-2.5 px-4 font-bold text-slate-900">Gross Irrigation Requirement (GIR)</td>
                    <td className="py-2.5 px-4 font-bold text-indigo-700">{calculations.grossIrrigationMm} mm</td>
                    <td className="py-2.5 px-4 text-slate-500">GIR = NIR / {calculations.applicationEfficiency}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Volumetric Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-teal-50/70 border border-teal-200">
            <div>
              <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">Total Water Volume</span>
              <span className="text-xl font-black text-teal-900 mt-0.5 block">
                {calculations.totalWaterLitres.toLocaleString()} Litres
              </span>
              <span className="text-[11px] text-teal-700">
                {Math.round((calculations.totalWaterLitres / 1000) * 10) / 10} m³ total volume
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">Per Acre Rate</span>
              <span className="text-base font-bold text-teal-900 mt-0.5 block">
                {calculations.litresPerAcre.toLocaleString()} L / acre
              </span>
              <span className="text-[11px] text-teal-700">1 mm = 4,046.86 Litres</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">Per Hectare Rate</span>
              <span className="text-base font-bold text-teal-900 mt-0.5 block">
                {calculations.litresPerHectare.toLocaleString()} L / ha
              </span>
              <span className="text-[11px] text-teal-700">1 mm = 10,000 Litres</span>
            </div>
          </div>

          {/* Disclaimer & Sign-off */}
          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 space-y-1">
            <p>
              <strong>Disclaimer:</strong> This AgroVision AI Farm Water Advisory Report is generated using FAO-56 Penman-Monteith physics and live agro-meteorological feeds. It is intended strictly as a decision-support guide for progressive farmers. Calibrate with physical soil probe readings and local agronomist recommendations.
            </p>
            <p className="font-semibold text-slate-500">
              AgroVision AI Platform • Climate-Smart Decision Support • Confidential Farm Record
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
