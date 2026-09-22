import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { Forecast7Days } from './components/Forecast7Days';
import { VisualTrendsChart } from './components/VisualTrendsChart';
import { PlanningRecommendations } from './components/PlanningRecommendations';
import { ErrorAlert } from './components/ErrorAlert';
import { GeoCity, UnitSettings, WeatherIntelligence } from './types';
import { fetchWeatherForecast, reverseGeocode, WeatherApiError } from './services/openMeteo';
import { Loader2, CloudSun, MapPin } from 'lucide-react';

const INITIAL_CITY: GeoCity = {
  id: 2988507,
  name: 'Paris',
  latitude: 48.8534,
  longitude: 2.3488,
  country: 'France',
  admin1: 'Île-de-France',
  timezone: 'Europe/Paris',
};

export default function App() {
  const [currentCity, setCurrentCity] = useState<GeoCity>(INITIAL_CITY);
  const [weatherData, setWeatherData] = useState<WeatherIntelligence | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  const [unitSettings, setUnitSettings] = useState<UnitSettings>(() => {
    try {
      const saved = localStorage.getItem('weather_units');
      return saved ? JSON.parse(saved) : { temp: 'celsius', wind: 'kmh' };
    } catch {
      return { temp: 'celsius', wind: 'kmh' };
    }
  });

  const loadWeatherForCity = useCallback(async (city: GeoCity) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherForecast(city);
      setWeatherData(data);
      setCurrentCity(city);
      setSelectedDayIndex(0);
    } catch (err: any) {
      if (err instanceof WeatherApiError) {
        setError(err.message);
      } else {
        setError(`Unable to load weather forecast for ${city.name}. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadWeatherForCity(INITIAL_CITY);
  }, [loadWeatherForCity]);

  // Unit toggle handler
  const handleToggleUnit = () => {
    setUnitSettings((prev) => {
      const next: UnitSettings = {
        temp: prev.temp === 'celsius' ? 'fahrenheit' : 'celsius',
        wind: prev.wind === 'kmh' ? 'mph' : 'kmh',
      };
      try {
        localStorage.setItem('weather_units', JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  // Browser Geolocation handler
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your current browser environment.');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const detectedCity = await reverseGeocode(lat, lon);
          await loadWeatherForCity(detectedCity);
        } catch {
          setError('Failed to resolve weather for current location coordinates.');
        } finally {
          setIsLocating(false);
        }
      },
      (geoError) => {
        setIsLocating(false);
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setError('Location permission was denied. Please search for your city name in the search bar above.');
        } else {
          setError('Could not retrieve current location. Please search manually.');
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Sticky Header with Unit Toggle and Geolocation */}
      <Header
        unitSettings={unitSettings}
        onToggleUnit={handleToggleUnit}
        onUseCurrentLocation={handleUseCurrentLocation}
        onRefresh={() => loadWeatherForCity(currentCity)}
        isLoading={isLoading}
        isLocating={isLocating}
        lastUpdated={weatherData?.fetchedAt}
      />

      {/* Main Container */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7">
        {/* City Search Bar */}
        <section id="search-container" aria-label="City Search">
          <SearchBar
            onSelectCity={loadWeatherForCity}
            isLoading={isLoading}
            selectedCityName={currentCity.name}
            onError={setError}
          />
        </section>

        {/* Error Alert Display */}
        {error && (
          <section id="error-section" aria-label="Errors">
            <ErrorAlert
              message={error}
              onDismiss={() => setError(null)}
              onRetry={() => loadWeatherForCity(currentCity)}
            />
          </section>
        )}

        {/* Loading Skeleton */}
        {isLoading && !weatherData && (
          <div
            id="initial-loading-skeleton"
            className="w-full py-20 flex flex-col items-center justify-center space-y-4"
          >
            <div className="p-4 rounded-3xl bg-slate-800/80 border border-slate-700/60 shadow-xl">
              <Loader2 className="w-10 h-10 animate-spin text-sky-400" />
            </div>
            <p className="text-sm text-slate-400 font-medium animate-pulse">
              Retrieving atmospheric data from Open-Meteo...
            </p>
          </div>
        )}

        {/* Main Weather Intelligence Layout */}
        {weatherData && (
          <div id="weather-dashboard-view" className="space-y-7 animate-fade-in">
            {/* Top Section: Current Weather Display */}
            <section id="section-current-weather" aria-label="Current Weather">
              <CurrentWeatherCard
                city={weatherData.city}
                current={weatherData.current}
                unitSettings={unitSettings}
              />
            </section>

            {/* Visual Weather Trends Chart */}
            <section id="section-weather-trends" aria-label="Weather Trends">
              <VisualTrendsChart
                hourly={weatherData.hourly}
                daily={weatherData.daily}
                unitSettings={unitSettings}
              />
            </section>

            {/* 7-Day Weather Forecast Cards */}
            <section id="section-7day-forecast" aria-label="7-Day Forecast">
              <Forecast7Days
                daily={weatherData.daily}
                unitSettings={unitSettings}
                selectedDayIndex={selectedDayIndex}
                onSelectDay={setSelectedDayIndex}
              />
            </section>

            {/* Smart Planning Recommendations (Umbrella, Hydration, Advisories, Activities, Outfit) */}
            <section id="section-planning-recommendations" aria-label="Planning Recommendations">
              <PlanningRecommendations
                recommendations={weatherData.recommendations}
                activities={weatherData.activities}
                outfit={weatherData.outfit}
              />
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer id="app-footer" className="w-full border-t border-slate-800/80 bg-slate-900/60 py-5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <CloudSun className="w-4 h-4 text-sky-400" />
            <span>Weather Intelligence Platform</span>
          </div>

          <div className="flex items-center space-x-4">
            <span>
              Powered by{' '}
              <a
                href="https://open-meteo.com/"
                target="_blank"
                rel="noreferrer"
                className="text-sky-400 hover:text-sky-300 underline underline-offset-2"
              >
                Open-Meteo
              </a>{' '}
              (Forecast & Geocoding APIs)
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">WMO Meteorological Standard</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
