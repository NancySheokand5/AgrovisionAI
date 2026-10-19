// ============================================================
// AgroVision AI – AI Advisor Client Service
// ============================================================

import type {
  AdvisorChatRequest,
  AdvisorChatResponse,
  AdvisorHealthResponse,
  GovernmentScheme,
  SuggestedQuestion,
  ChatMessage
} from '../types/aiAdvisor';

const API_BASE = '/api/ai-advisor';

export const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  {
    id: 'sq-1',
    category: 'crop-management',
    categoryLabel: 'Crop Choice & Sowing',
    categoryLabelHi: 'फसल चयन व बुवाई',
    emoji: '🌾',
    questionEn: 'Which crop is suitable for my soil and climate?',
    questionHi: 'मेरी मिट्टी और मौसम के लिए कौन सी फसल सबसे उपयुक्त है?',
    tagEn: 'Soil & Climate Match',
    tagHi: 'मृदा व जलवायु'
  },
  {
    id: 'sq-2',
    category: 'pest-disease',
    categoryLabel: 'Crop Diseases & Pests',
    categoryLabelHi: 'कीट व रोग प्रबंधन',
    emoji: '🔬',
    questionEn: 'Why are my crop leaves turning yellow?',
    questionHi: 'फसल की पत्तियों में पीलापन क्यों आ रहा है और क्या उपाय करें?',
    tagEn: 'Leaf Yellowing & Pests',
    tagHi: 'पीलापन व कीट'
  },
  {
    id: 'sq-3',
    category: 'soil-fertilizer',
    categoryLabel: 'Soil & Fertilizers',
    categoryLabelHi: 'मिट्टी व खाद (NPK)',
    emoji: '🧪',
    questionEn: 'How do I understand soil pH and balanced NPK values?',
    questionHi: 'मिट्टी का pH और NPK संतुलन कैसे समझें व सुधारें?',
    tagEn: 'Nutrients & pH',
    tagHi: 'संतुलित उर्वरक'
  },
  {
    id: 'sq-4',
    category: 'weather-irrigation',
    categoryLabel: 'Weather & Irrigation',
    categoryLabelHi: 'मौसम व सिंचाई',
    emoji: '🌦',
    questionEn: 'When should I irrigate my crops given current weather?',
    questionHi: 'वर्तमान मौसम को देखते हुए खेत में अगली सिंचाई कब करनी चाहिए?',
    tagEn: 'Smart Watering',
    tagHi: 'सिंचाई समय'
  },
  {
    id: 'sq-5',
    category: 'government-schemes',
    categoryLabel: 'Government Schemes',
    categoryLabelHi: 'सरकारी योजनाएं व सब्सिडी',
    emoji: '🏛️',
    questionEn: 'How can I apply for PM-KISAN or PMFBY Crop Insurance?',
    questionHi: 'पीएम किसान ₹6,000 व पीएम फसल बीमा योजना का लाभ कैसे लें?',
    tagEn: 'PM-KISAN & PMFBY',
    tagHi: 'किसान योजनाएं'
  },
  {
    id: 'sq-6',
    category: 'mandi-selling',
    categoryLabel: 'Mandi Prices & Selling',
    categoryLabelHi: 'मंडी भाव व विक्रय निर्णय',
    emoji: '📈',
    questionEn: 'How can I compare mandi prices and decide when to sell?',
    questionHi: 'मंडी भाव की तुलना कैसे करें और फसल बेचने का सही समय क्या है?',
    tagEn: 'Price Comparison',
    tagHi: 'मंडी भाव रणनीति'
  }
];

