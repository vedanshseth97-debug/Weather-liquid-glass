import React, { useState, useEffect } from 'react';
import {
  X,
  Radio,
  Volume2,
  Square,
  Globe,
  Navigation,
  Sparkles,
  Play,
  Pause,
  MapPin,
  ArrowRight,
  Mic,
} from 'lucide-react';
import { WeatherData, CityPreset } from '../types/weather';
import { POPULAR_CITIES, getMockWeatherData } from '../services/weatherService';
import { weatherBroadcast } from '../services/weatherBroadcastService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentWeather: WeatherData;
  onSelectCity: (city: { lat: number; lon: number; name: string; country: string }) => void;
  isDark: boolean;
}

export const AllLocationsBroadcastModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentWeather,
  onSelectCity,
  isDark,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playingCity, setPlayingCity] = useState<string | null>(null);

  // Pre-generate weather data for popular cities for broadcast
  const allLocationsData = React.useMemo(() => {
    const list: WeatherData[] = [
      currentWeather,
      ...POPULAR_CITIES.filter((c) => c.name.toLowerCase() !== currentWeather.cityName.toLowerCase()).map((c) =>
        getMockWeatherData(c)
      ),
    ];
    return list;
  }, [currentWeather]);

  useEffect(() => {
    weatherBroadcast.setListener((speaking, cityName) => {
      setIsPlaying(speaking);
      setPlayingCity(cityName || null);
    });
    return () => {
      weatherBroadcast.stop();
    };
  }, []);

  if (!isOpen) return null;

  const handlePlayGlobalRoundup = () => {
    if (isPlaying && playingCity === 'Global Round-up') {
      weatherBroadcast.stop();
    } else {
      weatherBroadcast.speakRoundup(allLocationsData);
    }
  };

  const handlePlayCityBroadcast = (w: WeatherData) => {
    if (isPlaying && playingCity === w.cityName) {
      weatherBroadcast.stop();
    } else {
      weatherBroadcast.speak(w);
    }
  };

  const modalBg = isDark
    ? 'bg-[#0b1325]/95 border-white/20 text-white'
    : 'bg-white/95 border-slate-200 text-slate-800';

  const cardBg = isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-xl max-h-[90vh] overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-2xl flex flex-col ${modalBg}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-black/5 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 p-[1.5px] shadow-md shadow-pink-500/20">
              <div className="w-full h-full rounded-[14px] bg-[#070b14] flex items-center justify-center text-white">
                <Radio className="w-5 h-5 text-pink-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Worldwide Weather Broadcast Hub</h2>
              <p className="text-xs opacity-60">Live audio meteorological dispatch for all global locations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Radio Master Player Banner */}
        <div className="p-4 bg-gradient-to-r from-pink-500/15 via-purple-500/10 to-cyan-500/15 border-b border-black/5 dark:border-white/10 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Global Meteorological Dispatch
                </span>
              </div>
              <p className="text-[11px] opacity-70 mt-0.5">
                {isPlaying
                  ? `Now Broadcasting: ${playingCity || 'Live Bulletin'}`
                  : 'Listen to a comprehensive voice overview of all world stations'}
              </p>
            </div>

            <button
              onClick={handlePlayGlobalRoundup}
              className={`flex items-center gap-2 py-2 px-4 rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0 ${
                isPlaying && playingCity === 'Global Round-up'
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white animate-pulse'
                  : 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 text-white hover:opacity-95'
              }`}
            >
              {isPlaying && playingCity === 'Global Round-up' ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop Worldwide</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Play Worldwide Round-up</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* All Locations Broadcast Roster */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 no-scrollbar">
          <span className="text-[11px] font-bold tracking-wider uppercase opacity-60 block mb-1">
            All Monitored Locations ({allLocationsData.length} Stations)
          </span>

          {allLocationsData.map((loc) => {
            const isThisPlaying = isPlaying && playingCity === loc.cityName;
            const isCurrentViewing = currentWeather.cityName.toLowerCase() === loc.cityName.toLowerCase();

            return (
              <div
                key={loc.cityName}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isCurrentViewing
                    ? 'border-cyan-400 bg-cyan-500/10 shadow-sm'
                    : isThisPlaying
                    ? 'border-pink-500 bg-pink-500/10 shadow-sm'
                    : cardBg
                }`}
              >
                {/* Left: Location & Conditions */}
                <div className="flex items-center gap-3 truncate">
                  <div className="p-2 rounded-xl bg-white/10 border border-white/10 shrink-0">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold truncate">{loc.cityName}</span>
                      {loc.country && <span className="text-[10px] opacity-60 truncate">({loc.country})</span>}
                      {isCurrentViewing && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500 text-white uppercase">
                          Viewing
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] opacity-70 block truncate">
                      {loc.conditionDescription} · Wind {loc.windSpeed} mph · Hum {loc.humidity}%
                    </span>
                  </div>
                </div>

                {/* Right: Temp & Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-base font-extrabold font-mono text-gradient-liquid">
                    {loc.currentTemp}°
                  </span>

                  {/* Play Voice Broadcast for this city */}
                  <button
                    onClick={() => handlePlayCityBroadcast(loc)}
                    title={`Broadcast weather for ${loc.cityName}`}
                    className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      isThisPlaying
                        ? 'bg-red-500 text-white border-red-400 animate-pulse'
                        : 'border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20 text-pink-500 dark:text-pink-300'
                    }`}
                  >
                    {isThisPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Mic className="w-3.5 h-3.5" />}
                    <span className="text-[10px] hidden sm:inline">{isThisPlaying ? 'Stop' : 'Voice'}</span>
                  </button>

                  {/* Switch app view to this city */}
                  {!isCurrentViewing && (
                    <button
                      onClick={() => {
                        onSelectCity({
                          lat: loc.latitude,
                          lon: loc.longitude,
                          name: loc.cityName,
                          country: loc.country,
                        });
                        onClose();
                      }}
                      title={`View full forecast for ${loc.cityName}`}
                      className="p-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-slate-500 dark:text-white/70"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between shrink-0">
          <span className="text-xs opacity-60">Aether Global Meteorologist Network</span>
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
