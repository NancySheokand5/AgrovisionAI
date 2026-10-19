import React from 'react';
import { Sprout, Sparkles, SlidersHorizontal, ScanLine } from 'lucide-react';

interface HeaderProps {
  onNavClick: (sectionId: string) => void;
  onNavigateToRecommendation?: () => void;
  onNavigateToDisease?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavClick,
  onNavigateToRecommendation,
  onNavigateToDisease,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  AgroVision <span className="text-emerald-600">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  Mandi Module
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                Mandi Crop Price & AI Prediction
              </p>
            </div>
          </div>

          {/* Nav Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onNavClick('mandi-prices')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              Mandi Prices
            </button>
            <button
              onClick={() => onNavClick('price-comparison')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              Price Comparison
            </button>
            <button
              onClick={() => onNavClick('price-history')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              Historical Trends
            </button>
            <button
              onClick={() => onNavClick('ai-prediction')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 transition-colors border border-emerald-200/60"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              AI Prediction
            </button>
            {onNavigateToRecommendation && (
              <button
                onClick={onNavigateToRecommendation}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-emerald-800 bg-emerald-100/60 hover:bg-emerald-100 transition-colors border border-emerald-300 shadow-2xs"
                title="Open AI Crop Recommendation"
              >
                <Sprout className="w-4 h-4 text-emerald-700" />
                <span>Crop Recommendation</span>
              </button>
            )}
            {onNavigateToDisease && (
              <button
                onClick={onNavigateToDisease}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200 shadow-2xs"
                title="Open Crop Disease Detection"
              >
                <ScanLine className="w-4 h-4 text-rose-700" />
                <span>Disease Detection</span>
              </button>
            )}
          </nav>

          {/* Quick Info & Demo Chip */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/80">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Prototype Demo</span>
            </div>

            <button
              onClick={() => onNavClick('filter-section')}
              title="Filter and preferences"
              className="p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
              aria-label="Settings and Filters"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 px-2 py-2 bg-slate-50/80 text-xs font-medium text-slate-600">
        <button
          onClick={() => onNavClick('mandi-prices')}
          className="px-2 py-1 hover:text-emerald-600 transition-colors"
        >
          Prices
        </button>
        <button
          onClick={() => onNavClick('price-comparison')}
          className="px-2 py-1 hover:text-emerald-600 transition-colors"
        >
          Compare
        </button>
        <button
          onClick={() => onNavClick('price-history')}
          className="px-2 py-1 hover:text-emerald-600 transition-colors"
        >
          History
        </button>
        <button
          onClick={() => onNavClick('ai-prediction')}
          className="flex items-center gap-1 px-2 py-1 font-semibold text-emerald-700 hover:text-emerald-800"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Predict
        </button>
        {onNavigateToRecommendation && (
          <button
            onClick={onNavigateToRecommendation}
            className="flex items-center gap-1 px-2 py-1 font-semibold text-emerald-800 bg-emerald-100 rounded"
          >
            <Sprout className="w-3.5 h-3.5 text-emerald-700" />
            <span>Recommend</span>
          </button>
        )}
        {onNavigateToDisease && (
          <button
            onClick={onNavigateToDisease}
            className="flex items-center gap-1 px-2 py-1 font-semibold text-rose-800 bg-rose-100 rounded"
          >
            <ScanLine className="w-3.5 h-3.5 text-rose-700" />
            <span>Disease</span>
          </button>
        )}
      </div>
    </header>
  );
};
