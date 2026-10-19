/**
 * AgroVision AI - Weather Service Abstraction Layer
 * Provides normalized agricultural weather data from Open-Meteo live API.
 * Ensures both Weather Intelligence and Irrigation Advice share the exact same weather dataset.
 */

import {
  evaluateSpraySuitability,
  generateWeatherAlerts,
  type SpraySuitabilityResult,
  type WeatherRiskAlert
} from '../data/weatherRules';
import { calculateDailyGDD } from '../data/cropRules';

export interface LocationInfo {
  name: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface CurrentAgroWeather {
  temperature: number;
  feelsLike: number;
  condition: string;
  conditionCode: number;
  icon: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  precipitation: number;
  rain: number;
  uvIndex: number | null;
  soilTemperature: number | null; // °C (0-10cm)
  soilMoisture: number | null;    // % (0-7cm volumetric)
  sunrise: string;
  sunset: string;
  lastUpdated: string;
}

export interface DailyForecastDay {
  date: string;
  dayName: string;
  maxTemp: number;
  minTemp: number;
  rainChance: number;
  precipitationSum: number;
  windSpeedMax: number;
  et0: number; // FAO-56 Penman-Monteith (mm/day)
  condition: string;
  conditionCode: number;
  icon: string;
}

export interface HourlyForecastItem {
  time: string;
  hour: string;
  temperature: number;
  humidity: number;
  precipitationProbability: number;
  precipitation: number;
  soilMoisture: number | null;
  et0: number | null;
}

export interface NormalizedAgroVisionWeather {
  location: LocationInfo;
  current: CurrentAgroWeather;
  daily: DailyForecastDay[];
  hourly: HourlyForecastItem[];
  agriculture: {
    todayET0: number;
    weeklyTotalET0: number;
    spraySuitability: SpraySuitabilityResult;
    alerts: WeatherRiskAlert[];
    gdd: { gdd: number; baseTemp: number; isAvailable: boolean };
    insights: string[];
  };
  isLive: boolean;
  dataSourceNote: string;
}

// Map WMO Weather Interpretation Codes to friendly label & icon
export function mapWMOCode(code: number): { label: string; icon: string } {
  if (code === 0) return { label: 'Clear Sky', icon: '☀️' };
  if (code === 1) return { label: 'Mainly Clear', icon: '🌤️' };
  if (code === 2) return { label: 'Partly Cloudy', icon: '⛅' };
  if (code === 3) return { label: 'Overcast', icon: '☁️' };
  if ([45, 48].includes(code)) return { label: 'Fog / Mist', icon: '🌫️' };
  if ([51, 53, 55].includes(code)) return { label: 'Light Drizzle', icon: '🌦️' };
  if ([61, 63, 65].includes(code)) return { label: 'Rain Showers', icon: '🌧️' };
  if ([71, 73, 75].includes(code)) return { label: 'Snowfall', icon: '🌨️' };
  if ([80, 81, 82].includes(code)) return { label: 'Heavy Showers', icon: '🌧️' };
  if ([95, 96, 99].includes(code)) return { label: 'Thunderstorm', icon: '⛈️' };
  return { label: 'Partly Cloudy', icon: '🌤️' };
}

function getWindCompass(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 45) % 8;
  return directions[index];
}

const DEFAULT_LOCATION: LocationInfo = {
  name: 'Karnal',
  state: 'Haryana',
  country: 'India',
  latitude: 29.6857,
  longitude: 76.9905
};

const STORAGE_KEY_LOCATION = 'agrovision_selected_location';

