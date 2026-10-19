import React, { useState, useEffect } from 'react';
import { Radio, Volume2, Square, ChevronDown, ChevronUp, Sparkles, Mic, Globe } from 'lucide-react';
import { WeatherData } from '../types/weather';
import { weatherBroadcast } from '../services/weatherBroadcastService';

interface Props {
  weather: WeatherData;
  isDark: boolean;
  onOpenAllLocations?: () => void;
}

export const WeatherBroadcastBanner: React.FC<Props> = ({ weather, isDark, onOpenAllLocations }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    weatherBroadcast.setListener((speaking) => {
      setIsPlaying(speaking);
    });
    return () => {
      weatherBroadcast.stop();
    };
  }, []);

  const handleToggleBroadcast = () => {
    const nextState = weatherBroadcast.toggle(weather, () => {
      setIsPlaying(false);
    });
    setIsPlaying(nextState);
  };

  const script = weatherBroadcast.generateScript(weather);

  return (
    <div className="relative rounded-[26px] overflow-hidden transition-all duration-300 p-[1.5px] bg-gradient-to-r from-pink-500 via-cyan-400 to-amber-400 shadow-[0_12px_30px_rgba(236,72,153,0.2)]">
      <div
        className={`rounded-[25px] p-3.5 backdrop-blur-2xl transition-all ${
          isDark ? 'bg-[#0e1628]/90 text-white' : 'bg-white/90 text-slate-800'
        }`}
      >
        {/* Main Bar */}
        <div className="flex items-center justify-between gap-3">
          {/* Left: Live Indicator & Title */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="relative flex items-center justify-center">
              <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-red-500 animate-ping' : 'bg-pink-500'}`} />
              <span className={`absolute w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500' : 'bg-pink-500'}`} />
            </div>

            <div className="flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-pink-500" />
              <span className="text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                Live Broadcast
              </span>
            </div>
          </div>

          {/* Center: Audio Equalizer Waveform Bars */}
          <div className="flex items-center gap-1 h-5 px-1">
            {[40, 75, 55, 90, 60, 85, 45, 95, 65, 50].map((h, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isPlaying
                    ? 'bg-gradient-to-t from-pink-500 via-cyan-400 to-amber-300 animate-pulse'
                    : 'bg-black/20 dark:bg-white/20'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(20, (h * (0.6 + ((i * 37) % 40) / 100)))}%` : '20%',
                  animationDelay: `${i * 90}ms`,
                }}
              />
            ))}
          </div>

          {/* Right: Audio Action Trigger & All Locations */}
          <div className="flex items-center gap-1.5">
            {onOpenAllLocations && (
              <button
                onClick={onOpenAllLocations}
                title="All Locations Weather Broadcast Hub"
                className="flex items-center gap-1 py-1.5 px-2.5 rounded-full text-[10px] font-bold border border-cyan-400/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-all cursor-pointer"
              >
                <Globe className="w-3 h-3" />
                <span className="hidden sm:inline">All Locations</span>
              </button>
            )}

            <button
              onClick={handleToggleBroadcast}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer ${
                isPlaying
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white animate-pulse'
                  : 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 hover:opacity-95 text-white'
              }`}
            >
              {isPlaying ? <Square className="w-3 h-3 fill-current" /> : <Mic className="w-3 h-3" />}
              <span>{isPlaying ? 'Stop' : 'Listen'}</span>
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer text-slate-500 dark:text-white/60"
              title="Expand meteorologist bulletin"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Ticker snippet */}
        <div className="mt-2 pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-[11px] opacity-75">
          <span className="truncate pr-2">
            🎙️ <strong className="font-semibold text-cyan-400">{weather.cityName}:</strong> {weather.conditionDescription} · High {weather.tempMax}° / Low {weather.tempMin}° · Wind {weather.windSpeed} mph
          </span>
          <span className="shrink-0 font-mono text-[10px] text-pink-400 font-semibold">ON AIR</span>
        </div>

        {/* Expanded Meteorologist Studio Transcript */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/10 text-xs leading-relaxed animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-semibold text-cyan-400 text-[11px] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Meteorologist Dispatch Bulletin</span>
              </div>
              {onOpenAllLocations && (
                <button
                  onClick={onOpenAllLocations}
                  className="text-[10px] text-pink-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Globe className="w-3 h-3" />
                  <span>Switch to other locations</span>
                </button>
              )}
            </div>
            <p className="p-3 rounded-xl bg-black/5 dark:bg-black/30 border border-black/5 dark:border-white/10 italic opacity-90 leading-relaxed font-sans">
              "{script}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
