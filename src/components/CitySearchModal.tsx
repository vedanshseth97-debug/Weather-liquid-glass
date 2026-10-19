import React, { useState } from 'react';
import { Search, X, MapPin, Navigation, Compass, Check } from 'lucide-react';
import { POPULAR_CITIES, searchCities } from '../services/weatherService';
import { CityPreset } from '../types/weather';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectCity: (city: { name: string; country: string; lat: number; lon: number }) => void;
  onUseCurrentLocation: () => void;
  selectedCityName: string;
  isDark: boolean;
  isLocating?: boolean;
}

export const CitySearchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectCity,
  onUseCurrentLocation,
  selectedCityName,
  isDark,
  isLocating = false,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ name: string; country: string; admin1?: string; lat: number; lon: number }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.trim().length < 2) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    const searchRes = await searchCities(val);
    setResults(searchRes);
    setIsSearching(false);
  };

  const handleSelect = (city: { name: string; country: string; lat: number; lon: number }) => {
    onSelectCity(city);
    onClose();
  };

  const modalBg = isDark
    ? 'bg-[#0b1325]/90 border-white/20 text-white'
    : 'bg-white/90 border-slate-200 text-slate-800';

  const inputBg = isDark
    ? 'bg-white/10 border-white/15 text-white placeholder-white/40 focus:border-cyan-400'
    : 'bg-slate-100/90 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-cyan-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-lg rounded-3xl border p-6 shadow-2xl backdrop-blur-2xl transition-all ${modalBg}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold tracking-tight">Select Location</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative my-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 dark:text-white/40 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search city, state or country..."
            className={`w-full pl-10 pr-10 py-3 rounded-2xl border text-sm outline-none transition-all ${inputBg}`}
            autoFocus
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Use Current GPS Location Button */}
        <button
          onClick={() => {
            onUseCurrentLocation();
            onClose();
          }}
          disabled={isLocating}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-500 dark:text-cyan-300 font-medium text-xs transition-colors mb-4 border border-cyan-500/30 cursor-pointer"
        >
          <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Locating Your Position...' : 'Use Current Device Location'}</span>
        </button>

        {/* Dynamic Search Results */}
        {results.length > 0 && (
          <div className="mb-4">
            <span className="text-[11px] font-bold tracking-wider uppercase opacity-50 block mb-2">
              Search Results
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
              {results.map((res, i) => (
                <button
                  key={`${res.name}-${res.lat}-${i}`}
                  onClick={() => handleSelect(res)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-cyan-500/10 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium">{res.name}</span>
                    {res.admin1 && <span className="text-xs opacity-60">· {res.admin1}</span>}
                    <span className="text-xs opacity-40">({res.country})</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {isSearching && (
          <div className="text-center py-4 text-xs opacity-60 animate-pulse">
            Searching global meteorological stations...
          </div>
        )}

        {/* Popular Cities Grid */}
        <div>
          <span className="text-[11px] font-bold tracking-wider uppercase opacity-50 block mb-2.5">
            Curated Global Hubs
          </span>
          <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto no-scrollbar">
            {POPULAR_CITIES.map((city: CityPreset) => {
              const isSelected = selectedCityName.toLowerCase() === city.name.toLowerCase();
              return (
                <button
                  key={city.id}
                  onClick={() => handleSelect(city)}
                  className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-500/15 text-cyan-500 dark:text-cyan-300 shadow-sm'
                      : isDark
                      ? 'border-white/10 bg-white/5 hover:bg-white/10'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="truncate pr-1">
                    <span className="text-xs font-semibold block truncate">{city.name}</span>
                    <span className="text-[10px] opacity-60 block truncate">{city.country}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs font-mono font-bold">{city.temp}°</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
