import React from 'react';
import { X, Sliders, Sun, Moon, Sparkles, Eye, Wind, RefreshCw, Clock } from 'lucide-react';
import { GlassSettings, WeatherConditionType } from '../types/weather';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: GlassSettings;
  onUpdateSettings: (newSettings: Partial<GlassSettings>) => void;
  themeMode: ThemeMode;
  onChangeThemeMode: (mode: ThemeMode) => void;
  autoModeType: 'system' | 'solar';
  onChangeAutoModeType: (type: 'system' | 'solar') => void;
  currentCondition: WeatherConditionType;
  onSimulateCondition: (cond: WeatherConditionType) => void;
  isDark: boolean;
  onResetDefaults: () => void;
}

export const LiquidGlassControlsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  themeMode,
  onChangeThemeMode,
  autoModeType,
  onChangeAutoModeType,
  currentCondition,
  onSimulateCondition,
  isDark,
  onResetDefaults,
}) => {
  if (!isOpen) return null;

  const modalBg = isDark
    ? 'bg-[#0b1325]/95 border-white/20 text-white'
    : 'bg-white/95 border-slate-200 text-slate-800';

  const sectionBg = isDark
    ? 'bg-white/5 border-white/10'
    : 'bg-slate-50 border-slate-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar rounded-3xl border p-6 shadow-2xl backdrop-blur-2xl transition-all ${modalBg}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-lg font-bold tracking-tight">Liquid Glass Studio</h2>
              <p className="text-xs opacity-60">Physics, Shaders & Auto Theme Config</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Theme Mode Switcher with Auto Dark Mode */}
        <div className={`p-4 rounded-2xl border mb-4 ${sectionBg}`}>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold tracking-wider uppercase opacity-70 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Theme Appearance</span>
            </span>
            <span className="text-[11px] font-mono text-cyan-500 font-semibold">
              Currently: {isDark ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>

          {/* 3-Way Segmented Control: Light | Dark | Auto */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-black/5 dark:bg-black/30 border border-black/5 dark:border-white/10">
            <button
              onClick={() => onChangeThemeMode('light')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                themeMode === 'light'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-white/60 dark:hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </button>

            <button
              onClick={() => onChangeThemeMode('dark')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                themeMode === 'dark'
                  ? 'bg-slate-900 text-white shadow-sm font-semibold border border-white/20'
                  : 'text-slate-500 hover:text-slate-800 dark:text-white/60 dark:hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dark</span>
            </button>

            <button
              onClick={() => onChangeThemeMode('auto')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                themeMode === 'auto'
                  ? 'bg-cyan-500 text-white shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-white/60 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto</span>
            </button>
          </div>

          {/* Auto Mode Sub-options if Auto is selected */}
          {themeMode === 'auto' && (
            <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/10">
              <span className="text-[11px] font-semibold text-cyan-500 block mb-2">
                Auto Dark Mode Triggers:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onChangeAutoModeType('solar')}
                  className={`flex flex-col p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    autoModeType === 'solar'
                      ? 'border-cyan-400 bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 font-medium'
                      : 'border-transparent bg-black/5 dark:bg-white/5 opacity-70'
                  }`}
                >
                  <span className="font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Sunset to Sunrise</span>
                  </span>
                  <span className="text-[10px] opacity-70 mt-0.5">
                    Dark mode at solar twilight/night
                  </span>
                </button>

                <button
                  onClick={() => onChangeAutoModeType('system')}
                  className={`flex flex-col p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    autoModeType === 'system'
                      ? 'border-cyan-400 bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 font-medium'
                      : 'border-transparent bg-black/5 dark:bg-white/5 opacity-70'
                  }`}
                >
                  <span className="font-semibold flex items-center gap-1">
                    <Sliders className="w-3 h-3" />
                    <span>Follow System</span>
                  </span>
                  <span className="text-[10px] opacity-70 mt-0.5">
                    Matches Android/device theme
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. Glass Physics Sliders */}
        <div className={`p-4 rounded-2xl border mb-4 space-y-4 ${sectionBg}`}>
          <span className="text-xs font-bold tracking-wider uppercase opacity-70 block mb-1">
            Glass Refraction & Shader Physics
          </span>

          {/* Blur Intensity */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Backdrop Blur Radius</span>
              </span>
              <span className="font-mono text-cyan-500 font-bold">{settings.blurIntensity}px</span>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              value={settings.blurIntensity}
              onChange={(e) => onUpdateSettings({ blurIntensity: Number(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Specular Edge Brightness */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Specular Rim Brightness</span>
              </span>
              <span className="font-mono text-cyan-500 font-bold">
                {Math.round(settings.specularBrightness * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={settings.specularBrightness}
              onChange={(e) => onUpdateSettings({ specularBrightness: Number(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* 3D Tilt Sensitivity */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>Spatial 3D Tilt Angle</span>
              </span>
              <span className="font-mono text-cyan-500 font-bold">±{settings.tiltSensitivity}°</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              value={settings.tiltSensitivity}
              onChange={(e) => onUpdateSettings({ tiltSensitivity: Number(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Fluid Blob Speed */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-emerald-400" />
                <span>Fluid Caustics Speed</span>
              </span>
              <span className="font-mono text-cyan-500 font-bold">{settings.fluidSpeed}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={settings.fluidSpeed}
              onChange={(e) => onUpdateSettings({ fluidSpeed: Number(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>

        {/* 3. Weather Atmosphere Simulator */}
        <div className={`p-4 rounded-2xl border mb-4 ${sectionBg}`}>
          <span className="text-xs font-bold tracking-wider uppercase opacity-70 block mb-2.5">
            Atmospheric Weather Condition Simulator
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'clear', label: '☀️ Clear Twilight' },
              { id: 'partly-cloudy', label: '⛅ Partly Cloudy' },
              { id: 'rain', label: '🌧️ Liquid Rain' },
              { id: 'thunderstorm', label: '⚡ Thunderstorm' },
              { id: 'snow', label: '❄️ Glacial Snow' },
              { id: 'fog', label: '🌫️ Frosted Fog' },
            ].map((cond) => (
              <button
                key={cond.id}
                onClick={() => onSimulateCondition(cond.id as WeatherConditionType)}
                className={`py-2 px-2.5 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer ${
                  currentCondition === cond.id
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold'
                    : 'border-transparent bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                }`}
              >
                {cond.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reset button */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onResetDefaults}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-white/60 dark:hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Physics to Factory Default</span>
          </button>
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