export const aiAdvisorService = {
  /**
   * Send a question to the AI advisor endpoint
   */
  async sendMessage(payload: AdvisorChatRequest): Promise<AdvisorChatResponse> {
    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Advisor service returned status ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      console.warn('Backend chat failed, using local agronomic fallback:', err);
      return this.getLocalFallbackResponse(payload);
    }
  },

  /**
   * Check advisor service health & active LLM provider
   */
  async getHealth(): Promise<AdvisorHealthResponse> {
    try {
      const response = await fetch(`${API_BASE}/health`);
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('Failed to fetch advisor health:', err);
    }

    return {
      status: 'healthy',
      provider: 'agrovision-local-agronomy',
      model: 'agronomy-client-fallback-v2.4',
      hasLlmKey: false,
      supportedLanguages: ['en', 'hi'],
      knowledgeBaseVersion: '2.4.0',
      featuresConnected: ['crop_recommendation', 'crop_disease_detection', 'weather', 'mandi']
    };
  },

  /**
   * Fetch official verified government schemes
   */
  async getSchemes(): Promise<GovernmentScheme[]> {
    try {
      const response = await fetch(`${API_BASE}/schemes`);
      if (response.ok) {
        const data = await response.json();
        return data.schemes || [];
      }
    } catch (err) {
      console.warn('Failed to fetch schemes from backend:', err);
    }
    return [];
  },

  /**
   * Local storage conversation persistence
   */
  loadConversationHistory(): ChatMessage[] {
    try {
      const raw = localStorage.getItem('agrovision_advisor_chat_v1');
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to load chat history from localStorage', e);
    }
    return [];
  },

  saveConversationHistory(messages: ChatMessage[]): void {
    try {
      // Keep only last 30 messages in storage
      const toSave = messages.slice(-30);
      localStorage.setItem('agrovision_advisor_chat_v1', JSON.stringify(toSave));
    } catch (e) {
      console.warn('Failed to save chat history to localStorage', e);
    }
  },

  clearConversationHistory(): void {
    try {
      localStorage.removeItem('agrovision_advisor_chat_v1');
    } catch (e) {
      console.warn('Failed to clear chat history', e);
    }
  },

  /**
   * High-reliability client-side agronomic fallback in case of network drops
   */
  getLocalFallbackResponse(payload: AdvisorChatRequest): AdvisorChatResponse {
    const isHi = payload.language === 'hi' || /[\u0900-\u097F]/.test(payload.message);
    const loc = payload.context?.location || 'Karnal, Haryana';

    if (isHi) {
      return {
        success: true,
        reply: `### 🌾 AgroVision AI कृषि सलाहकार (ऑफलाइन मोड)

आपके खेत (**${loc}**) के संदर्भ में:

1. **फसल सुरक्षा:** यदि पत्तियों में पीलापन या कीट है, तो **Crop Disease Detection** में पत्ती की फोटो स्कैन करें।
2. **मिट्टी व खाद:** संतुलित NPK अनुपात (4:2:1) बनाए रखें। यूरिया को 2-3 किस्तों में ही दें।
3. **सरकारी योजनाएं:** PM-KISAN (₹6,000/वर्ष) और PMFBY फसल बीमा हेतु आधिकारिक पोर्टल pmkisan.gov.in व pmfby.gov.in पर जाएं।

> ℹ️ *नेटवर्क पुनर्स्थापित होने पर पूर्ण क्लाउड AI मॉडल स्वतः सक्रिय हो जाएगा।*`,
        language: 'hi',
        conversationId: payload.conversationId || 'local-session',
        provider: 'agrovision-local-fallback',
        model: 'client-agronomy-v1',
        featuresUsed: ['local_agronomy_knowledge'],
        actionLinks: [
          {
            label: 'Scan Leaf in Crop Disease Detection',
            hindiLabel: 'रोग पहचान हेतु पत्ती स्कैन करें',
            targetPage: 'crop-disease',
            icon: 'ScanLine'
          },
          {
            label: 'Open Crop Recommendation',
            hindiLabel: 'उपयुक्त फसल सिफारिश देखें',
            targetPage: 'crop-recommendation',
            icon: 'Sprout'
          }
        ],
        suggestedFollowUps: [
          'मेरी मिट्टी के लिए कौन सी फसल उपयुक्त है?',
          'गेहूं में पीलापन आने का क्या कारण है?',
          'PM-KISAN के लिए कौन से दस्तावेज चाहिए?'
        ]
      };
    }

    return {
      success: true,
      reply: `### 🌾 AgroVision AI Advisor (Offline Agronomy Mode)

Guidance for your farm in **${loc}**:

1. **Crop Health:** For leaf yellowing, check for Nitrogen deficiency (V-shaped yellowing on lower leaves) or excess moisture. Use the **Crop Disease Detection** module to photograph any diseased foliage.
2. **Fertilizer Management:** Maintain the standard 4:2:1 NPK balance for cereal crops. Apply all P & K at basal sowing and split Nitrogen into 3 timely doses.
3. **Government Support:** Verified central schemes like PM-KISAN (₹6,000/yr) and PMFBY crop insurance can be accessed at official portals pmkisan.gov.in and pmfby.gov.in.

> ℹ️ *Full cloud AI intelligence will automatically resume once the connection stabilizes.*`,
      language: 'en',
      conversationId: payload.conversationId || 'local-session',
      provider: 'agrovision-local-fallback',
      model: 'client-agronomy-v1',
      featuresUsed: ['local_agronomy_knowledge'],
      actionLinks: [
        {
          label: 'Scan Leaf in Crop Disease Detection',
          targetPage: 'crop-disease',
          icon: 'ScanLine'
        },
        {
          label: 'Open Crop Recommendation',
          targetPage: 'crop-recommendation',
          icon: 'Sprout'
        }
      ],
      suggestedFollowUps: [
        'Which crop is suitable for my soil and climate?',
        'Why are my crop leaves turning yellow?',
        'How can I compare mandi prices before selling?'
      ]
    };
  }
};
