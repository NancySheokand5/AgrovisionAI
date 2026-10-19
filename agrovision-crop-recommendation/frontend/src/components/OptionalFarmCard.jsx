import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { MapPin, ChevronDown, ChevronUp, Layers, Calendar, Maximize2 } from 'lucide-react';

export default function OptionalFarmCard({ formData, onChange }) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden transition-all">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-stone-50/80 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-xs">
            4
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-stone-800">
                {t('form.section_optional')}
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {t('form.optional_badge')}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {t('form.optional_hint')}
            </p>
          </div>
        </div>

        <div className="p-1 rounded-full text-stone-400 hover:text-stone-600">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isExpanded && (
        <div className="p-5 sm:p-6 border-t border-stone-100 bg-stone-50/50 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* State */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{t('form.state')}</span>
              </label>
              <input
                type="text"
                value={formData.state || ''}
                onChange={(e) => onChange('state', e.target.value)}
                placeholder={t('form.state_placeholder')}
                className="w-full px-3 py-2 text-sm text-stone-900 bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-stone-400" />
                <span>{t('form.district')}</span>
              </label>
              <input
                type="text"
                value={formData.district || ''}
                onChange={(e) => onChange('district', e.target.value)}
                placeholder={t('form.district_placeholder')}
                className="w-full px-3 py-2 text-sm text-stone-900 bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Season */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>{t('form.season')}</span>
              </label>
              <select
                value={formData.season || 'Kharif'}
                onChange={(e) => onChange('season', e.target.value)}
                className="w-full px-3 py-2 text-sm text-stone-900 bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Kharif">{t('form.season_kharif')}</option>
                <option value="Rabi">{t('form.season_rabi')}</option>
                <option value="Zaid">{t('form.season_zaid')}</option>
                <option value="Annual">{t('form.season_annual')}</option>
              </select>
            </div>

            {/* Farm Size */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5 text-stone-400" />
                <span>{t('form.farm_size')}</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={formData.farm_size || ''}
                  onChange={(e) => onChange('farm_size', e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full pl-3 pr-16 py-2 text-sm text-stone-900 bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-stone-400">
                  {t('form.farm_size_unit')}
                </span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
