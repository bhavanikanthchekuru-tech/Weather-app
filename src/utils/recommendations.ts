import { ActivitySuitability, OutfitAdvice, ProcessedCurrentWeather, Recommendation } from '../types';
import { isPrecipitationCode, isRainCode, isSnowCode } from './weatherCodes';

export function generateRecommendations(current: ProcessedCurrentWeather): {
  recommendations: Recommendation[];
  activities: ActivitySuitability[];
  outfit: OutfitAdvice;
} {
  const recommendations: Recommendation[] = [];
  const {
    temperature,
    feelsLike,
    weatherCode,
    windSpeed,
    uvIndex,
    precipitationChance,
    humidity,
    todayMax,
    todayMin,
  } = current;

  const isRain = isRainCode(weatherCode) || precipitationChance >= 40;
  const isSnow = isSnowCode(weatherCode);
  const isPrecip = isPrecipitationCode(weatherCode) || precipitationChance >= 30;
  const isVeryHot = temperature >= 30 || feelsLike >= 32;
  const isWarm = temperature >= 22 && temperature < 30;
  const isChilly = temperature >= 8 && temperature < 15;
  const isCold = temperature < 8;
  const isFreezing = temperature <= 0;
  const isWindy = windSpeed >= 28;
  const isHighUV = uvIndex >= 6;
  const tempDropTonight = todayMax - todayMin >= 9;

  // 1. Primary Umbrella & Rain recommendation
  if (isRain) {
    recommendations.push({
      id: 'rain-umbrella',
      title: 'Carry an Umbrella',
      description: precipitationChance >= 70 || [63, 65, 81, 82, 95, 96, 99].includes(weatherCode)
        ? 'Steady or heavy rain expected. Keep a sturdy umbrella or waterproof raincoat with you.'
        : 'Scattered drizzle or light showers in the area. A compact umbrella is recommended.',
      type: 'umbrella',
      severity: 'alert',
      icon: 'Umbrella',
      badge: 'Rain Alert',
    });
  } else if (precipitationChance >= 25) {
    recommendations.push({
      id: 'rain-possible',
      title: 'Pocket Umbrella Recommended',
      description: `There is a ${precipitationChance}% chance of spotty precipitation today. Better safe than wet!`,
      type: 'umbrella',
      severity: 'advisory',
      icon: 'CloudRain',
      badge: 'Chance of Rain',
    });
  }

  // 2. Hydration & Heat recommendation
  if (isVeryHot) {
    recommendations.push({
      id: 'heat-hydration',
      title: 'Stay Hydrated',
      description: `High heat conditions (${Math.round(temperature)}°C / Feels like ${Math.round(feelsLike)}°C). Drink plenty of water throughout the day, seek shade, and avoid prolonged outdoor exertion during peak hours.`,
      type: 'hydration',
      severity: 'alert',
      icon: 'Droplets',
      badge: 'Heat Advisory',
    });
  } else if (temperature >= 25 && humidity >= 65) {
    recommendations.push({
      id: 'humid-hydration',
      title: 'Keep Water Handy',
      description: 'Humid conditions will make the air feel heavier. Drink fluids consistently if active outdoors.',
      type: 'hydration',
      severity: 'advisory',
      icon: 'GlassWater',
      badge: 'Hydration',
    });
  }

  // 3. Snow & Freezing conditions
  if (isSnow || isFreezing) {
    recommendations.push({
      id: 'cold-snow',
      title: 'Icy Roads & Thermal Layers',
      description: 'Sub-zero or snowy conditions. Wear insulated boots with good grip, a heavy parka, gloves, and watch for black ice on paths.',
      type: 'clothing',
      severity: 'alert',
      icon: 'Snowflake',
      badge: 'Freezing Alert',
    });
  }

  // 4. Sun & UV Protection
  if (isHighUV) {
    recommendations.push({
      id: 'uv-defense',
      title: 'Sun Protection Required',
      description: `UV Index is high (${uvIndex.toFixed(1)}). Apply broad-spectrum SPF 30+ sunscreen, wear UV-blocking sunglasses, and put on a wide-brimmed hat.`,
      type: 'uv',
      severity: 'advisory',
      icon: 'Sun',
      badge: 'High UV',
    });
  }

  // 5. Wind Warning
  if (isWindy) {
    recommendations.push({
      id: 'wind-warning',
      title: 'Breezy & Blustery Winds',
      description: `Winds blowing at ${Math.round(windSpeed)} km/h. Secure loose outdoor furniture, take care when cycling, and choose windproof outer clothing.`,
      type: 'wind',
      severity: 'advisory',
      icon: 'Wind',
      badge: 'Wind Advisory',
    });
  }

  // 6. Evening Temperature Drop Alert
  if (tempDropTonight && !isFreezing) {
    recommendations.push({
      id: 'temp-drop',
      title: 'Significant Evening Cool Down',
      description: `Temperatures will drop from a high of ${Math.round(todayMax)}°C down to ${Math.round(todayMin)}°C tonight. Bring an extra sweater or light jacket if staying out late.`,
      type: 'clothing',
      severity: 'advisory',
      icon: 'Shirt',
      badge: 'Evening Chill',
    });
  }

  // 7. Optimal Weather Window
  if (!isRain && !isSnow && !isVeryHot && !isCold && !isWindy) {
    recommendations.push({
      id: 'optimal-weather',
      title: 'Pleasant Outdoor Conditions',
      description: 'Comfortable temperatures and calm atmosphere make it a wonderful time for a walk, outdoor dining, or running errands.',
      type: 'activity',
      severity: 'optimal',
      icon: 'Sparkles',
      badge: 'Ideal Window',
    });
  }

  // Fallback to ensure at least 2 relevant recommendations
  if (recommendations.length < 2) {
    if (isCold) {
      recommendations.push({
        id: 'cold-layers',
        title: 'Bundle Up in Warm Layers',
        description: 'Chilly air today. A warm jacket, scarf, and cozy socks will keep you comfortable throughout the day.',
        type: 'clothing',
        severity: 'advisory',
        icon: 'Shirt',
        badge: 'Chilly Air',
      });
    } else {
      recommendations.push({
        id: 'general-comfort',
        title: 'Mild & Moderate Day',
        description: 'No severe weather events detected today. Perfect for standard daily activities.',
        type: 'activity',
        severity: 'optimal',
        icon: 'Compass',
        badge: 'Normal Conditions',
      });
    }
  }

  // Activity suitability calculations (0 - 100)
  const activities: ActivitySuitability[] = [];

  // Running / Jogging
  let runScore = 90;
  if (isRain) runScore -= 35;
  if (isVeryHot) runScore -= 40;
  else if (temperature > 26) runScore -= 20;
  if (isCold) runScore -= 15;
  if (isFreezing) runScore -= 35;
  if (isWindy) runScore -= 20;
  runScore = Math.max(10, Math.min(100, runScore));

  activities.push({
    activity: 'Running & Jogging',
    score: runScore,
    label: runScore >= 80 ? 'Great' : runScore >= 55 ? 'Good' : runScore >= 35 ? 'Challenging' : 'Avoid',
    summary: runScore >= 80
      ? 'Optimal crisp temperatures and clear footing.'
      : runScore >= 55
      ? 'Good conditions; hydrate well and pace yourself.'
      : isRain
      ? 'Slippery roads; treadmill or indoor workout recommended.'
      : isVeryHot
      ? 'High heat risk; run early morning before 8 AM or after sunset.'
      : 'Cold or harsh wind; wear thermal windproof layers.',
    icon: 'Footprints',
  });

  // Cycling
  let bikeScore = 90;
  if (isRain) bikeScore -= 45;
  if (isSnow || isFreezing) bikeScore -= 60;
  if (isWindy) bikeScore -= 35;
  if (isVeryHot) bikeScore -= 25;
  bikeScore = Math.max(10, Math.min(100, bikeScore));

  activities.push({
    activity: 'Cycling & Commuting',
    score: bikeScore,
    label: bikeScore >= 80 ? 'Great' : bikeScore >= 55 ? 'Good' : bikeScore >= 35 ? 'Challenging' : 'Avoid',
    summary: bikeScore >= 80
      ? 'Clear visibility, moderate breeze, and smooth roads.'
      : isWindy
      ? 'Strong headwinds and crosswinds require extra steering caution.'
      : isRain || isSnow
      ? 'Reduced tire traction and wet braking distances; ride with caution.'
      : 'Fair conditions; wear appropriate eye protection.',
    icon: 'Bike',
  });

  // Outdoor Dining & Socializing
  let diningScore = 85;
  if (isRain) diningScore -= 50;
  if (isWindy) diningScore -= 30;
  if (temperature < 14) diningScore -= 35;
  if (temperature > 32) diningScore -= 30;
  diningScore = Math.max(10, Math.min(100, diningScore));

  activities.push({
    activity: 'Outdoor Dining & Patio',
    score: diningScore,
    label: diningScore >= 80 ? 'Great' : diningScore >= 55 ? 'Good' : diningScore >= 35 ? 'Challenging' : 'Avoid',
    summary: diningScore >= 80
      ? 'Splendid patio weather! Comfortable breeze and mild sun.'
      : diningScore >= 55
      ? 'Pleasant under covered patio or with a light sweater.'
      : isRain
      ? 'Rain expected; recommend reserving an indoor table.'
      : 'A bit too chilly or windy for long relaxed meals outside.',
    icon: 'Coffee',
  });

  // Walking & Sightseeing
  let walkScore = 90;
  if (isRain) walkScore -= 30;
  if (isSnow) walkScore -= 25;
  if (isVeryHot) walkScore -= 25;
  if (isWindy) walkScore -= 15;
  walkScore = Math.max(15, Math.min(100, walkScore));

  activities.push({
    activity: 'Walking & Exploring',
    score: walkScore,
    label: walkScore >= 80 ? 'Great' : walkScore >= 55 ? 'Good' : walkScore >= 35 ? 'Challenging' : 'Avoid',
    summary: walkScore >= 80
      ? 'Inviting conditions for a stroll in the park or city exploration.'
      : walkScore >= 55
      ? 'Nice walking weather with the right clothing choices.'
      : 'Bring weather gear (umbrella, coat) if planning extended walks.',
    icon: 'Compass',
  });

  // Smart Outfit Planner
  let top = 'Breathable Cotton T-Shirt';
  let bottom = 'Comfortable Shorts or Chinos';
  let footwear = 'Casual Sneakers';
  const accessories: string[] = [];

  if (isFreezing || isSnow) {
    top = 'Thermal Base Layer + Heavy Down Parka';
    bottom = 'Insulated Trousers / Thermal Leggings';
    footwear = 'Waterproof Insulated Winter Boots';
    accessories.push('Knit Beanie', 'Thermal Gloves', 'Wool Scarf');
  } else if (isCold) {
    top = 'Long-Sleeve Sweater + Mid-Weight Coat';
    bottom = 'Denim Jeans or Wool Trousers';
    footwear = 'Closed Leather Shoes or Ankle Boots';
    accessories.push('Warm Scarf');
  } else if (isChilly) {
    top = 'Layered Shirt + Light Jacket / Cardigan';
    bottom = 'Casual Pants or Jeans';
    footwear = 'Comfortable Sneakers';
  } else if (isWarm) {
    top = 'Lightweight Linen or Cotton Shirt';
    bottom = 'Chinos or Light Denim';
    footwear = 'Breathable Low-top Sneakers';
  } else if (isVeryHot) {
    top = 'Ultra-light Moisture-Wicking Tee';
    bottom = 'Breezy Linen Shorts';
    footwear = 'Airy Canvas Shoes or Sandals';
  }

  if (isRain) {
    accessories.push('Waterproof Umbrella', 'Water-repellent Shell');
  }
  if (isHighUV || (temperature > 22 && !isRain)) {
    accessories.push('UV400 Sunglasses', 'Sunscreen SPF 30+');
  }
  if (isWindy && !accessories.includes('Windbreaker')) {
    accessories.push('Windbreaker Outer Layer');
  }

  const outfit: OutfitAdvice = {
    top,
    bottom,
    footwear,
    accessories: accessories.slice(0, 4),
  };

  return {
    recommendations,
    activities,
    outfit,
  };
}
