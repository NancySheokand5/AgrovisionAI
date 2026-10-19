import React from 'react';
import { Calendar } from 'lucide-react';
import type { IrrigationAdviceResult } from '../../services/irrigationService';

interface IrrigationTimelineProps {
  result: IrrigationAdviceResult;
}

export const IrrigationTimeline: React.FC<IrrigationTimelineProps> = ({ result }) => {
  const { timeline, recommendation, inputs } = result;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Calendar className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Irrigation Sequence Timeline</h2>
            <p className="text-xs text-slate-500">
              Tracking cycle from previous watering through next scheduled moisture review
            </p>
          </div>
        </div>
      </div>

      {/* 3-Step Timeline Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        
        {/* Step 1: Past */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 relative">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[11px] font-bold">
              1
            </span>
            <span>Previous Irrigation</span>
          </div>
          <div className="text-base font-bold text-slate-800">
            {timeline.previous.date}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {inputs.daysSinceIrrigation === 0
              ? 'Applied today'
              : `${inputs.daysSinceIrrigation} days of continuous crop transpiration`}
          </p>
        </div>

        {/* Step 2: Today (Active) */}
        <div className="bg-blue-50/70 rounded-2xl p-5 border-2 border-blue-500/50 shadow-sm relative">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">
              2
            </span>
            <span>Today's Action</span>
          </div>
          <div className="text-base font-bold text-blue-900">
            {timeline.current.status}
          </div>
          <p className="text-xs text-blue-700 mt-1">
            {recommendation.suggestedWindow}
          </p>
        </div>

        {/* Step 3: Next */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 relative">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[11px] font-bold">
              3
            </span>
            <span>Next Review</span>
          </div>
          <div className="text-base font-bold text-slate-800">
            {timeline.next.date}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {timeline.next.projectedAction}
          </p>
        </div>

      </div>

    </div>
  );
};
