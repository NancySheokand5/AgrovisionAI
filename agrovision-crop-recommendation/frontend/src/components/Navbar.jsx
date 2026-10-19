import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import LanguageSelector from './LanguageSelector';
import { 
  Sprout, 
  LayoutDashboard, 
  ScanLine, 
  TrendingUp, 
  CloudSun, 
  Bot, 
  Bell, 
  User, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

export default function Navbar({ onNavigateSection, activeSection = 'crop_rec' }) {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard, unbuilt: true },
    { id: 'crop_rec', label: t('nav.crop_rec'), icon: Sprout, active: true },
    { id: 'mandi_prices', label: t('nav.mandi_prices'), icon: TrendingUp, href: 'http://localhost:5174', tag: 'Feature 1' },
    { id: 'disease_det', label: t('nav.disease_det'), icon: ScanLine, unbuilt: true },
    { id: 'weather', label: t('nav.weather'), icon: CloudSun, unbuilt: true },
    { id: 'advisor', label: t('nav.advisor'), icon: Bot, unbuilt: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Tag */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <Sprout className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-emerald-950 font-serif">
                  AgroVision <span className="text-emerald-600">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Crop AI
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium hidden md:block">
                Intelligent Precision Agriculture Suite
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Ready for future integration) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              if (item.active) {
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigateSection && onNavigateSection('crop_rec')}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 rounded-lg shadow-xs"
                  >
                    <Icon className="w-4 h-4 text-emerald-600" />
                    <span>{item.label}</span>
                  </button>
                );
              }
              if (item.href) {
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-stone-700 hover:text-emerald-800 hover:bg-stone-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200"
                    title="Open Mandi Price Prediction Module"
                  >
                    <Icon className="w-4 h-4 text-amber-600" />
                    <span>{item.label}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold">
                      {item.tag || 'Active'}
                    </span>
                  </a>
                );
              }
              return (
                <div key={item.id} className="relative group">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors"
                  >
                    <Icon className="w-4 h-4 text-stone-400 group-hover:text-stone-600" />
                    <span>{item.label}</span>
                  </button>
                  {item.unbuilt && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block w-48 p-2 bg-stone-900 text-stone-200 text-xs text-center rounded-lg shadow-xl z-50 pointer-events-none">
                      {t('nav.coming_soon')}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors"
                aria-label={t('nav.notifications')}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-white"></span>
              </button>
              
              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-stone-100 p-3 z-50 text-xs">
                  <div className="font-semibold text-stone-800 mb-2">AgroVision Updates</div>
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-900 mb-1">
                    🌾 AI Crop Recommendation model initialized. Ready for soil analysis.
                  </div>
                  <div className="p-2 rounded-lg bg-stone-50 text-stone-600">
                    ☁️ Weather station sensor link active.
                  </div>
                </div>
              )}
            </div>

            {/* Farmer Profile Avatar */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-stone-200">
              <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-semibold text-xs">
                RK
              </div>
              <div className="text-left text-xs">
                <div className="font-semibold text-stone-800">{t('nav.farmer_name')}</div>
                <div className="text-stone-400 text-[10px]">{t('nav.farmer_region')}</div>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.href) {
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-stone-700 hover:bg-stone-50"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-amber-600" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                    {item.tag || 'Active'}
                  </span>
                </a>
              );
            }
            return (
              <button
                key={item.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (item.active && onNavigateSection) onNavigateSection('crop_rec');
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  item.active
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${item.active ? 'text-emerald-600' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.unbuilt && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-500 font-normal">
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
