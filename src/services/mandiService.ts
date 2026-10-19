import {
  CROPS,
  STATES,
  MANDIS,
  generateCurrentPriceRecord,
  generateHistoricalPrices,
} from '../data/mockMandiData';
import type {
  Crop,
  State,
  Mandi,
  MandiPriceRecord,
  MandiComparisonItem,
  HistoricalPricePoint,
} from '../types';


/**
 * MANDI SERVICE LAYER
 * 
 * Future API Integration Hook:
 * When connecting to live government APIs (e.g., AGMARKNET, eNAM, data.gov.in),
 * set VITE_MANDI_API_URL in your environment and replace the mock return statements
 * with fetch/axios calls to your backend proxy.
 */

const API_BASE_URL = import.meta.env.VITE_MANDI_API_URL || null;

export const mandiService = {
  /**
   * Fetches all supported commodities/crops
   */
  async getCrops(): Promise<Crop[]> {
    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/crops`);
        if (response.ok) return await response.json();
      } catch (err) {
        console.warn('API fetch failed, falling back to prototype dataset', err);
      }
    }
    return Promise.resolve(CROPS);
  },

  /**
   * Fetches supported states
   */
  async getStates(): Promise<State[]> {
    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/states`);
        if (response.ok) return await response.json();
      } catch (err) {
        console.warn('API fetch failed, falling back to prototype dataset', err);
      }
    }
    return Promise.resolve(STATES);
  },

  /**
   * Fetches mandis filtered by state
   */
  async getMandisByState(stateId: string): Promise<Mandi[]> {
    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/mandis?state=${stateId}`);
        if (response.ok) return await response.json();
      } catch (err) {
        console.warn('API fetch failed, falling back to prototype dataset', err);
      }
    }
    const filtered = MANDIS.filter((m) => m.stateId === stateId);
    return Promise.resolve(filtered.length > 0 ? filtered : MANDIS.slice(0, 4));
  },

  /**
   * Fetches a specific mandi details
   */
  async getMandiById(mandiId: string): Promise<Mandi | undefined> {
    return Promise.resolve(MANDIS.find((m) => m.id === mandiId));
  },

  /**
   * Fetches latest market price for a selected crop and mandi
   */
  async getCurrentPrice(cropId: string, mandiId: string): Promise<MandiPriceRecord> {
    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/price?crop=${cropId}&mandi=${mandiId}`);
        if (response.ok) return await response.json();
      } catch (err) {
        console.warn('API fetch failed, falling back to prototype dataset', err);
      }
    }
    // Simulate brief network latency for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 80));
    return Promise.resolve(generateCurrentPriceRecord(cropId, mandiId));
  },

  /**
   * Compares prices across multiple mandis in the state/nearby
   */
  async getMandiComparisons(
    cropId: string,
    stateId: string,
    selectedMandiId: string
  ): Promise<MandiComparisonItem[]> {
    const stateMandis = MANDIS.filter((m) => m.stateId === stateId);
    // If state has fewer than 3 mandis, include a couple from adjacent states for realistic comparison
    const mandisToCompare = stateMandis.length >= 3 ? stateMandis : MANDIS.slice(0, 5);

    const stateObj = STATES.find((s) => s.id === stateId);
    const stateName = stateObj ? stateObj.name : 'Regional';

    const currentRecord = generateCurrentPriceRecord(cropId, selectedMandiId);
    const baseModal = currentRecord.modalPrice;

    const items: MandiComparisonItem[] = mandisToCompare.map((m) => {
      const rec = generateCurrentPriceRecord(cropId, m.id);
      const diff = rec.modalPrice - baseModal;
      const pct = baseModal > 0 ? (diff / baseModal) * 100 : 0;
      
      const mState = STATES.find((s) => s.id === m.stateId);

      return {
        mandiId: m.id,
        mandiName: m.name,
        district: m.district,
        stateName: mState?.name || stateName,
        minPrice: rec.minPrice,
        maxPrice: rec.maxPrice,
        modalPrice: rec.modalPrice,
        arrivalQuantity: rec.arrivalQuantity,
        differenceVsSelected: diff,
        percentDiffVsSelected: Math.round(pct * 10) / 10,
        isSelected: m.id === selectedMandiId,
      };
    });

    return Promise.resolve(items);
  },

  /**
   * Fetches historical time-series price data
   */
  async getHistoricalPrices(
    cropId: string,
    mandiId: string,
    days: number
  ): Promise<HistoricalPricePoint[]> {
    if (API_BASE_URL) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/historical?crop=${cropId}&mandi=${mandiId}&days=${days}`
        );
        if (response.ok) return await response.json();
      } catch (err) {
        console.warn('API fetch failed, falling back to prototype dataset', err);
      }
    }
    return Promise.resolve(generateHistoricalPrices(cropId, mandiId, days));
  },
};
