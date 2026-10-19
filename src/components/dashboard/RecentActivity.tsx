import React from 'react';
import type { ActivityItem } from '../../types/dashboard';

interface RecentActivityProps {
  activities: ActivityItem[];
}

function formatTimestamp(iso: string): { label: string; time: string } {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / (24 * 3600 * 1000));
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor(diff / 60000);

  let label: string;
  if (days === 0) label = 'Today';
  else if (days === 1) label = 'Yesterday';
  else {
    label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }

  let time: string;
  if (mins < 60) time = `${mins}m ago`;
  else if (hours < 24) time = `${hours}h ago`;
  else time = `${days}d ago`;

  return { label, time };
}

const categoryColors: Record<string, string> = {
  Health: 'bg-emerald-100 text-emerald-700',
  Market: 'bg-teal-100 text-teal-700',
  Irrigation: 'bg-sky-100 text-sky-700',
  Disease: 'bg-red-100 text-red-700',
  AI: 'bg-slate-100 text-slate-700',
  Weather: 'bg-blue-100 text-blue-700',
};

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  // Group by day label
  const grouped: { label: string; items: (ActivityItem & { time: string })[] }[] = [];
  activities.forEach((act) => {
    const { label, time } = formatTimestamp(act.timestamp);
    const existing = grouped.find((g) => g.label === label);
    const item = { ...act, time };
    if (existing) {
      existing.items.push(item);
    } else {
      grouped.push({ label, items: [item] });
    }
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
      <h2 className="text-base font-bold text-slate-900">Recent Farm Activity</h2>

      <div className="space-y-4">
        {grouped.map((group) => (
          <div key={group.label}>
            {/* Day header */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {group.label}
              </span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Activity items */}
            <div className="space-y-2">
              {group.items.map((act, idx) => (
                <div key={act.id} className="flex items-start gap-3">
                  {/* Timeline connector */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-base">
                      {act.icon}
                    </div>
                    {idx < group.items.length - 1 && (
                      <div className="w-px h-4 bg-slate-100 mt-1" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-800">{act.action}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${categoryColors[act.category] ?? 'bg-slate-100 text-slate-600'}`}>
                          {act.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 flex-shrink-0">{act.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{act.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-6 text-slate-400">
          <div className="text-3xl mb-2">📋</div>
          <p className="text-sm">No recent activity</p>
        </div>
      )}
    </div>
  );
};
