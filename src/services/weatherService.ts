import { CityPreset, WeatherConditionType, WeatherData } from '../types/weather';

export const POPULAR_CITIES: CityPreset[] = [
  {
    id: 'sf',
    name: 'San Francisco',
    country: 'United States',
    lat: 37.7749,
    lon: -122.4194,
    condition: 'clear',
    temp: 72,
    tagline: 'Liquid Twilight • Mostly Clear',
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    lat: 35.6762,
    lon: 139.6503,
    condition: 'partly-cloudy',
    temp: 64,
    tagline: 'Neon Mist • Gentle Breeze',
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    lat: 51.5074,
    lon: -0.1278,
    condition: 'rain',
    temp: 57,
    tagline: 'Atmospheric Drizzle • Wet Glass',
  },
  {
    id: 'ny',
    name: 'New York',
    country: 'United States',
    lat: 40.7128,
    lon: -74.006,
    condition: 'thunderstorm',
    temp: 68,
    tagline: 'Electric Nimbus • Sudden Downpour',
  },
  {
    id: 'reykjavik',
    name: 'Reykjavík',
    country: 'Iceland',
    lat: 64.1466,
    lon: -21.9426,
    condition: 'snow',
    temp: 31,
    tagline: 'Glacial Flurry • Aurora Sky',
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    lat: 25.2048,
    lon: 55.2708,
    condition: 'clear',
    temp: 89,
    tagline: 'Golden Solar • Radiant Heat',
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    lat: 48.8566,
    lon: 2.3522,
    condition: 'cloudy',
    temp: 61,
    tagline: 'Silver Overcast • Soft Ambient Light',
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    lat: 1.3521,
    lon: 103.8198,
    condition: 'heavy-rain',
    temp: 84,
    tagline: 'Tropical Monsoon • Warm Rainfall',
  },
];

// Helper to map WMO Weather Codes to our condition types
function mapWmoToCondition(code: number): { condition: WeatherConditionType; label: string } {
  if (code === 0) return { condition: 'clear', label: 'Clear Sky' };
  if (code === 1 || code === 2) return { condition: 'partly-cloudy', label: 'Partly Cloudy' };
  if (code === 3) return { condition: 'cloudy', label: 'Overcast' };
  if (code === 45 || code === 48) return { condition: 'fog', label: 'Foggy Glass' };
  if (code >= 51 && code <= 55) return { condition: 'rain', label: 'Light Drizzle' };
  if (code >= 61 && code <= 65) return { condition: 'rain', label: 'Steady Rain' };
  if (code >= 66 && code <= 67) return { condition: 'snow', label: 'Freezing Rain' };
  if (code >= 71 && code <= 77) return { condition: 'snow', label: 'Snow Flurry' };
  if (code >= 80 && code <= 82) return { condition: 'heavy-rain', label: 'Heavy Showers' };
  if (code >= 85 && code <= 86) return { condition: 'snow', label: 'Heavy Snow' };
  if (code >= 95 && code <= 99) return { condition: 'thunderstorm', label: 'Thunderstorm' };
  return { condition: 'partly-cloudy', label: 'Partly Cloudy' };
}

