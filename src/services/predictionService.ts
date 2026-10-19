import { CROPS, MANDIS } from '../data/mockMandiData';
import type { PredictionInput, PredictionResult, TrendDirection } from '../types';



/**
 * AI PREDICTION SERVICE LAYER
 * 
 * Future Python/Flask/FastAPI ML Integration:
 * To connect your trained machine learning model:
 * 1. Start your Flask/FastAPI server with an endpoint e.g., POST /api/predict
 * 2. Set VITE_PREDICTION_API_URL=http://localhost:5000/api/predict in your .env
 * 3. The service below will automatically forward the PredictionInput payload
 *    and map the ML model response!
 */

const PREDICTION_API_URL = import.meta.env.VITE_PREDICTION_API_URL || null;

export const predictionService = {
  /**
   * Predicts future crop price based on market input features
   */
  async predictCropPrice(input: PredictionInput): Promise<PredictionResult> {
    // 1. Future ML Backend Hook (Flask / FastAPI)
    if (PREDICTION_API_URL) {
      try {
        const response = await fetch(PREDICTION_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });

        if (response.ok) {
          const mlResult: PredictionResult = await response.json();
          return mlResult;
        }
      } catch (error) {
        console.warn('ML Backend unreachable, using client prototype estimator:', error);
      }
    }

    // 2. Client-Side Prototype Logic (Simulated 500ms AI compute time)
    await new Promise((resolve) => setTimeout(resolve, 550));

    const crop = CROPS.find((c) => c.id === input.cropId) || CROPS[0];
    const mandi = MANDIS.find((m) => m.id === input.mandiId) || MANDIS[0];

    const current = Math.max(100, Number(input.currentPrice) || 2000);
    const prev = Math.max(100, Number(input.previousPrice) || current * 0.98);

    // Momentum factor from recent price movement
    const momentum = (current - prev) / prev;

    // Seasonality adjustment factor based on harvest/off-season
    let seasonModifier = 0.02; // default mild inflation
    if (input.season === 'Harvest Peak') {
      seasonModifier = -0.035; // high arrivals usually depress prices slightly
    } else if (input.season === 'Lean / Off-Season') {
      seasonModifier = 0.045; // reduced market supply usually supports prices
    } else if (input.season === 'Sowing Period') {
      seasonModifier = 0.015;
    }

    // Calculated projected shift
    // Blended estimate: 60% seasonality cycle + 40% momentum
    const projectedChangePercent = (seasonModifier * 0.6 + momentum * 0.4) * 100;
    
    // Clamp realistic prototype variation between -12% and +15%
    const clampedPercent = Math.max(-12, Math.min(15, projectedChangePercent));
    
    // Predicted price rounded to nearest 10
    const rawPredicted = current * (1 + clampedPercent / 100);
    const predictedPrice = Math.round(rawPredicted / 10) * 10;
    const changeAmount = predictedPrice - current;
    const actualPercentChange = Math.round(((predictedPrice - current) / current) * 1000) / 10;

    let trend: TrendDirection = 'stable';
    if (actualPercentChange >= 1.5) {
      trend = 'increase';
    } else if (actualPercentChange <= -1.5) {
      trend = 'decrease';
    }

    // Farmer-friendly explanation
    let explanation = '';
    let marketInsight = '';
    const factors: string[] = [];

    if (trend === 'increase') {
      explanation = `Based on historical sample trends and seasonal supply patterns, ${crop.name} shows upward price momentum in ${mandi.name}.`;
      marketInsight = `Prices appear to be firming up. Farmers holding quality produce may consider monitoring mandis closely over the next 7-15 days for favorable selling windows.`;
      factors.push('Lower regional market arrivals expected');
      factors.push('Consistent wholesale consumer & mill demand');
      factors.push('Historical off-season price firmness');
    } else if (trend === 'decrease') {
      explanation = `Historical market patterns indicate that ${crop.name} prices may face slight downward pressure in ${mandi.name} as supply flows increase.`;
      marketInsight = `Higher harvest volume may bring moderate price corrections. Farmers with ready stock may evaluate immediate mandi rates versus storage costs.`;
      factors.push('Anticipated increase in fresh crop arrivals');
      factors.push('Adequate buffer inventory in distribution channels');
      factors.push('Seasonal harvest arrival peaks');
    } else {
      explanation = `Sample market data suggests ${crop.name} is trading in a steady consolidation range with minimal expected volatility in ${mandi.name}.`;
      marketInsight = `Prices are relatively stable. Normal mandi dispatch schedules without urgent distress sales or speculative hoarding appear suitable.`;
      factors.push('Balanced daily arrivals matching local demand');
      factors.push('Stable wholesale transport and logistic rates');
      factors.push('Close alignment with prevailing baseline benchmarks');
    }

    // Future prediction date target (e.g., 15 days ahead)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + (input.horizonDays || 15));
    const formattedTargetDate = targetDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    return {
      cropId: crop.id,
      cropName: crop.name,
      mandiId: mandi.id,
      mandiName: mandi.name,
      currentPrice: current,
      predictedPrice,
      changeAmount,
      changePercent: actualPercentChange,
      trend,
      confidenceLabel: 'Prototype estimate',
      modelStatus: 'Demo prediction',
      explanation,
      marketInsight,
      predictedDate: formattedTargetDate,
      keyFactors: factors,
    };
  },
};
