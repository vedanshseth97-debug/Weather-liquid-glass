import React, { useState } from 'react';
import {
  X,
  LayoutGrid,
  Clock,
  Sparkles,
  Navigation,
  Radio,
  Sliders,
  Copy,
  Check,
  Smartphone,
  Eye,
  ArrowUp,
  ArrowDown,
  Droplets,
  Wind,
  Compass,
} from 'lucide-react';
import { WeatherData, AndroidWidgetType, WidgetConfig } from '../types/weather';
import { Glass3DWeatherEmblem } from './Glass3DWeatherEmblem';
import { Interactive3DCard } from './Interactive3DCard';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  weather: WeatherData;
  isDark: boolean;
  onSelectAction: (action: string) => void;
}

export const AndroidWidgetsStudio: React.FC<Props> = ({
  isOpen,
  onClose,
  weather,
  isDark,
  onSelectAction,
}) => {
  const [activeWidget, setActiveWidget] = useState<AndroidWidgetType>('horizontal-4x2');
  const [widgetTint, setWidgetTint] = useState<'rainbow' | 'cyan' | 'amber' | 'emerald'>('rainbow');
  const [copiedGlanceCode, setCopiedGlanceCode] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'preview' | 'homescreen' | 'code'>('preview');

  if (!isOpen) return null;

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });

  const getBorderGradient = () => {
    switch (widgetTint) {
      case 'cyan':
        return 'from-cyan-400 via-sky-500 to-blue-600';
      case 'amber':
        return 'from-amber-400 via-orange-500 to-pink-500';
      case 'emerald':
        return 'from-emerald-400 via-teal-500 to-cyan-500';
      case 'rainbow':
      default:
        return 'from-cyan-400 via-pink-500 to-amber-400';
    }
  };

  const glanceCodeSnippet = `// Android Jetpack Glance AppWidget Implementation
package com.example.liquidweather.glance

import android.content.Context
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.*
import androidx.glance.action.clickable
import androidx.glance.appwidget.*
import androidx.glance.layout.*
import androidx.glance.text.*

class LiquidWeatherGlanceWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            Box(
                modifier = GlanceModifier
                    .fillMaxSize()
                    .cornerRadius(28.dp)
                    .background(ImageProvider(R.drawable.liquid_glass_background))
                    .padding(16.dp)
                    .clickable(actionStartActivity<MainActivity>())
            ) {
                Row(
                    modifier = GlanceModifier.fillMaxSize(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = GlanceModifier.defaultWeight()) {
                        Text(
                            text = "${weather.cityName}",
                            style = TextStyle(fontSize = 16.sp, fontWeight = FontWeight.Bold, color = ColorProvider(R.color.white))
                        )
                        Text(
                            text = "${weather.currentTemp}°",
                            style = TextStyle(fontSize = 44.sp, fontWeight = FontWeight.Bold, color = ColorProvider(R.color.cyan_300))
                        )
                        Text(
                            text = "H:${weather.tempMax}° L:${weather.tempMin}°",
                            style = TextStyle(fontSize = 12.sp, color = ColorProvider(R.color.white_70))
                        )
                    }
                    Image(
                        provider = ImageProvider(R.drawable.ic_3d_glass_weather),
                        contentDescription = "Weather",
                        modifier = GlanceModifier.size(72.dp)
                    )
                }
            }
        }
    }
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(glanceCodeSnippet);
    setCopiedGlanceCode(true);
    setTimeout(() => setCopiedGlanceCode(false), 2000);
  };

  const modalBg = isDark
    ? 'bg-[#0b1325]/95 border-white/20 text-white'
    : 'bg-white/95 border-slate-200 text-slate-800';

  const cardBg = isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-2xl max-h-[92vh] overflow-y-auto no-scrollbar rounded-3xl border p-6 shadow-2xl backdrop-blur-2xl transition-all ${modalBg}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-400 via-pink-500 to-amber-400 text-white shadow-md shadow-pink-500/20">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Android Liquid Glass Widgets</h2>
              <p className="text-xs opacity-60">Cool 3D interactive home screen widgets for Android</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode Switcher: Preview | Simulated Home Screen | Glance Code */}
        <div className="flex items-center p-1 rounded-2xl bg-black/5 dark:bg-black/30 border border-black/5 dark:border-white/10 mb-4">
          <button
            onClick={() => setViewMode('preview')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'preview'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            3D Widget Studio
          </button>

          <button
            onClick={() => setViewMode('homescreen')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'homescreen'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Android Home Screen
          </button>

          <button
            onClick={() => setViewMode('code')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'code'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Jetpack Glance Code
          </button>
        </div>

        {/* View 1: 3D Widget Studio */}
        {viewMode === 'preview' && (
          <div>
            {/* Widget Size Selector Pills */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { id: 'compact-2x2', label: '2×2 Orb', tag: 'Compact' },
                { id: 'horizontal-4x2', label: '4×2 Bar', tag: 'Flagship' },
                { id: 'clock-4x3', label: '4×3 Clock', tag: 'Panoramic' },
                { id: 'dial-3x3', label: '3×3 Dial', tag: 'Circular' },
              ].map((w) => (
                <button
                  key={w.id}
                  onClick={() => setActiveWidget(w.id as any)}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    activeWidget === w.id
                      ? 'border-cyan-400 bg-cyan-500/20 text-cyan-400 shadow-sm font-bold'
                      : 'border-transparent bg-black/5 dark:bg-white/5 opacity-70 hover:opacity-100'
                  }`}
                >
                  <span className="text-xs block font-bold">{w.label}</span>
                  <span className="text-[10px] opacity-60 block mt-0.5">{w.tag}</span>
                </button>
              ))}
            </div>

            {/* Tint Color Selector */}
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-xs font-medium opacity-70">Prismatic Glass Tint:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'rainbow', label: 'Rainbow', color: 'from-pink-500 via-cyan-400 to-amber-400' },
                  { id: 'cyan', label: 'Cyan', color: 'from-cyan-400 to-blue-500' },
                  { id: 'amber', label: 'Amber', color: 'from-amber-400 to-orange-500' },
                  { id: 'emerald', label: 'Emerald', color: 'from-emerald-400 to-teal-500' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setWidgetTint(t.id as any)}
                    className={`w-6 h-6 rounded-full bg-gradient-to-tr ${t.color} p-[2px] transition-transform cursor-pointer ${
                      widgetTint === t.id ? 'scale-125 ring-2 ring-cyan-400' : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Interactive 3D Widget Display */}
            <div className="p-6 rounded-3xl bg-black/40 border border-white/10 flex items-center justify-center min-h-[260px] relative overflow-hidden mb-4">
              {/* Background ambient lighting */}
              <div className="absolute inset-0 bg-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

              {/* 1. 2x2 Compact Orb Widget */}
              {activeWidget === 'compact-2x2' && (
                <Interactive3DCard maxTilt={16} intensity={1.2} className="w-[180px] h-[180px]">
                  <div className={`w-full h-full rounded-[30px] p-[1.5px] bg-gradient-to-tr ${getBorderGradient()} shadow-2xl`}>
                    <div className="w-full h-full rounded-[28.5px] p-4 flex flex-col justify-between liquid-glass-surface relative overflow-hidden backdrop-blur-3xl text-white">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate max-w-[80px]">{weather.cityName}</span>
                        <Glass3DWeatherEmblem condition={weather.condition} size={42} isDay={weather.isDay} />
                      </div>
                      <div>
                        <div className="text-4xl font-extrabold text-gradient-liquid font-mono tabular-nums leading-none mb-1">
                          {weather.currentTemp}°
                        </div>
                        <span className="text-[10px] text-white/70 font-medium">{weather.conditionDescription}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-white/60 font-mono">
                        <span>H:{weather.tempMax}°</span>
                        <span>L:{weather.tempMin}°</span>
                      </div>
                    </div>
                  </div>
                </Interactive3DCard>
              )}

              {/* 2. 4x2 Horizontal Flagship Bar Widget */}
              {activeWidget === 'horizontal-4x2' && (
                <Interactive3DCard maxTilt={14} intensity={1} className="w-full max-w-[390px] h-[160px]">
                  <div className={`w-full h-full rounded-[32px] p-[1.5px] bg-gradient-to-r ${getBorderGradient()} shadow-2xl`}>
                    <div className="w-full h-full rounded-[30.5px] p-4 flex items-center justify-between liquid-glass-surface relative overflow-hidden backdrop-blur-3xl text-white">
                      {/* Left: Weather readout */}
                      <div className="flex flex-col justify-between h-full pr-3">
                        <div className="flex items-center gap-1.5">
                          <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-sm font-bold">{weather.cityName}</span>
                        </div>
                        <div className="my-1">
                          <span className="text-5xl font-black text-gradient-liquid font-mono tabular-nums leading-none">
                            {weather.currentTemp}°
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-white/70">
                          <span className="text-emerald-300 font-bold">H: {weather.tempMax}°</span>
                          <span>·</span>
                          <span className="text-sky-300 font-bold">L: {weather.tempMin}°</span>
                        </div>
                      </div>

                      {/* Right: 3D Emblem & Next 3 Hours Mini Strip */}
                      <div className="flex flex-col items-center justify-between h-full pl-3 border-l border-white/10">
                        <Glass3DWeatherEmblem condition={weather.condition} size={58} isDay={weather.isDay} />
                        <div className="flex items-center gap-2 mt-1">
                          {weather.hourly.slice(1, 4).map((h, idx) => (
                            <div key={idx} className="flex flex-col items-center text-[10px]">
                              <span className="text-white/60 text-[9px]">{h.time}</span>
                              <span className="font-bold font-mono">{h.temp}°</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Interactive3DCard>
              )}

              {/* 3. 4x3 Panoramic Clock & Weather Flagship */}
              {activeWidget === 'clock-4x3' && (
                <Interactive3DCard maxTilt={12} intensity={1} className="w-full max-w-[390px] h-[210px]">
                  <div className={`w-full h-full rounded-[34px] p-[1.5px] bg-gradient-to-tr ${getBorderGradient()} shadow-2xl`}>
                    <div className="w-full h-full rounded-[32.5px] p-5 flex flex-col justify-between liquid-glass-surface relative overflow-hidden backdrop-blur-3xl text-white">
                      {/* Top Bar: Time & Location */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-extrabold font-mono tracking-tight text-white drop-shadow-md">
                            {currentTime}
                          </span>
                          <span className="text-xs font-semibold text-cyan-400">{weather.cityName}</span>
                        </div>
                        <Glass3DWeatherEmblem condition={weather.condition} size={48} isDay={weather.isDay} />
                      </div>

                      {/* Middle: Temperature & Conditions */}
                      <div className="flex items-center justify-between my-1">
                        <div>
                          <div className="text-3xl font-extrabold text-gradient-liquid font-mono">
                            {weather.currentTemp}°
                          </div>
                          <span className="text-xs text-white/80">{weather.conditionDescription}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs">
                          <Wind className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{weather.windSpeed} mph</span>
                        </div>
                      </div>

                      {/* Bottom: UV & Rain indicators */}
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-2 border-t border-white/10">
                        <div>
                          <span className="opacity-50 block">UV Index</span>
                          <span className="font-bold text-amber-300">{weather.uvIndex} Mod</span>
                        </div>
                        <div>
                          <span className="opacity-50 block">Humidity</span>
                          <span className="font-bold text-sky-300">{weather.humidity}%</span>
                        </div>
                        <div>
                          <span className="opacity-50 block">Air Quality</span>
                          <span className="font-bold text-emerald-300">{weather.airQualityIndex} AQI</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Interactive3DCard>
              )}

              {/* 4. 3x3 Chrono Dial Widget */}
              {activeWidget === 'dial-3x3' && (
                <Interactive3DCard maxTilt={15} intensity={1} className="w-[220px] h-[220px]">
                  <div className={`w-full h-full rounded-full p-[2px] bg-gradient-to-tr ${getBorderGradient()} shadow-2xl`}>
                    <div className="w-full h-full rounded-full p-4 flex flex-col items-center justify-center liquid-glass-surface relative overflow-hidden backdrop-blur-3xl text-white text-center">
                      <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">{weather.cityName}</span>
                      <div className="my-1">
                        <Glass3DWeatherEmblem condition={weather.condition} size={54} isDay={weather.isDay} />
                      </div>
                      <span className="text-3xl font-black text-gradient-liquid font-mono leading-none">
                        {weather.currentTemp}°
                      </span>
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-white/70 font-mono">
                        <span>H:{weather.tempMax}°</span>
                        <span>·</span>
                        <span>L:{weather.tempMin}°</span>
                      </div>
                    </div>
                  </div>
                </Interactive3DCard>
              )}
            </div>

            <p className="text-center text-xs opacity-60">
              ✨ <strong>Interactive 3D Glass Physics:</strong> Drag or hover to tilt with dynamic light reflections.
            </p>
          </div>
        )}

        {/* View 2: Simulated Android Home Screen */}
        {viewMode === 'homescreen' && (
          <div className="p-4 rounded-3xl bg-gradient-to-b from-indigo-950/80 via-slate-900 to-black border border-white/15 relative overflow-hidden mb-4">
            {/* Android Home Screen Header */}
            <div className="flex items-center justify-between text-xs text-white/80 mb-4 px-2">
              <span className="font-mono font-bold">{currentTime}</span>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span>5G</span>
                <span>98%</span>
              </div>
            </div>

            {/* Pinned 3D Liquid Glass Widget on Home Screen */}
            <div className="my-3">
              <div className={`w-full rounded-[28px] p-[1.5px] bg-gradient-to-r ${getBorderGradient()} shadow-xl`}>
                <div className="w-full rounded-[26.5px] p-4 flex items-center justify-between liquid-glass-surface text-white">
                  <div>
                    <span className="text-xs font-semibold text-cyan-300 block">{weather.cityName}</span>
                    <span className="text-3xl font-extrabold font-mono text-gradient-liquid">{weather.currentTemp}°</span>
                    <span className="text-[10px] opacity-70 block">{weather.conditionDescription}</span>
                  </div>
                  <Glass3DWeatherEmblem condition={weather.condition} size={54} isDay={weather.isDay} />
                </div>
              </div>
            </div>

            {/* Simulated Android App Icons Dock */}
            <div className="pt-6 pb-2 grid grid-cols-4 gap-4 text-center">
              {[
                { name: 'Phone', bg: 'bg-emerald-500' },
                { name: 'Messages', bg: 'bg-blue-500' },
                { name: 'Aether', bg: 'bg-gradient-to-tr from-cyan-400 to-pink-500', isApp: true },
                { name: 'Camera', bg: 'bg-rose-500' },
              ].map((icon, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-2xl ${icon.bg} flex items-center justify-center text-white shadow-md text-xs font-bold mb-1 ${icon.isApp ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-black' : ''}`}>
                    {icon.isApp ? <Sparkles className="w-6 h-6 text-white" /> : icon.name[0]}
                  </div>
                  <span className="text-[10px] text-white/80">{icon.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View 3: Jetpack Glance Code */}
        {viewMode === 'code' && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold tracking-wider uppercase opacity-75">
                Native Jetpack Glance AppWidget (Kotlin)
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 py-1 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                {copiedGlanceCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedGlanceCode ? 'Copied!' : 'Copy Glance Code'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-cyan-200 overflow-x-auto leading-relaxed max-h-[300px]">
              {glanceCodeSnippet}
            </pre>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
          <span className="text-xs opacity-60">Optimized for Android 14/15 Material You & Glance</span>
          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:opacity-95 text-white font-bold text-xs transition-opacity cursor-pointer shadow-md shadow-cyan-500/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
