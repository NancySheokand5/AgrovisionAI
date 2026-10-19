import React from 'react';
import { AlertTriangle, ShieldCheck, ThermometerSnowflake, Flame, Bug } from 'lucide-react';
import type { WeatherRiskAlert } from '../../data/weatherRules';

interface WeatherAlertsProps {
  alerts: WeatherRiskAlert[];
}

export const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'heat':
        return Flame;
      case 'frost':
        return ThermometerSnowflake;
      case 'disease':
        return Bug;
      default:
        return AlertTriangle;
    }
  };

  return (
    <div className="space-y-3">
      {alerts.map((alert, idx) => {
        const Icon = getAlertIcon(alert.type);
        const isNormal = alert.level === 'Normal';

        return (
          <div
            key={idx}
            className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              isNormal
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : alert.level === 'High Risk'
                ? 'bg-rose-50 border-rose-200 text-rose-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  isNormal
                    ? 'bg-emerald-100 text-emerald-700'
                    : alert.level === 'High Risk'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {isNormal ? <ShieldCheck className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {alert.title}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${alert.badgeClass}`}
                  >
                    {alert.level}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {alert.description}
                </p>
                <div className="mt-2 text-xs font-medium text-slate-700 bg-white/70 p-2.5 rounded-xl border border-slate-200/60">
                  <strong className="text-slate-900">Advisory Action: </strong>
                  <span>{alert.actionAdvice}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
