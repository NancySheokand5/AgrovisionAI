import React from 'react';
import { Sparkles, Bot, ChevronRight, AlertCircle, Clock } from 'lucide-react';
import type { AIAdvisorMessage } from '../../types/dashboard';

interface AIAdvisorCardProps {
  messages: AIAdvisorMessage[];
  onViewAdvisory?: () => void;
}

const priorityConfig = {
  High: { border: 'border-l-red-400', bg: 'bg-red-50', badge: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  Medium: { border: 'border-l-amber-400', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  Low: { border: 'border-l-emerald-400', bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
};

const categoryEmoji: Record<string, string> = {
  Disease: '🦠',
  Weather: '🌦',
  Irrigation: '💧',
  Fertilizer: '🧪',
  Market: '📈',
  Pest: '🐛',
  General: '💡',
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export const AIAdvisorCard: React.FC<AIAdvisorCardProps> = ({ messages, onViewAdvisory }) => {
  const primary = messages[0];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 rounded-2xl shadow-xl shadow-slate-900/20 p-5 sm:p-6 text-white flex flex-col gap-5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-emerald-600/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-4 w-28 h-28 rounded-full bg-teal-600/10 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold">AgroVision AI Advisor</h2>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400">AI-powered farm guidance</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-full font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Active
        </span>
      </div>

      {/* Primary message */}
      {primary && (
        <div className="relative bg-white/8 rounded-xl p-4 border border-white/10">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-xl flex-shrink-0">{categoryEmoji[primary.category] ?? '💡'}</span>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-bold text-white">{primary.title}</h3>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${priorityConfig[primary.priority].badge}`}>
                  {primary.priority}
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{primary.summary}</p>
            </div>
          </div>

          {/* Recommendation box */}
          <div className="bg-emerald-500/15 border border-emerald-500/25 rounded-lg px-3 py-2.5">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wide mb-0.5">
                  AI Recommendation
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{primary.recommendation}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 mt-2 text-slate-500 text-[10px]">
            <Clock className="w-3 h-3" />
            {timeAgo(primary.timestamp)}
            {primary.affectedCrops.length > 0 && (
              <span className="ml-2 text-slate-500">· Affects: {primary.affectedCrops.join(', ')}</span>
            )}
          </div>
        </div>
      )}

      {/* More tips count */}
      {messages.length > 1 && (
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <Sparkles className="w-3 h-3 text-emerald-500" />
          <span>{messages.length - 1} more recommendation{messages.length - 1 > 1 ? 's' : ''} available</span>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={onViewAdvisory}
        className="relative w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-semibold transition-all active:scale-[0.98] shadow-lg shadow-emerald-600/20 cursor-pointer"
      >
        <Bot className="w-4 h-4" />
        Chat with AI Advisor
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
