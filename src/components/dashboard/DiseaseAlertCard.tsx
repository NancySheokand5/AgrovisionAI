import React from 'react';
import { AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';
import type { DiseaseAlert, AlertSeverity } from '../../types/dashboard';

interface DiseaseAlertCardProps {
  alerts: DiseaseAlert[];
  onCheckCrop?: (alertId: string) => void;
}

const severityConfig: Record<AlertSeverity, {
  border: string; bg: string; badge: string; icon: string; pulse: string;
}> = {
  High: {
    border: 'border-red-200',
    bg: 'bg-red-50',
    badge: 'bg-red-100 text-red-700',
    icon: 'text-red-500',
    pulse: 'bg-red-500',
  },
  Medium: {
    border: 'border-amber-200',
    bg: 'bg-amber-50',
    badge: 'bg-amber-100 text-amber-700',
    icon: 'text-amber-500',
    pulse: 'bg-amber-500',
  },
  Low: {
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    badge: 'bg-blue-100 text-blue-700',
    icon: 'text-blue-500',
    pulse: 'bg-blue-500',
  },
};

export const DiseaseAlertCard: React.FC<DiseaseAlertCardProps> = ({ alerts, onCheckCrop }) => {
  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4.5 h-4.5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900">Crop Health Alerts</h2>
        </div>
        <div className="text-center py-4 text-slate-400">
          <div className="text-3xl mb-2">✅</div>
          <p className="text-sm font-medium">No alerts right now</p>
          <p className="text-xs text-slate-400 mt-1">Your crops look great!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4.5 h-4.5 text-amber-600" />
          <h2 className="text-base font-bold text-slate-900">Crop Health Alerts</h2>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-amber-700">{alerts.length} Alert{alerts.length > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="space-y-3">
        {alerts.map((alert) => {
          const cfg = severityConfig[alert.severity];
          return (
            <div
              key={alert.id}
              className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}
            >
              {/* Alert header */}
              <div className="flex items-start gap-3 mb-2">
                <div className="flex-shrink-0 mt-0.5">
                  <AlertTriangle className={`w-4.5 h-4.5 ${cfg.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-sm font-bold text-slate-800">
                      {alert.cropEmoji} {alert.alertTitle}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${cfg.badge}`}>
                      {alert.severity} Risk
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{alert.description}</p>
                </div>
              </div>

              {/* Recommended action */}
              <div className="bg-white/70 rounded-lg px-3 py-2 mb-3">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-0.5">
                  Recommended Action
                </div>
                <p className="text-xs text-slate-700">{alert.recommendedAction}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                {alert.affectedArea && (
                  <span className="text-[11px] text-slate-500">📍 {alert.affectedArea} acres affected</span>
                )}
                <button
                  onClick={() => onCheckCrop?.(alert.id)}
                  className={`flex items-center gap-1.5 ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors active:scale-[0.98] ${
                    alert.severity === 'High'
                      ? 'bg-red-500 hover:bg-red-600'
                      : alert.severity === 'Medium'
                      ? 'bg-amber-500 hover:bg-amber-600'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  Check Crop
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note */}
      <p className="text-[11px] text-slate-400 text-center">
        Alerts are advisory only. Use the Crop Disease Detection feature for confirmed diagnosis.
      </p>
    </div>
  );
};