// Generates fallback rich data based on preset or default
export function getMockWeatherData(city: CityPreset): WeatherData {
  const isSnow = city.condition === 'snow';
  const isRain = city.condition === 'rain' || city.condition === 'heavy-rain';
  const isThunder = city.condition === 'thunderstorm';

  const baseTemp = city.temp;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIndex = new Date().getDay(); // 0 is Sun

  const hourly = Array.from({ length: 12 }, (_, i) => {
    const currentHour = (new Date().getHours() + i) % 24;
    const hourLabel = i === 0 ? 'Now' : `${currentHour % 12 || 12} ${currentHour >= 12 ? 'PM' : 'AM'}`;
    const tempOffset = Math.round(Math.sin((i / 12) * Math.PI) * 5) - Math.floor(i * 0.4);
    
    let cond = city.condition;
    if (i > 6 && city.condition === 'thunderstorm') cond = 'rain';
    if (i > 8 && city.condition === 'rain') cond = 'cloudy';

    return {
      time: hourLabel,
      hour: currentHour,
      temp: baseTemp + tempOffset,
      condition: cond,
      conditionLabel: i === 0 ? city.tagline : 'Scattered',
      pop: isRain ? Math.min(95, 40 + i * 5) : isThunder ? 85 : 10,
      isDay: currentHour >= 6 && currentHour < 19,
    };
  });

  const daily = Array.from({ length: 7 }, (_, i) => {
    const dayName = i === 0 ? 'Today' : days[(todayIndex + i - 1 + 7) % 7];
    const conditionPool: WeatherConditionType[] = [
      city.condition,
      'partly-cloudy',
      'clear',
      'rain',
      'cloudy',
      'partly-cloudy',
      'clear'
    ];
    const cond = conditionPool[i % conditionPool.length];
    const high = baseTemp + (i % 2 === 0 ? 3 : -2) + (i === 0 ? 4 : 0);
    const low = high - 14 - (i % 3);

    return {
      day: dayName,
      date: `Oct ${19 + i}`,
      condition: cond,
      conditionLabel: cond === 'clear' ? 'Sunny' : cond === 'rain' ? 'Showers' : 'Partly Cloudy',
      tempMin: low,
      tempMax: high,
      precipitationChance: cond === 'rain' || cond === 'heavy-rain' ? 70 : 15,
      uvIndex: isSnow ? 1 : 4 + (i % 3),
      windSpeed: 8 + (i % 5) * 2,
      humidity: 55 + (i * 4) % 30,
    };
  });

  return {
    cityName: city.name,
    country: city.country,
    latitude: city.lat,
    longitude: city.lon,
    currentTemp: baseTemp,
    feelsLike: baseTemp + (isRain ? -2 : 1),
    tempMin: baseTemp - 14,
    tempMax: baseTemp + 4,
    condition: city.condition,
    conditionDescription: city.tagline,
    uvIndex: isSnow ? 1 : isRain ? 2 : 5,
    uvDescription: isSnow ? 'Very low UV' : isRain ? 'Low UV index' : 'Moderate for next 3h',
    windSpeed: isThunder ? 24 : 11,
    windDirection: 215, // SW
    windGusts: isThunder ? 36 : 16,
    humidity: isRain ? 88 : 64,
    dewPoint: baseTemp - 12,
    visibility: isRain ? 6 : isSnow ? 4 : 10,
    pressure: 1014,
    airQualityIndex: 28,
    airQualityStatus: 'Excellent (Clean Liquid Air)',
    sunriseTime: '6:42 AM',
    sunsetTime: '6:58 PM',
    isDay: true,
    hourly,
    daily,
  };
}

