import React from 'react';
import { MapPin, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import { WeatherData } from '../types/weather';
import { Glass3DWeatherEmblem } from './Glass3DWeatherEmblem';
import { Interactive3DCard } from './Interactive3DCard';

interface Props {
  weather: WeatherData;
  onOpenSearch: () => void;
  isCurrentLocation?: boolean;
  onDetectLocation?: () => void;
  tiltEnabled?: boolean;
}

export const LiquidHeroWeatherCard: React.FC<Props> = ({
  weather,
  onOpenSearch,
  isCurrentLocation = false,
  onDetectLocation,
  tiltEnabled = true,
}) => {
  // Vibrant colorful glow halo based on weather
  const getGlowGradient = () => {
    switch (weather.condition) {
      case 'thunderstorm':
        return 'from-violet-600/35 via-fuchsia-600/30 to-cyan-500/25';
      case 'rain':
      case 'heavy-rain':
        return 'from-cyan-500/35 via-blue-600/30 to-teal-400/25';
      case 'snow':
        return 'from-sky-400/35 via-indigo-400/25 to-pink-300/20';
      case 'clear':
      default:
        return 'from-amber-400/35 via-pink-500/30 to-cyan-400/25';
    }
  };

  return (
    <Interactive3DCard maxTilt={tiltEnabled ? 15 : 0} intensity={1} className="w-full">
      <div className="relative rounded-[32px] p-[1.5px] bg-gradient-to-tr from-cyan-400 via-pink-500 to-amber-400 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
        <div className="liquid-glass-surface rounded-[31px] p-6 text-center flex flex-col items-center relative overflow-hidden backdrop-blur-3xl">
          {/* Vibrant Dynamic Subsurface Color Halo */}
          <div
            className={`absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none bg-gradient-to-b ${getGlowGradient()} animate-pulse duration-1000`}
          />

          {/* Location Header - Clickable for Search */}
          <div className="flex flex-col items-center relative z-10">
            <button
              onClick={onOpenSearch}
              className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full hover:bg-white/10 active:bg-white/15 transition-all cursor-pointer"
            >
              <div className="p-1 rounded-full bg-cyan-400/20 text-cyan-300 group-hover:scale-110 transition-transform">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 drop-shadow-sm">
                {weather.cityName}
              </span>
              {weather.country && (
                <span className="text-xs text-white/60 font-medium">
                  {weather.country}
                </span>
              )}
            </button>

            {/* GPS Detected Badge or Manual Search Prompt */}
            {isCurrentLocation ? (
              <div className="flex items-center gap-1.5 text-[10px] text-cyan-300 font-semibold bg-cyan-500/20 border border-cyan-400/40 px-2.5 py-0.5 rounded-full mt-1 shadow-sm shadow-cyan-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>Current GPS Location</span>
              </div>
            ) : (
              <button
                onClick={onDetectLocation}
                className="flex items-center gap-1 text-[10px] text-cyan-300/80 hover:text-cyan-200 transition-colors mt-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Tap to switch to current GPS location</span>
              </button>
            )}
          </div>

          {/* Condition Subtitle */}
          <p className="text-xs text-white/80 font-medium mt-1.5 tracking-wide relative z-10">
            {weather.conditionDescription}
          </p>

          {/* 3D Liquid Glass Weather Artwork Emblem */}
          <div className="my-2 cursor-grab active:cursor-grabbing relative z-10 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)]">
            <Glass3DWeatherEmblem
              condition={weather.condition}
              size={165}
              isDay={weather.isDay}
            />
          </div>

          {/* Giant Vivid Colorful Temperature Display */}
          <div className="relative flex items-start justify-center z-10">
            <span className="text-7xl md:text-8xl font-black tracking-tighter text-gradient-liquid font-mono tabular-nums drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]">
              {weather.currentTemp}
            </span>
            <span className="text-4xl font-bold text-amber-300 mt-2 ml-1 drop-shadow-md">°</span>
          </div>

          {/* High / Low & Feels Like Colorful Glass Strip */}
          <div className="mt-3 flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs text-white/90 backdrop-blur-xl shadow-lg relative z-10">
            <div className="flex items-center gap-1 text-emerald-300 font-mono font-bold">
              <ArrowUp className="w-3 h-3 text-emerald-400" />
              <span>H: {weather.tempMax}°</span>
            </div>
            <span className="text-white/30">·</span>
            <div className="flex items-center gap-1 text-sky-300 font-mono font-bold">
              <ArrowDown className="w-3 h-3 text-sky-400" />
              <span>L: {weather.tempMin}°</span>
            </div>
            <span className="text-white/30">·</span>
            <span className="text-amber-200 font-medium">Feels like {weather.feelsLike}°</span>
          </div>
        </div>
      </div>
    </Interactive3DCard>
  );
};
