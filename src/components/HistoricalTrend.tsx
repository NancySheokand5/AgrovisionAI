import React from 'react';
import type { Crop, Mandi, HistoricalPricePoint } from '../types';
import { formatCurrency } from '../utils/formatters';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { LineChart as ChartIcon, Info } from 'lucide-react';


interface HistoricalTrendProps {
  crop: Crop;
  mandi: Mandi;
  historyData: HistoricalPricePoint[];
  activePeriod: number; // 7, 30, 90
  onChangePeriod: (days: number) => void;
}

export const HistoricalTrend: React.FC<HistoricalTrendProps> = ({
  crop,
  mandi,
  historyData,
  activePeriod,
  onChangePeriod,
}) => {
  if (!historyData || historyData.length === 0) {
    return null;
  }

  // Calculate high, low, average
  const prices = historyData.map((d) => d.modalPrice);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];
  const netChange = lastPrice - firstPrice;
  const netChangePercent = Math.round((netChange / firstPrice) * 1000) / 10;

  return (
    <div id="price-history" className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-5 sm:p-7 space-y-6">
      {/* Header with period toggle buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ChartIcon className="w-5 h-5 text-emerald-600" />
            <span>Historical Mandi Price Movement</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {crop.name} price trends recorded at {mandi.name}.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => onChangePeriod(7)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activePeriod === 7
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => onChangePeriod(30)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activePeriod === 30
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => onChangePeriod(90)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activePeriod === 90
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3 Months
          </button>
        </div>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-0.5">
            Period Movement
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold text-slate-900 font-mono">
              {netChange >= 0 ? `+${formatCurrency(netChange)}` : `-${formatCurrency(Math.abs(netChange))}`}
            </span>
            <span
              className={`text-xs font-bold px-1.5 py-0.5 rounded-sm ${
                netChange >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {netChange >= 0 ? '+' : ''}{netChangePercent}%
            </span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-0.5">
            Period High
          </span>
          <div className="text-lg font-bold text-slate-900 font-mono">
            {formatCurrency(maxPrice)}
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-0.5">
            Period Low
          </span>
          <div className="text-lg font-bold text-slate-900 font-mono">
            {formatCurrency(minPrice)}
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-0.5">
            Period Average
          </span>
          <div className="text-lg font-bold text-slate-900 font-mono">
            {formatCurrency(avgPrice)}
          </div>
        </div>
      </div>

      {/* Interactive Line/Area Chart */}
      <div className="bg-gradient-to-b from-slate-50/70 to-white rounded-xl p-4 border border-slate-200">
        <div className="h-64 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                domain={['auto', 'auto']}
                tickFormatter={(val) => `₹${val}`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: any) => [`${formatCurrency(Number(value) || 0)} / Qtl`, 'Modal Price']}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#cbd5e1',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="modalPrice"
                stroke="#059669"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#priceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Prototype note */}
      <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>
          <strong>Prototype Data:</strong> Price timeline is derived from historical baseline models to demonstrate charting trends for this module.
        </span>
      </div>
    </div>
  );
};
