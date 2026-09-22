export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph';

export interface UnitSettings {
  temp: TemperatureUnit;
  wind: WindSpeedUnit;
}

export interface GeoCity {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string; // State or province
  admin2?: string;
  timezone?: string;
  population?: number;
}

export interface OpenMeteoCurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
}

export interface OpenMeteoDaily {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weathercode: number[];
  precipitation_probability_max?: number[];
  precipitation_sum?: number[];
  uv_index_max?: number[];
  wind_speed_10m_max?: number[];
  sunrise?: string[];
  sunset?: string[];
}

export interface OpenMeteoHourly {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature?: number[];
  precipitation_probability?: number[];
  weathercode: number[];
  wind_speed_10m?: number[];
  surface_pressure?: number[];
  uv_index?: number[];
  visibility?: number[];
}

export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather: OpenMeteoCurrentWeather;
  hourly?: OpenMeteoHourly;
  daily: OpenMeteoDaily;
}

export interface ProcessedCurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  conditionText: string;
  isDay: boolean;
  time: string;
  pressure: number;
  uvIndex: number;
  precipitationChance: number;
  todayMax: number;
  todayMin: number;
}

export interface DayForecast {
  date: string;
  dateLabel: string;
  dayName: string;
  weatherCode: number;
  conditionText: string;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
  uvIndexMax: number;
  windSpeedMax: number;
}

export interface HourlyPoint {
  time: string;
  hourLabel: string;
  temp: number;
  weatherCode: number;
  conditionText: string;
  precipitationProb: number;
  humidity: number;
  windSpeed: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'umbrella' | 'hydration' | 'clothing' | 'uv' | 'wind' | 'activity' | 'caution';
  severity: 'alert' | 'advisory' | 'optimal';
  icon: string;
  badge: string;
}

export interface ActivitySuitability {
  activity: string;
  score: number; // 0 - 100
  label: 'Great' | 'Good' | 'Challenging' | 'Avoid';
  summary: string;
  icon: string;
}

export interface OutfitAdvice {
  top: string;
  bottom: string;
  footwear: string;
  accessories: string[];
}

export interface WeatherIntelligence {
  city: GeoCity;
  current: ProcessedCurrentWeather;
  daily: DayForecast[];
  hourly: HourlyPoint[];
  recommendations: Recommendation[];
  activities: ActivitySuitability[];
  outfit: OutfitAdvice;
  fetchedAt: string;
}
