import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Copy,
  Check,
  ArrowRight,
  Sprout,
  ScanLine,
  CloudSun,
  Droplets,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  RefreshCw
} from 'lucide-react';
import type {
  ChatMessage,
  AdvisorLanguage,
  QuestionCategory,
  ActionLink,
  AdvisorHealthResponse
} from '../../types/aiAdvisor';
import {
  aiAdvisorService,
  SUGGESTED_QUESTIONS
} from '../../services/aiAdvisorService';
import type { DashboardNavPage } from '../dashboard/DashboardHeader';

interface AgroVisionAIAdvisorPageProps {
  onBackToDashboard: () => void;
  onNavigate: (page: DashboardNavPage) => void;
  onSwitchToMandi: () => void;
}

export const AgroVisionAIAdvisorPage: React.FC<AgroVisionAIAdvisorPageProps> = ({
  onBackToDashboard,
  onNavigate,
  onSwitchToMandi
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<AdvisorLanguage>('en');
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [health, setHealth] = useState<AdvisorHealthResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Farm context for AI reasoning
  const farmContext = {
    farmerName: 'Ramesh Kumar',
    location: 'Karnal, Haryana',
    farmSize: 12,
    currentCrops: ['Wheat (HD-3086)', 'Mustard (RH-749)', 'Tomato (Pusa Ruby)'],
    temperature: 28,
    humidity: 72,
    weatherCondition: 'Partly Cloudy',
    rainProbability: 20,
    soilPh: 6.8,
    nitrogen: 82,
    phosphorus: 58,
    potassium: 195,
    mandiPricesSummary: {
      wheat: 2275,
      rice: 3100,
      mustard: 5450,
      tomato: 1850
    }
  };

  // Initial load
  useEffect(() => {
    // 1. Fetch health
    aiAdvisorService.getHealth().then(setHealth).catch(console.error);

    // 2. Load cached chat history or create initial welcome message
    const saved = aiAdvisorService.loadConversationHistory();
    if (saved && saved.length > 0) {
      setMessages(saved);
    } else {
      createWelcomeMessage(language);
    }

    // 3. Setup SpeechRecognition if supported
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Update speech recognition language when state changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    }
  }, [language]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const createWelcomeMessage = (lang: AdvisorLanguage) => {
    const welcomeEn = `### 👨‍🌾 Welcome to AgroVision AI Advisor!

I am your dedicated smart farming companion, tailored to your farm in **Karnal, Haryana**.

**How I can assist you today:**
• 🌾 **Crop Choice & Sowing:** Identify optimal crop varieties suited to your soil and regional climate.
• 🔬 **Pest & Disease Diagnosis:** Actionable guidance for yellowing leaves, blight, and pest control.
• 🧪 **Soil & Fertilizers:** Balanced NPK ratios and soil health tips.
• 🌦 **Weather & Irrigation:** Smart water scheduling based on our live **28°C & 72% humidity** data.
• 🏛️ **Government Schemes:** Step-by-step eligibility and application help for PM-KISAN, PMFBY, and KCC.
• 📈 **Mandi Selling Decisions:** Real-time prices (Wheat ₹2,275, Mustard ₹5,450) and marketing guidance.

Feel free to choose a suggested question below or ask anything in simple English or Hindi!`;

    const welcomeHi = `### 👨‍🌾 AgroVision AI कृषि सलाहकार में आपका स्वागत है!

मैं आपके खेत (**करनाल, हरियाणा**) के लिए विशेष रूप से तैयार किया गया आपका स्मार्ट कृषि साथी हूँ।

**मैं आपकी इन विषयों में मदद कर सकता हूँ:**
• 🌾 **फसल चयन व बुवाई:** आपकी मिट्टी और मौसम के लिए सबसे उपयुक्त व अधिक पैदावार देने वाली किस्में।
• 🔬 **कीट व रोग प्रबंधन:** पत्तियों का पीलापन, झुलसा रोग और सुरक्षित कीट रोकथाम।
• 🧪 **मिट्टी व संतुलित खाद:** NPK (नाइट्रोजन, फास्फोरस, पोटाश) अनुपात और मृदा सुधार।
• 🌦 **मौसम व सिंचाई:** ताजा मौसम (**28°C व 72% नमी**) के आधार पर सिंचाई का सही समय।
• 🏛️ **सरकारी योजनाएं:** PM-KISAN, PMFBY फसल बीमा और KCC ऋण की पात्रता व आवेदन विधि।
• 📈 **मंडी भाव व विक्रय:** गेहूं (₹2,275), सरसों (₹5,450) के भाव व सही समय पर बेचने की रणनीति।

नीचे दिए गए किसी भी सुझाव पर क्लिक करें या सीधे अपना प्रश्न सरल हिंदी में टाइप करें!`;

    const initialMsg: ChatMessage = {
      id: 'welcome-msg',
      sender: 'assistant',
      content: lang === 'hi' ? welcomeHi : welcomeEn,
      timestamp: new Date().toISOString(),
      language: lang,
      status: 'sent',
      metadata: {
        provider: 'AgroVision Verified Knowledge Base',
        model: 'Agronomy Expert v2.4',
        featuresUsed: ['soil', 'weather', 'mandi', 'schemes'],
        actionLinks: [
          {
            label: 'Calculate Crop Match',
            hindiLabel: 'उपयुक्त फसल जांचें',
            targetPage: 'crop-recommendation',
            icon: 'Sprout'
          },
          {
            label: 'Scan Leaf for Disease',
            hindiLabel: 'पत्ती रोग स्कैन करें',
            targetPage: 'crop-disease',
            icon: 'ScanLine'
          }
        ],
        followUpSuggestions: lang === 'hi' ? [
          'मेरी मिट्टी के लिए कौन सी फसल सबसे उपयुक्त है?',
          'गेहूं की पत्तियों में पीलापन क्यों आ रहा है?',
          'PM-KISAN योजना के तहत ₹6,000 कैसे प्राप्त करें?'
        ] : [
          'Which crop is suitable for my soil and climate?',
          'Why are my crop leaves turning yellow?',
          'How can I apply for PM-KISAN or PMFBY?'
        ]
      }
    };

    setMessages([initialMsg]);
    aiAdvisorService.saveConversationHistory([initialMsg]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    setErrorMessage(null);
    setInputValue('');

    // Detect language if text contains Hindi characters
    const detectedLang: AdvisorLanguage = /[\u0900-\u097F]/.test(text) ? 'hi' : language;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'farmer',
      content: text,
      timestamp: new Date().toISOString(),
      language: detectedLang,
      status: 'sent'
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    aiAdvisorService.saveConversationHistory(updatedMessages);
    setIsLoading(true);

    try {
      // Build conversation history format
      const historyPayload = updatedMessages.slice(-6).map((m) => ({
        role: m.sender === 'farmer' ? ('user' as const) : ('assistant' as const),
        content: m.content
      }));

      const response = await aiAdvisorService.sendMessage({
        message: text,
        language: detectedLang,
        conversationId: 'agrovision-session-1',
        history: historyPayload,
        context: farmContext
      });

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString(),
        language: response.language || detectedLang,
        status: 'sent',
        metadata: {
          provider: response.provider,
          model: response.model,
          featuresUsed: response.featuresUsed,
          actionLinks: response.actionLinks,
          followUpSuggestions: response.suggestedFollowUps,
          safetyWarnings: response.safetyWarnings,
          verifiedFacts: response.verifiedFacts
        }
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      aiAdvisorService.saveConversationHistory(finalMessages);
    } catch (err: any) {
      console.error('Failed to get answer:', err);
      setErrorMessage(
        detectedLang === 'hi'
          ? 'उत्तर प्राप्त करने में समस्या हुई। कृपया पुनः प्रयास करें।'
          : 'Could not connect to the advisor service. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (window.confirm(language === 'hi' ? 'क्या आप पूरी बातचीत मिटाना चाहते हैं?' : 'Clear all conversation history?')) {
      aiAdvisorService.clearConversationHistory();
      window.speechSynthesis?.cancel();
      createWelcomeMessage(language);
    }
  };

  const handleToggleLanguage = (newLang: AdvisorLanguage) => {
    setLanguage(newLang);
    // If only welcome message exists, re-generate in new language
    if (messages.length <= 1) {
      createWelcomeMessage(newLang);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string, lang: AdvisorLanguage) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner audio
    const cleanText = text
      .replace(/[#*`_>•]/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleToggleMic = () => {
    if (!recognitionRef.current) {
      alert(language === 'hi' ? 'आपके ब्राउज़र में आवाज इनपुट उपलब्ध नहीं है।' : 'Voice recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Speech recognition start failed', e);
      }
    }
  };

  const handleActionClick = (action: ActionLink) => {
    if (action.targetPage === 'mandi-prices') {
      onSwitchToMandi();
    } else {
      onNavigate(action.targetPage);
    }
  };

  const filteredQuestions =
    selectedCategory === 'all'
      ? SUGGESTED_QUESTIONS
      : SUGGESTED_QUESTIONS.filter((q) => q.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* ── Top Bar / Header ── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-6 text-white shadow-xl shadow-slate-900/10 border border-slate-800 relative overflow-hidden">
        {/* Decorative blur glows */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={onBackToDashboard}
                className="flex items-center gap-1 text-xs text-slate-300 hover:text-white transition-colors mr-2 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Farm AI
              </div>
              {health && (
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                  [{health.provider}]
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 flex-shrink-0">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  AgroVision AI Advisor
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </h1>
                <p className="text-xs text-slate-300 mt-0.5">
                  Your smart farming companion — ask questions, understand your crops, and make informed farming decisions.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Language toggle */}
            <div className="flex items-center rounded-xl bg-white/10 p-1 border border-white/10 text-xs">
              <button
                onClick={() => handleToggleLanguage('en')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  language === 'en'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => handleToggleLanguage('hi')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  language === 'hi'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Clear conversation */}
            <button
              onClick={handleClearChat}
              title="New Chat / Clear Conversation"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 transition-colors border border-white/10"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Chat</span>
            </button>
          </div>
        </div>

        {/* Real Farm Context Chips Strip */}
        <div className="relative mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-white/5 rounded-xl px-3 py-2 border border-white/10">
            <span className="text-[10px] text-slate-400 block font-medium">📍 Farm Location</span>
            <span className="font-semibold text-slate-200">Karnal, Haryana (12 ac)</span>
          </div>
          <div className="bg-white/5 rounded-xl px-3 py-2 border border-white/10">
            <span className="text-[10px] text-slate-400 block font-medium">🌦 Live Weather</span>
            <span className="font-semibold text-emerald-300">28°C · Hum: 72% · Rain: 20%</span>
          </div>
          <div className="bg-white/5 rounded-xl px-3 py-2 border border-white/10">
            <span className="text-[10px] text-slate-400 block font-medium">🧪 Soil Condition</span>
            <span className="font-semibold text-slate-200">pH 6.8 · N:82 P:58 K:195</span>
          </div>
          <div className="bg-white/5 rounded-xl px-3 py-2 border border-white/10">
            <span className="text-[10px] text-slate-400 block font-medium">💰 Mandi Benchmarks</span>
            <span className="font-semibold text-amber-300">Wheat ₹2,275 · Mustard ₹5,450</span>
          </div>
        </div>
      </div>

      {/* ── Suggested Questions Carousel / Grid ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-800">
              {language === 'hi' ? 'सुझाए गए प्रमुख कृषि प्रश्न' : 'Suggested Agricultural Questions'}
            </h2>
          </div>
          <span className="text-[11px] text-slate-500">
            {language === 'hi' ? 'किसी भी कार्ड पर क्लिक करके पूछें' : 'Click any card to ask immediately'}
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-2.5 border-b border-slate-100 text-xs">
          {[
            { id: 'all', label: language === 'hi' ? 'सभी विषय' : 'All Topics' },
            { id: 'crop-management', label: language === 'hi' ? '🌾 फसल चयन' : '🌾 Crop Choice' },
            { id: 'pest-disease', label: language === 'hi' ? '🔬 कीट व रोग' : '🔬 Pests & Disease' },
            { id: 'soil-fertilizer', label: language === 'hi' ? '🧪 मिट्टी व खाद' : '🧪 Soil & Fertilizer' },
            { id: 'weather-irrigation', label: language === 'hi' ? '🌦 मौसम व सिंचाई' : '🌦 Weather & Water' },
            { id: 'government-schemes', label: language === 'hi' ? '🏛️ योजनाएं' : '🏛️ Govt Schemes' },
            { id: 'mandi-selling', label: language === 'hi' ? '📈 मंडी भाव' : '📈 Mandi Prices' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {filteredQuestions.map((sq) => (
            <button
              key={sq.id}
              onClick={() => handleSendMessage(language === 'hi' ? sq.questionHi : sq.questionEn)}
              disabled={isLoading}
              className="flex items-start gap-3 p-3 rounded-xl border border-slate-200/90 hover:border-emerald-300 bg-slate-50/70 hover:bg-emerald-50/60 transition-all text-left group cursor-pointer"
            >
              <span className="text-xl p-1.5 rounded-lg bg-white shadow-2xs border border-slate-200/60 group-hover:scale-110 transition-transform flex-shrink-0">
                {sq.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">
                    {language === 'hi' ? sq.tagHi : sq.tagEn}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs font-semibold text-slate-800 leading-snug line-clamp-2">
                  {language === 'hi' ? sq.questionHi : sq.questionEn}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Chat Conversation Box ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-[500px]">
        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 space-y-5 overflow-y-auto max-h-[600px]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'farmer';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {/* AI Avatar */}
                {!isUser && (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-emerald-600/20 mt-1">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 text-sm transition-all ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-none shadow-sm shadow-emerald-600/20'
                      : 'bg-slate-50 border border-slate-200/90 text-slate-800 rounded-tl-none shadow-xs'
                  }`}
                >
                  {/* Sender title & controls */}
                  <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-black/5 dark:border-white/10 text-xs">
                    <span className={`font-bold flex items-center gap-1.5 ${isUser ? 'text-emerald-100' : 'text-emerald-800'}`}>
                      {isUser ? 'You (Farmer)' : 'AgroVision AI Advisor'}
                      {!isUser && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                          Agronomist
                        </span>
                      )}
                    </span>

                    <div className="flex items-center gap-1 text-[11px] opacity-75">
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

                      {!isUser && (
                        <>
                          {/* Audio speak */}
                          <button
                            onClick={() => handleSpeak(msg.id, msg.content, msg.language)}
                            title={speakingId === msg.id ? 'Stop reading' : 'Listen to answer'}
                            className={`p-1 rounded hover:bg-slate-200 transition-colors ${speakingId === msg.id ? 'text-emerald-600 font-bold' : ''}`}
                          >
                            {speakingId === msg.id ? <VolumeX className="w-3.5 h-3.5 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
                          </button>

                          {/* Copy */}
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            title="Copy answer"
                            className="p-1 rounded hover:bg-slate-200 transition-colors"
                          >
                            {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed space-y-2 whitespace-pre-wrap break-words">
                    {msg.content}
                  </div>

                  {/* Verified Facts & Safety Badges */}
                  {!isUser && msg.metadata?.verifiedFacts && msg.metadata.verifiedFacts.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200/70 flex flex-wrap gap-1.5">
                      {msg.metadata.verifiedFacts.map((fact, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                        >
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          {fact}
                        </span>
                      ))}
                    </div>
                  )}

                  {!isUser && msg.metadata?.safetyWarnings && msg.metadata.safetyWarnings.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {msg.metadata.safetyWarnings.map((warn, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200"
                        >
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          {warn}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Link Buttons */}
                  {!isUser && msg.metadata?.actionLinks && msg.metadata.actionLinks.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200/70 space-y-2">
                      <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                        {msg.language === 'hi' ? 'संबंधित टूल्स व अगली कार्रवाई:' : 'Connected Tools & Recommended Actions:'}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.metadata.actionLinks.map((action, idx) => {
                          const IconComponent =
                            action.icon === 'Sprout'
                              ? Sprout
                              : action.icon === 'ScanLine'
                              ? ScanLine
                              : action.icon === 'CloudSun'
                              ? CloudSun
                              : action.icon === 'Droplets'
                              ? Droplets
                              : TrendingUp;

                          return (
                            <button
                              key={idx}
                              onClick={() => handleActionClick(action)}
                              className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50/80 transition-colors text-left group shadow-2xs"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold text-slate-800">
                                  {msg.language === 'hi' && action.hindiLabel ? action.hindiLabel : action.label}
                                </span>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Follow-up question chips */}
                  {!isUser && msg.metadata?.followUpSuggestions && msg.metadata.followUpSuggestions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200/70">
                      <div className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        {msg.language === 'hi' ? 'संबंधित अगले प्रश्न (क्लिक करें):' : 'Suggested follow-up questions:'}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.metadata.followUpSuggestions.map((fu, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(fu)}
                            disabled={isLoading}
                            className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 transition-colors text-left"
                          >
                            {fu}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm mt-1">
                    RK
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-emerald-600/20">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none p-4 text-xs text-slate-600 flex items-center gap-2 shadow-xs">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>
                  {language === 'hi'
                    ? 'AgroVision AI आपके प्रश्न और खेत डेटा का विश्लेषण कर रहा है...'
                    : 'AgroVision AI is analyzing your question & farm data...'}
                </span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => handleSendMessage()}
                className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-medium hover:bg-rose-700 transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Retry
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Input Box ── */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 rounded-b-2xl">
          <div className="relative flex items-end gap-2 bg-white rounded-xl border border-slate-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 p-2 shadow-xs transition-all">
            {/* Auto-growing Textarea */}
            <textarea
              ref={textareaRef}
              rows={2}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder={
                language === 'hi'
                  ? 'अपनी खेती से जुड़ा कोई भी सवाल पूछें... (जैसे: गेहूं में पीलापन, खाद की मात्रा, मौसम सलाह)'
                  : 'Ask anything about your farming... (e.g. why are wheat leaves turning yellow, fertilizer dosage, irrigation)'
              }
              className="flex-1 bg-transparent border-0 resize-none text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none p-1.5 max-h-32 leading-relaxed"
            />

            {/* Input buttons */}
            <div className="flex items-center gap-1 pb-1">
              {/* Mic / Voice dictation */}
              <button
                type="button"
                onClick={handleToggleMic}
                title={isListening ? 'Listening... click to stop' : 'Voice input (Speak)'}
                className={`p-2 rounded-lg transition-colors ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className="p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all active:scale-95 shadow-sm shadow-emerald-600/30"
                aria-label="Send message"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 mt-2">
            <span>
              {language === 'hi'
                ? 'Enter दबाकर भेजें • Shift+Enter से नई लाइन'
                : 'Press Enter to send • Shift+Enter for new line'}
            </span>
            <span className="text-[10px] opacity-75">
              Verified for Indian Agro-climatic Zones
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
