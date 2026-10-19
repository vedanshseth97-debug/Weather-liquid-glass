export type WeatherConditionType = 
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rain'
  | 'heavy-rain'
  | 'thunderstorm'
  | 'snow'
  | 'fog';

export interface HourlyForecastData {
  time: string;
  hour: number;
  temp: number;
  condition: WeatherConditionType;
  conditionLabel: string;
  pop: number; // probability of precipitation (0-100)
  isDay: boolean;
}

export interface DailyForecastData {
  day: string;
  date: string;
  condition: WeatherConditionType;
  conditionLabel: string;
  tempMin: number;
  tempMax: number;
  precipitationChance: number;
  uvIndex: number;
  windSpeed: number;
  humidity: number;
}

export interface WeatherData {
  cityName: string;
  country: string;
  latitude: number;
  longitude: number;
  currentTemp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  condition: WeatherConditionType;
  conditionDescription: string;
  uvIndex: number;
  uvDescription: string;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  humidity: number;
  dewPoint: number;
  visibility: number; // in miles
  pressure: number; // hPa
  airQualityIndex: number; // AQI
  airQualityStatus: string;
  sunriseTime: string;
  sunsetTime: string;
  isDay: boolean;
  hourly: HourlyForecastData[];
  daily: DailyForecastData[];
}

export interface GlassSettings {
  blurIntensity: number; // 10 to 40
  specularBrightness: number; // 0.2 to 1.0
  fluidSpeed: number; // 0.5 to 2.5
  tiltSensitivity: number; // 5 to 25
  chromaticTint: 'cyan-magenta' | 'amber-violet' | 'aurora-emerald' | 'crystal-ice';
  hapticFeedback: boolean;
}

export interface AnimationControls {
  enabled: boolean;
  speed: number; // 0.5, 1.0, 2.0
  particlesEnabled: boolean;
  fluidMeshEnabled: boolean;
  tiltPhysicsEnabled: boolean;
  radarPulseEnabled: boolean;
}

export type AndroidWidgetType = 'compact-2x2' | 'horizontal-4x2' | 'clock-4x3' | 'dial-3x3';

export interface WidgetConfig {
  type: AndroidWidgetType;
  tint: 'rainbow' | 'cyan' | 'amber' | 'emerald' | 'crystal';
  showHourly: boolean;
  showAirQuality: boolean;
  blurLevel: number;
}

export interface CityPreset {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  condition: WeatherConditionType;
  temp: number;
  tagline: string;
}
