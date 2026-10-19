import React, { useState } from 'react';
import {
  Sprout,
  LayoutDashboard,
  TrendingUp,
  CloudSun,
  Bell,
  Globe,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  User,
  Droplets,
  ScanLine,
  Bot,
} from 'lucide-react';

export type DashboardNavPage =
  | 'dashboard'
  | 'crop-recommendation'
  | 'crop-disease'
  | 'my-farm'
  | 'crop-health'
  | 'mandi-prices'
  | 'weather'
  | 'irrigation'
  | 'advisory';

interface DashboardHeaderProps {
  activePage: DashboardNavPage;
  onNavigate: (page: DashboardNavPage) => void;
  onSwitchToMandi: () => void;
  farmerName: string;
  farmerInitials: string;
  notificationCount?: number;
}

const navLinks: { id: DashboardNavPage; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'crop-recommendation', label: 'Crop Recommendation', icon: Sprout },
  { id: 'crop-disease', label: 'Disease Detection', icon: ScanLine },
  { id: 'advisory', label: 'AI Advisor', icon: Bot },
  { id: 'mandi-prices', label: 'Mandi Prices', icon: TrendingUp },
  { id: 'weather', label: 'Weather', icon: CloudSun },
  { id: 'irrigation', label: 'Irrigation', icon: Droplets },
];

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'hr', label: 'हरयाणवी' },
];

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  activePage,
  onNavigate,
  onSwitchToMandi,
  farmerName,
  farmerInitials,
  notificationCount = 3,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');
  const [profileOpen, setProfileOpen] = useState(false);

  const handleNav = (page: DashboardNavPage) => {
    if (page === 'mandi-prices') {
      onSwitchToMandi();
    } else {
      onNavigate(page);
    }
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  AgroVision <span className="text-emerald-600">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <Sparkles className="w-2.5 h-2.5" />
                  Beta
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden md:block leading-none mt-0.5">
                Smart Farming Platform
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center px-8">
            {navLinks.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activePage === id
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => { setLangOpen(!langOpen); setProfileOpen(false); }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Select language"
              >
                <Globe className="w-4 h-4" />
                <span className="text-xs font-medium">{languages.find(l => l.code === selectedLang)?.label}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setSelectedLang(lang.code); setLangOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-emerald-50 transition-colors ${
                        selectedLang === lang.code ? 'text-emerald-700 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <button
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label={`${notificationCount} notifications`}
            >
              <Bell className="w-4.5 h-4.5" />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Profile Avatar */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setLangOpen(false); }}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 transition-colors group"
                aria-label={`Profile: ${farmerName}`}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {farmerInitials}
                </div>
                <span className="hidden md:block text-sm font-medium text-slate-700 group-hover:text-slate-900">
                  {farmerName.split(' ')[0]}
                </span>
                <ChevronDown className="hidden md:block w-3 h-3 text-slate-400" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-800">{farmerName}</p>
                    <p className="text-xs text-slate-500">Karnal, Haryana</p>
                  </div>
                  <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> My Profile
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5" /> Language
                  </button>
                  <hr className="my-1 border-slate-100" />
                  <button className="w-full text-left px-3 py-2 text-sm text-slate-500 hover:bg-slate-50">
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 gap-2">
            {navLinks.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                  activePage === id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
          <div className="px-4 pb-3 flex gap-2">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => { setSelectedLang(lang.code); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedLang === lang.code
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
