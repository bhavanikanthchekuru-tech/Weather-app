import React from 'react';
import { CloudSun, Navigation, RefreshCw } from 'lucide-react';
import { UnitSettings } from '../types';

interface HeaderProps {
  unitSettings: UnitSettings;
  onToggleUnit: () => void;
  onUseCurrentLocation: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  isLocating: boolean;
  lastUpdated?: string;
}

export const Header: React.FC<HeaderProps> = ({
  unitSettings,
  onToggleUnit,
  onUseCurrentLocation,
  onRefresh,
  isLoading,
  isLocating,
  lastUpdated,
}) => {
  return (
    <header
      id="header-bar"
      className="w-full border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div id="brand-container" className="flex items-center space-x-3">
          <div
            id="brand-icon-wrapper"
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white"
          >
            <CloudSun className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 id="app-title" className="text-lg font-bold tracking-tight text-white">
                Weather Intelligence
              </h1>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Live Open-Meteo
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal">
              Forecasts, Trends & Smart Planning
            </p>
          </div>
        </div>

        {/* Controls: Location, Refresh, Unit Toggle */}
        <div id="header-controls" className="flex items-center space-x-2 sm:space-x-3">
          {/* Last updated indicator */}
          {lastUpdated && (
            <span
              id="last-updated-text"
              className="hidden md:inline-flex text-xs text-slate-400 font-medium mr-1"
            >
              Updated: {lastUpdated}
            </span>
          )}

          {/* Current Location Button */}
          <button
            id="btn-use-location"
            onClick={onUseCurrentLocation}
            disabled={isLocating || isLoading}
            title="Use current geolocation"
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/60 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Navigation className={`w-3.5 h-3.5 text-sky-400 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">My Location</span>
          </button>

          {/* Refresh Button */}
          <button
            id="btn-refresh-weather"
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh weather data"
            className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-300 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Units Switcher */}
          <button
            id="btn-toggle-unit"
            onClick={onToggleUnit}
            title={`Switch to ${unitSettings.temp === 'celsius' ? 'Fahrenheit (°F)' : 'Celsius (°C)'}`}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-xs font-semibold border border-slate-700/60 transition"
          >
            <span className={unitSettings.temp === 'celsius' ? 'text-sky-400 font-bold' : 'text-slate-400'}>
              °C
            </span>
            <span className="text-slate-600">/</span>
            <span className={unitSettings.temp === 'fahrenheit' ? 'text-sky-400 font-bold' : 'text-slate-400'}>
              °F
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
