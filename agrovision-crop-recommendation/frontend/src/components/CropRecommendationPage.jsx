import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n';
import HeroSection from './HeroSection';
import FarmInputForm from './FarmInputForm';
import AnalysisLoader from './AnalysisLoader';
import RecommendationResult from './RecommendationResult';
import RecommendationHistory from './RecommendationHistory';
import { submitCropRecommendation, fetchSampleConditions } from '../services/api';
import { 
  getSavedRecommendations, 
  saveRecommendationRecord 
} from '../services/historyStorage';
import { AlertCircle } from 'lucide-react';

const DEFAULT_FORM_DATA = {
  N: 90,
  P: 42,
  K: 43,
  temperature: 24,
  humidity: 82,
  ph: 6.8,
  rainfall: 210,
  state: 'Haryana',
  district: 'Karnal',
  season: 'Kharif',
  farm_size: '4',
  farm_size_unit: 'Acres'
};

export default function CropRecommendationPage() {
  const { t } = useTranslation();
  const formRef = useRef(null);
  const resultRef = useRef(null);

  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [history, setHistory] = useState([]);
  const [samplePresets, setSamplePresets] = useState({});

  useEffect(() => {
    // Load initial history
    setHistory(getSavedRecommendations());

    // Fetch presets from backend
    fetchSampleConditions().then(res => {
      if (res && res.samples) {
        const mapped = {};
        res.samples.forEach(s => {
          if (s.name.includes('Rice')) mapped['rice'] = s;
          if (s.name.includes('Chickpea')) mapped['chickpea'] = s;
          if (s.name.includes('Banana')) mapped['banana'] = s;
          if (s.name.includes('Moth')) mapped['moth'] = s;
        });
        setSamplePresets(mapped);
      }
    });
  }, []);

  const handleFieldChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleScrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoadPreset = (presetKey) => {
    const preset = samplePresets[presetKey];
    if (preset) {
      setFormData({
        N: preset.data.N,
        P: preset.data.P,
        K: preset.data.K,
        temperature: preset.data.temperature,
        humidity: preset.data.humidity,
        ph: preset.data.ph,
        rainfall: preset.data.rainfall,
        state: preset.state || '',
        district: preset.district || '',
        season: preset.season || 'Kharif',
        farm_size: preset.farm_size || '4',
        farm_size_unit: preset.farm_size_unit || 'Acres'
      });
      handleScrollToForm();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setApiError(null);

    const payload = {
      N: Number(formData.N),
      P: Number(formData.P),
      K: Number(formData.K),
      temperature: Number(formData.temperature),
      humidity: Number(formData.humidity),
      ph: Number(formData.ph),
      rainfall: Number(formData.rainfall),
      state: formData.state,
      district: formData.district,
      season: formData.season,
      farm_size: formData.farm_size,
      farm_size_unit: formData.farm_size_unit
    };

    try {
      // Simulate brief UI milestone display for smooth UX
      const [res] = await Promise.all([
        submitCropRecommendation(payload),
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);

      if (res && res.success) {
        setResult(res);
        // Save to recommendation history
        saveRecommendationRecord(res, payload);
        setHistory(getSavedRecommendations());

        // Smooth scroll to result
        setTimeout(() => {
          if (resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        setApiError(res.error || 'Failed to analyze farm conditions.');
      }
    } catch (err) {
      setApiError(err.message || 'Unable to connect to AgroVision AI backend. Ensure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      N: '',
      P: '',
      K: '',
      temperature: '',
      humidity: '',
      ph: 6.5,
      rainfall: '',
      state: '',
      district: '',
      season: 'Kharif',
      farm_size: '',
      farm_size_unit: 'Acres'
    });
    setResult(null);
    setApiError(null);
  };

  const handleEditInputs = () => {
    handleScrollToForm();
  };

  const handleTryAnother = () => {
    setResult(null);
    handleScrollToForm();
  };

  const handleSelectHistoryRecord = (rec) => {
    if (rec.inputs) {
      setFormData({
        N: rec.inputs.N,
        P: rec.inputs.P,
        K: rec.inputs.K,
        temperature: rec.inputs.temperature,
        humidity: rec.inputs.humidity,
        ph: rec.inputs.ph,
        rainfall: rec.inputs.rainfall,
        state: rec.inputs.farm_meta?.state || '',
        district: rec.inputs.farm_meta?.district || '',
        season: rec.inputs.farm_meta?.season || 'Kharif',
        farm_size: rec.inputs.farm_meta?.farm_size || '',
        farm_size_unit: rec.inputs.farm_meta?.farm_size_unit || 'Acres'
      });
    }
    if (rec.result) {
      setResult(rec.result);
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Hero Presentation */}
      <HeroSection
        onScrollToForm={handleScrollToForm}
        onLoadPreset={handleLoadPreset}
      />

      {/* Global API Error Alert */}
      {apiError && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-semibold text-rose-900">Analysis Notice: </strong>
              <span>{apiError}</span>
            </div>
            <button
              type="button"
              onClick={() => setApiError(null)}
              className="text-xs font-bold text-rose-600 hover:text-rose-900"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Farm Input Form */}
      <FarmInputForm
        formRef={formRef}
        formData={formData}
        onChange={handleFieldChange}
        onSubmit={handleSubmit}
        onReset={handleReset}
        isLoading={isLoading}
      />

      {/* Loading State Milestone Animation */}
      {isLoading && <AnalysisLoader />}

      {/* Recommendation Result Presentation */}
      {result && !isLoading && (
        <div ref={resultRef} className="scroll-mt-20">
          <RecommendationResult
            result={result}
            rawInputs={{
              N: formData.N,
              P: formData.P,
              K: formData.K,
              temperature: formData.temperature,
              humidity: formData.humidity,
              ph: formData.ph,
              rainfall: formData.rainfall,
              farm_meta: {
                state: formData.state,
                district: formData.district,
                season: formData.season,
                farm_size: formData.farm_size,
                farm_size_unit: formData.farm_size_unit
              }
            }}
            onTryAnother={handleTryAnother}
            onEditInputs={handleEditInputs}
          />
        </div>
      )}

      {/* Recommendation History Section */}
      <RecommendationHistory
        history={history}
        onSelectRecord={handleSelectHistoryRecord}
        onRefreshHistory={() => setHistory(getSavedRecommendations())}
      />

    </div>
  );
}
