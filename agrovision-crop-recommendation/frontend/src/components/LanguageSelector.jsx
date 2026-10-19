import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { Globe, ChevronDown, Check } from 'lucide-react';

export default function LanguageSelector() {
  const { language, setLanguage, availableLanguages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = availableLanguages.find(l => l.code === language) || availableLanguages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-full shadow-xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
        aria-label="Select Language"
      >
        <Globe className="w-4 h-4 text-emerald-600" />
        <span>{currentLang.native}</span>
        <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-stone-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1 text-xs font-semibold text-stone-400 uppercase tracking-wider">
            Select Language / भाषा
          </div>
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              disabled={lang.disabled}
              onClick={() => {
                if (!lang.disabled) {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors ${
                lang.disabled
                  ? 'text-stone-300 cursor-not-allowed'
                  : language === lang.code
                  ? 'bg-emerald-50 text-emerald-800 font-medium'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span>{lang.native}</span>
              {language === lang.code && <Check className="w-4 h-4 text-emerald-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
