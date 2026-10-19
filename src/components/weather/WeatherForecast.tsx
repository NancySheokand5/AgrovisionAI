import React from 'react';
import { Calendar, Umbrella } from 'lucide-react';
import type { DailyForecastDay } from '../../services/weatherService';

interface WeatherForecastProps {
  forecast: DailyForecastDay[];
}

export const WeatherForecast: React.FC<WeatherForecastProps> = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              7-Day Farm Weather Forecast
            </h2>
            <p className="text-xs text-slate-400">
              Atmospheric forecast and daily evaporative demand outlook
            </p>
          </div>
        </div>
      </div>

      {/* Responsive Horizontal Scroll / Grid container */}
      <div className="overflow-x-auto pb-2 scrollbar-thin">
        <div className="grid grid-flow-col auto-cols-[140px] sm:auto-cols-fr gap-2.5 min-w-[700px] sm:min-w-0">
          {forecast.map((day, idx) => {
            const isToday = idx === 0;

            return (
              <div
                key={day.date}
                className={`p-3.5 rounded-2xl border transition-all text-center flex flex-col justify-between ${
                  isToday
                    ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50 hover:border-emerald-200'
                }`}
              >
                {/* Day Header */}
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className={`text-xs font-bold ${isToday ? 'text-emerald-900' : 'text-slate-800'}`}>
                      {day.dayName}
                    </span>
                    {isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {day.date.split('-').slice(1).join('/')}
                  </div>
                </div>

                {/* Weather Emoji & Condition */}
                <div className="py-2.5">
                  <div className="text-3xl mb-1">{day.icon}</div>
                  <div className="text-[11px] font-medium text-slate-700 truncate" title={day.condition}>
                    {day.condition}
                  </div>
                </div>

                {/* High / Low Temp */}
                <div className="flex items-baseline justify-center gap-2 text-xs font-mono py-1 border-t border-slate-200/60">
                  <span className="font-extrabold text-slate-900">{day.maxTemp}°</span>
                  <span className="text-slate-400 font-normal">{day.minTemp}°</span>
                </div>

                {/* Rain probability & precipitation */}
                <div className="mt-2 space-y-1 text-[10px]">
                  <div className="flex items-center justify-between px-1 text-blue-600 font-medium">
                    <span className="flex items-center gap-0.5">
                      <Umbrella className="w-3 h-3" />
                      <span>Rain</span>
                    </span>
                    <span className="font-bold">{day.rainChance}%</span>
                  </div>

                  {day.precipitationSum > 0 ? (
                    <div className="text-[10px] font-semibold text-blue-700 bg-blue-50 py-0.5 rounded">
                      {day.precipitationSum} mm
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400">0.0 mm</div>
                  )}

                  {/* Daily ET0 */}
                  <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between px-1 text-[10px] text-sky-700">
                    <span className="text-slate-400">ET0</span>
                    <span className="font-bold font-mono">{day.et0} mm</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
