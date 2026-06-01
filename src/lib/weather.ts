const LAT = 29.0469;
const LNG = -13.5899;
const TIMEZONE = 'Atlantic/Canary';

import { AlertThresholds, AlertRuleResult, DEFAULT_ALERT_THRESHOLDS, evaluateAlertRules } from '@/lib/alertRules';

export interface CurrentWeather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windGust: number;
  uvIndex: number;
  precipitation: number;
  cloudCover: number;
  weatherCode: number;
  apparentTemperature: number;
}

export interface HourlyData {
  time: string[];
  temperature: number[];
  humidity: number[];
  windSpeed: number[]; // nueva propiedad para velocidad de viento
  windGust: number[];
  precipitationProbability: number[];
  soilTemperature: number[];
  soilMoisture: number[];
  dewPoint: number[]; // nueva propiedad para punto de rocío
}

export interface DailyData {
  time: string[];
  temperatureMax: number[];
  temperatureMin: number[];
  apparentTemperatureMax: number[];
  apparentTemperatureMin: number[];
  precipitationSum: number[];
  precipitationProbabilityMax: number[];
  uvIndexMax: number[];
  windSpeedMax: number[];
  sunrise: string[];
  sunset: string[];
  weatherCode: number[];
}

export interface WeatherResponse {
  current: CurrentWeather;
  hourly: HourlyData;
  daily: DailyData;
}

export async function fetchWeather(latitude: number = LAT, longitude: number = LNG): Promise<WeatherResponse> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,wind_direction_10m,uv_index,precipitation,cloud_cover,weather_code,apparent_temperature&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,wind_speed_10m,wind_gusts_10m,precipitation_probability,soil_temperature_6cm,soil_moisture_3_to_9cm&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,precipitation_probability_max,uv_index_max,wind_speed_10m_max,sunrise,sunset,weather_code&timezone=${TIMEZONE}&forecast_days=7`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch weather data');
  const data = await res.json();

  return {
    current: {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      windGust: data.current.wind_gusts_10m,
      uvIndex: data.current.uv_index,
      precipitation: data.current.precipitation,
      cloudCover: data.current.cloud_cover,
      weatherCode: data.current.weather_code,
      apparentTemperature: data.current.apparent_temperature,
    },
    hourly: {
      time: data.hourly.time,
      temperature: data.hourly.temperature_2m,
      humidity: data.hourly.relative_humidity_2m,
      windSpeed: data.hourly.wind_speed_10m, // incluir velocidad de viento
      windGust: data.hourly.wind_gusts_10m,
      precipitationProbability: data.hourly.precipitation_probability,
      soilTemperature: data.hourly.soil_temperature_6cm,
      soilMoisture: data.hourly.soil_moisture_3_to_9cm,
      dewPoint: data.hourly.dew_point_2m,
    },
    daily: {
      time: data.daily.time,
      temperatureMax: data.daily.temperature_2m_max,
      temperatureMin: data.daily.temperature_2m_min,
      apparentTemperatureMax: data.daily.apparent_temperature_max,
      apparentTemperatureMin: data.daily.apparent_temperature_min,
      precipitationSum: data.daily.precipitation_sum,
      precipitationProbabilityMax: data.daily.precipitation_probability_max,
      uvIndexMax: data.daily.uv_index_max,
      windSpeedMax: data.daily.wind_speed_10m_max,
      sunrise: data.daily.sunrise,
      sunset: data.daily.sunset,
      weatherCode: data.daily.weather_code,
    },
  };
}

export type GrowingAlert = AlertRuleResult;

export function getGrowingAlerts(
  weather: WeatherResponse,
  thresholds: AlertThresholds = DEFAULT_ALERT_THRESHOLDS,
  timezone: string = TIMEZONE,
): GrowingAlert[] {
  return evaluateAlertRules(
    {
      current: {
        temperature: weather.current.temperature,
        uvIndex: weather.current.uvIndex,
        windSpeed: weather.current.windSpeed,
        windGust: weather.current.windGust,
      },
      hourly: {
        time: weather.hourly.time,
        temperature: weather.hourly.temperature,
        humidity: weather.hourly.humidity,
        dewPoint: weather.hourly.dewPoint,
        windSpeed: weather.hourly.windSpeed,
        windGust: weather.hourly.windGust,
        precipitationProbability: weather.hourly.precipitationProbability,
      },
      daily: {
        precipitationSum: weather.daily.precipitationSum,
      },
      timezone,
    },
    thresholds,
  );
}

export function getWeatherDescription(code: number): { label: string; icon: string } {
  const map: Record<number, { label: string; icon: string }> = {
    0: { label: 'Cielo despejado', icon: '☀️' },
    1: { label: 'Mayormente despejado', icon: '🌤️' },
    2: { label: 'Parcialmente nublado', icon: '⛅' },
    3: { label: 'Nublado', icon: '☁️' },
    45: { label: 'Niebla', icon: '🌫️' },
    48: { label: 'Niebla con escarcha', icon: '🌫️' },
    51: { label: 'Llovizna ligera', icon: '🌦️' },
    53: { label: 'Llovizna', icon: '🌦️' },
    55: { label: 'Llovizna intensa', icon: '🌧️' },
    61: { label: 'Lluvia ligera', icon: '🌦️' },
    63: { label: 'Lluvia', icon: '🌧️' },
    65: { label: 'Lluvia intensa', icon: '🌧️' },
    71: { label: 'Nevada ligera', icon: '🌨️' },
    73: { label: 'Nevada', icon: '❄️' },
    75: { label: 'Nevada intensa', icon: '❄️' },
    80: { label: 'Chubascos', icon: '🌦️' },
    81: { label: 'Chubascos moderados', icon: '🌧️' },
    82: { label: 'Chubascos fuertes', icon: '⛈️' },
    95: { label: 'Tormenta', icon: '⛈️' },
    96: { label: 'Tormenta con granizo', icon: '⛈️' },
    99: { label: 'Tormenta severa', icon: '⛈️' },
  };
  return map[code] || { label: 'Desconocido', icon: '❓' };
}

export function getWindDirection(deg: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  name: string;
}

export async function geocodePostalCode(postalCode: string): Promise<GeocodingResult | null> {
  try {
    const normalizedPostalCode = postalCode.trim();
    if (!normalizedPostalCode) return null;

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(normalizedPostalCode)}&count=1&language=es&format=json`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        latitude: result.latitude,
        longitude: result.longitude,
        name: result.name
      };
    }
    return null;
  } catch (error) {
    console.error('Error geocoding postal code:', error);
    return null;
  }
}

export async function reverseGeocodeCoordinates(latitude: number, longitude: number): Promise<string | null> {
  try {
    const lat = Number(latitude.toFixed(4));
    const lng = Number(longitude.toFixed(4));
    const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lng}&language=es&format=json`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;
    return data.results[0].name ?? null;
  } catch (error) {
    console.error('Error reverse geocoding coordinates:', error);
    return null;
  }
}
