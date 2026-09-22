export interface WeatherCodeInfo {
  code: number;
  label: string;
  category: 'clear' | 'clouds' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
  icon: string; // Lucide icon identifier
  badgeBg: string;
  badgeText: string;
  cardGradient: string;
}

export const WEATHER_CODE_MAP: Record<number, WeatherCodeInfo> = {
  0: {
    code: 0,
    label: 'Clear Sky',
    category: 'clear',
    icon: 'Sun',
    badgeBg: 'bg-amber-500/10 border-amber-500/30',
    badgeText: 'text-amber-400',
    cardGradient: 'from-amber-500/15 via-sky-500/10 to-slate-900/40',
  },
  1: {
    code: 1,
    label: 'Mainly Clear',
    category: 'clear',
    icon: 'SunDim',
    badgeBg: 'bg-amber-400/10 border-amber-400/30',
    badgeText: 'text-amber-300',
    cardGradient: 'from-amber-400/15 via-sky-500/10 to-slate-900/40',
  },
  2: {
    code: 2,
    label: 'Partly Cloudy',
    category: 'clouds',
    icon: 'CloudSun',
    badgeBg: 'bg-sky-500/10 border-sky-500/30',
    badgeText: 'text-sky-300',
    cardGradient: 'from-sky-500/15 via-blue-500/10 to-slate-900/40',
  },
  3: {
    code: 3,
    label: 'Overcast',
    category: 'clouds',
    icon: 'Cloud',
    badgeBg: 'bg-slate-500/10 border-slate-500/30',
    badgeText: 'text-slate-300',
    cardGradient: 'from-slate-500/15 via-slate-600/10 to-slate-900/40',
  },
  45: {
    code: 45,
    label: 'Foggy',
    category: 'fog',
    icon: 'CloudFog',
    badgeBg: 'bg-zinc-500/10 border-zinc-500/30',
    badgeText: 'text-zinc-300',
    cardGradient: 'from-zinc-500/15 via-slate-600/10 to-slate-900/40',
  },
  48: {
    code: 48,
    label: 'Depositing Rime Fog',
    category: 'fog',
    icon: 'CloudFog',
    badgeBg: 'bg-zinc-500/10 border-zinc-500/30',
    badgeText: 'text-zinc-300',
    cardGradient: 'from-zinc-500/15 via-slate-600/10 to-slate-900/40',
  },
  51: {
    code: 51,
    label: 'Light Drizzle',
    category: 'drizzle',
    icon: 'CloudDrizzle',
    badgeBg: 'bg-teal-500/10 border-teal-500/30',
    badgeText: 'text-teal-300',
    cardGradient: 'from-teal-500/15 via-cyan-600/10 to-slate-900/40',
  },
  53: {
    code: 53,
    label: 'Moderate Drizzle',
    category: 'drizzle',
    icon: 'CloudDrizzle',
    badgeBg: 'bg-teal-500/10 border-teal-500/30',
    badgeText: 'text-teal-300',
    cardGradient: 'from-teal-500/15 via-cyan-600/10 to-slate-900/40',
  },
  55: {
    code: 55,
    label: 'Dense Drizzle',
    category: 'drizzle',
    icon: 'CloudRain',
    badgeBg: 'bg-cyan-500/10 border-cyan-500/30',
    badgeText: 'text-cyan-300',
    cardGradient: 'from-cyan-500/15 via-blue-600/10 to-slate-900/40',
  },
  56: {
    code: 56,
    label: 'Light Freezing Drizzle',
    category: 'drizzle',
    icon: 'CloudSnow',
    badgeBg: 'bg-cyan-400/10 border-cyan-400/30',
    badgeText: 'text-cyan-200',
    cardGradient: 'from-cyan-400/15 via-indigo-600/10 to-slate-900/40',
  },
  57: {
    code: 57,
    label: 'Dense Freezing Drizzle',
    category: 'drizzle',
    icon: 'CloudSnow',
    badgeBg: 'bg-cyan-400/10 border-cyan-400/30',
    badgeText: 'text-cyan-200',
    cardGradient: 'from-cyan-400/15 via-indigo-600/10 to-slate-900/40',
  },
  61: {
    code: 61,
    label: 'Slight Rain',
    category: 'rain',
    icon: 'CloudRain',
    badgeBg: 'bg-blue-500/10 border-blue-500/30',
    badgeText: 'text-blue-300',
    cardGradient: 'from-blue-500/15 via-indigo-600/10 to-slate-900/40',
  },
  63: {
    code: 63,
    label: 'Moderate Rain',
    category: 'rain',
    icon: 'CloudRain',
    badgeBg: 'bg-blue-500/10 border-blue-500/30',
    badgeText: 'text-blue-300',
    cardGradient: 'from-blue-500/20 via-sky-600/10 to-slate-900/40',
  },
  65: {
    code: 65,
    label: 'Heavy Rain',
    category: 'rain',
    icon: 'CloudRainWind',
    badgeBg: 'bg-blue-600/15 border-blue-500/40',
    badgeText: 'text-blue-200',
    cardGradient: 'from-blue-600/25 via-indigo-700/15 to-slate-900/50',
  },
  66: {
    code: 66,
    label: 'Light Freezing Rain',
    category: 'rain',
    icon: 'CloudSnow',
    badgeBg: 'bg-indigo-500/10 border-indigo-500/30',
    badgeText: 'text-indigo-300',
    cardGradient: 'from-indigo-500/20 via-blue-600/10 to-slate-900/40',
  },
  67: {
    code: 67,
    label: 'Heavy Freezing Rain',
    category: 'rain',
    icon: 'CloudSnow',
    badgeBg: 'bg-indigo-500/15 border-indigo-500/40',
    badgeText: 'text-indigo-200',
    cardGradient: 'from-indigo-600/25 via-blue-700/15 to-slate-900/50',
  },
  71: {
    code: 71,
    label: 'Slight Snow Fall',
    category: 'snow',
    icon: 'Snowflake',
    badgeBg: 'bg-sky-400/10 border-sky-400/30',
    badgeText: 'text-sky-200',
    cardGradient: 'from-sky-300/15 via-blue-400/10 to-slate-900/40',
  },
  73: {
    code: 73,
    label: 'Moderate Snow Fall',
    category: 'snow',
    icon: 'Snowflake',
    badgeBg: 'bg-sky-400/15 border-sky-400/30',
    badgeText: 'text-sky-200',
    cardGradient: 'from-sky-300/20 via-blue-500/10 to-slate-900/40',
  },
  75: {
    code: 75,
    label: 'Heavy Snow Fall',
    category: 'snow',
    icon: 'Snowflake',
    badgeBg: 'bg-sky-300/20 border-sky-300/40',
    badgeText: 'text-white',
    cardGradient: 'from-sky-200/25 via-indigo-400/15 to-slate-900/50',
  },
  77: {
    code: 77,
    label: 'Snow Grains',
    category: 'snow',
    icon: 'Snowflake',
    badgeBg: 'bg-sky-400/10 border-sky-400/30',
    badgeText: 'text-sky-200',
    cardGradient: 'from-sky-400/15 via-slate-600/10 to-slate-900/40',
  },
  80: {
    code: 80,
    label: 'Slight Rain Showers',
    category: 'rain',
    icon: 'CloudRain',
    badgeBg: 'bg-blue-500/10 border-blue-500/30',
    badgeText: 'text-blue-300',
    cardGradient: 'from-blue-500/15 via-sky-600/10 to-slate-900/40',
  },
  81: {
    code: 81,
    label: 'Moderate Rain Showers',
    category: 'rain',
    icon: 'CloudRain',
    badgeBg: 'bg-blue-500/15 border-blue-500/30',
    badgeText: 'text-blue-300',
    cardGradient: 'from-blue-500/20 via-cyan-600/10 to-slate-900/40',
  },
  82: {
    code: 82,
    label: 'Violent Rain Showers',
    category: 'rain',
    icon: 'CloudRainWind',
    badgeBg: 'bg-blue-600/20 border-blue-600/40',
    badgeText: 'text-blue-200',
    cardGradient: 'from-blue-700/30 via-indigo-800/20 to-slate-900/60',
  },
  85: {
    code: 85,
    label: 'Slight Snow Showers',
    category: 'snow',
    icon: 'Snowflake',
    badgeBg: 'bg-sky-400/10 border-sky-400/30',
    badgeText: 'text-sky-200',
    cardGradient: 'from-sky-400/15 via-slate-700/10 to-slate-900/40',
  },
  86: {
    code: 86,
    label: 'Heavy Snow Showers',
    category: 'snow',
    icon: 'Snowflake',
    badgeBg: 'bg-sky-300/20 border-sky-300/40',
    badgeText: 'text-white',
    cardGradient: 'from-sky-300/25 via-blue-700/20 to-slate-900/50',
  },
  95: {
    code: 95,
    label: 'Thunderstorm',
    category: 'thunderstorm',
    icon: 'CloudLightning',
    badgeBg: 'bg-purple-500/15 border-purple-500/30',
    badgeText: 'text-purple-300',
    cardGradient: 'from-purple-600/25 via-amber-500/10 to-slate-900/50',
  },
  96: {
    code: 96,
    label: 'Thunderstorm with Slight Hail',
    category: 'thunderstorm',
    icon: 'CloudLightning',
    badgeBg: 'bg-purple-500/20 border-purple-500/40',
    badgeText: 'text-purple-200',
    cardGradient: 'from-purple-700/30 via-sky-600/15 to-slate-900/60',
  },
  99: {
    code: 99,
    label: 'Thunderstorm with Heavy Hail',
    category: 'thunderstorm',
    icon: 'CloudLightning',
    badgeBg: 'bg-red-500/20 border-red-500/40',
    badgeText: 'text-red-200',
    cardGradient: 'from-red-600/30 via-purple-800/20 to-slate-900/60',
  },
};

export function getWeatherCodeInfo(code: number): WeatherCodeInfo {
  if (WEATHER_CODE_MAP[code]) {
    return WEATHER_CODE_MAP[code];
  }
  // Fallback
  return {
    code,
    label: 'Partly Cloudy',
    category: 'clouds',
    icon: 'CloudSun',
    badgeBg: 'bg-slate-500/10 border-slate-500/30',
    badgeText: 'text-slate-300',
    cardGradient: 'from-slate-500/15 via-slate-600/10 to-slate-900/40',
  };
}

export function isPrecipitationCode(code: number): boolean {
  return [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99].includes(code);
}

export function isRainCode(code: number): boolean {
  return [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code);
}

export function isSnowCode(code: number): boolean {
  return [56, 57, 66, 67, 71, 73, 75, 77, 85, 86].includes(code);
}