// Fetch live weather from Open-Meteo
export async function fetchLiveWeather(lat: number, lon: number, cityName?: string, countryName?: string): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,precipitation_probability,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Open-Meteo responded with status ${res.status}`);
    }

    const data = await res.json();
    const current = data.current;
    const { condition, label } = mapWmoToCondition(current.weather_code);

    const hourlyList = (data.hourly.time as string[]).slice(0, 16).map((timeStr: string, idx: number) => {
      const date = new Date(timeStr);
      const hour = date.getHours();
      const hourLabel = idx === 0 ? 'Now' : `${hour % 12 || 12} ${hour >= 12 ? 'PM' : 'AM'}`;
      const code = data.hourly.weather_code[idx] || 0;
      const mapped = mapWmoToCondition(code);

      return {
        time: hourLabel,
        hour,
        temp: Math.round(data.hourly.temperature_2m[idx]),
        condition: mapped.condition,
        conditionLabel: mapped.label,
        pop: Math.round(data.hourly.precipitation_probability[idx] || 0),
        isDay: Boolean(data.hourly.is_day[idx]),
      };
    });

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyList = (data.daily.time as string[]).slice(0, 7).map((timeStr: string, idx: number) => {
      const date = new Date(timeStr);
      const dayName = idx === 0 ? 'Today' : dayNames[date.getDay()];
      const code = data.daily.weather_code[idx] || 0;
      const mapped = mapWmoToCondition(code);

      return {
        day: dayName,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        condition: mapped.condition,
        conditionLabel: mapped.label,
        tempMin: Math.round(data.daily.temperature_2m_min[idx]),
        tempMax: Math.round(data.daily.temperature_2m_max[idx]),
        precipitationChance: Math.round(data.daily.precipitation_probability_max[idx] || 0),
        uvIndex: Math.round(data.daily.uv_index_max[idx] || 4),
        windSpeed: Math.round(current.wind_speed_10m || 10),
        humidity: Math.round(current.relative_humidity_2m || 60),
      };
    });

    const currentTemp = Math.round(current.temperature_2m);
    const tempMax = Math.round(data.daily.temperature_2m_max[0] || currentTemp + 4);
    const tempMin = Math.round(data.daily.temperature_2m_min[0] || currentTemp - 12);
    const uv = Math.round(data.daily.uv_index_max[0] || 4);

    return {
      cityName: cityName || 'Current Location',
      country: countryName || '',
      latitude: lat,
      longitude: lon,
      currentTemp,
      feelsLike: Math.round(current.apparent_temperature),
      tempMin,
      tempMax,
      condition,
      conditionDescription: `${label} • Liquid Atmosphere`,
      uvIndex: uv,
      uvDescription: uv >= 8 ? 'Very High UV' : uv >= 6 ? 'High UV' : uv >= 3 ? 'Moderate for next 3h' : 'Low UV index',
      windSpeed: Math.round(current.wind_speed_10m),
      windDirection: current.wind_direction_10m || 180,
      windGusts: Math.round(current.wind_gusts_10m || current.wind_speed_10m * 1.3),
      humidity: Math.round(current.relative_humidity_2m),
      dewPoint: Math.round(current.temperature_2m - (100 - current.relative_humidity_2m) / 5),
      visibility: 10,
      pressure: Math.round(current.surface_pressure),
      airQualityIndex: 26,
      airQualityStatus: 'Clean & Crisp',
      sunriseTime: data.daily.sunrise[0] ? new Date(data.daily.sunrise[0]).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '6:30 AM',
      sunsetTime: data.daily.sunset[0] ? new Date(data.daily.sunset[0]).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '7:15 PM',
      isDay: Boolean(current.is_day),
      hourly: hourlyList,
      daily: dailyList,
    };
  } catch (err) {
    console.warn('Using high-fidelity fallback weather data:', err);
    const matchedPreset = POPULAR_CITIES.find(c => c.name.toLowerCase() === (cityName || '').toLowerCase()) || POPULAR_CITIES[0];
    return getMockWeatherData(matchedPreset);
  }
}

// Search cities via geocoding
export async function searchCities(query: string): Promise<Array<{ name: string; country: string; admin1?: string; lat: number; lon: number }>> {
  if (!query || query.trim().length < 2) return [];

  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results) return [];

    return data.results.map((item: any) => ({
      name: item.name,
      country: item.country || '',
      admin1: item.admin1 || '',
      lat: item.latitude,
      lon: item.longitude,
    }));
  } catch (err) {
    console.error('City search failed:', err);
    return [];
  }
}

// Reverse geocode latitude and longitude to human-readable city/region
export async function reverseGeocode(lat: number, lon: number): Promise<{ cityName: string; country: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Detected Location';
      const country = data.countryName || '';
      return { cityName: city, country };
    }
  } catch (e) {
    console.warn('Reverse geocode lookup warning, falling back:', e);
  }

  // Fallback: check closest popular city
  let closest = POPULAR_CITIES[0];
  let minDistance = Infinity;
  for (const p of POPULAR_CITIES) {
    const d = Math.hypot(p.lat - lat, p.lon - lon);
    if (d < minDistance) {
      minDistance = d;
      closest = p;
    }
  }

  if (minDistance < 1.0) {
    return { cityName: closest.name, country: closest.country };
  }

  return { cityName: 'My Location', country: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°` };
}

