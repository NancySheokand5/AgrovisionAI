import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { LineChart as ChartIcon } from 'lucide-react';
import type { DailyForecastDay } from '../../services/weatherService';

interface WeatherTrendChartProps {
  daily: DailyForecastDay[];
}

export const WeatherTrendChart: React.FC<WeatherTrendChartProps> = ({ daily }) => {
  const [activeTab, setActiveTab] = useState<'temp' | 'rain' | 'et0'>('temp');

  if (!daily || daily.length === 0) return null;

  const chartData = daily.map((d) => ({
    name: d.dayName,
    date: d.date.split('-').slice(1).join('/'),
    maxTemp: d.maxTemp,
    minTemp: d.minTemp,
    rainMm: d.precipitationSum,
    rainChance: d.rainChance,
    et0: d.et0
  }));

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-5">
      {/* Header with metric tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <ChartIcon className="w-5 h-5 text-emerald-600" />
            <span>Farm Weather Trends (7-Day)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Microclimatic progression for planning field tasks and irrigation
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('temp')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'temp'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Temperature
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rain')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'rain'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rainfall
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('et0')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'et0'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ET0 Demand
          </button>
        </div>
      </div>

      {/* Recharts area */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'temp' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis unit="°C" domain={['auto', 'auto']} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg text-xs space-y-1">
                        <div className="font-bold text-slate-300">{label}</div>
                        <div className="text-amber-400">Max Temp: {payload[0]?.value}°C</div>
                        <div className="text-cyan-400">Min Temp: {payload[1]?.value}°C</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area type="monotone" name="Max Temp (°C)" dataKey="maxTemp" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorMax)" />
              <Area type="monotone" name="Min Temp (°C)" dataKey="minTemp" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorMin)" />
            </AreaChart>
          ) : activeTab === 'rain' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis unit="mm" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg text-xs space-y-1">
                        <div className="font-bold text-slate-300">{label}</div>
                        <div className="text-blue-400">Rainfall: {payload[0]?.value} mm</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Bar name="Rainfall (mm)" dataKey="rainMm" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorET" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis unit="mm" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg text-xs space-y-1">
                        <div className="font-bold text-slate-300">{label}</div>
                        <div className="text-emerald-400">FAO-56 ET0: {payload[0]?.value} mm/day</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area type="monotone" name="Evapotranspiration ET0 (mm/day)" dataKey="et0" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#colorET)" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
