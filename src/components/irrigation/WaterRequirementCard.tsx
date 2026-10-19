import React, { useState } from 'react';
import {
  Waves,
  Zap,
  Clock,
  Droplet
} from 'lucide-react';
import type { IrrigationAdviceResult } from '../../services/irrigationService';

interface WaterRequirementCardProps {
  result: IrrigationAdviceResult;
}

export const WaterRequirementCard: React.FC<WaterRequirementCardProps> = ({ result }) => {
  const { calculations, inputs } = result;

  // Pump rating presets (in Litres per Hour)
  const pumpPresets = [
    { label: '3 HP Pump (~9,000 L/h)', lph: 9000 },
    { label: '5 HP Pump (~15,000 L/h)', lph: 15000 },
    { label: '7.5 HP Pump (~22,500 L/h)', lph: 22500 },
    { label: '10 HP Pump (~30,000 L/h)', lph: 30000 },
  ];

  const [selectedPumpLph, setSelectedPumpLph] = useState<number>(15000);

  // Runtime calculation: Total Litres / LPH
  const totalLitres = calculations.totalWaterLitres;
  const runtimeHoursDecimal = totalLitres > 0 ? totalLitres / selectedPumpLph : 0;
  const runtimeHours = Math.floor(runtimeHoursDecimal);
  const runtimeMinutes = Math.round((runtimeHoursDecimal - runtimeHours) * 60);

  // Cubic metres (1 m3 = 1,000 L)
  const totalCubicMetres = Math.round((totalLitres / 1000) * 10) / 10;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Waves className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Volumetric Water Requirements</h2>
            <p className="text-xs text-slate-500">
              Standardized agricultural conversions (1 mm = 4,046.86 L/acre = 10,000 L/ha)
            </p>
          </div>
        </div>
      </div>

      {/* Hero Volume Display */}
      <div className="bg-gradient-to-br from-teal-900 via-emerald-900 to-slate-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/20 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-white/10 px-3 py-1 rounded-full mb-3">
              <Droplet className="w-3.5 h-3.5 fill-current" />
              Total Farm Application Volume
            </div>
            <div className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              {totalLitres.toLocaleString()} <span className="text-xl sm:text-2xl font-bold text-emerald-300">Litres</span>
            </div>
            <div className="text-sm text-slate-300 mt-1">
              Equivalent to <strong>{totalCubicMetres.toLocaleString()} m³</strong> for {inputs.area} {inputs.areaUnit}s of {result.crop.name}
            </div>
          </div>

          {/* Unit breakdown chips */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10">
              <span className="text-slate-300 block text-[10px]">Per Acre</span>
              <span className="font-bold text-white text-sm">{calculations.litresPerAcre.toLocaleString()} L</span>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10">
              <span className="text-slate-300 block text-[10px]">Per Hectare</span>
              <span className="font-bold text-white text-sm">{calculations.litresPerHectare.toLocaleString()} L</span>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10">
              <span className="text-slate-300 block text-[10px]">Gross Depth</span>
              <span className="font-bold text-emerald-300 text-sm">{calculations.grossIrrigationMm} mm</span>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10">
              <span className="text-slate-300 block text-[10px]">Efficiency</span>
              <span className="font-bold text-white text-sm">{Math.round(calculations.applicationEfficiency * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pump Runtime Estimator */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4.5 h-4.5 text-amber-500" />
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Tubewell / Pump Runtime Estimator
              </span>
              <p className="text-[11px] text-slate-500">
                Estimate continuous running time required to deliver required volume
              </p>
            </div>
          </div>

          <div className="relative">
            <select
              value={selectedPumpLph}
              onChange={(e) => setSelectedPumpLph(Number(e.target.value))}
              className="appearance-none bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer pr-8 shadow-2xs"
            >
              {pumpPresets.map((p) => (
                <option key={p.lph} value={p.lph}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {totalLitres > 0 ? (
          <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-teal-100 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium">Estimated Pump Runtime</span>
                <div className="text-lg font-bold text-slate-900">
                  {runtimeHours > 0 ? `${runtimeHours} hrs ` : ''}
                  {runtimeMinutes} mins
                </div>
              </div>
            </div>

            <div className="text-right text-xs text-slate-500">
              Flow Rate: <span className="font-bold text-slate-700">{selectedPumpLph.toLocaleString()} L/hr</span>
              <br />
              <span className="text-[10px] text-emerald-600 font-semibold">Recommended in 2 split shifts</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-3 text-xs text-slate-500 bg-white rounded-xl border border-slate-100">
            No pump runtime needed — soil moisture is adequate.
          </div>
        )}
      </div>

    </div>
  );
};
