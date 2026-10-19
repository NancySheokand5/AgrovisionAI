import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CropSelector } from './components/CropSelector';
import { CurrentPriceCard } from './components/CurrentPriceCard';
import { MandiComparison } from './components/MandiComparison';
import { HistoricalTrend } from './components/HistoricalTrend';
import { PredictionSection } from './components/PredictionSection';
import { Footer } from './components/Footer';
import { FarmerDashboard } from './components/dashboard/FarmerDashboard';
import type { DashboardNavPage } from './components/dashboard/DashboardHeader';
import { mandiService } from './services/mandiService';
import type {
  Crop,
  State,
  Mandi,
  MandiPriceRecord,
  MandiComparisonItem,
  HistoricalPricePoint
} from './types';

import { Loader2, LayoutDashboard, TrendingUp } from 'lucide-react';

type AppView = 'dashboard' | 'mandi';

export const App: React.FC = () => {
  // ── View state ───────────────────────────────────────────────
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [dashboardPage, setDashboardPage] = useState<DashboardNavPage>('dashboard');

  // Master lists
  const [crops, setCrops] = useState<Crop[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [mandis, setMandis] = useState<Mandi[]>([]);

  // Selection states
  const [selectedCropId, setSelectedCropId] = useState<string>('wheat');
  const [selectedStateId, setSelectedStateId] = useState<string>('haryana');
  const [selectedMandiId, setSelectedMandiId] = useState<string>('karnal');

  // Market data states
  const [currentPriceRecord, setCurrentPriceRecord] = useState<MandiPriceRecord | null>(null);
  const [comparisons, setComparisons] = useState<MandiComparisonItem[]>([]);
  const [historicalPrices, setHistoricalPrices] = useState<HistoricalPricePoint[]>([]);
  const [historyPeriod, setHistoryPeriod] = useState<number>(30);

  // Loading states
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isLoadingPrice, setIsLoadingPrice] = useState<boolean>(false);
  const [isLoadingMandis, setIsLoadingMandis] = useState<boolean>(false);

  // Initial master data load
  useEffect(() => {
    async function loadMasterData() {
      try {
        const [cropsData, statesData] = await Promise.all([
          mandiService.getCrops(),
          mandiService.getStates(),
        ]);
        setCrops(cropsData);
        setStates(statesData);

        const initialMandis = await mandiService.getMandisByState('haryana');
        setMandis(initialMandis);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setIsInitializing(false);
      }
    }
    loadMasterData();
  }, []);

  // When state changes, update mandis and pick first mandi
  const handleSelectState = async (stateId: string) => {
    setSelectedStateId(stateId);
    setIsLoadingMandis(true);
    try {
      const stateMandis = await mandiService.getMandisByState(stateId);
      setMandis(stateMandis);
      if (stateMandis.length > 0) {
        setSelectedMandiId(stateMandis[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch mandis for state:', err);
    } finally {
      setIsLoadingMandis(false);
    }
  };

  // Fetch current price, comparisons, and historical charts whenever crop or mandi changes
  const refreshMarketData = useCallback(async () => {
    if (!selectedCropId || !selectedMandiId || !selectedStateId) return;

    setIsLoadingPrice(true);
    try {
      const [priceRec, compList, histList] = await Promise.all([
        mandiService.getCurrentPrice(selectedCropId, selectedMandiId),
        mandiService.getMandiComparisons(selectedCropId, selectedStateId, selectedMandiId),
        mandiService.getHistoricalPrices(selectedCropId, selectedMandiId, historyPeriod),
      ]);

      setCurrentPriceRecord(priceRec);
      setComparisons(compList);
      setHistoricalPrices(histList);
    } catch (err) {
      console.error('Error refreshing market data:', err);
    } finally {
      setIsLoadingPrice(false);
    }
  }, [selectedCropId, selectedMandiId, selectedStateId, historyPeriod]);

  useEffect(() => {
    refreshMarketData();
  }, [refreshMarketData]);

  // Handle period change for historical chart
  const handleChangePeriod = async (days: number) => {
    setHistoryPeriod(days);
    const updatedHistory = await mandiService.getHistoricalPrices(
      selectedCropId,
      selectedMandiId,
      days
    );
    setHistoricalPrices(updatedHistory);
  };

  // Scroll to section helper
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Active object references
  const currentCrop = crops.find((c) => c.id === selectedCropId) || crops[0];
  const currentState = states.find((s) => s.id === selectedStateId) || states[0];
  const currentMandi = mandis.find((m) => m.id === selectedMandiId) || mandis[0];

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
            <span className="text-3xl">🌿</span>
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">
            Loading AgroVision AI Platform...
          </p>
        </div>
      </div>
    );
  }

  // ── Farmer Dashboard view ───────────────────────────────────
  if (activeView === 'dashboard') {
    return (
      <FarmerDashboard
        initialPage={dashboardPage}
        onSwitchToMandi={() => {
          setActiveView('mandi');
          setTimeout(() => scrollToSection('filter-section'), 200);
        }}
      />
    );
  }

  // ── Mandi Module view ───────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Mandi Header + Dashboard back button */}
      <div className="sticky top-0 z-50">
        <div className="bg-emerald-700 px-4 py-2 flex items-center gap-3">
          <button
            onClick={() => {
              setDashboardPage('dashboard');
              setActiveView('dashboard');
            }}
            className="flex items-center gap-2 text-emerald-100 hover:text-white text-xs font-medium transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            ← Back to Dashboard
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-1.5 text-emerald-200 text-xs">
            <TrendingUp className="w-3.5 h-3.5" />
            Mandi Price Module
          </div>
        </div>
        <Header
          onNavClick={scrollToSection}
          onNavigateToRecommendation={() => {
            setDashboardPage('crop-recommendation');
            setActiveView('dashboard');
          }}
          onNavigateToDisease={() => {
            setDashboardPage('crop-disease');
            setActiveView('dashboard');
          }}
        />
      </div>

      {/* Hero Section */}
      <Hero
        onCheckPricesClick={() => scrollToSection('filter-section')}
        onExploreAIClick={() => scrollToSection('ai-prediction')}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10">
        <CropSelector
          crops={crops}
          states={states}
          mandis={mandis}
          selectedCropId={selectedCropId}
          selectedStateId={selectedStateId}
          selectedMandiId={selectedMandiId}
          onSelectCrop={setSelectedCropId}
          onSelectState={handleSelectState}
          onSelectMandi={setSelectedMandiId}
          isLoadingMandis={isLoadingMandis}
        />

        {currentCrop && currentMandi && currentPriceRecord && (
          <CurrentPriceCard
            crop={currentCrop}
            mandi={currentMandi}
            stateName={currentState?.name || 'Regional'}
            priceRecord={currentPriceRecord}
            onCompareClick={() => scrollToSection('price-comparison')}
            onPredictClick={() => scrollToSection('ai-prediction')}
            isLoading={isLoadingPrice}
          />
        )}

        {currentCrop && comparisons.length > 0 && (
          <MandiComparison
            crop={currentCrop}
            comparisons={comparisons}
            selectedMandiId={selectedMandiId}
            onSelectMandi={(mandiId) => {
              setSelectedMandiId(mandiId);
              scrollToSection('mandi-prices');
            }}
          />
        )}

        {currentCrop && currentMandi && historicalPrices.length > 0 && (
          <HistoricalTrend
            crop={currentCrop}
            mandi={currentMandi}
            historyData={historicalPrices}
            activePeriod={historyPeriod}
            onChangePeriod={handleChangePeriod}
          />
        )}

        {currentCrop && currentMandi && currentState && currentPriceRecord && (
          <PredictionSection
            crop={currentCrop}
            mandi={currentMandi}
            state={currentState}
            currentModalPrice={currentPriceRecord.modalPrice}
          />
        )}
      </main>

      <Footer onScrollToTop={scrollToTop} />
    </div>
  );
};

export default App;
