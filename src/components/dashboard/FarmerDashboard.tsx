import React from 'react';
import { DashboardHeader, type DashboardNavPage } from './DashboardHeader';
import { MobileNavigation } from './MobileNavigation';
import { WelcomeSection } from './WelcomeSection';
import { FarmHealthCard } from './FarmHealthCard';
import { WeatherCard } from './WeatherCard';
import { CropHealthCard } from './CropHealthCard';
import { AIAdvisorCard } from './AIAdvisorCard';
import { MandiPriceSummaryCard } from './MandiPriceSummaryCard';
import { DiseaseAlertCard } from './DiseaseAlertCard';
import { SoilConditionCard } from './SoilConditionCard';
import { IrrigationCard } from './IrrigationCard';
import { QuickActions } from './QuickActions';
import { RecentActivity } from './RecentActivity';
import { FarmMapOverview } from './FarmMapOverview';
import { mockDashboardData } from '../../data/mockDashboardData';
import { WeatherIntelligencePage } from '../weather/WeatherIntelligencePage';
import { IrrigationAdvicePage } from '../irrigation/IrrigationAdvicePage';
import { CropRecommendationPage } from '../recommendation/CropRecommendationPage';
import { CropDiseaseDetectionPage } from '../disease/CropDiseaseDetectionPage';
import { AgroVisionAIAdvisorPage } from '../advisor/AgroVisionAIAdvisorPage';

// ─── Coming Soon page stub ───────────────────────────────────
const ComingSoon: React.FC<{ page: DashboardNavPage }> = ({ page }) => {
  const labels: Record<DashboardNavPage, { emoji: string; title: string; desc: string }> = {
    dashboard: { emoji: '🌿', title: 'Dashboard', desc: '' },
    'crop-recommendation': { emoji: '🌾', title: 'Crop Recommendation', desc: 'AI-based crop selection by soil & weather.' },
    'crop-disease': { emoji: '🔬', title: 'Disease Detection', desc: 'Instant leaf diagnosis from photo.' },
    'my-farm': { emoji: '🚜', title: 'My Farm', desc: 'Detailed farm profile, field history, and soil records.' },
    'crop-health': { emoji: '🌱', title: 'Crop Health', desc: 'Detailed per-crop monitoring and growth timeline.' },
    'mandi-prices': { emoji: '💰', title: 'Mandi Prices', desc: 'Full mandi price module with AI predictions.' },
    weather: { emoji: '🌦', title: 'Weather', desc: 'Extended forecasts, agro-weather alerts, and rain mapping.' },
    irrigation: { emoji: '💧', title: 'Irrigation', desc: 'Smart FAO-56 irrigation and crop water balance.' },
    advisory: { emoji: '🤖', title: 'AI Advisory', desc: 'Full AI-powered personalized farm advisory.' },
  };

  const info = labels[page];
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-6xl mb-4">{info.emoji}</div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{info.title}</h2>
      <p className="text-slate-500 max-w-sm mb-6">{info.desc}</p>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        Coming Soon — Feature in Development
      </div>
    </div>
  );
};

// ─── Props ───────────────────────────────────────────────────
interface FarmerDashboardProps {
  initialPage?: DashboardNavPage;
  onSwitchToMandi: () => void;
}

