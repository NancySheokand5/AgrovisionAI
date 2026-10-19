import React, { useState, useEffect } from 'react';
import {
  Droplets,
  CloudSun,
  ArrowLeft,
  Volume2,
  VolumeX,
  FileText,
  History,
  ChevronRight
} from 'lucide-react';
import { IrrigationForm } from './IrrigationForm';
import { IrrigationResultCard } from './IrrigationResultCard';
import { WaterRequirementCard } from './WaterRequirementCard';
import { SoilMoistureGauge } from './SoilMoistureGauge';
import { IrrigationTimeline } from './IrrigationTimeline';
import { IrrigationExplanation } from './IrrigationExplanation';
import { WaterReportModal } from './WaterReportModal';
import {
  irrigationService,
  type IrrigationInput,
  type IrrigationAdviceResult
} from '../../services/irrigationService';
import {
  weatherService,
  type NormalizedAgroVisionWeather,
  type LocationInfo
} from '../../services/weatherService';

interface IrrigationAdvicePageProps {
  onBackToDashboard?: () => void;
  onNavigateToWeather?: () => void;
}

export const IrrigationAdvicePage: React.FC<IrrigationAdvicePageProps> = ({
  onBackToDashboard,
  onNavigateToWeather
}) => {
  const [currentLocation] = useState<LocationInfo>(weatherService.getSavedLocation());
  const [weatherData, setWeatherData] = useState<NormalizedAgroVisionWeather | null>(null);
  const [adviceResult, setAdviceResult] = useState<IrrigationAdviceResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [historyList, setHistoryList] = useState<IrrigationAdviceResult[]>([]);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Load weather and initial calculation on mount
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const weather = await weatherService.getWeather(
          currentLocation.latitude,
          currentLocation.longitude,
          currentLocation.name
        );
        setWeatherData(weather);

        // Load history
        const hist = irrigationService.getHistory();
        setHistoryList(hist);

        // If history exists, load the latest advice; otherwise calculate initial default advice for Wheat
        if (hist.length > 0) {
          setAdviceResult(hist[0]);
        } else {
          const defaultInput: IrrigationInput = {
            crop: 'wheat',
            growthStage: 'vegetative',
            area: 2.5,
            areaUnit: 'acre',
            soilType: 'loamy',
            lastIrrigationDate: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString().split('T')[0],
            irrigationMethod: 'drip',
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude
          };
          const initialAdvice = await irrigationService.calculateIrrigationAdvice(defaultInput);
          setAdviceResult(initialAdvice);
          setHistoryList(irrigationService.getHistory());
        }
      } catch (err) {
        console.error('Failed to init irrigation page:', err);
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, [currentLocation]);

  // Handle calculation submission
  const handleCalculate = async (input: IrrigationInput) => {
    setIsLoading(true);
    try {
      const res = await irrigationService.calculateIrrigationAdvice(input);
      setAdviceResult(res);
      setHistoryList(irrigationService.getHistory());
    } catch (err) {
      console.error('Irrigation calculation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Text-To-Speech voice narration
  const handleToggleVoice = () => {
    if (!('speechSynthesis' in window) || !adviceResult) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const r = adviceResult;
    const speechText = `AgroVision Smart Irrigation Advice for ${r.crop.name}. Recommendation status is ${r.recommendation.status}. Action: ${r.recommendation.actionPhrase}. Optimal watering window is ${r.recommendation.suggestedWindow}. Total water required is ${r.calculations.totalWaterLitres.toLocaleString()} litres, which is ${r.calculations.litresPerAcre.toLocaleString()} litres per acre. Next review on ${r.recommendation.nextCheckDate}.`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = 'en-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleClearHistory = () => {
    irrigationService.clearHistory();
    setHistoryList([]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm">
        <div>
          {onBackToDashboard && (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Farmer Dashboard</span>
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Smart Irrigation Advice
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60 uppercase">
                  FAO-56 Water Balance
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Precision crop water scheduling for <strong className="text-slate-700">{currentLocation.name}</strong> ({currentLocation.state})
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Voice button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            disabled={!adviceResult}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isSpeaking
                ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Listen to Irrigation Advisory"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-600" /> : <Volume2 className="w-4 h-4 text-slate-600" />}
            <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
          </button>

          {/* View Report button */}
          {adviceResult && (
            <button
              type="button"
              onClick={() => setIsReportOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Water Report</span>
            </button>
          )}

          {/* Navigate to Weather */}
          {onNavigateToWeather && (
            <button
              type="button"
              onClick={onNavigateToWeather}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <CloudSun className="w-4 h-4 text-emerald-600" />
              <span>Weather Intelligence →</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Form on Left/Top, Advice Results on Right/Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Column (5 cols on large) */}
        <div className="lg:col-span-5 space-y-6">
          <IrrigationForm
            weather={weatherData}
            onSubmit={handleCalculate}
            isLoading={isLoading}
          />

          {/* Previous Advice History */}
          {historyList.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <History className="w-4 h-4 text-slate-500" />
                  <span>Calculation History</span>
                </div>
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="text-[11px] text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {historyList.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAdviceResult(item)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      adviceResult?.id === item.id
                        ? 'bg-blue-50 border-blue-200 text-blue-900 shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <span>{item.crop.emoji}</span>
                        <span>{item.crop.name}</span>
                        <span className="text-[10px] text-slate-400">({item.growthStage.label})</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {item.recommendation.actionPhrase} • {item.calculations.totalWaterLitres.toLocaleString()} L
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Column (7 cols on large) */}
        <div className="lg:col-span-7 space-y-6">
          {adviceResult ? (
            <>
              {/* Main Result Card */}
              <IrrigationResultCard
                result={adviceResult}
                onOpenReportModal={() => setIsReportOpen(true)}
              />

              {/* Exact Volumetric Requirements */}
              <WaterRequirementCard result={adviceResult} />

              {/* Soil Moisture Gauge */}
              <SoilMoistureGauge result={adviceResult} />

              {/* Irrigation Timeline */}
              <IrrigationTimeline result={adviceResult} />

              {/* Transparent "Why" Explanation & Disclaimer */}
              <IrrigationExplanation result={adviceResult} />
            </>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Configure your field and click Calculate
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                AgroVision AI will run FAO-56 Penman-Monteith water depletion calculations for your specific crop and soil.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Official Farm Water Report Modal */}
      <WaterReportModal
        result={adviceResult}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

    </div>
  );
};
