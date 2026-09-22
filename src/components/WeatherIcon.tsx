import React from 'react';
import {
  Sun,
  SunDim,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Snowflake,
  CloudLightning,
  Wind,
  Droplets,
  Umbrella,
  Compass,
  Footprints,
  Bike,
  Coffee,
  Shirt,
  Sparkles,
  GlassWater,
  LucideProps,
} from 'lucide-react';
import { getWeatherCodeInfo } from '../utils/weatherCodes';

interface WeatherIconProps extends LucideProps {
  code?: number;
  iconName?: string;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ code, iconName, className = 'w-6 h-6', ...props }) => {
  let targetIcon = iconName;

  if (code !== undefined) {
    const info = getWeatherCodeInfo(code);
    targetIcon = info.icon;
  }

  switch (targetIcon) {
    case 'Sun':
      return <Sun className={`text-amber-400 ${className}`} {...props} />;
    case 'SunDim':
      return <SunDim className={`text-amber-300 ${className}`} {...props} />;
    case 'CloudSun':
      return <CloudSun className={`text-sky-300 ${className}`} {...props} />;
    case 'Cloud':
      return <Cloud className={`text-slate-300 ${className}`} {...props} />;
    case 'CloudFog':
      return <CloudFog className={`text-zinc-300 ${className}`} {...props} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={`text-teal-300 ${className}`} {...props} />;
    case 'CloudRain':
      return <CloudRain className={`text-blue-400 ${className}`} {...props} />;
    case 'CloudRainWind':
      return <CloudRainWind className={`text-blue-500 ${className}`} {...props} />;
    case 'CloudSnow':
      return <CloudSnow className={`text-sky-200 ${className}`} {...props} />;
    case 'Snowflake':
      return <Snowflake className={`text-cyan-200 ${className}`} {...props} />;
    case 'CloudLightning':
      return <CloudLightning className={`text-purple-400 ${className}`} {...props} />;
    case 'Wind':
      return <Wind className={`text-teal-300 ${className}`} {...props} />;
    case 'Droplets':
      return <Droplets className={`text-cyan-400 ${className}`} {...props} />;
    case 'Umbrella':
      return <Umbrella className={`text-blue-400 ${className}`} {...props} />;
    case 'Footprints':
      return <Footprints className={`text-emerald-400 ${className}`} {...props} />;
    case 'Bike':
      return <Bike className={`text-amber-400 ${className}`} {...props} />;
    case 'Coffee':
      return <Coffee className={`text-orange-400 ${className}`} {...props} />;
    case 'Shirt':
      return <Shirt className={`text-indigo-400 ${className}`} {...props} />;
    case 'Sparkles':
      return <Sparkles className={`text-yellow-400 ${className}`} {...props} />;
    case 'GlassWater':
      return <GlassWater className={`text-sky-400 ${className}`} {...props} />;
    case 'Compass':
    default:
      return <Compass className={`text-sky-400 ${className}`} {...props} />;
  }
};
