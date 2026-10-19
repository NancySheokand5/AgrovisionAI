import React from 'react';
import { ArrowDown, TrendingUp, Sparkles, Store, Layers, BarChart2 } from 'lucide-react';

interface HeroProps {
  onCheckPricesClick: () => void;
  onExploreAIClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCheckPricesClick, onExploreAIClick }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-slate-900 text-white pt-12 pb-16 md:pt-16 md:pb-20">
      {/* Decorative subtle background grid & agricultural glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#052e16_1px,transparent_1px),linear-gradient(to_bottom,#052e16_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-700/60 text-emerald-200 border border-emerald-500/30 mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-spin-slow" />
            <span>AgroVision AI Intelligent Mandi Intelligence</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Mandi Prices & <span className="text-emerald-400">AI Price Prediction</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-emerald-100/90 leading-relaxed mb-8">
            Check current mandi prices, compare markets across regions, and understand future crop price trends with AI.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
            <button
              onClick={onCheckPricesClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-98 transition-all shadow-lg shadow-emerald-500/25"
            >
              <span>Check Mandi Prices</span>
              <ArrowDown className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreAIClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-800/80 text-white hover:bg-slate-700/80 border border-slate-700/70 active:scale-98 transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>AI Crop Trend Forecast</span>
            </button>
          </div>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-left">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-medium mb-1">
                <Layers className="w-4 h-4" />
                <span>Commodities</span>
              </div>
              <div className="text-xl font-bold text-white">12+ Crops</div>
              <div className="text-xs text-emerald-200/70">Wheat, Rice, Mustard...</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-medium mb-1">
                <Store className="w-4 h-4" />
                <span>Coverage</span>
              </div>
              <div className="text-xl font-bold text-white">30+ Mandis</div>
              <div className="text-xs text-emerald-200/70">Across 9 major states</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-medium mb-1">
                <BarChart2 className="w-4 h-4" />
                <span>Market Spread</span>
              </div>
              <div className="text-xl font-bold text-white">Min / Max / Modal</div>
              <div className="text-xs text-emerald-200/70">Daily arrival tracking</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-medium mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>AI Forecasting</span>
              </div>
              <div className="text-xl font-bold text-white">Trend Analysis</div>
              <div className="text-xs text-emerald-200/70">Farmer-friendly insights</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
