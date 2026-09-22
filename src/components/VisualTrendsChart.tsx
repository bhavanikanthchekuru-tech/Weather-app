import React, { useState } from 'react';
import { TrendingUp, Clock, Calendar, Droplets } from 'lucide-react';
import { DayForecast, HourlyPoint, UnitSettings } from '../types';
import { formatTemp, formatTempValue } from '../utils/units';
import { WeatherIcon } from './WeatherIcon';

interface VisualTrendsChartProps {
  hourly: HourlyPoint[];
  daily: DayForecast[];
  unitSettings: UnitSettings;
}

export const VisualTrendsChart: React.FC<VisualTrendsChartProps> = ({
  hourly,
  daily,
  unitSettings,
}) => {
  const [viewMode, setViewMode] = useState<'hourly' | 'daily'>('hourly');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Hourly curve calculations (viewBox: 800 x 220)
  const svgWidth = 800;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingTop = 35;
  const paddingBottom = 45;

  // Hourly points (take up to 16 points for clean spacing)
  const displayHourly = hourly.slice(0, 16);
  const hourlyTemps = displayHourly.map((h) => formatTempValue(h.temp, unitSettings.temp));
  const minHourlyTemp = Math.min(...hourlyTemps);
  const maxHourlyTemp = Math.max(...hourlyTemps);
  const hourlyRange = Math.max(1, maxHourlyTemp - minHourlyTemp);

  const getHourlyCoords = (index: number) => {
    const x = paddingX + (index / (displayHourly.length - 1)) * (svgWidth - paddingX * 2);
    const temp = hourlyTemps[index];
    const y =
      svgHeight -
      paddingBottom -
      ((temp - minHourlyTemp) / hourlyRange) * (svgHeight - paddingTop - paddingBottom);
    return { x, y };
  };

  // Build SVG path for smooth bezier curve
  const hourlyPoints = displayHourly.map((_, i) => getHourlyCoords(i));
  let hourlyPath = '';
  let hourlyAreaPath = '';

  if (hourlyPoints.length > 0) {
    hourlyPath = `M ${hourlyPoints[0].x} ${hourlyPoints[0].y}`;
    for (let i = 0; i < hourlyPoints.length - 1; i++) {
      const p0 = i > 0 ? hourlyPoints[i - 1] : hourlyPoints[i];
      const p1 = hourlyPoints[i];
      const p2 = hourlyPoints[i + 1];
      const p3 = i < hourlyPoints.length - 2 ? hourlyPoints[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      hourlyPath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    const last = hourlyPoints[hourlyPoints.length - 1];
    const first = hourlyPoints[0];
    hourlyAreaPath = `${hourlyPath} L ${last.x} ${svgHeight - paddingBottom} L ${first.x} ${
      svgHeight - paddingBottom
    } Z`;
  }

  // Daily 7-day trend calculations
  const dailyMaxTemps = daily.map((d) => formatTempValue(d.tempMax, unitSettings.temp));
  const dailyMinTemps = daily.map((d) => formatTempValue(d.tempMin, unitSettings.temp));
  const minDaily = Math.min(...dailyMinTemps);
  const maxDaily = Math.max(...dailyMaxTemps);
  const dailyRange = Math.max(1, maxDaily - minDaily);

  const getDailyCoords = (index: number, isMax: boolean) => {
    const x = paddingX + (index / (daily.length - 1)) * (svgWidth - paddingX * 2);
    const temp = isMax ? dailyMaxTemps[index] : dailyMinTemps[index];
    const y =
      svgHeight -
      paddingBottom -
      ((temp - minDaily) / dailyRange) * (svgHeight - paddingTop - paddingBottom);
    return { x, y };
  };

  const dailyMaxPoints = daily.map((_, i) => getDailyCoords(i, true));
  const dailyMinPoints = daily.map((_, i) => getDailyCoords(i, false));

  const buildLine = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let p = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i < pts.length - 2 ? pts[i + 2] : p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      p += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return p;
  };

  const dailyMaxPath = buildLine(dailyMaxPoints);
  const dailyMinPath = buildLine(dailyMinPoints);

  const hoveredHourly = hoveredIndex !== null && viewMode === 'hourly' ? displayHourly[hoveredIndex] : null;
  const hoveredDaily = hoveredIndex !== null && viewMode === 'daily' ? daily[hoveredIndex] : null;

  return (
    <div
      id="visual-trends-section"
      className="w-full rounded-3xl p-5 sm:p-7 bg-slate-850/80 border border-slate-700/60 shadow-xl backdrop-blur-md"
    >
      {/* Chart Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-sky-400" />
          <h3 id="trends-heading" className="text-lg font-bold text-white tracking-tight">
            Visual Weather Trends
          </h3>
        </div>

        {/* View Mode Toggle Button */}
        <div id="trends-toggle-group" className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-700/60 text-xs font-semibold">
          <button
            id="btn-trend-hourly"
            type="button"
            onClick={() => {
              setViewMode('hourly');
              setHoveredIndex(null);
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
              viewMode === 'hourly'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>24-Hour Hourly</span>
          </button>

          <button
            id="btn-trend-daily"
            type="button"
            onClick={() => {
              setViewMode('daily');
              setHoveredIndex(null);
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
              viewMode === 'daily'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>7-Day Outlook</span>
          </button>
        </div>
      </div>

      {/* Interactive SVG Chart Container */}
      <div id="chart-viewport" className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {/* Hourly area gradient */}
            <linearGradient id="hourlyAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </linearGradient>

            {/* Daily range band gradient */}
            <linearGradient id="dailyBandGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={paddingTop}
            x2={svgWidth - paddingX}
            y2={paddingTop}
            stroke="#334155"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={(paddingTop + svgHeight - paddingBottom) / 2}
            x2={svgWidth - paddingX}
            y2={(paddingTop + svgHeight - paddingBottom) / 2}
            stroke="#334155"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={svgHeight - paddingBottom}
            x2={svgWidth - paddingX}
            y2={svgHeight - paddingBottom}
            stroke="#475569"
            strokeWidth="1"
          />

          {viewMode === 'hourly' ? (
            <>
              {/* Hourly Area Fill */}
              {hourlyAreaPath && <path d={hourlyAreaPath} fill="url(#hourlyAreaGrad)" />}

              {/* Hourly Temperature Curve */}
              {hourlyPath && (
                <path
                  d={hourlyPath}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data points & labels */}
              {hourlyPoints.map((pt, i) => {
                const item = displayHourly[i];
                const isHovered = hoveredIndex === i;

                return (
                  <g
                    key={`hourly-pt-${i}`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onClick={() => setHoveredIndex(i)}
                  >
                    {/* Vertical hover guide */}
                    {isHovered && (
                      <line
                        x1={pt.x}
                        y1={paddingTop}
                        x2={pt.x}
                        y2={svgHeight - paddingBottom}
                        stroke="#0284c7"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />
                    )}

                    {/* Point circle */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 6 : 4}
                      fill={isHovered ? '#38bdf8' : '#0f172a'}
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      className="transition-all"
                    />

                    {/* Temperature text above point */}
                    <text
                      x={pt.x}
                      y={pt.y - 12}
                      textAnchor="middle"
                      className="fill-slate-100 text-[11px] font-bold"
                    >
                      {formatTemp(item.temp, unitSettings.temp)}
                    </text>

                    {/* Hour label below baseline */}
                    <text
                      x={pt.x}
                      y={svgHeight - paddingBottom + 16}
                      textAnchor="middle"
                      className="fill-slate-400 text-[10px] font-medium"
                    >
                      {item.hourLabel}
                    </text>

                    {/* Rain probability bar (if present) */}
                    {item.precipitationProb > 0 && (
                      <rect
                        x={pt.x - 3}
                        y={svgHeight - paddingBottom + 22}
                        width="6"
                        height={Math.min(18, Math.max(3, (item.precipitationProb / 100) * 18))}
                        rx="2"
                        className="fill-blue-400/80"
                      />
                    )}
                  </g>
                );
              })}
            </>
          ) : (
            <>
              {/* Daily Max Curve (Gold/Amber) */}
              {dailyMaxPath && (
                <path
                  d={dailyMaxPath}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Daily Min Curve (Sky Blue) */}
              {dailyMinPath && (
                <path
                  d={dailyMinPath}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Daily points and text */}
              {daily.map((day, i) => {
                const maxPt = dailyMaxPoints[i];
                const minPt = dailyMinPoints[i];
                const isHovered = hoveredIndex === i;

                return (
                  <g
                    key={`daily-pt-${i}`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onClick={() => setHoveredIndex(i)}
                  >
                    {isHovered && (
                      <line
                        x1={maxPt.x}
                        y1={paddingTop}
                        x2={maxPt.x}
                        y2={svgHeight - paddingBottom}
                        stroke="#64748b"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />
                    )}

                    {/* Max Point */}
                    <circle
                      cx={maxPt.x}
                      cy={maxPt.y}
                      r={isHovered ? 6 : 4}
                      fill={isHovered ? '#fbbf24' : '#0f172a'}
                      stroke="#fbbf24"
                      strokeWidth="2.5"
                    />
                    <text
                      x={maxPt.x}
                      y={maxPt.y - 10}
                      textAnchor="middle"
                      className="fill-amber-300 text-[11px] font-bold"
                    >
                      {formatTemp(day.tempMax, unitSettings.temp)}
                    </text>

                    {/* Min Point */}
                    <circle
                      cx={minPt.x}
                      cy={minPt.y}
                      r={isHovered ? 5 : 3.5}
                      fill={isHovered ? '#38bdf8' : '#0f172a'}
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                    <text
                      x={minPt.x}
                      y={minPt.y + 16}
                      textAnchor="middle"
                      className="fill-sky-300 text-[10px] font-semibold"
                    >
                      {formatTemp(day.tempMin, unitSettings.temp)}
                    </text>

                    {/* Day label */}
                    <text
                      x={maxPt.x}
                      y={svgHeight - paddingBottom + 26}
                      textAnchor="middle"
                      className="fill-slate-300 text-[11px] font-medium"
                    >
                      {day.dayName}
                    </text>
                  </g>
                );
              })}
            </>
          )}
        </svg>
      </div>

      {/* Interactive Tooltip Card at Bottom of Chart */}
      <div
        id="trend-details-bar"
        className="mt-4 pt-3 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-3 text-xs"
      >
        {viewMode === 'hourly' && (
          <div className="flex items-center space-x-4 text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              Hourly Temperature
            </span>
            <span className="flex items-center gap-1.5 text-blue-300">
              <span className="w-2 h-2.5 rounded-sm bg-blue-400" />
              Precipitation Probability
            </span>
          </div>
        )}

        {viewMode === 'daily' && (
          <div className="flex items-center space-x-4 text-slate-300">
            <span className="flex items-center gap-1.5 font-medium text-amber-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              High Temp
            </span>
            <span className="flex items-center gap-1.5 font-medium text-sky-300">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              Low Temp
            </span>
          </div>
        )}

        {/* Hovered item preview */}
        {hoveredHourly && (
          <div className="flex items-center space-x-3 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-700/50 text-slate-200">
            <span className="font-semibold text-sky-400">{hoveredHourly.hourLabel}:</span>
            <span className="font-bold">{formatTemp(hoveredHourly.temp, unitSettings.temp)}</span>
            <span className="text-slate-400">({hoveredHourly.conditionText})</span>
            {hoveredHourly.precipitationProb > 0 && (
              <span className="flex items-center text-blue-300 font-medium">
                <Droplets className="w-3 h-3 mr-0.5 text-blue-400" />
                {hoveredHourly.precipitationProb}% rain
              </span>
            )}
          </div>
        )}

        {hoveredDaily && (
          <div className="flex items-center space-x-3 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-700/50 text-slate-200">
            <span className="font-semibold text-amber-300">{hoveredDaily.dayName} ({hoveredDaily.dateLabel}):</span>
            <span className="text-white font-bold">{formatTemp(hoveredDaily.tempMax, unitSettings.temp)}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-300">{formatTemp(hoveredDaily.tempMin, unitSettings.temp)}</span>
            <span className="text-slate-400">({hoveredDaily.conditionText})</span>
          </div>
        )}

        {!hoveredHourly && !hoveredDaily && (
          <span className="text-slate-500 text-[11px] italic">
            Hover or tap any data point on the chart to inspect specifics
          </span>
        )}
      </div>
    </div>
  );
};
