import React from 'react';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

interface WeatherInsightsProps {
  insights: string[];
}

export const WeatherInsights: React.FC<WeatherInsightsProps> = ({ insights }) => {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            AI Farm Weather Insights
          </h2>
          <p className="text-xs text-slate-400">
            Rule-based agronomic interpretation of live meteorological readings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-start gap-3 hover:border-emerald-200 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {insight}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
