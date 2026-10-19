import React from 'react';
import {
  Droplets,
  Wind,
  CloudRain,
  Sun,
  Sunrise,
  Sunset,
  Layers,
  Sprout,
  Activity
} from 'lucide-react';
import type { CurrentAgroWeather, LocationInfo } from '../../services/weatherService';

interface CurrentWeatherCardProps {
  current: CurrentAgroWeather;
  location: LocationInfo;
  todayET0: number;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  current,
  location,
  todayET0,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6">
      
      {/* Header with location and live badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold text-slate-900">
              {location.name}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              {location.state || location.country}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Agricultural Microclimate Feed • Updated at {current.lastUpdated}
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Station</span>
        </div>
      </div>

      {/* Main Temperature and Primary Status Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Large Temp Display */}
        <div className="md:col-span-2 flex items-center gap-6">
          <div className="text-6xl sm:text-7xl shrink-0">
            {current.icon}
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
                {current.temperature}°
              </span>
              <span className="text-2xl text-slate-400 font-medium">C</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-800 mt-1">
              {current.condition}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Feels like <strong className="text-slate-700">{current.feelsLike}°C</strong>
            </div>
          </div>
        </div>

        {/* Highlight Atmospheric Evaporative Demand (ET0) */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50/60 border border-sky-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-sky-800 font-bold uppercase tracking-wider mb-1">
              <span>Reference ET (ET0)</span>
              <Activity className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-3xl font-black text-sky-950 font-mono mt-1">
              {todayET0} <span className="text-sm font-semibold text-sky-700">mm/day</span>
            </div>
          </div>
          <p className="text-[11px] text-sky-700/90 leading-tight mt-2">
            FAO-56 Penman-Monteith evaporative atmospheric demand for the farm.
          </p>
        </div>

      </div>

      {/* Key Meteorological Parameters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        
        {/* Relative Humidity */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <Droplets className="w-3.5 h-3.5 text-sky-500" />
            <span>Humidity</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-800 font-mono">
            {current.humidity}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {current.humidity > 75 ? 'Humid' : current.humidity < 35 ? 'Arid' : 'Moderate'}
          </div>
        </div>

        {/* Wind Speed & Compass */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <Wind className="w-3.5 h-3.5 text-slate-500" />
            <span>Wind</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-800 font-mono">
            {current.windSpeed} <span className="text-xs font-normal">km/h</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Direction: <strong className="text-slate-600">{current.windDirection}</strong>
          </div>
        </div>

        {/* Precipitation / Rain */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <CloudRain className="w-3.5 h-3.5 text-blue-500" />
            <span>Precipitation</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-800 font-mono">
            {current.precipitation} <span className="text-xs font-normal">mm</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Rain: {current.rain} mm
          </div>
        </div>

        {/* UV Radiation Index */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>UV Index</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-800 font-mono">
            {current.uvIndex !== null ? current.uvIndex : 'Not available'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {current.uvIndex !== null && current.uvIndex >= 6 ? 'High solar exposure' : 'Mild exposure'}
          </div>
        </div>

      </div>

      {/* Soil Microclimate & Solar Horizon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1 border-t border-slate-100">
        
        {/* Soil Moisture */}
        <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
            <Sprout className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Soil Moisture (0-7cm)</div>
            <div className="text-sm font-bold text-slate-900 font-mono">
              {current.soilMoisture !== null ? `${current.soilMoisture}%` : 'Not available'}
            </div>
          </div>
        </div>

        {/* Soil Temperature */}
        <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Soil Temp (0-10cm)</div>
            <div className="text-sm font-bold text-slate-900 font-mono">
              {current.soilTemperature !== null ? `${current.soilTemperature}°C` : 'Not available'}
            </div>
          </div>
        </div>

        {/* Sunrise */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-200/70 text-slate-700">
            <Sunrise className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Sunrise</div>
            <div className="text-sm font-bold text-slate-900 font-mono">{current.sunrise}</div>
          </div>
        </div>

        {/* Sunset */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-200/70 text-slate-700">
            <Sunset className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Sunset</div>
            <div className="text-sm font-bold text-slate-900 font-mono">{current.sunset}</div>
          </div>
        </div>

      </div>

    </div>
  );
};
