import {
  LayoutDashboard,
  TrendingUp,
  Sprout,
  ScanLine,
  Bot,
  type LucideIcon,
} from 'lucide-react';
import type { DashboardNavPage } from './DashboardHeader';

interface MobileNavigationProps {
  activePage: DashboardNavPage;
  onNavigate: (page: DashboardNavPage) => void;
  onSwitchToMandi: () => void;
}

const navItems: { id: DashboardNavPage; label: string; Icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Home', Icon: LayoutDashboard },
  { id: 'crop-recommendation', label: 'Recommend', Icon: Sprout },
  { id: 'crop-disease', label: 'Disease', Icon: ScanLine },
  { id: 'advisory', label: 'AI Advisor', Icon: Bot },
  { id: 'mandi-prices', label: 'Mandi', Icon: TrendingUp },
];

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activePage,
  onNavigate,
  onSwitchToMandi,
}) => {
  const handleTap = (id: DashboardNavPage) => {
    if (id === 'mandi-prices') {
      onSwitchToMandi();
    } else {
      onNavigate(id);
    }
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-1 pb-safe">
        {navItems.map(({ id, label, Icon }) => {
          const isActive = activePage === id;
          return (
            <button
              key={id}
              onClick={() => handleTap(id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-700'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={`relative w-7 h-7 flex items-center justify-center rounded-xl transition-all ${
                isActive ? 'bg-emerald-100' : ''
              }`}>
                <Icon className={`w-4.5 h-4.5 transition-all ${isActive ? 'text-emerald-700' : ''}`} />
                {isActive && (
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-600" />
                )}
              </div>
              <span className={`text-[10px] font-medium leading-none ${isActive ? 'text-emerald-700' : ''}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
