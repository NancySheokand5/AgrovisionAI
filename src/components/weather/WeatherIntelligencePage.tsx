import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  RefreshCw,
  Volume2,
  VolumeX,
  ShieldAlert,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { LocationSelector } from './LocationSelector';
import { CurrentWeatherCard } from './CurrentWeatherCard';
import { WeatherForecast } from './WeatherForecast';
import { WeatherAlerts } from './WeatherAlerts';
import { SpraySuitabilityCard } from './SpraySuitabilityCard';
import { WeatherInsights } from './WeatherInsights';
import { WeatherTrendChart } from './WeatherTrendChart';
import { CropWeatherConnector } from './CropWeatherConnector';
import { weatherService, type NormalizedAgroVisionWeather, type LocationInfo } from '../../services/weatherService';

interface WeatherIntelligencePageProps {
  onBackToDashboard?: () => void;
  onNavigateToIrrigation?: () => void;
}

export const WeatherIntelligencePage: React.FC<WeatherIntelligencePageProps> = ({
  onBackToDashboard,
  onNavigateToIrrigation
}) => {
  const [currentLocation, setCurrentLocation] = useState<LocationInfo>(weatherService.getSavedLocation());
  const [weatherData, setWeatherData] = useState<NormalizedAgroVisionWeather | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const fetchWeather = async (loc: LocationInfo) => {
    try {
      const data = await weatherService.getWeather(loc.latitude, loc.longitude, loc.name);
      setWeatherData(data);
    } catch (err) {
      console.error('Weather load error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchWeather(currentLocation);
  }, [currentLocation]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchWeather(currentLocation);
  };

  const handleLocationChange = (loc: LocationInfo) => {
    setCurrentLocation(loc);
  };

  // Text-To-Speech voice narration
  const handleToggleVoice = () => {
    if (!('speechSynthesis' in window) || !weatherData) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const w = weatherData;
    const topInsight = w.agriculture.insights[0] || 'Conditions are stable.';
    const speechText = `AgroVision Weather Intelligence for ${w.location.name}. Current temperature is ${w.current.temperature} degrees Celsius, ${w.current.condition}. Reference evapotranspiration is ${w.agriculture.todayET0} millimeters per day. Spray suitability status is ${w.agriculture.spraySuitability.status}. Advisory: ${topInsight}`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = 'en-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Weather Intelligence
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
              <CloudSun className="w-3.5 h-3.5" />
              Agro-Meteo
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time agricultural microclimate, evapotranspiration (ET0), and spray suitability
          </p>
        </div>

        {/* Right Controls: Location search & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <LocationSelector
            currentLocation={currentLocation}
            onLocationChange={handleLocationChange}
          />

          <button
            type="button"
            onClick={handleToggleVoice}
            disabled={!weatherData}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              isSpeaking
                ? 'bg-rose-50 text-rose-700 border-rose-300'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
            }`}
            title="Listen to Weather Advisory"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4 text-rose-600 animate-pulse" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Listen</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            title="Refresh live weather feed"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <div className="text-sm font-bold text-slate-800">
            Fetching Live Agricultural Meteorological Feed...
          </div>
          <p className="text-xs text-slate-400">
            Connecting to Open-Meteo station at {currentLocation.name} ({currentLocation.latitude}°, {currentLocation.longitude}°)
          </p>
        </div>
      )}

      {/* Main Content when loaded */}
      {!isLoading && weatherData && (
        <div className="space-y-6">
          
          {/* Weather Risk Alerts Banner */}
          <WeatherAlerts alerts={weatherData.agriculture.alerts} />

          {/* Current Weather Card */}
          <CurrentWeatherCard
            current={weatherData.current}
            location={weatherData.location}
            todayET0={weatherData.agriculture.todayET0}
          />

          {/* 2-Column: Spray Suitability & AI Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpraySuitabilityCard spray={weatherData.agriculture.spraySuitability} />
            <WeatherInsights insights={weatherData.agriculture.insights} />
          </div>

          {/* Crop Weather Connector */}
          <CropWeatherConnector weather={weatherData} />

          {/* 7-Day Farm Forecast */}
          <WeatherForecast forecast={weatherData.daily} />

          {/* Weather Trends Chart */}
          <WeatherTrendChart daily={weatherData.daily} />

          {/* Action Link to Smart Irrigation Advice */}
          {onNavigateToIrrigation && (
            <div className="p-5 rounded-3xl bg-gradient-to-r from-sky-900 to-blue-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                  Connected Module
                </span>
                <h3 className="text-lg font-bold">
                  Calculate Crop Water Requirement for this Weather
                </h3>
                <p className="text-xs text-sky-200">
                  Today's ET0 is {weatherData.agriculture.todayET0} mm/day. Run FAO-56 irrigation balance.
                </p>
              </div>
              <button
                type="button"
                onClick={onNavigateToIrrigation}
                className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white text-sky-950 hover:bg-sky-50 shadow-sm transition-colors cursor-pointer shrink-0"
              >
                Open Smart Irrigation Advice →
              </button>
            </div>
          )}

          {/* Agricultural Disclaimer */}
          <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200 text-slate-500 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>AgroVision AI Decision-Support Notice: </strong>
              Meteorological variables are sourced from Open-Meteo live feeds with FAO-56 Penman-Monteith reference evapotranspiration algorithms. Microclimate variations can occur within field topography. Always confirm local ground conditions before executing high-value agricultural operations.
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
