import React from 'react';
import { MapPin, Leaf, Tractor, Clock, Sun, Sunset } from 'lucide-react';
import type { FarmerProfile, FarmHealthSummary } from '../../types/dashboard';

interface WelcomeSectionProps {
  farmer: FarmerProfile;
  farmHealth: FarmHealthSummary;
}

function getGreeting(): { text: string; icon: React.ReactNode } {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good Morning', icon: <Sun className="w-5 h-5 text-amber-500" /> };
  if (hour < 17) return { text: 'Good Afternoon', icon: <Sun className="w-5 h-5 text-orange-400" /> };
  return { text: 'Good Evening', icon: <Sunset className="w-5 h-5 text-orange-500" /> };
}

function formatLastUpdated(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ farmer, farmHealth }) => {
  const greeting = getGreeting();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 px-6 py-6 sm:px-8 sm:py-7 text-white shadow-xl shadow-emerald-700/20">
      {/* Decorative blobs */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 blur-xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-6 w-36 h-36 rounded-full bg-teal-400/10 blur-xl pointer-events-none" />
      {/* Leaf pattern decoration */}
      <div className="absolute top-4 right-6 opacity-10 text-8xl select-none pointer-events-none">🌿</div>

      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left: greeting + info */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            {greeting.icon}
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {greeting.text}, {farmer.name.split(' ')[0]} 👋
            </h1>
          </div>
          <p className="text-emerald-100 text-sm mb-4">
            Here's what's happening on your farm today.
          </p>

          {/* Farm metadata pills */}
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur rounded-full px-3 py-1 text-sm font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-200" />
              {farmer.location}
            </span>
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur rounded-full px-3 py-1 text-sm font-medium">
              <Leaf className="w-3.5 h-3.5 text-emerald-200" />
              {farmer.currentSeason} Season {farmer.seasonYear}
            </span>
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur rounded-full px-3 py-1 text-sm font-medium">
              <Tractor className="w-3.5 h-3.5 text-emerald-200" />
              {farmer.farmSize} {farmer.farmSizeUnit}
            </span>
          </div>
        </div>

        {/* Right: Farm health score */}
        <div className="flex-shrink-0">
          <div className="bg-white/10 backdrop-blur rounded-2xl px-5 py-4 text-center border border-white/20">
            <div className="text-3xl font-bold">{farmHealth.overallScore}%</div>
            <div className="text-emerald-100 text-xs font-medium mt-0.5">Farm Health</div>
            <div className={`mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold inline-block ${
              farmHealth.label === 'Healthy' || farmHealth.label === 'Excellent'
                ? 'bg-emerald-400/30 text-emerald-100'
                : farmHealth.label === 'Needs Attention'
                ? 'bg-amber-400/30 text-amber-100'
                : 'bg-red-400/30 text-red-100'
            }`}>
              {farmHealth.label}
            </div>
            <div className="flex items-center justify-center gap-1 mt-2 text-emerald-200 text-[10px]">
              <Clock className="w-3 h-3" />
              Updated {formatLastUpdated(farmHealth.lastUpdated)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
