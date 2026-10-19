import React, { useState } from 'react';
import { Clock, Droplets, Wind, Sparkles } from 'lucide-react';
import { HourlyForecastData, WeatherConditionType } from '../types/weather';

interface Props {
  hourly: HourlyForecastData[];
}

function getConditionEmoji(condition: WeatherConditionType, isDay: boolean): string {
  switch (condition) {
    case 'clear':
      return isDay ? '☀️' : '🌙';
    case 'partly-cloudy':
      return isDay ? '⛅' : '☁️';
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

export const HourlyForecastStrip: React.FC<Props> = ({ hourly }) => {
  const [selectedHourIndex, setSelectedHourIndex] = useState<number>(0);

  const temps = hourly.map((h) => h.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const range = Math.max(1, maxTemp - minTemp);

  // SVG Spline coordinates
  const cardWidth = 76;
  const svgWidth = hourly.length * cardWidth;
  const svgHeight = 44;

  const points = hourly.map((h, i) => {
    const x = i * cardWidth + cardWidth / 2;
    // Map temp so max is near top (y=8) and min is near bottom (y=36)
    const normalized = (h.temp - minTemp) / range;
    const y = svgHeight - (normalized * (svgHeight - 16) + 8);
    return { x, y };
  });

  // Construct smooth SVG path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const mx = (p0.x + p1.x) / 2;
    pathD += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  const fillD = `${pathD} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`;

  const selectedHour = hourly[selectedHourIndex] || hourly[0];

  return (
    <div className="liquid-glass-card rounded-[26px] p-4 relative overflow-hidden">
      {/* Header with active selection info */}
      <div className="flex items-center justify-between pb-3 px-1 border-b border-black/5 dark:border-white/10 mb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-bold tracking-widest uppercase opacity-75">
            Hourly Forecast
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-mono">
          <Sparkles className="w-3 h-3" />
          <span>{selectedHour.time}: {selectedHour.temp}° ({selectedHour.conditionLabel})</span>
        </div>
      </div>

      {/* Interactive Temperature Wave Strip */}
      <div className="relative overflow-x-auto no-scrollbar py-2">
        {/* SVG Temperature Curve */}
        <div style={{ width: `${svgWidth}px` }} className="relative mb-2 pointer-events-none select-none">
          <svg
            width={svgWidth}
            height={svgHeight}
            className="overflow-visible"
          >
            <defs>
              <linearGradient id="tempWaveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="tempLineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="50%" stopColor="#818CF8" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>

            {/* Gradient Area Fill under spline */}
            <path d={fillD} fill="url(#tempWaveGrad)" />

            {/* Spline Stroke */}
            <path
              d={pathD}
              fill="none"
              stroke="url(#tempLineGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Temperature points */}
            {points.map((p, idx) => (
              <g key={`pt-${idx}`}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={selectedHourIndex === idx ? 4.5 : 3}
                  className={selectedHourIndex === idx ? 'fill-cyan-300 stroke-white' : 'fill-white/80'}
                  strokeWidth="1.5"
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Hour Cards Carousel */}
        <div className="flex items-center gap-2 px-0.5" style={{ width: `${svgWidth}px` }}>
          {hourly.map((item, idx) => {
            const isSelected = selectedHourIndex === idx;
            return (
              <button
                key={`${item.time}-${idx}`}
                onClick={() => setSelectedHourIndex(idx)}
                className={`flex flex-col items-center justify-between rounded-2xl py-3 px-2 transition-all duration-200 select-none cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 border border-cyan-400/60 shadow-[0_8px_20px_rgba(0,229,255,0.2)] scale-[1.03]'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10 dark:border-white/5'
                }`}
                style={{ width: `${cardWidth - 8}px` }}
              >
                <span className={`text-[11px] ${isSelected ? 'font-bold text-cyan-400' : 'opacity-70'}`}>
                  {item.time}
                </span>

                <div className="my-1.5 relative flex items-center justify-center">
                  <span className="text-2xl filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                    {getConditionEmoji(item.condition, item.isDay)}
                  </span>
                </div>

                {/* Rain probability */}
                {item.pop > 15 ? (
                  <div className="flex items-center gap-0.5 text-[10px] text-cyan-400 font-mono mb-1">
                    <Droplets className="w-2.5 h-2.5" />
                    <span>{item.pop}%</span>
                  </div>
                ) : (
                  <div className="h-4" />
                )}

                <span className="text-sm font-semibold font-mono tabular-nums">
                  {item.temp}°
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
