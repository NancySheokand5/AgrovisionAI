import React from 'react';

interface QuickAction {
  id: string;
  emoji: string;
  label: string;
  description: string;
  color: string;     // Tailwind bg color
  textColor: string;
  onClick: () => void;
}

interface QuickActionsProps {
  onCropRecommendation?: () => void;
  onCropHealth?: () => void;
  onDetectDisease?: () => void;
  onWeather?: () => void;
  onMandiPrices?: () => void;
  onAskAI?: () => void;
  onIrrigation?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onCropRecommendation,
  onCropHealth,
  onDetectDisease,
  onWeather,
  onMandiPrices,
  onAskAI,
  onIrrigation,
}) => {
  const actions: QuickAction[] = [
    {
      id: 'crop-recommendation',
      emoji: '🌾',
      label: 'Recommend Crop',
      description: 'Soil & climate AI',
      color: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-100 hover:border-emerald-200',
      textColor: 'text-emerald-800',
      onClick: onCropRecommendation ?? onCropHealth ?? (() => {}),
    },
    {
      id: 'detect-disease',
      emoji: '🔬',
      label: 'Detect Disease',
      description: 'AI leaf scan & cure',
      color: 'bg-red-50 hover:bg-red-100 border-red-100 hover:border-red-200',
      textColor: 'text-red-800',
      onClick: onDetectDisease ?? (() => {}),
    },
    {
      id: 'weather',
      emoji: '🌦',
      label: 'Check Weather',
      description: 'Forecast & alerts',
      color: 'bg-sky-50 hover:bg-sky-100 border-sky-100 hover:border-sky-200',
      textColor: 'text-sky-800',
      onClick: onWeather ?? (() => {}),
    },
    {
      id: 'mandi-prices',
      emoji: '💰',
      label: 'Mandi Prices',
      description: 'Live rates & AI predict',
      color: 'bg-teal-50 hover:bg-teal-100 border-teal-100 hover:border-teal-200',
      textColor: 'text-teal-800',
      onClick: onMandiPrices ?? (() => {}),
    },
    {
      id: 'ask-ai',
      emoji: '🤖',
      label: 'Ask AI Advisor',
      description: 'Get smart advice',
      color: 'bg-slate-800 hover:bg-slate-700 border-slate-700',
      textColor: 'text-white',
      onClick: onAskAI ?? (() => {}),
    },
    {
      id: 'irrigation',
      emoji: '💧',
      label: 'Irrigation Advice',
      description: 'Water schedule',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-100 hover:border-blue-200',
      textColor: 'text-blue-800',
      onClick: onIrrigation ?? (() => {}),
    },
  ];

  return (
    <div>
      <h2 className="text-base font-bold text-slate-900 mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-150 active:scale-[0.96] cursor-pointer text-center group ${action.color}`}
            aria-label={action.label}
          >
            <span
              className="text-3xl transition-transform duration-150 group-hover:scale-110"
              role="img"
              aria-hidden="true"
            >
              {action.emoji}
            </span>
            <div>
              <div className={`text-xs font-bold leading-snug ${action.textColor}`}>
                {action.label}
              </div>
              <div className={`text-[10px] mt-0.5 opacity-70 ${action.textColor}`}>
                {action.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
