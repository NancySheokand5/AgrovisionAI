import React from 'react';
import { useTranslation } from '../i18n';
import { History, Trash2, Eye, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { deleteRecommendationRecord, clearAllHistory } from '../services/historyStorage';

export default function RecommendationHistory({ 
  history = [], 
  onSelectRecord, 
  onRefreshHistory 
}) {
  const { t } = useTranslation();

  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteRecommendationRecord(id);
    if (onRefreshHistory) onRefreshHistory();
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your recommendation history?')) {
      clearAllHistory();
      if (onRefreshHistory) onRefreshHistory();
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                {t('history.title')}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {t('history.subtitle')}
              </p>
            </div>
          </div>

          {history.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('history.clear_btn')}</span>
            </button>
          )}
        </div>

        {/* Records List */}
        {history.length === 0 ? (
          <div className="p-12 text-center text-stone-400 text-sm">
            <History className="w-8 h-8 mx-auto mb-2 text-stone-300" />
            <p>{t('history.empty')}</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {history.map((rec) => (
              <div
                key={rec.id}
                onClick={() => onSelectRecord(rec)}
                className="p-4 sm:p-5 hover:bg-stone-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                    {rec.icon || '🌾'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-stone-900 group-hover:text-emerald-800 transition-colors">
                        {rec.cropName}
                      </span>
                      {rec.hindiName && (
                        <span className="text-xs font-medium text-stone-500">
                          ({rec.hindiName})
                        </span>
                      )}
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                        {rec.suitabilityScore}% Match
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>{rec.dateFormatted}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>{rec.location}</span>
                      </span>
                      <span>•</span>
                      <span className="font-mono text-stone-600 font-medium">
                        {rec.keyConditions}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => onSelectRecord(rec)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 group-hover:bg-emerald-700 group-hover:text-white transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{t('history.view_btn')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, rec.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-stone-100 rounded-lg transition-colors"
                    aria-label="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