export const weatherService = {
  getSavedLocation(): LocationInfo {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LOCATION);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_LOCATION;
  },

  setSavedLocation(location: LocationInfo): void {
    try {
      localStorage.setItem(STORAGE_KEY_LOCATION, JSON.stringify(location));
    } catch {
      // Ignore
    }
  },

  /**
   * Search locations using Open-Meteo Geocoding API
   */
  async searchLocations(query: string): Promise<LocationInfo[]> {
    if (!query || query.trim().length < 2) return [];

    try {
      const encoded = encodeURIComponent(query.trim());
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encoded}&count=8&language=en&format=json`
      );
      if (!res.ok) throw new Error('Geocoding search failed');
      const data = await res.json();
      if (!data.results || data.results.length === 0) return [];

      return data.results.map((r: any) => ({
        name: r.name,
        state: r.admin1 || r.admin2 || '',
        country: r.country || '',
        latitude: r.latitude,
        longitude: r.longitude
      }));
    } catch (err) {
      console.warn('Geocoding search error:', err);
      return [];
    }
  },

  /**
   * Fetches live normalized weather data from Open-Meteo
   */
  async getWeather(
    latitude?: number,
    longitude?: number,
    locationName?: string,
    cropId: string = 'wheat'
  ): Promise<NormalizedAgroVisionWeather> {
    const activeLoc = this.getSavedLocation();
    const lat = latitude ?? activeLoc.latitude;
    const lon = longitude ?? activeLoc.longitude;
    const locInfo: LocationInfo = {
      name: locationName || activeLoc.name,
      state: activeLoc.state,
      country: activeLoc.country,
      latitude: lat,
      longitude: lon
    };

    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,et0_fao_evapotranspiration&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,soil_temperature_0_to_10cm,soil_moisture_0_to_7cm,et0_fao_evapotranspiration&timezone=auto`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Open-Meteo HTTP error: ${response.status}`);
      }
      const data = await response.json();
      return this.normalizeOpenMeteoResponse(data, locInfo, cropId, true);
    } catch (err) {
      console.warn('Live Open-Meteo weather fetch failed, providing fallback dataset:', err);
      return this.getFallbackWeather(locInfo, cropId);
    }
  },

  normalizeOpenMeteoResponse(
    data: any,
    location: LocationInfo,
    cropId: string,
    isLive: boolean
  ): NormalizedAgroVisionWeather {
    const cur = data.current || {};
    const daily = data.daily || {};
    const hourly = data.hourly || {};

    const conditionMeta = mapWMOCode(cur.weather_code ?? 0);

    // Soil moisture conversion from m³/m³ to %
    let soilMoistPct: number | null = null;
    let soilTemp: number | null = null;
    if (hourly.soil_moisture_0_to_7cm && hourly.soil_moisture_0_to_7cm.length > 0) {
      const val = hourly.soil_moisture_0_to_7cm[0];
      if (val !== undefined && val !== null) {
        soilMoistPct = Math.round(val * 100 * 10) / 10;
      }
    }
    if (hourly.soil_temperature_0_to_10cm && hourly.soil_temperature_0_to_10cm.length > 0) {
      const sVal = hourly.soil_temperature_0_to_10cm[0];
      if (sVal !== undefined && sVal !== null) {
        soilTemp = Math.round(sVal * 10) / 10;
      }
    }

    const currentWeather: CurrentAgroWeather = {
      temperature: Math.round((cur.temperature_2m ?? 28) * 10) / 10,
      feelsLike: Math.round((cur.apparent_temperature ?? cur.temperature_2m ?? 28) * 10) / 10,
      condition: conditionMeta.label,
      conditionCode: cur.weather_code ?? 0,
      icon: conditionMeta.icon,
      humidity: Math.round(cur.relative_humidity_2m ?? 65),
      windSpeed: Math.round((cur.wind_speed_10m ?? 10) * 10) / 10,
      windDirection: getWindCompass(cur.wind_direction_10m ?? 0),
      precipitation: Math.round((cur.precipitation ?? 0) * 10) / 10,
      rain: Math.round((cur.rain ?? 0) * 10) / 10,
      uvIndex: cur.uv_index !== undefined ? Math.round(cur.uv_index * 10) / 10 : null,
      soilTemperature: soilTemp,
      soilMoisture: soilMoistPct,
      sunrise: (daily.sunrise && daily.sunrise[0]) ? daily.sunrise[0].split('T')[1] : '06:00',
      sunset: (daily.sunset && daily.sunset[0]) ? daily.sunset[0].split('T')[1] : '18:30',
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // 7-day forecast array
    const dailyForecast: DailyForecastDay[] = [];
    const numDays = Math.min((daily.time || []).length, 7);

    for (let i = 0; i < numDays; i++) {
      const dCode = daily.weather_code?.[i] ?? 0;
      const dMeta = mapWMOCode(dCode);
      const dateStr = daily.time?.[i] || '';
      const dayObj = new Date(dateStr);
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayObj.toLocaleDateString('en-US', { weekday: 'short' });

      dailyForecast.push({
        date: dateStr,
        dayName,
        maxTemp: Math.round(daily.temperature_2m_max?.[i] ?? 30),
        minTemp: Math.round(daily.temperature_2m_min?.[i] ?? 20),
        rainChance: Math.round(daily.precipitation_probability_max?.[i] ?? 10),
        precipitationSum: Math.round((daily.precipitation_sum?.[i] ?? 0) * 10) / 10,
        windSpeedMax: Math.round(daily.wind_speed_10m_max?.[i] ?? 12),
        et0: Math.round((daily.et0_fao_evapotranspiration?.[i] ?? 4.0) * 100) / 100,
        condition: dMeta.label,
        conditionCode: dCode,
        icon: dMeta.icon
      });
    }

    // Hourly forecast (next 24 hours)
    const hourlyForecast: HourlyForecastItem[] = [];
    const hTimes = hourly.time || [];
    const limitH = Math.min(hTimes.length, 24);

    for (let j = 0; j < limitH; j++) {
      const timeStr = hTimes[j] || '';
      const hourLabel = timeStr.includes('T') ? timeStr.split('T')[1].substring(0, 5) : `${j}:00`;

      hourlyForecast.push({
        time: timeStr,
        hour: hourLabel,
        temperature: Math.round(hourly.temperature_2m?.[j] ?? 25),
        humidity: Math.round(hourly.relative_humidity_2m?.[j] ?? 60),
        precipitationProbability: Math.round(hourly.precipitation_probability?.[j] ?? 0),
        precipitation: Math.round((hourly.precipitation?.[j] ?? 0) * 10) / 10,
        soilMoisture: hourly.soil_moisture_0_to_7cm?.[j] ? Math.round(hourly.soil_moisture_0_to_7cm[j] * 100) : null,
        et0: hourly.et0_fao_evapotranspiration?.[j] ? Math.round(hourly.et0_fao_evapotranspiration[j] * 100) / 100 : null
      });
    }

    // Agricultural calculations
    const todayET0 = dailyForecast[0]?.et0 || 4.2;
    const weeklyTotalET0 = Math.round(dailyForecast.reduce((acc, d) => acc + d.et0, 0) * 10) / 10;

    const todayRainChance = dailyForecast[0]?.rainChance || 10;
    const todayPrecipSum = dailyForecast[0]?.precipitationSum || 0;
    const todayMaxTemp = dailyForecast[0]?.maxTemp || 30;
    const todayMinTemp = dailyForecast[0]?.minTemp || 20;

    const spraySuitability = evaluateSpraySuitability(
      currentWeather.windSpeed,
      todayRainChance,
      todayPrecipSum,
      currentWeather.temperature
    );

    const alerts = generateWeatherAlerts(
      todayMaxTemp,
      todayMinTemp,
      currentWeather.humidity,
      currentWeather.windSpeed,
      todayRainChance
    );

    const gdd = calculateDailyGDD(todayMaxTemp, todayMinTemp, cropId);

    // Rule-based agricultural insights
    const insights: string[] = [];

    if (todayPrecipSum > 5 || todayRainChance > 60) {
      insights.push(`Rainfall expected (${todayPrecipSum} mm, ${todayRainChance}% chance). Suspend planned irrigation and check field drainage.`);
    } else if (todayPrecipSum === 0 && todayRainChance < 20) {
      insights.push(`Dry weather prevailing. Evapotranspiration is ${todayET0} mm/day. Monitor crop moisture demand.`);
    }

    if (currentWeather.humidity > 80 && currentWeather.temperature > 22) {
      insights.push(`Elevated humidity (${currentWeather.humidity}%) creates a microclimate favorable to fungal disease spores. Scout crops regularly.`);
    }

    if (currentWeather.windSpeed > 18) {
      insights.push(`Breezy conditions (${currentWeather.windSpeed} km/h). Postpone foliar pesticide and nutrient spraying to prevent drift losses.`);
    } else {
      insights.push(`Calm wind (${currentWeather.windSpeed} km/h) is favorable for field operations and spray applications.`);
    }

    if (todayMaxTemp >= 36) {
      insights.push(`High daytime temperatures (${todayMaxTemp}°C) will accelerate moisture depletion. Light evening watering recommended.`);
    }

    return {
      location,
      current: currentWeather,
      daily: dailyForecast,
      hourly: hourlyForecast,
      agriculture: {
        todayET0,
        weeklyTotalET0,
        spraySuitability,
        alerts,
        gdd,
        insights
      },
      isLive,
      dataSourceNote: isLive
        ? 'Live Open-Meteo meteorological feed with FAO-56 Penman-Monteith ET0'
        : 'Development prototype dataset (offline fallback)'
    };
  },

  getFallbackWeather(location: LocationInfo, cropId: string): NormalizedAgroVisionWeather {
    const fallbackData = {
      current: {
        temperature_2m: 28.5,
        apparent_temperature: 30.2,
        relative_humidity_2m: 68,
        wind_speed_10m: 11.5,
        wind_direction_10m: 110,
        precipitation: 0.0,
        rain: 0.0,
        weather_code: 2,
        uv_index: 6.2
      },
      daily: {
        time: ['2026-09-27', '2026-09-28', '2026-09-29', '2026-09-30', '2026-10-01', '2026-10-02', '2026-10-03'],
        weather_code: [2, 1, 61, 3, 0, 1, 2],
        temperature_2m_max: [30, 31, 27, 29, 32, 33, 31],
        temperature_2m_min: [21, 22, 20, 20, 21, 22, 21],
        sunrise: ['2026-09-27T06:14', '2026-09-28T06:15'],
        sunset: ['2026-09-27T18:18', '2026-09-28T18:17'],
        precipitation_sum: [0.0, 0.0, 6.5, 0.5, 0.0, 0.0, 0.0],
        precipitation_probability_max: [15, 20, 75, 30, 10, 10, 15],
        wind_speed_10m_max: [12, 14, 18, 11, 9, 10, 12],
        et0_fao_evapotranspiration: [4.15, 4.30, 2.90, 3.80, 4.60, 4.75, 4.40]
      },
      hourly: {
        time: Array.from({ length: 24 }, (_, i) => `2026-09-27T${String(i).padStart(2, '0')}:00`),
        temperature_2m: [22, 21, 20, 20, 21, 22, 24, 26, 28, 29, 30, 30, 29, 28, 27, 26, 25, 24, 23, 23, 22, 22, 21, 21],
        relative_humidity_2m: [80, 82, 85, 85, 83, 78, 70, 65, 60, 58, 55, 55, 58, 62, 68, 72, 75, 78, 80, 80, 81, 82, 82, 83],
        precipitation_probability: [0, 0, 0, 0, 5, 5, 10, 10, 15, 15, 15, 10, 10, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        precipitation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        soil_moisture_0_to_7cm: [0.38, 0.38, 0.38, 0.38, 0.37, 0.37, 0.36, 0.36, 0.35, 0.35, 0.35, 0.34, 0.34, 0.34, 0.35, 0.35, 0.36, 0.36, 0.36, 0.37, 0.37, 0.37, 0.38, 0.38],
        soil_temperature_0_to_10cm: [22.5, 22.0, 21.8, 21.5, 21.8, 22.4, 23.8, 25.2, 26.8, 27.5, 28.0, 28.2, 27.9, 27.1, 26.2, 25.4, 24.6, 24.0, 23.5, 23.2, 23.0, 22.8, 22.6, 22.5],
        et0_fao_evapotranspiration: [0, 0, 0, 0, 0.05, 0.15, 0.30, 0.45, 0.55, 0.60, 0.62, 0.58, 0.48, 0.35, 0.20, 0.08, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    };

    return this.normalizeOpenMeteoResponse(fallbackData, location, cropId, false);
  }
};
