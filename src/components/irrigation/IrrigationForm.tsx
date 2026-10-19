import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Gauge,
  Sparkles,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { irrigationService, type IrrigationInput, IRRIGATION_METHODS_EFFICIENCY, SOIL_AVAILABLE_WATER_CAPACITY } from '../../services/irrigationService';
import type { NormalizedAgroVisionWeather } from '../../services/weatherService';

interface IrrigationFormProps {
  weather: NormalizedAgroVisionWeather | null;
  onSubmit: (input: IrrigationInput) => void;
  isLoading: boolean;
}

export const IrrigationForm: React.FC<IrrigationFormProps> = ({
  weather,
  onSubmit,
  isLoading
}) => {
  const cropsList = irrigationService.getCropsList();

  // Form states
  const [selectedCrop, setSelectedCrop] = useState<string>('wheat');
  const [selectedStage, setSelectedStage] = useState<string>('vegetative');
  const [area, setArea] = useState<number>(2.5);
  const [areaUnit, setAreaUnit] = useState<'acre' | 'hectare' | 'sqm'>('acre');
  const [soilType, setSoilType] = useState<'sandy' | 'loamy' | 'clay'>('loamy');
  
  // Default last irrigation date to 3 days ago
  const getDefaultLastDate = () => {
    const d = new Date();
    d.setDate(d.getDate() - 3);
    return d.toISOString().split('T')[0];
  };

  const [lastIrrigationDate, setLastIrrigationDate] = useState<string>(getDefaultLastDate());
  const [irrigationMethod, setIrrigationMethod] = useState<'drip' | 'sprinkler' | 'flood' | 'furrow'>('drip');
  
  // Moisture mode
  const [useLiveMoisture, setUseLiveMoisture] = useState<boolean>(true);
  const [manualMoisture, setManualMoisture] = useState<number>(45);

  // Available stages for selected crop
  const currentCropObj = cropsList.find((c) => c.id === selectedCrop) || cropsList[0];
  const stagesEntries = currentCropObj ? Object.entries(currentCropObj.stages) : [];

  // When crop changes, update stage to first stage or vegetative
  useEffect(() => {
    if (stagesEntries.length > 0) {
      if (stagesEntries.some(([k]) => k === 'vegetative')) {
        setSelectedStage('vegetative');
      } else {
        setSelectedStage(stagesEntries[0][0]);
      }
    }
  }, [selectedCrop]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const liveMoistureVal = weather?.current.soilMoisture;
    const finalMoisture = useLiveMoisture
      ? (liveMoistureVal !== undefined && liveMoistureVal !== null ? liveMoistureVal : undefined)
      : manualMoisture;

    onSubmit({
      crop: selectedCrop,
      growthStage: selectedStage,
      area: Math.max(0.1, Number(area) || 1),
      areaUnit,
      soilType,
      lastIrrigationDate,
      irrigationMethod,
      soilMoisture: finalMoisture,
      latitude: weather?.location.latitude,
      longitude: weather?.location.longitude
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Droplets className="w-4.5 h-4.5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Farm Irrigation Parameters</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            FAO-56 Water Balance Model using live agro-meteorological observations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* 1. Crop Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Select Crop / फसल
          </label>
          <div className="relative">
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer"
            >
              {cropsList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.name} ({c.hindiName})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 2. Growth Stage */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Crop Growth Stage / विकास चरण
          </label>
          <div className="relative">
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer"
            >
              {stagesEntries.map(([stageKey, stageData]: [string, any]) => (
                <option key={stageKey} value={stageKey}>
                  {stageData.label} (Kc: {stageData.kc}) — {stageData.days} days
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 3. Field Area & Unit */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Field Area / खेत का क्षेत्रफल
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="5000"
              value={area}
              onChange={(e) => setArea(parseFloat(e.target.value) || 0)}
              className="w-2/3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              placeholder="e.g. 2.5"
              required
            />
            <div className="relative w-1/3">
              <select
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value as any)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="acre">Acres</option>
                <option value="hectare">Hectares</option>
                <option value="sqm">Sq Metres</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 4. Soil Type */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Soil Texture / मिट्टी का प्रकार
          </label>
          <div className="relative">
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value as any)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer"
            >
              {Object.entries(SOIL_AVAILABLE_WATER_CAPACITY).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label} (AWC: {val.awcPerMeter} mm/m)
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 5. Last Irrigation Date */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Last Irrigation Date / पिछली सिंचाई
          </label>
          <div className="relative">
            <input
              type="date"
              max={new Date().toISOString().split('T')[0]}
              value={lastIrrigationDate}
              onChange={(e) => setLastIrrigationDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer"
              required
            />
          </div>
        </div>

        {/* 6. Irrigation Method */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Irrigation System / सिंचाई विधि
          </label>
          <div className="relative">
            <select
              value={irrigationMethod}
              onChange={(e) => setIrrigationMethod(e.target.value as any)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer"
            >
              {Object.entries(IRRIGATION_METHODS_EFFICIENCY).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label} — {Math.round(val.efficiency * 100)}% Efficiency
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* 7. Soil Moisture Input / Sensor Mode */}
      <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Gauge className="w-4.5 h-4.5 text-blue-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Soil Moisture Source / मृदा नमी
            </span>
          </div>

          {/* Toggle Button */}
          <div className="inline-flex items-center bg-white rounded-xl p-1 border border-slate-200 shadow-2xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setUseLiveMoisture(true)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                useLiveMoisture
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live Weather / Sensor
            </button>
            <button
              type="button"
              onClick={() => setUseLiveMoisture(false)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                !useLiveMoisture
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Manual Input
            </button>
          </div>
        </div>

        {useLiveMoisture ? (
          <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-blue-100">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <div className="text-xs font-bold text-slate-800">
                  {weather?.current.soilMoisture !== null && weather?.current.soilMoisture !== undefined
                    ? `${weather.current.soilMoisture}% Volumetric Moisture`
                    : 'Auto-estimated from weather and soil depletion'}
                </div>
                <div className="text-[11px] text-slate-500">
                  Open-Meteo European Model (0–7cm soil layer) for {weather?.location.name || 'farm'}
                </div>
              </div>
            </div>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
              Live Satellite / ECMWF
            </span>
          </div>
        ) : (
          <div className="space-y-2 bg-white rounded-xl p-3 border border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Measured Soil Moisture:</span>
              <span className="font-bold text-blue-700 text-sm">{manualMoisture}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              value={manualMoisture}
              onChange={(e) => setManualMoisture(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>Dry (&lt;25%)</span>
              <span>Refill Point (~40%)</span>
              <span>Field Capacity (~70%)</span>
              <span>Saturated (&gt;85%)</span>
            </div>
          </div>
        )}
      </div>

      {/* Submit CTA */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-600 to-teal-600 text-white font-bold text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:scale-[1.008] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Calculating FAO-56 Water Balance...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Calculate Smart Irrigation Advice
            </>
          )}
        </button>
      </div>

    </form>
  );
};
