import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, MapPin, History, Sparkles } from 'lucide-react';
import { GeoCity } from '../types';
import { searchCities, WeatherApiError } from '../services/openMeteo';

interface SearchBarProps {
  onSelectCity: (city: GeoCity) => void;
  isLoading: boolean;
  selectedCityName?: string;
  onError: (errorMessage: string | null) => void;
}

const POPULAR_CITIES: GeoCity[] = [
  { id: 5128581, name: 'New York', country: 'United States', admin1: 'New York', latitude: 40.7143, longitude: -74.006 },
  { id: 2643743, name: 'London', country: 'United Kingdom', admin1: 'England', latitude: 51.5085, longitude: -0.1257 },
  { id: 1850147, name: 'Tokyo', country: 'Japan', admin1: 'Tokyo', latitude: 35.6895, longitude: 139.6917 },
  { id: 2988507, name: 'Paris', country: 'France', admin1: 'Île-de-France', latitude: 48.8534, longitude: 2.3488 },
  { id: 2147714, name: 'Sydney', country: 'Australia', admin1: 'New South Wales', latitude: -33.8678, longitude: 151.2073 },
  { id: 292223, name: 'Dubai', country: 'United Arab Emirates', admin1: 'Dubai', latitude: 25.0772, longitude: 55.3093 },
  { id: 1880252, name: 'Singapore', country: 'Singapore', admin1: 'Singapore', latitude: 1.2897, longitude: 103.8501 },
  { id: 5391959, name: 'San Francisco', country: 'United States', admin1: 'California', latitude: 37.7749, longitude: -122.4194 },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectCity,
  isLoading,
  selectedCityName,
  onError,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoCity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [recentCities, setRecentCities] = useState<GeoCity[]>(() => {
    try {
      const saved = localStorage.getItem('weather_recent_cities');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle live suggestions search with debounce
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchCities(trimmed);
        setSuggestions(results);
        setIsOpen(true);
        setSelectedIndex(-1);
      } catch {
        // Dropdown silent fallback; manual submit will show clear alert
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSelectCity = (city: GeoCity) => {
    setQuery('');
    setIsOpen(false);
    setSuggestions([]);
    onError(null);

    // Save to recents
    const updated = [city, ...recentCities.filter((c) => c.name !== city.name || c.country !== city.country)].slice(0, 5);
    setRecentCities(updated);
    try {
      localStorage.setItem('weather_recent_cities', JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }

    onSelectCity(city);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    // If an item in dropdown is highlighted, pick it
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSelectCity(suggestions[selectedIndex]);
      return;
    }

    setIsSearching(true);
    onError(null);

    try {
      const results = await searchCities(trimmed);
      if (results.length === 0) {
        onError(`No matching city found for "${trimmed}". Please check the spelling or search another location.`);
        setIsOpen(false);
      } else {
        handleSelectCity(results[0]);
      }
    } catch (err: any) {
      if (err instanceof WeatherApiError) {
        onError(err.message);
      } else {
        onError(`Unable to find city "${trimmed}". Please check your internet connection.`);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div id="city-search-section" className="w-full relative z-20">
      {/* Search Bar Input Form */}
      <div ref={wrapperRef} className="relative max-w-3xl mx-auto">
        <form
          id="city-search-form"
          onSubmit={handleFormSubmit}
          className="relative flex items-center"
        >
          <div className="absolute left-4 pointer-events-none text-slate-400">
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>

          <input
            id="input-city-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedCityName
                ? `Current: ${selectedCityName} — Search another city...`
                : 'Search any city worldwide (e.g. Paris, Tokyo, Seattle)...'
            }
            className="w-full pl-12 pr-28 py-3.5 bg-slate-800/90 hover:bg-slate-800 text-slate-100 placeholder-slate-400 text-sm sm:text-base rounded-2xl border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 shadow-xl shadow-slate-950/40 transition-all"
            autoComplete="off"
          />

          <div className="absolute right-2 flex items-center space-x-1.5">
            {query && (
              <button
                type="button"
                id="btn-clear-search"
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              id="btn-submit-search"
              disabled={isLoading || isSearching || !query.trim()}
              className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-sky-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Search
            </button>
          </div>
        </form>

        {/* Live Auto-complete Suggestions Dropdown */}
        {isOpen && suggestions.length > 0 && (
          <div
            id="city-suggestions-dropdown"
            className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-700/40"
          >
            <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-900/50">
              Matching Cities (Open-Meteo Geocoding)
            </div>
            <ul id="suggestions-list" className="max-h-72 overflow-y-auto">
              {suggestions.map((city, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <li key={`${city.id}-${index}`}>
                    <button
                      type="button"
                      id={`suggestion-item-${city.id}`}
                      onClick={() => handleSelectCity(city)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full text-left px-4 py-3 flex items-center justify-between transition ${
                        isSelected ? 'bg-sky-500/15 text-white' : 'text-slate-200 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <MapPin className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`} />
                        <div>
                          <span className="font-medium text-sm text-slate-100">{city.name}</span>
                          <span className="text-xs text-slate-400 ml-1.5">
                            {[city.admin1, city.country].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Quick Select & Recents bar */}
      <div id="quick-city-pills" className="max-w-3xl mx-auto mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
        <span className="flex items-center gap-1 text-slate-400 mr-1 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          Popular:
        </span>
        {POPULAR_CITIES.map((c) => (
          <button
            key={`popular-${c.name}`}
            id={`popular-pill-${c.name.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => handleSelectCity(c)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/50 transition"
          >
            {c.name}
          </button>
        ))}

        {recentCities.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 ml-auto pt-1 sm:pt-0">
            <span className="flex items-center gap-1 text-slate-400 font-medium">
              <History className="w-3.5 h-3.5 text-slate-400" />
              Recent:
            </span>
            {recentCities.map((c) => (
              <button
                key={`recent-${c.name}-${c.id}`}
                id={`recent-pill-${c.id}`}
                onClick={() => handleSelectCity(c)}
                disabled={isLoading}
                className="px-2 py-0.5 rounded-md bg-slate-800/50 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200 border border-slate-700/40 text-[11px] transition"
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
