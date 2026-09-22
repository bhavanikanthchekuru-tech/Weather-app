import React from 'react';
import {
  Lightbulb,
  ShieldAlert,
  Sparkles,
  Footprints,
  Bike,
  Coffee,
  Compass,
  Shirt,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { ActivitySuitability, OutfitAdvice, Recommendation } from '../types';
import { WeatherIcon } from './WeatherIcon';

interface PlanningRecommendationsProps {
  recommendations: Recommendation[];
  activities: ActivitySuitability[];
  outfit: OutfitAdvice;
}

export const PlanningRecommendations: React.FC<PlanningRecommendationsProps> = ({
  recommendations,
  activities,
  outfit,
}) => {
  const getActivityIcon = (icon: string) => {
    switch (icon) {
      case 'Footprints':
        return <Footprints className="w-4 h-4 text-emerald-400" />;
      case 'Bike':
        return <Bike className="w-4 h-4 text-amber-400" />;
      case 'Coffee':
        return <Coffee className="w-4 h-4 text-orange-400" />;
      case 'Compass':
      default:
        return <Compass className="w-4 h-4 text-sky-400" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 55) return 'text-sky-400 border-sky-500/30 bg-sky-500/10';
    if (score >= 35) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const getSeverityBadge = (rec: Recommendation) => {
    if (rec.severity === 'alert') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
          <AlertTriangle className="w-3 h-3 text-rose-400" />
          {rec.badge}
        </span>
      );
    }
    if (rec.severity === 'advisory') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
          <Info className="w-3 h-3 text-amber-400" />
          {rec.badge}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
        <Sparkles className="w-3 h-3 text-emerald-400" />
        {rec.badge}
      </span>
    );
  };

  return (
    <div id="planning-recommendations-section" className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h3 id="recommendations-heading" className="text-lg font-bold text-white tracking-tight">
            Smart Planning Recommendations
          </h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
          Rule-Based Intelligence
        </span>
      </div>

      {/* Primary Action Advisories Grid */}
      <div
        id="advisories-cards-grid"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            id={`recommendation-card-${rec.id}`}
            className="p-5 rounded-2xl bg-slate-850/90 border border-slate-700/60 shadow-lg relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700/50">
                  <WeatherIcon iconName={rec.icon} className="w-5 h-5" />
                </div>
                {getSeverityBadge(rec)}
              </div>

              <h4 id={`rec-title-${rec.id}`} className="text-base font-bold text-slate-100 tracking-tight">
                {rec.title}
              </h4>
              <p id={`rec-desc-${rec.id}`} className="mt-1.5 text-xs text-slate-300 leading-relaxed font-normal">
                {rec.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Intelligence: Activities & Outfit Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Outdoor Activity Suitability Index (8 Cols) */}
        <div
          id="activity-suitability-panel"
          className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-slate-850/80 border border-slate-700/60 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 id="activity-index-title" className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Outdoor Activity Suitability Index
            </h4>
            <span className="text-[11px] text-slate-400 font-medium">Weather Condition Ratings</span>
          </div>

          <div id="activities-list" className="space-y-3.5">
            {activities.map((act) => (
              <div
                key={act.activity}
                id={`activity-row-${act.activity.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-700/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start sm:items-center space-x-3">
                  <div className="p-2 rounded-lg bg-slate-800 shrink-0 border border-slate-700/50">
                    {getActivityIcon(act.icon)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-100">{act.activity}</div>
                    <div className="text-xs text-slate-400 mt-0.5 leading-snug">{act.summary}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getScoreColor(
                      act.score
                    )}`}
                  >
                    {act.label} ({act.score}/100)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Outfit Planner (5 Cols) */}
        <div
          id="outfit-planner-panel"
          className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-slate-850/80 border border-slate-700/60 shadow-lg flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 id="outfit-planner-title" className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Shirt className="w-4 h-4 text-indigo-400" />
                Smart Outfit & Gear Planner
              </h4>
              <span className="text-[11px] text-indigo-300 font-medium bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                Today
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div id="outfit-top-row" className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-700/40">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                  Top Layer
                </span>
                <span id="outfit-top-value" className="text-slate-100 font-semibold text-sm">
                  {outfit.top}
                </span>
              </div>

              <div id="outfit-bottom-row" className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-700/40">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                  Bottom Layer
                </span>
                <span id="outfit-bottom-value" className="text-slate-100 font-semibold text-sm">
                  {outfit.bottom}
                </span>
              </div>

              <div id="outfit-footwear-row" className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-700/40">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                  Footwear
                </span>
                <span id="outfit-footwear-value" className="text-slate-100 font-semibold text-sm">
                  {outfit.footwear}
                </span>
              </div>

              {outfit.accessories.length > 0 && (
                <div id="outfit-accessories-row" className="pt-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1.5">
                    Recommended Gear & Accessories
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {outfit.accessories.map((acc, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/25 font-medium text-xs"
                      >
                        {acc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
