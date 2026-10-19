import React from 'react';
import { useTranslation } from '../i18n';
import { Sprout, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="no-print bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-stone-800 text-xs">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white font-serif">
                AgroVision <span className="text-emerald-400">AI</span>
              </span>
            </div>
            <p className="text-stone-400 max-w-md leading-relaxed">
              Empowering farmers with transparent, explainable artificial intelligence for precision agriculture, crop suitability, disease diagnostics, and mandi intelligence.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800 border border-stone-700 text-stone-300 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Feature 3: Standalone AI Crop Recommendation Module</span>
            </div>
          </div>

          {/* AgroVision Platform Modules */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <span>• AI Crop Recommendation</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-900/60 text-emerald-300">Active</span>
              </li>
              <li className="hover:text-stone-300 transition-colors">
                • Mandi Price Prediction (Feature 1)
              </li>
              <li className="hover:text-stone-300 transition-colors">
                • Crop Disease Detection (Feature 2)
              </li>
              <li className="text-stone-500">• Weather & Soil Moisture (Soon)</li>
              <li className="text-stone-500">• Krishi Sahayak AI Advisor (Soon)</li>
            </ul>
          </div>

          {/* Agricultural Advisory Note */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">
              Farmer Advisory
            </h4>
            <p className="text-stone-400 leading-relaxed text-[11px]">
              Recommendations are generated based on entered soil nutrients (N-P-K), soil pH, and weather conditions. For commercial crop planning, combine recommendations with local soil lab tests and Krishi Vigyan Kendra (KVK) guidelines.
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} AgroVision AI. Built with precision for Indian Agriculture.
          </div>
          <div className="flex items-center gap-1">
            <span>Powered by Scikit-Learn ML & Agricultural Intelligence</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
