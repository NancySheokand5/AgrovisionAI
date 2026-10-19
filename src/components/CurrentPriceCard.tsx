import React from 'react';
import type { Crop, Mandi, MandiPriceRecord } from '../types';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { 
  Store, 
  MapPin, 
  Clock, 
  AlertCircle, 
  Scale, 
  Truck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';


interface CurrentPriceCardProps {
  crop: Crop;
  mandi: Mandi;
  stateName: string;
  priceRecord: MandiPriceRecord;
  onCompareClick: () => void;
  onPredictClick: () => void;
  isLoading?: boolean;
}

export const CurrentPriceCard: React.FC<CurrentPriceCardProps> = ({
  crop,
  mandi,
  stateName,
  priceRecord,
  onCompareClick,
  onPredictClick,
  isLoading = false,
}) => {

  const spread = priceRecord.maxPrice - priceRecord.minPrice;
  // Calculate percentage position of modal price within [min, max]
  const spreadPercent =
    spread > 0
      ? Math.min(100, Math.max(0, ((priceRecord.modalPrice - priceRecord.minPrice) / spread) * 100))
      : 50;

  return (
    <div
      id="mandi-prices"
      className={`bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden transition-all duration-300 ${
        isLoading ? 'opacity-70 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Banner with Crop & Mandi Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-850 text-white px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-700/80 text-emerald-100 border border-emerald-500/30">
                {crop.category}
              </span>
              <span className="text-xs text-emerald-200">
                Unit: {crop.standardUnit}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{crop.name}</span>
              <span className="text-emerald-200 font-normal text-xl sm:text-2xl">
                ({crop.hindiName})
              </span>
            </h2>
            <div className="flex items-center gap-4 text-xs sm:text-sm text-emerald-100/90 pt-0.5">
              <span className="flex items-center gap-1">
                <Store className="w-4 h-4 text-emerald-300" />
                <strong>{mandi.name}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-emerald-300" />
                {mandi.district}, {stateName}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={onCompareClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
            >
              <span>Compare Mandis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onPredictClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Predict</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Pricing Breakdown */}
      <div className="p-6 sm:p-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Modal / Main Price Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-50/70 to-teal-50/50 rounded-2xl p-5 border border-emerald-200/80 text-center lg:text-left">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              Current Modal Price (औसत थोक भाव)
            </span>
            <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              {formatCurrency(priceRecord.modalPrice)}
            </div>
            <div className="text-sm font-semibold text-emerald-700 mt-1">
              per Quintal (100 kg)
            </div>

            {crop.msp && (
              <div className="mt-3 pt-3 border-t border-emerald-200/70 flex items-center justify-between text-xs text-slate-600">
                <span>Govt. Minimum Support Price (MSP):</span>
                <span className="font-bold text-slate-800">
                  {formatCurrency(crop.msp)} / Qtl
                </span>
              </div>
            )}
          </div>

          {/* Min / Max Range & Metrics */}
          <div className="lg:col-span-7 space-y-4">
            {/* Visual Range Bar */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-500 mb-2">
                <span>Min Price: <strong className="text-slate-800">{formatCurrency(priceRecord.minPrice)}</strong></span>
                <span className="text-emerald-700">Modal: {formatCurrency(priceRecord.modalPrice)}</span>
                <span>Max Price: <strong className="text-slate-800">{formatCurrency(priceRecord.maxPrice)}</strong></span>
              </div>

              {/* Range Progress Track */}
              <div className="relative w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 bottom-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"
                  style={{ width: `${Math.max(15, spreadPercent)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                <span>Spread: <strong>{formatCurrency(spread)}</strong></span>
                <span className="text-[11px] text-slate-400">Quality-dependent daily variance</span>
              </div>
            </div>

            {/* Additional Market Information Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Today's Arrivals</span>
                </div>
                <div className="text-base font-bold text-slate-800">
                  {formatNumber(priceRecord.arrivalQuantity)}{' '}
                  <span className="text-xs font-normal text-slate-500">Qtl</span>
                </div>
              </div>

              <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Scale className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Trade Grade</span>
                </div>
                <div className="text-base font-bold text-slate-800 truncate" title={priceRecord.grade}>
                  {priceRecord.grade}
                </div>
              </div>

              <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Last Updated</span>
                </div>
                <div className="text-xs font-semibold text-slate-700 mt-0.5">
                  Today (Session Demo)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prototype Transparency Notice */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              <strong>Note:</strong> Prototype Demonstration Data. Prices are modeled for academic/hackathon showcase and do not represent live government APMC bids.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
