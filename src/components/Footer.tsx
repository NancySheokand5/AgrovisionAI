import React from 'react';
import { Sprout, ArrowUp } from 'lucide-react';


interface FooterProps {
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToTop }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                AgroVision <span className="text-emerald-500">AI</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              Standalone Mandi Crop Price & AI Prediction module. Built as the first feature component for the upcoming modular AgroVision AI agriculture intelligence platform.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Module 1: Mandi Intelligence & AI Forecasting (Active)</span>
            </div>
          </div>

          {/* Module Architecture Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Platform Architecture
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="text-emerald-400 font-medium">✓ Mandi Crop Price & AI Prediction</li>
              <li className="text-slate-500">○ Crop Health & Diagnostics (Upcoming)</li>
              <li className="text-slate-500">○ Soil & Micro-climate Sensing (Upcoming)</li>
              <li className="text-slate-500">○ Farm Machinery & Resource Sharing (Upcoming)</li>
            </ul>
          </div>

          {/* Integration & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Integration Ready
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• Decoupled <code className="text-slate-300">mandiService</code> (eNAM / AGMARKNET API ready)</li>
              <li>• Pluggable <code className="text-slate-300">predictionService</code> (Python/Flask ML ready)</li>
              <li>• Responsive Mobile & Tablet Layout</li>
              <li>• Reusable Component Architecture</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Back to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} AgroVision AI. College Project / Hackathon Prototype. Data and predictions are for simulation purposes.
          </div>

          <button
            onClick={onScrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
