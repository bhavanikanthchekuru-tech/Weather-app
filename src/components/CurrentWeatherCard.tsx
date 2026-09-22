import React from 'react';
import {
  Wind,
  Droplets,
  Sun,
  Gauge,
  CloudRain,
  MapPin,
  Clock,
  ArrowUp,
  ArrowDown,
  Compass,
} from 'lucide-react';
import { GeoCity, ProcessedCurrentWeather, UnitSettings } from '../types';
import { formatTemp, formatWind, getWindDirectionLabel } from '../utils/units';
import { getWeatherCodeInfo } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  city: GeoCity;
  current: ProcessedCurrentWeather;
  unitSettings: UnitSettings;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  city,
  current,
  unitSettings,
}) => {
  const codeInfo = getWeatherCodeInfo(current.weatherCode);
  const locationLabel = [city.name, city.admin1, city.country].filter(Boolean).join(', ');

  return (
    <div
      id="current-weather-card"
      className={`relative w-full rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${codeInfo.cardGradient} bg-slate-800/80 border border-slate-700/60 shadow-2xl backdrop-blur-md overflow-hidden transition-all`}
    >
      {/* Subtle atmospheric glow effect */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top bar: Location & Observation Time */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <div className="flex items-center space-x-2 text-slate-200">
          <MapPin className="w-5 h-5 text-sky-400 shrink-0" />
          <h2 id="current-city-name" className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {locationLabel}
          </h2>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span id="current-local-time">
            Local Obs: {current.time.replace('T', ' ')}
          </span>
        </div>
      </div>

      {/* Main Weather Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Column: Big Temperature & Condition */}
        <div className="md:col-span-6 flex flex-col justify-center">
          <div className="flex items-baseline space-x-3">
            <span
              id="current-temperature-display"
              className="text-6xl sm:text-7xl font-extrabold text-white tracking-tight leading-none"
            >
              {formatTemp(current.temperature, unitSettings.temp)}
            </span>
            <div className="flex flex-col text-sm text-slate-300">
              <span className="text-slate-400">Feels like</span>
              <span id="current-feels-like" className="font-semibold text-slate-200 text-lg">
                {formatTemp(current.feelsLike, unitSettings.temp)}
              </span>
            </div>
          </div>

          {/* Condition Badge and High/Low */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div
              id="current-condition-badge"
              className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border ${codeInfo.badgeBg} ${codeInfo.badgeText} text-sm font-semibold shadow-sm`}
            >
              <WeatherIcon code={current.weatherCode} className="w-4 h-4" />
              <span>{current.conditionText}</span>
            </div>

            <div
              id="current-high-low"
              className="flex items-center space-x-3 text-xs sm:text-sm font-medium text-slate-300 bg-slate-900/40 px-3 py-1.5 rounded-full border border-slate-700/50"
            >
              <span className="flex items-center text-rose-400">
                <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
                {formatTemp(current.todayMax, unitSettings.temp)}
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center text-sky-400">
                <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
                {formatTemp(current.todayMin, unitSettings.temp)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Weather Icon Graphic */}
        <div className="md:col-span-6 flex items-center justify-center md:justify-end">
          <div
            id="hero-weather-icon-container"
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-slate-850/60 border border-slate-700/50 flex items-center justify-center shadow-xl shadow-slate-950/30"
          >
            <WeatherIcon
              code={current.weatherCode}
              className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Atmospheric Metrics Grid (Wind, Humidity, UV, Pressure, Rain Chance) */}
      <div
        id="current-metrics-grid"
        className="mt-8 pt-6 border-t border-slate-700/50 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
      >
        {/* Wind Speed & Direction */}
        <div
          id="metric-wind"
          className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-700/40 flex items-center space-x-3"
        >
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Wind
            </div>
            <div id="metric-wind-value" className="text-sm font-bold text-slate-100">
              {formatWind(current.windSpeed, unitSettings.wind)}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Compass className="w-3 h-3 text-slate-400" />
              {getWindDirectionLabel(current.windDirection)} ({Math.round(current.windDirection)}°)
            </div>
          </div>
        </div>

        {/* Humidity */}
        <div
          id="metric-humidity"
          className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-700/40 flex items-center space-x-3"
        >
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Humidity
            </div>
            <div id="metric-humidity-value" className="text-sm font-bold text-slate-100">
              {Math.round(current.humidity)}%
            </div>
            <div className="text-[11px] text-slate-400">
              {current.humidity > 65 ? 'High' : current.humidity < 35 ? 'Dry' : 'Optimal'}
            </div>
          </div>
        </div>

        {/* UV Index */}
        <div
          id="metric-uv"
          className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-700/40 flex items-center space-x-3"
        >
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              UV Index
            </div>
            <div id="metric-uv-value" className="text-sm font-bold text-slate-100">
              {current.uvIndex.toFixed(1)}
            </div>
            <div className="text-[11px] text-slate-400">
              {current.uvIndex >= 8 ? 'Very High' : current.uvIndex >= 6 ? 'High' : current.uvIndex >= 3 ? 'Moderate' : 'Low'}
            </div>
          </div>
        </div>

        {/* Precipitation Chance */}
        <div
          id="metric-precipitation"
          className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-700/40 flex items-center space-x-3"
        >
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
            <CloudRain className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Rain Chance
            </div>
            <div id="metric-precip-value" className="text-sm font-bold text-slate-100">
              {current.precipitationChance}%
            </div>
            <div className="text-[11px] text-slate-400">
              {current.precipitationChance >= 50 ? 'Likely' : current.precipitationChance >= 25 ? 'Possible' : 'Unlikely'}
            </div>
          </div>
        </div>

        {/* Air Pressure */}
        <div
          id="metric-pressure"
          className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-700/40 flex items-center space-x-3 col-span-2 sm:col-span-1"
        >
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Pressure
            </div>
            <div id="metric-pressure-value" className="text-sm font-bold text-slate-100">
              {current.pressure} hPa
            </div>
            <div className="text-[11px] text-slate-400">
              {current.pressure >= 1013 ? 'Normal/High' : 'Low System'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
