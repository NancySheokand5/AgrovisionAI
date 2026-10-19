import React from 'react';
import { TrendingUp, TrendingDown, Minus, ChevronRight, Store } from 'lucide-react';
import type { MandiPriceSummaryItem } from '../../types/dashboard';

interface MandiPriceSummaryCardProps {
  items: MandiPriceSummaryItem[];
  onViewMarket: () => void;
}

function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}

export const MandiPriceSummaryCard: React.FC<MandiPriceSummaryCardProps> = ({
  items,
  onViewMarket,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
            <Store className="w-4.5 h-4.5 text-teal-600" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Mandi Prices</h2>
        </div>
        <button
          onClick={onViewMarket}
          className="flex items-center gap-1 text-xs text-teal-600 font-semibold hover:text-teal-700 transition-colors"
        >
          Full Market <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Price items */}
      <div className="space-y-2.5">
        {items.map((item) => (
          <div
            key={item.cropId}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-teal-50/40 transition-colors border border-slate-100 cursor-pointer"
            onClick={onViewMarket}
          >
            {/* Emoji */}
            <div className="w-9 h-9 flex items-center justify-center bg-white rounded-xl shadow-sm text-xl flex-shrink-0">
              {item.cropEmoji}
            </div>

            {/* Name + mandi */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-800">{item.cropName}</div>
              <div className="text-[11px] text-slate-400">{item.mandi}</div>
            </div>

            {/* Price + trend */}
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-bold text-slate-900">
                {formatPrice(item.currentPrice)}
              </div>
              <div className="text-[10px] text-slate-400 mb-0.5">/ {item.unit}</div>
              <div className={`flex items-center justify-end gap-0.5 text-[11px] font-semibold ${
                item.trend === 'up'
                  ? 'text-emerald-600'
                  : item.trend === 'down'
                  ? 'text-red-500'
                  : 'text-slate-400'
              }`}>
                {item.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                {item.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                {item.trend === 'stable' && <Minus className="w-3 h-3" />}
                Pred: {formatPrice(item.predictedPrice)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prediction note */}
      <div className="px-3 py-2 bg-teal-50 rounded-xl border border-teal-100">
        <p className="text-[11px] text-teal-700 font-medium">
          💡 AI price predictions are based on historical trends. Check the Mandi module for detailed analysis.
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={onViewMarket}
        className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors active:scale-[0.98] shadow-sm shadow-teal-600/20"
      >
        View Market Prices
      </button>
    </div>
  );
};
