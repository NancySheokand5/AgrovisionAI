import React, { useState, useEffect } from 'react';
import type { Crop, Mandi, PredictionResult, PredictionInput, State } from '../types';
import { predictionService } from '../services/predictionService';
import { formatCurrency, formatPercent } from '../utils/formatters';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  BrainCircuit
} from 'lucide-react';


interface PredictionSectionProps {
  crop: Crop;
  mandi: Mandi;
  state: State;
  currentModalPrice: number;
}

export const PredictionSection: React.FC<PredictionSectionProps> = ({
  crop,
  mandi,
  state,
  currentModalPrice,
}) => {
  // Prediction form state
  const [currentPriceInput, setCurrentPriceInput] = useState<number>(currentModalPrice);
  const [previousPriceInput, setPreviousPriceInput] = useState<number>(
    Math.round(currentModalPrice * 0.97)
  );
  const [season, setSeason] = useState<string>('Normal Trade');
  const [horizonDays, setHorizonDays] = useState<number>(15);

  // Execution state
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);

  // Update form inputs when selected crop/mandi changes
  useEffect(() => {
    setCurrentPriceInput(currentModalPrice);
    setPreviousPriceInput(Math.round(currentModalPrice * 0.97));
    // Trigger fresh prediction for new crop/mandi
    handleRunPrediction(currentModalPrice, Math.round(currentModalPrice * 0.97), season, horizonDays);
  }, [crop.id, mandi.id, currentModalPrice]);

  const handleRunPrediction = async (
    curr = currentPriceInput,
    prev = previousPriceInput,
    sea = season,
    days = horizonDays
  ) => {
    setIsPredicting(true);
    try {
      const input: PredictionInput = {
        cropId: crop.id,
        stateId: state.id,
        mandiId: mandi.id,
        currentPrice: curr,
        previousPrice: prev,
        season: sea,
        horizonDays: days,
      };

      const result = await predictionService.predictCropPrice(input);
      setPredictionResult(result);
    } catch (err) {
      console.error('Prediction calculation error', err);
    } finally {
      setIsPredicting(false);
    }
  };

  const getTrendBadge = (trend: 'increase' | 'decrease' | 'stable') => {
    switch (trend) {
      case 'increase':
        return {
          icon: <TrendingUp className="w-5 h-5 text-emerald-700" />,
          label: 'Price May Increase',
          hindiLabel: 'भाव बढ़ने की संभावना',
          bgColor: 'bg-emerald-50 border-emerald-300 text-emerald-900',
          indicatorColor: 'text-emerald-700',
        };
      case 'decrease':
        return {
          icon: <TrendingDown className="w-5 h-5 text-rose-700" />,
          label: 'Price May Decrease',
          hindiLabel: 'भाव घटने की संभावना',
          bgColor: 'bg-rose-50 border-rose-300 text-rose-900',
          indicatorColor: 'text-rose-700',
        };
      default:
        return {
          icon: <Minus className="w-5 h-5 text-amber-700" />,
          label: 'Price Appears Stable',
          hindiLabel: 'भाव स्थिर रहने का अनुमान',
          bgColor: 'bg-amber-50 border-amber-300 text-amber-900',
          indicatorColor: 'text-amber-700',
        };
    }
  };

  return (
    <div id="ai-prediction" className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-5 sm:p-7 space-y-7">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Predictive Modeling</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>AI Crop Price Prediction ({crop.name})</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Forecast upcoming mandi price trends based on historical patterns, seasonality, and arrival dynamics.
          </p>
        </div>

        {/* Prototype disclaimer pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs self-start sm:self-auto">
          <BrainCircuit className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Model status: Demo prediction</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Prediction Parameter Input Form */}
        <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200/90 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <span>Prediction Parameters</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">
              Editable inputs
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRunPrediction();
            }}
            className="space-y-4 text-xs font-medium text-slate-700"
          >
            {/* Read-only Context Summary */}
            <div className="bg-white rounded-xl p-3 border border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Selected Crop:</span>
                <span className="font-bold text-slate-900">{crop.name} ({crop.hindiName})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Selected Market:</span>
                <span className="font-bold text-slate-900">{mandi.name}, {state.code}</span>
              </div>
            </div>

            {/* Current Price */}
            <div>
              <label className="block mb-1.5 text-xs font-bold text-slate-800">
                Current Price (₹ / Quintal):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  min="100"
                  max="100000"
                  value={currentPriceInput}
                  onChange={(e) => setCurrentPriceInput(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Previous Reference Price */}
            <div>
              <label className="block mb-1.5 text-xs font-bold text-slate-800">
                Previous Reference Price (₹ / Quintal):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  min="100"
                  max="100000"
                  value={previousPriceInput}
                  onChange={(e) => setPreviousPriceInput(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Price from past 7–14 days to gauge recent trend.
              </span>
            </div>

            {/* Season / Market Cycle */}
            <div>
              <label className="block mb-1.5 text-xs font-bold text-slate-800">
                Seasonal Arrival Cycle (मौसम / आवक चक्र):
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="Normal Trade">Normal Trade (सामान्य आवक)</option>
                <option value="Harvest Peak">Harvest Peak (कटाई का समय - भारी आवक)</option>
                <option value="Lean / Off-Season">Lean / Off-Season (कम आवक का समय)</option>
                <option value="Sowing Period">Sowing Period (बुआई का समय)</option>
              </select>
            </div>

            {/* Forecast Horizon */}
            <div>
              <label className="block mb-1.5 text-xs font-bold text-slate-800">
                Forecast Horizon:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[7, 15, 30].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setHorizonDays(days)}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                      horizonDays === days
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPredicting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isPredicting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Calculating Prediction...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Predict Price</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Prediction Result Card */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {predictionResult ? (
            <div className="space-y-4">
              {/* Primary Output Display */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-850 text-white rounded-2xl p-6 shadow-md border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold block mb-0.5">
                      Predicted {crop.name} Price
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                        {formatCurrency(predictionResult.predictedPrice)}
                      </span>
                      <span className="text-sm font-medium text-slate-400">/ quintal</span>
                    </div>
                  </div>

                  {/* Trend Indicator Pill */}
                  {(() => {
                    const badge = getTrendBadge(predictionResult.trend);
                    return (
                      <div
                        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold ${badge.bgColor}`}
                      >
                        {badge.icon}
                        <div className="text-left leading-tight">
                          <div>{badge.label}</div>
                          <div className="text-[10px] font-normal opacity-85">{badge.hindiLabel}</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Change Percent & Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
                  <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
                    <span className="text-[11px] text-slate-400 block mb-0.5">Expected Change</span>
                    <span
                      className={`text-base font-bold font-mono ${
                        predictionResult.changePercent > 0
                          ? 'text-emerald-400'
                          : predictionResult.changePercent < 0
                          ? 'text-rose-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {formatPercent(predictionResult.changePercent)} (
                      {predictionResult.changeAmount >= 0 ? '+' : ''}
                      {formatCurrency(predictionResult.changeAmount)})
                    </span>
                  </div>

                  <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
                    <span className="text-[11px] text-slate-400 block mb-0.5">Target Horizon</span>
                    <span className="text-sm font-bold text-slate-200">
                      ~ {predictionResult.predictedDate}
                    </span>
                  </div>

                  <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 col-span-2 sm:col-span-1">
                    <span className="text-[11px] text-slate-400 block mb-0.5">Confidence Status</span>
                    <span className="text-xs font-semibold text-amber-300">
                      {predictionResult.confidenceLabel}
                    </span>
                  </div>
                </div>

                {/* Short farmer-friendly explanation */}
                <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white block mb-1">Model Explanation:</strong>
                  {predictionResult.explanation}
                </div>
              </div>

              {/* Farmer-Friendly Market Insight Section */}
              <div className="bg-emerald-50/80 rounded-2xl p-5 border border-emerald-200/90 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <Lightbulb className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Farmer-Friendly Market Insight (किसान सलाह)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {predictionResult.marketInsight}
                </p>
              </div>

              {/* Key Contributing Factors */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Key Estimated Driving Factors in this Prototype:</span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-1">
                  {predictionResult.keyFactors.map((factor, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center">
              <div className="space-y-2 text-slate-500">
                <Sparkles className="w-8 h-8 mx-auto text-slate-400" />
                <p className="text-sm font-medium">Select parameters and click "Predict Price" to view estimates.</p>
              </div>
            </div>
          )}

          {/* Important Mandatory Disclaimer */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Important Disclaimer:</strong> Predictions are simulated prototype estimates and actual mandi prices may vary significantly due to daily auction fluctuations, sudden rainfall/weather shifts, freight tariffs, export/import policies, and spot supply volumes. This feature is intended for educational and decision-support demonstration.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