// ─── Main Farmer Dashboard ───────────────────────────────────
export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  initialPage = 'dashboard',
  onSwitchToMandi,
}) => {
  const [activePage, setActivePage] = React.useState<DashboardNavPage>(initialPage);
  const data = mockDashboardData; // TODO: replace with API call

  React.useEffect(() => {
    if (initialPage) {
      setActivePage(initialPage);
    }
  }, [initialPage]);

  const handleNavigate = (page: DashboardNavPage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Dashboard Header */}
      <DashboardHeader
        activePage={activePage}
        onNavigate={handleNavigate}
        onSwitchToMandi={onSwitchToMandi}
        farmerName={data.farmer.name}
        farmerInitials={data.farmer.avatarInitials}
        notificationCount={data.diseaseAlerts.length + 1}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8">
        {activePage === 'dashboard' ? (
          <div className="space-y-6">

            {/* ── Welcome Section ── */}
            <WelcomeSection
              farmer={data.farmer}
              farmHealth={data.farmHealth}
            />

            {/* ── Quick Actions ── */}
            <QuickActions
              onCropRecommendation={() => handleNavigate('crop-recommendation')}
              onDetectDisease={() => handleNavigate('crop-disease')}
              onWeather={() => handleNavigate('weather')}
              onMandiPrices={onSwitchToMandi}
              onAskAI={() => handleNavigate('advisory')}
              onIrrigation={() => handleNavigate('irrigation')}
            />

            {/* ── Disease Alerts (full width if present) ── */}
            {data.diseaseAlerts.length > 0 && (
              <DiseaseAlertCard
                alerts={data.diseaseAlerts}
                onCheckCrop={() => handleNavigate('crop-disease')}
              />
            )}

            {/* ── Row 1: AI Advisor (large) + Farm Health + Weather ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* AI Advisor – spans 1 col on md, 1 on lg */}
              <AIAdvisorCard
                messages={data.aiAdvisor}
                onViewAdvisory={() => handleNavigate('advisory')}
              />

              {/* Farm Health */}
              <FarmHealthCard
                farmHealth={data.farmHealth}
                totalAcres={data.farmer.farmSize}
              />

              {/* Weather */}
              <WeatherCard
                weather={data.weather}
                onViewDetails={() => handleNavigate('weather')}
              />
            </div>

            {/* ── Row 2: Crop Health + Mandi Prices + Soil ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <CropHealthCard
                crops={data.cropHealth}
                onViewAll={() => handleNavigate('crop-recommendation')}
              />
              <MandiPriceSummaryCard
                items={data.mandiPrices}
                onViewMarket={onSwitchToMandi}
              />
              <SoilConditionCard
                soil={data.soilCondition}
                onViewDetails={() => handleNavigate('my-farm')}
              />
            </div>

            {/* ── Row 3: Irrigation + Farm Map ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <IrrigationCard
                irrigation={data.irrigation}
                onViewDetails={() => handleNavigate('irrigation')}
              />
              <FarmMapOverview
                sections={data.farmSections}
                farmerName={data.farmer.name}
                location={data.farmer.location}
                totalAcres={data.farmer.farmSize}
              />
            </div>

            {/* ── Recent Activity ── */}
            <RecentActivity activities={data.recentActivity} />

          </div>
        ) : activePage === 'crop-recommendation' ? (
          <CropRecommendationPage
            onBackToDashboard={() => handleNavigate('dashboard')}
            onNavigateToDisease={() => handleNavigate('crop-disease')}
            onNavigateToMandi={onSwitchToMandi}
          />
        ) : activePage === 'crop-disease' ? (
          <CropDiseaseDetectionPage
            onBackToDashboard={() => handleNavigate('dashboard')}
            onNavigateToRecommendation={() => handleNavigate('crop-recommendation')}
            onNavigateToMandi={onSwitchToMandi}
          />
        ) : activePage === 'weather' ? (
          <WeatherIntelligencePage
            onBackToDashboard={() => handleNavigate('dashboard')}
            onNavigateToIrrigation={() => handleNavigate('irrigation')}
          />
        ) : activePage === 'irrigation' ? (
          <IrrigationAdvicePage
            onBackToDashboard={() => handleNavigate('dashboard')}
            onNavigateToWeather={() => handleNavigate('weather')}
          />
        ) : activePage === 'advisory' ? (
          <AgroVisionAIAdvisorPage
            onBackToDashboard={() => handleNavigate('dashboard')}
            onNavigate={handleNavigate}
            onSwitchToMandi={onSwitchToMandi}
          />
        ) : (
          <ComingSoon page={activePage} />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation
        activePage={activePage}
        onNavigate={handleNavigate}
        onSwitchToMandi={onSwitchToMandi}
      />
    </div>
  );
};
