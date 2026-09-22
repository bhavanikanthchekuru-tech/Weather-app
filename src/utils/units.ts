import { TemperatureUnit, WindSpeedUnit } from '../types';

export function toFahrenheit(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

export function toCelsius(fahrenheit: number): number {
  return Math.round(((fahrenheit - 32) * 5) / 9);
}

export function toMph(kmh: number): number {
  return Math.round(kmh * 0.621371);
}

export function formatTemp(celsius: number, unit: TemperatureUnit): string {
  const rounded = Math.round(unit === 'fahrenheit' ? toFahrenheit(celsius) : celsius);
  return `${rounded}°${unit === 'fahrenheit' ? 'F' : 'C'}`;
}

export function formatTempValue(celsius: number, unit: TemperatureUnit): number {
  return Math.round(unit === 'fahrenheit' ? toFahrenheit(celsius) : celsius);
}

export function formatWind(kmh: number, unit: WindSpeedUnit): string {
  const value = unit === 'mph' ? toMph(kmh) : Math.round(kmh);
  return `${value} ${unit === 'mph' ? 'mph' : 'km/h'}`;
}

export function getWindDirectionLabel(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}
