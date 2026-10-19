import React, { useState } from 'react';
import type { MandiComparisonItem, Crop } from '../types';
import { formatCurrency } from '../utils/formatters';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  CartesianGrid 
} from 'recharts';
import { BarChart3, ArrowUpDown, Store, Check, Info } from 'lucide-react';


interface MandiComparisonProps {
  crop: Crop;
  comparisons: MandiComparisonItem[];
  selectedMandiId: string;
  onSelectMandi: (mandiId: string) => void;
}

export const MandiComparison: React.FC<MandiComparisonProps> = ({
  crop,
  comparisons,
  selectedMandiId,
  onSelectMandi,
}) => {
  const [sortField, setSortField] = useState<'modalPrice' | 'mandiName' | 'arrivalQuantity'>('modalPrice');
  const [sortAsc, setSortAsc] = useState(false);

  // Sorting helper
  const sortedData = [...comparisons].sort((a, b) => {
    if (sortField === 'mandiName') {
      return sortAsc
        ? a.mandiName.localeCompare(b.mandiName)
        : b.mandiName.localeCompare(a.mandiName);
    }
    const valA = a[sortField];
    const valB = b[sortField];
    return sortAsc ? valA - valB : valB - valA;
  });

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Chart data format
  const chartData = comparisons.map((item) => ({
    name: item.mandiName.replace(' Mandi', '').replace(' APMC', '').replace(' Market', ''),
    fullName: item.mandiName,
    modalPrice: item.modalPrice,
    minPrice: item.minPrice,
    maxPrice: item.maxPrice,
    isSelected: item.mandiId === selectedMandiId,
  }));

  return (
    <div id="price-comparison" className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-5 sm:p-7 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <span>Compare Mandi Prices ({crop.name})</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Objective market rate comparison across regional mandis to help farmers decide where to sell.
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Click any mandi to set as active</span>
        </div>
      </div>

      {/* Visual Bar Comparison Chart */}
      <div className="bg-slate-50/70 rounded-xl p-4 sm:p-5 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Modal Price Comparison (₹ / Quintal)
          </h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" />
              <span>Selected Mandi</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-3 h-3 rounded-xs bg-slate-300 inline-block" />
              <span>Other Mandis</span>
            </span>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: '#475569' }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                domain={['auto', 'auto']}
                tickFormatter={(val) => `₹${val}`}
              />
              <Tooltip
                formatter={(value: any) => [`${formatCurrency(Number(value) || 0)} / Qtl`, 'Modal Price']}
                labelFormatter={(label) => `Market: ${label}`}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#cbd5e1',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="modalPrice" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isSelected ? '#059669' : '#94a3b8'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Regional Mandi Pricing Table
          </h3>
          <span className="text-xs text-slate-500">
            Showing {comparisons.length} markets
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th
                  onClick={() => toggleSort('mandiName')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-200/70 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Mandi / Market</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">State / District</th>
                <th className="py-3 px-4 text-right">Min Price</th>
                <th className="py-3 px-4 text-right">Max Price</th>
                <th
                  onClick={() => toggleSort('modalPrice')}
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-200/70 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Modal Price</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">vs Selected</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {sortedData.map((item) => {
                const isSelected = item.mandiId === selectedMandiId;
                const isHigher = item.differenceVsSelected > 0;
                const isLower = item.differenceVsSelected < 0;

                return (
                  <tr
                    key={item.mandiId}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-emerald-50/70 font-semibold'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <Store className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span>{item.mandiName}</span>
                        {isSelected && (
                          <span className="text-[10px] font-bold uppercase tracking-wide bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-xs">
                      {item.stateName} • Dist. {item.district}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-600 font-mono">
                      {formatCurrency(item.minPrice)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-600 font-mono">
                      {formatCurrency(item.maxPrice)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 font-mono">
                      {formatCurrency(item.modalPrice)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-xs">
                      {isSelected ? (
                        <span className="text-slate-400">— Baseline —</span>
                      ) : isHigher ? (
                        <span className="text-emerald-700 font-medium">
                          +{formatCurrency(item.differenceVsSelected)} ({item.percentDiffVsSelected}%)
                        </span>
                      ) : isLower ? (
                        <span className="text-rose-700 font-medium">
                          -{formatCurrency(Math.abs(item.differenceVsSelected))} ({item.percentDiffVsSelected}%)
                        </span>
                      ) : (
                        <span className="text-slate-500">Same</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {isSelected ? (
                        <span className="inline-flex items-center text-xs text-emerald-700 font-medium">
                          <Check className="w-4 h-4 mr-1 text-emerald-600" /> Active
                        </span>
                      ) : (
                        <button
                          onClick={() => onSelectMandi(item.mandiId)}
                          className="px-2.5 py-1 text-xs font-medium rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                        >
                          Select
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
