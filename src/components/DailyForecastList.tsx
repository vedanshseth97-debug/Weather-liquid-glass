import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Droplets, Wind, Sun, Compass } from 'lucide-react';
import { DailyForecastData, WeatherConditionType } from '../types/weather';

interface Props {
  daily: DailyForecastData[];
}

function getDailyEmoji(condition: WeatherConditionType): string {
  switch (condition) {
    case 'clear':
      return '☀️';
    case 'partly-cloudy':
      return '⛅';
    case 'cloudy':
      return '☁️';
    case 'rain':
      return '🌧️';
    case 'heavy-rain':
      return '⛈️';
    case 'thunderstorm':
      return '⚡';
    case 'snow':
      return '❄️';
    case 'fog':
      return '🌫️';
    default:
      return '☀️';
  }
}

export const DailyForecastList: React.FC<Props> = ({ daily }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Calculate weekly global min and max for the relative gradient bar
  const weekMin = Math.min(...daily.map((d) => d.tempMin));
  const weekMax = Math.max(...daily.map((d) => d.tempMax));
  const tempRange = Math.max(1, weekMax - weekMin);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="liquid-glass-card rounded-[26px] p-4 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 px-1 border-b border-white/10 mb-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-bold tracking-widest text-white/70 uppercase">
            7-Day Forecast
          </span>
        </div>
        <span className="text-[11px] text-white/40">Liquid Extended</span>
      </div>

      {/* Days List */}
      <div className="divide-y divide-white/5">
        {daily.map((item, idx) => {
          const isToday = idx === 0;
          const isExpanded = expandedIndex === idx;

          // Bar calculations
          const leftPercent = Math.max(0, ((item.tempMin - weekMin) / tempRange) * 100);
          const widthPercent = Math.max(12, ((item.tempMax - item.tempMin) / tempRange) * 100);

          return (
            <div key={`${item.day}-${idx}`} className="py-2.5 px-1">
              <button
                onClick={() => toggleExpand(idx)}
                className="w-full flex items-center justify-between group cursor-pointer text-left focus:outline-none"
              >
                {/* Day and icon */}
                <div className="w-24 shrink-0 flex items-center gap-2">
                  <span className={`text-sm ${isToday ? 'font-bold text-cyan-300' : 'font-medium text-white/90'}`}>
                    {item.day}
                  </span>
                </div>

                {/* Weather emoji & rain chance */}
                <div className="flex items-center gap-1.5 w-16 justify-center">
                  <span className="text-xl">{getDailyEmoji(item.condition)}</span>
                  {item.precipitationChance > 25 && (
                    <span className="text-[10px] text-cyan-400 font-mono">
                      {item.precipitationChance}%
                    </span>
                  )}
                </div>

                {/* Min temp */}
                <span className="w-8 text-right text-xs text-white/50 font-mono tabular-nums">
                  {item.tempMin}°
                </span>

                {/* Liquid Temperature Range Bar */}
                <div className="flex-1 mx-3 h-1.5 bg-white/10 rounded-full relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                      background: 'linear-gradient(90deg, #38BDF8, #818CF8, #F59E0B)',
                      boxShadow: '0 0 8px rgba(56, 189, 248, 0.4)',
                    }}
                  />
                </div>

                {/* Max temp */}
                <span className="w-8 text-left text-xs font-semibold text-white font-mono tabular-nums">
                  {item.tempMax}°
                </span>

                {/* Expand Indicator */}
                <div className="ml-1 text-white/40 group-hover:text-white/80 transition-colors">
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </div>
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className="mt-2.5 pt-2.5 border-t border-white/5 grid grid-cols-3 gap-2 px-2 text-xs">
                  <div className="flex items-center gap-1.5 text-white/70">
                    <Droplets className="w-3 h-3 text-cyan-400" />
                    <span>Hum: {item.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/70">
                    <Wind className="w-3 h-3 text-sky-400" />
                    <span>Wind: {item.windSpeed} mph</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/70">
                    <Sun className="w-3 h-3 text-amber-400" />
                    <span>UV: {item.uvIndex}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
