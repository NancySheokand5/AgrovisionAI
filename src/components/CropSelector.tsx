import React from 'react';
import type { Crop, State, Mandi } from '../types';
import { MapPin, Store, Wheat, Info, Check } from 'lucide-react';

interface CropSelectorProps {
  crops: Crop[];
  states: State[];
  mandis: Mandi[];
  selectedCropId: string;
  selectedStateId: string;
  selectedMandiId: string;
  onSelectCrop: (cropId: string) => void;
  onSelectState: (stateId: string) => void;
  onSelectMandi: (mandiId: string) => void;
  isLoadingMandis?: boolean;
}

export const CropSelector: React.FC<CropSelectorProps> = ({
  crops,
  states,
  mandis,
  selectedCropId,
  selectedStateId,
  selectedMandiId,
  onSelectCrop,
  onSelectState,
  onSelectMandi,
  isLoadingMandis = false,
}) => {
  const selectedCrop = crops.find((c) => c.id === selectedCropId);
  const selectedState = states.find((s) => s.id === selectedStateId);
  const selectedMandi = mandis.find((m) => m.id === selectedMandiId);


  // Quick pick favorite crops
  const popularCropIds = ['wheat', 'rice', 'mustard', 'cotton', 'onion', 'tomato'];

  return (
    <div id="filter-section" className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-7 transition-all">
      {/* Header of Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
              1
            </span>
            <span>Select Crop & Regional Mandi</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Follow the 3 simple steps to fetch current rates, historical charts, and AI trend estimates.
          </p>
        </div>

        {/* Prototype label */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/70 text-xs self-start sm:self-auto">
          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Demo Data Prototype</span>
        </div>
      </div>

      {/* Quick Select Crop Chips */}
      <div className="mt-4 pt-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
          Popular Crops (त्वरित चयन):
        </label>
        <div className="flex flex-wrap gap-2">
          {crops
            .filter((c) => popularCropIds.includes(c.id))
            .map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectCrop(c.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCropId === c.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              >
                <span>{c.name}</span>
                <span className="opacity-75 text-[11px]">({c.hindiName})</span>
                {selectedCropId === c.id && <Check className="w-3 h-3 ml-0.5" />}
              </button>
            ))}
        </div>
      </div>

      {/* Main 3-Step Cascading Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-6">
        {/* Step 1: Crop Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Wheat className="w-4 h-4 text-emerald-600" />
            <span>Step 1: Crop (फसल)</span>
          </label>
          <div className="relative">
            <select
              value={selectedCropId}
              onChange={(e) => onSelectCrop(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-300 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer"
            >
              {crops.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {crop.name} — {crop.hindiName} ({crop.category})
                </option>
              ))}
            </select>
          </div>
          {selectedCrop && (
            <p className="text-xs text-slate-500 flex items-center justify-between px-1">
              <span>Category: <strong className="text-slate-700">{selectedCrop.category}</strong></span>
              {selectedCrop.msp && (
                <span>MSP: <strong className="text-emerald-700">₹{selectedCrop.msp.toLocaleString('en-IN')}/Qtl</strong></span>
              )}
            </p>
          )}
        </div>

        {/* Step 2: State Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Step 2: State (राज्य)</span>
          </label>
          <div className="relative">
            <select
              value={selectedStateId}
              onChange={(e) => onSelectState(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-300 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer"
            >
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name} ({state.code})
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-slate-500 px-1">
            Selected State: <strong className="text-slate-700">{selectedState?.name || 'All'}</strong>
          </p>
        </div>

        {/* Step 3: Mandi Selection (Filtered by State) */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Store className="w-4 h-4 text-emerald-600" />
            <span>Step 3: Mandi (मंडी / बाजार)</span>
          </label>
          <div className="relative">
            <select
              value={selectedMandiId}
              onChange={(e) => onSelectMandi(e.target.value)}
              disabled={isLoadingMandis || mandis.length === 0}
              className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-300 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {mandis.map((mandi) => (
                <option key={mandi.id} value={mandi.id}>
                  {mandi.name} — Dist. {mandi.district}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-slate-500 px-1 flex items-center justify-between">
            <span>
              District: <strong className="text-slate-700">{selectedMandi?.district || 'Regional'}</strong>
            </span>
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {mandis.length} markets active
            </span>
          </p>
        </div>
      </div>

      {/* Active Flow Summary Bar */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-emerald-50/60 rounded-xl p-3 border border-emerald-100">
        <div className="flex flex-wrap items-center gap-2 font-medium text-slate-700">
          <span className="text-emerald-800 font-semibold">Active Selection:</span>
          <span className="bg-white px-2.5 py-1 rounded-md border border-emerald-200 text-slate-900 shadow-2xs">
            {selectedCrop?.name} ({selectedCrop?.hindiName})
          </span>
          <span className="text-slate-400">→</span>
          <span className="bg-white px-2.5 py-1 rounded-md border border-emerald-200 text-slate-900 shadow-2xs">
            {selectedState?.name}
          </span>
          <span className="text-slate-400">→</span>
          <span className="bg-white px-2.5 py-1 rounded-md border border-emerald-200 text-slate-900 shadow-2xs font-semibold text-emerald-800">
            {selectedMandi?.name}
          </span>
        </div>

        <div className="text-slate-500 text-[11px]">
          Live query matches 100% of sample dataset
        </div>
      </div>
    </div>
  );
};
