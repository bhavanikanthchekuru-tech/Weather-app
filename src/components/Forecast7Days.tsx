import React from 'react';
import { CalendarDays, CloudRain, Droplets } from 'lucide-react';
import { DayForecast, UnitSettings } from '../types';
import { formatTemp } from '../utils/units';
import { WeatherIcon } from './WeatherIcon';

interface Forecast7DaysProps {
  daily: DayForecast[];
  unitSettings: UnitSettings;
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
}

export const Forecast7Days: React.FC<Forecast7DaysProps> = ({
  daily,
  unitSettings,
  selectedDayIndex,
  onSelectDay,
}) => {
  // Compute global min and max across all 7 days for the visual range bars
  const allMax = Math.max(...daily.map((d) => d.tempMax));
  const allMin = Math.min(...daily.map((d) => d.tempMin));
  const tempSpan = Math.max(1, allMax - allMin);

  return (
    <div id="forecast-7days-section" className="w-full">
      {/* Section Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <CalendarDays className="w-5 h-5 text-sky-400" />
          <h3 id="forecast-heading" className="text-lg font-bold text-white tracking-tight">
            7-Day Weather Forecast
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Daily Highs & Lows
        </span>
      </div>

      {/* Forecast Cards Grid */}
      <div
        id="forecast-cards-grid"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3"
      >
        {daily.map((day, idx) => {
          const isSelected = idx === selectedDayIndex;
          // Calculate relative position of this day's min/max bar
          const leftPercent = Math.max(0, Math.min(80, ((day.tempMin - allMin) / tempSpan) * 100));
          const widthPercent = Math.max(
            15,
            Math.min(100 - leftPercent, ((day.tempMax - day.tempMin) / tempSpan) * 100)
          );

          return (
            <button
              key={day.date}
              id={`forecast-card-${idx}`}
              type="button"
              onClick={() => onSelectDay(idx)}
              className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden group ${
                isSelected
                  ? 'bg-slate-800 border-sky-500 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/50'
                  : 'bg-slate-850/70 hover:bg-slate-800/80 border-slate-700/60'
              }`}
            >
              {/* Header: Day name & date */}
              <div>
                <div className="flex items-center justify-between">
                  <span
                    id={`forecast-dayname-${idx}`}
                    className={`text-sm font-bold tracking-tight ${
                      idx === 0 ? 'text-sky-400' : 'text-slate-100'
                    }`}
                  >
                    {day.dayName}
                  </span>
                  {day.precipitationProbability > 20 && (
                    <span
                      id={`forecast-rain-prob-${idx}`}
                      className="inline-flex items-center text-[10px] font-semibold text-blue-300 bg-blue-500/15 px-1.5 py-0.5 rounded-full"
                      title={`${day.precipitationProbability}% chance of rain`}
                    >
                      <Droplets className="w-2.5 h-2.5 mr-0.5 text-blue-400" />
                      {day.precipitationProbability}%
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {day.dateLabel}
                </div>
              </div>

              {/* Weather Icon and Short Condition */}
              <div className="my-3 flex flex-col items-center">
                <WeatherIcon code={day.weatherCode} className="w-8 h-8 sm:w-10 sm:h-10 my-1" />
                <span
                  id={`forecast-condition-${idx}`}
                  className="text-xs font-medium text-slate-300 text-center line-clamp-1 mt-1"
                >
                  {day.conditionText}
                </span>
              </div>

              {/* Temperature Range */}
              <div className="w-full pt-2 border-t border-slate-700/50">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span id={`forecast-max-${idx}`} className="text-white">
                    {formatTemp(day.tempMax, unitSettings.temp)}
                  </span>
                  <span id={`forecast-min-${idx}`} className="text-slate-400">
                    {formatTemp(day.tempMin, unitSettings.temp)}
                  </span>
                </div>

                {/* Visual temperature spectrum bar */}
                <div className="w-full h-1.5 bg-slate-700/50 rounded-full mt-2 relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 to-amber-400"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
