import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';

export default function VoiceButton({ recommendation, cropInfo, whyFactors }) {
  const { language, t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleVoice = () => {
    if (!isSupported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Prepare speech text according to active language
    let speechText = '';
    const cropName = recommendation.display_name;
    const hindiName = recommendation.hindi_name || '';

    if (language === 'hi') {
      const topFactors = (whyFactors || [])
        .filter(f => f.status === 'optimal')
        .slice(0, 3)
        .map(f => f.explanation)
        .join('. ');

      const tips = (cropInfo?.care_tips || []).slice(0, 2).join('. ');

      speechText = `एग्रोविज़न एआई सिफारिश: आपके खेत की मिट्टी और मौसम के लिए सबसे उपयुक्त फसल ${cropName} ${hindiName} है। अनुकूलता स्तर ${recommendation.suitability_level} है। सिफारिश का मुख्य कारण: ${topFactors}। महत्वपूर्ण कृषि सलाह: ${tips}`;
    } else {
      const topFactors = (whyFactors || [])
        .filter(f => f.status === 'optimal')
        .slice(0, 3)
        .map(f => f.explanation)
        .join('. ');

      const tips = (cropInfo?.care_tips || []).slice(0, 2).join('. ');

      speechText = `AgroVision AI recommendation. The optimal crop for your farm conditions is ${cropName}. Suitability is assessed as ${recommendation.suitability_level}. Key matching factors: ${topFactors}. Basic agronomic guidance: ${tips}.`;
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95; // Slightly slower for clear farmer comprehension
    utterance.pitch = 1.0;

    // Pick a natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith(language === 'hi' ? 'hi' : 'en'));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={handleToggleVoice}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border transition-all cursor-pointer ${
        isPlaying
          ? 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
          : 'bg-white text-stone-700 hover:text-emerald-800 border-stone-300 hover:border-emerald-400 hover:bg-emerald-50/50 shadow-2xs'
      }`}
      aria-label={isPlaying ? t('result.stop_audio') : t('result.listen_btn')}
    >
      {isPlaying ? (
        <>
          <div className="flex items-center gap-0.5 h-4">
            <span className="w-1 h-3 bg-rose-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1 h-4 bg-rose-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1 h-2 bg-rose-600 rounded-full animate-bounce" />
          </div>
          <span>{t('result.stop_audio')}</span>
          <VolumeX className="w-4 h-4 text-rose-600" />
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-emerald-600" />
          <span>{t('result.listen_btn')}</span>
        </>
      )}
    </button>
  );
}
