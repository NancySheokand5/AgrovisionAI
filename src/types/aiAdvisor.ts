// ============================================================
// AgroVision AI – AI Advisor Type Definitions
// ============================================================

export type AdvisorLanguage = 'en' | 'hi';

export type QuestionCategory =
  | 'crop-management'
  | 'pest-disease'
  | 'soil-fertilizer'
  | 'weather-irrigation'
  | 'government-schemes'
  | 'mandi-selling';

export interface ActionLink {
  label: string;
  hindiLabel?: string;
  targetPage: 'crop-recommendation' | 'crop-disease' | 'weather' | 'irrigation' | 'mandi-prices';
  icon: 'Sprout' | 'ScanLine' | 'CloudSun' | 'Droplets' | 'TrendingUp';
  description?: string;
  params?: Record<string, any>;
}

export interface ChatMessageMetadata {
  provider?: string;
  model?: string;
  featuresUsed?: string[];
  actionLinks?: ActionLink[];
  verifiedFacts?: string[];
  safetyWarnings?: string[];
  followUpSuggestions?: string[];
  disclaimer?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'farmer' | 'assistant';
  content: string;
  timestamp: string;
  language: AdvisorLanguage;
  status?: 'sending' | 'sent' | 'error';
  metadata?: ChatMessageMetadata;
}

export interface SuggestedQuestion {
  id: string;
  category: QuestionCategory;
  categoryLabel: string;
  categoryLabelHi: string;
  emoji: string;
  questionEn: string;
  questionHi: string;
  tagEn: string;
  tagHi: string;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  hindiName: string;
  department: string;
  benefit: string;
  benefitHi: string;
  eligibility: string[];
  eligibilityHi: string[];
  documentsRequired: string[];
  documentsRequiredHi: string[];
  howToApply: string;
  howToApplyHi: string;
  officialUrl: string;
  category: 'direct-benefit' | 'insurance' | 'soil-water' | 'credit' | 'machinery';
}

export interface AdvisorContextPayload {
  farmerName?: string;
  location?: string;
  farmSize?: number;
  currentCrops?: string[];
  temperature?: number;
  humidity?: number;
  weatherCondition?: string;
  rainProbability?: number;
  soilMoisture?: number;
  soilPh?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  mandiPricesSummary?: Record<string, number>;
  activeDiseaseRisks?: string[];
}

export interface AdvisorChatRequest {
  message: string;
  language?: AdvisorLanguage;
  conversationId?: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  context?: AdvisorContextPayload;
}

export interface AdvisorChatResponse {
  success: boolean;
  reply: string;
  language: AdvisorLanguage;
  conversationId: string;
  provider: string;
  model: string;
  featuresUsed: string[];
  actionLinks: ActionLink[];
  suggestedFollowUps: string[];
  safetyWarnings?: string[];
  verifiedFacts?: string[];
  error?: string;
}

export interface AdvisorHealthResponse {
  status: 'healthy' | 'degraded';
  provider: string;
  model: string;
  hasLlmKey: boolean;
  supportedLanguages: string[];
  knowledgeBaseVersion: string;
  featuresConnected: string[];
}
