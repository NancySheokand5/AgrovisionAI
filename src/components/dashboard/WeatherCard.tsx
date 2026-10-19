import React from 'react';
import { Wind, Droplets, Umbrella, Eye, ThermometerSun, ChevronRight } from 'lucide-react';
import type { WeatherData, WeatherCondition } from '../../types/dashboard';

interface WeatherCardProps {
  weather: WeatherData;
  onViewDetails?: () => void;
}

function getWeatherEmoji(condition: WeatherCondition): string {
  const map: Record<WeatherCondition, string> = {
    'Sunny': '☀️',
    'Partly Cloudy': '⛅',
    'Cloudy': '☁️',
    'Light Rain': '🌦',
    'Heavy Rain': '🌧',
    'Foggy': '🌫',
    'Windy': '💨',
    'Thunderstorm': '⛈',
  };
  return map[condition] ?? '🌤';
}

function getActivityColor(text: string): string {
  if (text.toLowerCase().includes('good')) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (text.toLowerCase().includes('avoid')) return 'text-red-700 bg-red-50 border-red-200';
  return 'text-amber-700 bg-amber-50 border-amber-200';
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, onViewDetails }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">Today's Weather</h2>
        {onViewDetails ? (
          <button
            type="button"
            onClick={onViewDetails}
            className="flex items-center gap-1 text-xs text-emerald-600 font-semibold hover:text-emerald-700 transition-colors cursor-pointer"
          >
            Intelligence <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <span className="text-xs text-slate-400">Live</span>
        )}
      </div>

      {/* Main temp + condition */}
      <div className="flex items-center gap-4">
        <div className="text-5xl">{getWeatherEmoji(weather.condition)}</div>
        <div>
          <div className="flex items-end gap-1">
            <span className="text-4xl font-bold text-slate-800">{weather.temperature}</span>
            <span className="text-2xl text-slate-400 mb-0.5">°C</span>
          </div>
          <div className="text-sm text-slate-500">{weather.condition}</div>
          <div className="text-xs text-slate-400">Feels like {weather.feelsLike}°C</div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 bg-sky-50 rounded-xl p-2.5">
          <Droplets className="w-4 h-4 text-sky-500 flex-shrink-0" />
          <div>
            <div className="text-xs text-sky-600 font-medium leading-none">{weather.humidity}%</div>
            <div className="text-[10px] text-sky-500 mt-0.5">Humidity</div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-2.5">
          <Wind className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <div>
            <div className="text-xs text-slate-700 font-medium leading-none">{weather.windSpeed} km/h</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Wind {weather.windDirection}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 rounded-xl p-2.5">
          <Umbrella className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <div>
            <div className="text-xs text-blue-600 font-medium leading-none">{weather.rainProbability}%</div>
            <div className="text-[10px] text-blue-500 mt-0.5">Rain Chance</div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 rounded-xl p-2.5">
          <ThermometerSun className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <div>
            <div className="text-xs text-amber-700 font-medium leading-none">UV {weather.uvIndex}</div>
            <div className="text-[10px] text-amber-500 mt-0.5">UV Index</div>
          </div>
        </div>
      </div>

      {/* Activity suitability */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium ${getActivityColor(weather.activitySuitability)}`}>
        <Eye className="w-3.5 h-3.5 flex-shrink-0" />
        {weather.activitySuitability}
      </div>

      {/* 5-day forecast */}
      <div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">5-Day Forecast</div>
        <div className="grid grid-cols-5 gap-1">
          {weather.forecast.map((day) => (
            <div key={day.day} className="flex flex-col items-center gap-0.5 p-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 transition-colors">
              <span className="text-[10px] text-slate-500 font-medium">{day.day}</span>
              <span className="text-base">{day.icon}</span>
              <span className="text-[10px] font-bold text-slate-700">{day.high}°</span>
              <span className="text-[10px] text-slate-400">{day.low}°</span>
              {day.rainChance > 30 && (
                <span className="text-[9px] text-blue-500 font-medium">{day.rainChance}%</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
