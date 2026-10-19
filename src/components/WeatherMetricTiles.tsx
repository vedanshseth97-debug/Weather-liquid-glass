import React from 'react';
import {
  Sun,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Compass,
  Sparkles,
} from 'lucide-react';
import { WeatherData } from '../types/weather';

interface Props {
  weather: WeatherData;
  isDark: boolean;
}

export const WeatherMetricTiles: React.FC<Props> = ({ weather, isDark }) => {
  const getWindDirectionLabel = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round((deg % 360) / 45) % 8;
    return directions[index];
  };

  const baseCard = (borderGradient: string, glowColor: string) => `
    relative rounded-[26px] p-[1.2px] bg-gradient-to-br ${borderGradient} shadow-lg transition-all duration-300 hover:scale-[1.02] hover:${glowColor}
  `;

  const innerCard = isDark
    ? 'w-full h-full rounded-[25px] p-4 flex flex-col justify-between bg-[#0b1325]/85 backdrop-blur-2xl text-white'
    : 'w-full h-full rounded-[25px] p-4 flex flex-col justify-between bg-white/80 backdrop-blur-2xl text-slate-800';

  return (
    <div className="grid grid-cols-2 gap-3.5 my-3">
      {/* 1. UV Index - Radiant Amber Coral */}
      <div className={baseCard('from-amber-400 via-orange-500 to-pink-500', 'shadow-amber-500/25')}>
        <div className={innerCard}>
          <div>
            <div className="text-[11px] font-bold tracking-widest text-amber-500 uppercase flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>UV Index</span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold font-mono tabular-nums bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                {weather.uvIndex}
              </span>
              <span className="text-xs opacity-50 font-mono">/ 10</span>
            </div>
          </div>
          <p className="text-xs opacity-75 mt-1 font-medium">{weather.uvDescription}</p>
        </div>
      </div>

      {/* 2. Wind & Direction - Electric Cyan Turquoise */}
      <div className={baseCard('from-cyan-400 via-sky-500 to-blue-600', 'shadow-cyan-500/25')}>
        <div className={innerCard}>
          <div>
            <div className="text-[11px] font-bold tracking-widest text-cyan-500 uppercase flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span>Wind Speed</span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold font-mono tabular-nums bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {weather.windSpeed}
              </span>
              <span className="text-xs opacity-60 font-medium">mph</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-cyan-500 font-semibold mt-1">
            <Compass
              className="w-3.5 h-3.5 transition-transform"
              style={{ transform: `rotate(${weather.windDirection}deg)` }}
            />
            <span>{getWindDirectionLabel(weather.windDirection)} · Gusts {weather.windGusts} mph</span>
          </div>
        </div>
      </div>

      {/* 3. Humidity & Dew Point - Ocean Azure Indigo */}
      <div className={baseCard('from-blue-400 via-indigo-500 to-purple-600', 'shadow-blue-500/25')}>
        <div className={innerCard}>
          <div>
            <div className="text-[11px] font-bold tracking-widest text-indigo-400 uppercase flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              <span>Humidity</span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold font-mono tabular-nums bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                {weather.humidity}%
              </span>
            </div>
          </div>
          <p className="text-xs opacity-75 mt-1 font-medium">Dew point is {weather.dewPoint}°</p>
        </div>
      </div>

      {/* 4. Visibility - Vivid Mint Emerald */}
      <div className={baseCard('from-emerald-400 via-teal-500 to-cyan-500', 'shadow-emerald-500/25')}>
        <div className={innerCard}>
          <div>
            <div className="text-[11px] font-bold tracking-widest text-emerald-500 uppercase flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Visibility</span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold font-mono tabular-nums bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                {weather.visibility}
              </span>
              <span className="text-xs opacity-60 font-medium">mi</span>
            </div>
          </div>
          <p className="text-xs opacity-75 mt-1 font-medium">Crystalline clarity</p>
        </div>
      </div>

      {/* 5. Air Quality Index - Fluorescent Lime Cyan */}
      <div className={baseCard('from-lime-400 via-emerald-500 to-teal-500', 'shadow-lime-500/25')}>
        <div className={innerCard}>
          <div>
            <div className="text-[11px] font-bold tracking-widest text-lime-500 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              <span>Air Quality</span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono tabular-nums bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent">
                {weather.airQualityIndex}
              </span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-lime-500/20 text-lime-500">AQI</span>
            </div>
          </div>
          <p className="text-xs opacity-75 mt-1 font-medium">{weather.airQualityStatus}</p>
        </div>
      </div>

      {/* 6. Pressure - Neon Amethyst Violet */}
      <div className={baseCard('from-purple-400 via-fuchsia-500 to-pink-500', 'shadow-purple-500/25')}>
        <div className={innerCard}>
          <div>
            <div className="text-[11px] font-bold tracking-widest text-purple-400 uppercase flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>Pressure</span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold font-mono tabular-nums bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {weather.pressure}
              </span>
              <span className="text-xs opacity-50 font-mono">hPa</span>
            </div>
          </div>
          <p className="text-xs opacity-75 mt-1 font-medium">Balanced atmospheric bar</p>
        </div>
      </div>

      {/* 7. Sunrise / Sunset Solar Arc - Rainbow Golden Twilight */}
      <div className={`col-span-2 ${baseCard('from-amber-400 via-pink-500 to-indigo-500', 'shadow-pink-500/20')}`}>
        <div className={innerCard}>
          <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10">
            <div className="text-[11px] font-bold tracking-widest text-amber-500 uppercase flex items-center gap-1.5">
              <Sunrise className="w-3.5 h-3.5 text-amber-400" />
              <span>Solar Trajectory & Twilight</span>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500">
              Solar Arc
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white shadow-md shadow-amber-500/30">
                <Sunrise className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] opacity-60 block font-medium">
                  Sunrise
                </span>
                <span className="text-sm font-bold font-mono">
                  {weather.sunriseTime}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 text-white shadow-md shadow-indigo-500/30">
                <Sunset className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] opacity-60 block font-medium">
                  Sunset
                </span>
                <span className="text-sm font-bold font-mono">
                  {weather.sunsetTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
