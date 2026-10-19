import React from 'react';
import { MapPin } from 'lucide-react';
import type { FarmSection, CropHealthStatus } from '../../types/dashboard';

interface FarmMapOverviewProps {
  sections: FarmSection[];
  farmerName: string;
  location: string;
  totalAcres: number;
}

const statusColors: Record<CropHealthStatus, { bg: string; border: string; text: string; dot: string }> = {
  Excellent: {
    bg: 'bg-emerald-100',
    border: 'border-emerald-300',
    text: 'text-emerald-800',
    dot: 'bg-emerald-500',
  },
  Healthy: {
    bg: 'bg-green-100',
    border: 'border-green-300',
    text: 'text-green-800',
    dot: 'bg-green-500',
  },
  'Needs Attention': {
    bg: 'bg-amber-100',
    border: 'border-amber-300',
    text: 'text-amber-800',
    dot: 'bg-amber-500',
  },
  Critical: {
    bg: 'bg-red-100',
    border: 'border-red-300',
    text: 'text-red-800',
    dot: 'bg-red-500',
  },
};

// Simple grid-based visual farm map (4 columns × 3 rows)
const COLS = 4;
const ROWS = 3;

export const FarmMapOverview: React.FC<FarmMapOverviewProps> = ({
  sections,
  farmerName: _farmerName,
  location,
  totalAcres,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Farm Overview</h2>
          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-400">
            <MapPin className="w-3 h-3" />
            {location}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-slate-700">{totalAcres}</div>
          <div className="text-xs text-slate-400">total acres</div>
        </div>
      </div>

      {/* Visual grid map */}
      <div className="relative">
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, minmax(5rem, auto))`,
          }}
        >
          {sections.map((sec) => {
            const cfg = statusColors[sec.healthStatus];
            return (
              <div
                key={sec.id}
                className={`rounded-xl border-2 p-2.5 flex flex-col justify-between transition-all hover:scale-[1.02] cursor-pointer ${cfg.bg} ${cfg.border}`}
                style={{
                  gridColumn: `${sec.x + 1} / span ${sec.w}`,
                  gridRow: `${sec.y + 1} / span ${sec.h}`,
                }}
              >
                {/* Top: field label + health dot */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                    {sec.label}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                </div>

                {/* Center: crop emoji */}
                <div className="flex-1 flex items-center justify-center py-1">
                  <span className="text-2xl">{sec.cropEmoji}</span>
                </div>

                {/* Bottom: name + area */}
                <div>
                  <div className={`text-xs font-bold ${cfg.text} leading-none`}>
                    {sec.cropName}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{sec.area} acres</div>
                </div>
              </div>
            );
          })}

          {/* Empty/filler cells to complete the grid */}
          {Array.from({
            length: COLS * ROWS - sections.reduce((acc, s) => acc + s.w * s.h, 0),
          }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center"
            >
              <span className="text-slate-300 text-xl">+</span>
            </div>
          ))}
        </div>

        {/* Farm border overlay */}
        <div className="absolute inset-0 rounded-xl border-2 border-slate-200 pointer-events-none" />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[11px] text-slate-500 font-medium">Health:</span>
        {(Object.keys(statusColors) as CropHealthStatus[]).map((status) => (
          <div key={status} className="flex items-center gap-1">
            <div className={`w-2.5 h-2.5 rounded-full ${statusColors[status].dot}`} />
            <span className="text-[11px] text-slate-600">{status}</span>
          </div>
        ))}
      </div>

      {/* Note */}
      <p className="text-[11px] text-slate-400 text-center">
        Tap any field to view detailed crop information
      </p>
    </div>
  );
};
