import {
  DayForecast,
  GeoCity,
  HourlyPoint,
  OpenMeteoForecastResponse,
  ProcessedCurrentWeather,
  WeatherIntelligence,
} from '../types';
import { generateRecommendations } from '../utils/recommendations';
import { getWeatherCodeInfo } from '../utils/weatherCodes';

export class WeatherApiError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'WeatherApiError';
  }
}

/**
 * Converts a city name to latitude/longitude using Open-Meteo Geocoding API
 */
export async function searchCities(query: string): Promise<GeoCity[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const endpoint = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    trimmed
  )}&count=8&language=en&format=json`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const res = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new WeatherApiError(`Geocoding service returned status ${res.status}`, 'HTTP_ERROR');
    }

    const data = await res.json();

    if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
      return [];
    }

    return data.results.map((r: any) => ({
      id: r.id,
      name: r.name,
      latitude: r.latitude,
      longitude: r.longitude,
      elevation: r.elevation,
      country_code: r.country_code,
      country: r.country,
      admin1: r.admin1,
      admin2: r.admin2,
      timezone: r.timezone,
      population: r.population,
    }));
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new WeatherApiError('Search request timed out. Please check your network connection and try again.', 'TIMEOUT');
    }
    if (err instanceof WeatherApiError) {
      throw err;
    }
    throw new WeatherApiError('Failed to connect to the weather geocoding service. Please check your internet connection.', 'NETWORK_ERROR');
  }
}

/**
 * Reverse geocodes coordinates to a city name or returns a standard fallback
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<GeoCity> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: {
          'Accept-Language': 'en',
        },
      }
    );
    if (res.ok) {
      const data = await res.json();
      const name =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.municipality ||
        data.address?.county ||
        'Current Location';
      const country = data.address?.country || '';
      const admin1 = data.address?.state || data.address?.region || '';

      return {
        id: Math.floor(Math.random() * 1000000),
        name,
        latitude,
        longitude,
        country,
        admin1,
      };
    }
  } catch {
    // Graceful fallback below
  }

  return {
    id: 1,
    name: 'Current Location',
    latitude,
    longitude,
    country: '',
    admin1: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
  };
}

/**
 * Fetches comprehensive weather forecast from Open-Meteo
 */
export async function fetchWeatherForecast(city: GeoCity): Promise<WeatherIntelligence> {
  const { latitude, longitude } = city;
  const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max,uv_index_max,wind_speed_10m_max,sunrise,sunset&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weathercode,wind_speed_10m,surface_pressure,uv_index&timezone=auto`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new WeatherApiError(`Weather service returned HTTP ${res.status}`, 'HTTP_ERROR');
    }

    const data: OpenMeteoForecastResponse = await res.json();

    if (!data.current_weather || !data.daily) {
      throw new WeatherApiError('Incomplete weather forecast received from server.', 'PARSE_ERROR');
    }

    // Process current weather details
    const cw = data.current_weather;
    const currentCodeInfo = getWeatherCodeInfo(cw.weathercode);

    // Extract current hourly index if available
    let currentHumidity = 55;
    let currentFeelsLike = cw.temperature;
    let currentPressure = 1013;
    let currentUV = 3;
    let currentPrecipChance = 0;

    if (data.hourly && data.hourly.time && data.hourly.time.length > 0) {
      const nowIsoHour = cw.time.slice(0, 13); // "YYYY-MM-DDTHH"
      let matchIdx = data.hourly.time.findIndex((t) => t.startsWith(nowIsoHour));
      if (matchIdx === -1) matchIdx = 0;

      if (data.hourly.relative_humidity_2m?.[matchIdx] !== undefined) {
        currentHumidity = data.hourly.relative_humidity_2m[matchIdx];
      }
      if (data.hourly.apparent_temperature?.[matchIdx] !== undefined) {
        currentFeelsLike = data.hourly.apparent_temperature[matchIdx];
      }
      if (data.hourly.surface_pressure?.[matchIdx] !== undefined) {
        currentPressure = Math.round(data.hourly.surface_pressure[matchIdx]);
      }
      if (data.hourly.uv_index?.[matchIdx] !== undefined) {
        currentUV = data.hourly.uv_index[matchIdx];
      }
      if (data.hourly.precipitation_probability?.[matchIdx] !== undefined) {
        currentPrecipChance = data.hourly.precipitation_probability[matchIdx];
      }
    }

    const todayMax = data.daily.temperature_2m_max?.[0] ?? cw.temperature + 3;
    const todayMin = data.daily.temperature_2m_min?.[0] ?? cw.temperature - 4;

    const current: ProcessedCurrentWeather = {
      temperature: cw.temperature,
      feelsLike: currentFeelsLike,
      humidity: currentHumidity,
      windSpeed: cw.windspeed,
      windDirection: cw.winddirection,
      weatherCode: cw.weathercode,
      conditionText: currentCodeInfo.label,
      isDay: cw.is_day === 1,
      time: cw.time,
      pressure: currentPressure,
      uvIndex: currentUV,
      precipitationChance: currentPrecipChance,
      todayMax,
      todayMin,
    };

    // Process 7-day forecast cards
    const daily: DayForecast[] = [];
    const daysCount = Math.min(7, data.daily.time.length);

    for (let i = 0; i < daysCount; i++) {
      const rawDate = data.daily.time[i];
      const d = new Date(rawDate + 'T00:00:00');
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const code = data.daily.weathercode[i];
      const codeInfo = getWeatherCodeInfo(code);

      daily.push({
        date: rawDate,
        dateLabel,
        dayName,
        weatherCode: code,
        conditionText: codeInfo.label,
        tempMax: data.daily.temperature_2m_max[i],
        tempMin: data.daily.temperature_2m_min[i],
        precipitationProbability: data.daily.precipitation_probability_max?.[i] ?? 0,
        uvIndexMax: data.daily.uv_index_max?.[i] ?? 0,
        windSpeedMax: data.daily.wind_speed_10m_max?.[i] ?? 0,
      });
    }

    // Process 24-hour visual trend data
    const hourly: HourlyPoint[] = [];
    if (data.hourly && data.hourly.time) {
      const nowIsoHour = cw.time.slice(0, 13);
      let startIndex = data.hourly.time.findIndex((t) => t.startsWith(nowIsoHour));
      if (startIndex === -1) startIndex = 0;

      const endIndex = Math.min(startIndex + 24, data.hourly.time.length);

      for (let i = startIndex; i < endIndex; i++) {
        const rawTime = data.hourly.time[i];
        const dateObj = new Date(rawTime);
        const hourLabel =
          i === startIndex
            ? 'Now'
            : dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });

        const hCode = data.hourly.weathercode[i];
        const hCodeInfo = getWeatherCodeInfo(hCode);

        hourly.push({
          time: rawTime,
          hourLabel,
          temp: data.hourly.temperature_2m[i],
          weatherCode: hCode,
          conditionText: hCodeInfo.label,
          precipitationProb: data.hourly.precipitation_probability?.[i] ?? 0,
          humidity: data.hourly.relative_humidity_2m?.[i] ?? 50,
          windSpeed: data.hourly.wind_speed_10m?.[i] ?? 0,
        });
      }
    }

    // Generate intelligent rule-based planning recommendations
    const { recommendations, activities, outfit } = generateRecommendations(current);

    return {
      city,
      current,
      daily,
      hourly,
      recommendations,
      activities,
      outfit,
      fetchedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new WeatherApiError('Forecast request timed out. Please check your network connection.', 'TIMEOUT');
    }
    if (err instanceof WeatherApiError) {
      throw err;
    }
    throw new WeatherApiError('Failed to fetch weather forecast. Please check your internet connection and try again.', 'NETWORK_ERROR');
  }
}
