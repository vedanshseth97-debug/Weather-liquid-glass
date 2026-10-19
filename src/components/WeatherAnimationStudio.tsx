import React from 'react';
import {
  X,
  Play,
  Pause,
  Zap,
  Wind,
  Layers,
  Sparkles,
  Sliders,
  CloudRain,
  Flame,
  Activity,
  Gauge,
  Compass,
} from 'lucide-react';
import { AnimationControls, WeatherConditionType } from '../types/weather';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  animations: AnimationControls;
  onUpdateAnimations: (newVals: Partial<AnimationControls>) => void;
  currentCondition: WeatherConditionType;
  onTriggerCondition: (cond: WeatherConditionType) => void;
  isDark: boolean;
}

export const WeatherAnimationStudio: React.FC<Props> = ({
  isOpen,
  onClose,
  animations,
  onUpdateAnimations,
  currentCondition,
  onTriggerCondition,
  isDark,
}) => {
  if (!isOpen) return null;

  const modalBg = isDark
    ? 'bg-[#0b1325]/95 border-white/20 text-white'
    : 'bg-white/95 border-slate-200 text-slate-800';

  const cardBg = isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar rounded-3xl border p-6 shadow-2xl backdrop-blur-2xl transition-all ${modalBg}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-pink-500 to-cyan-400 text-white shadow-md shadow-pink-500/20">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Animation & FX Studio</h2>
              <p className="text-xs opacity-60">Control real-time liquid motion, particles & shaders</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Play / Pause & Speed Bar */}
        <div className={`p-4 rounded-2xl border mb-4 ${cardBg}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold tracking-wider uppercase opacity-75 flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-cyan-400" />
              <span>Master Motion Engine</span>
            </span>
            <span className={`text-[11px] font-mono font-bold ${animations.enabled ? 'text-emerald-400' : 'text-amber-400'}`}>
              {animations.enabled ? '60 FPS ACTIVE' : 'PAUSED'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateAnimations({ enabled: !animations.enabled })}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md ${
                animations.enabled
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/20'
              }`}
            >
              {animations.enabled ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{animations.enabled ? 'Pause Motion' : 'Resume Motion'}</span>
            </button>

            {/* Speed Pills: 0.5x | 1.0x | 2.0x */}
            <div className="flex items-center p-1 rounded-xl bg-black/5 dark:bg-black/30 border border-black/5 dark:border-white/10">
              {[0.5, 1.0, 2.0].map((s) => (
                <button
                  key={s}
                  onClick={() => onUpdateAnimations({ speed: s, enabled: true })}
                  className={`py-1.5 px-2.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                    animations.speed === s && animations.enabled
                      ? 'bg-cyan-500 text-white shadow-sm'
                      : 'text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className={`p-4 rounded-2xl border mb-4 space-y-3 ${cardBg}`}>
          <span className="text-xs font-bold tracking-wider uppercase opacity-75 block mb-2">
            Active Visual Layers
          </span>

          {/* 1. Fluid Caustics Background Mesh */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-xs font-semibold block">Liquid Chromatic Mesh</span>
                <span className="text-[10px] opacity-60 block">Animated organic caustics</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={animations.fluidMeshEnabled}
              onChange={(e) => onUpdateAnimations({ fluidMeshEnabled: e.target.checked })}
              className="w-4 h-4 accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* 2. Atmospheric Particles Storm */}
          <div className="flex items-center justify-between py-1 border-t border-black/5 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <CloudRain className="w-4 h-4 text-sky-400" />
              <div>
                <span className="text-xs font-semibold block">Atmospheric Particle System</span>
                <span className="text-[10px] opacity-60 block">Falling glass rain beads, snow & solar glints</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={animations.particlesEnabled}
              onChange={(e) => onUpdateAnimations({ particlesEnabled: e.target.checked })}
              className="w-4 h-4 accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* 3. 3D Spatial Tilt Physics */}
          <div className="flex items-center justify-between py-1 border-t border-black/5 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-purple-400" />
              <div>
                <span className="text-xs font-semibold block">Interactive 3D Tilt & Gyroscope</span>
                <span className="text-[10px] opacity-60 block">Spatial perspective response to pointer and tilt</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={animations.tiltPhysicsEnabled}
              onChange={(e) => onUpdateAnimations({ tiltPhysicsEnabled: e.target.checked })}
              className="w-4 h-4 accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Live Animated Weather Showcases */}
        <div className={`p-4 rounded-2xl border mb-4 ${cardBg}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold tracking-wider uppercase opacity-75 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Animated Weather Scenarios</span>
            </span>
            <span className="text-[10px] opacity-60">Click to animate</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'clear', label: '☀️ Solar Flare Twilight', desc: 'Floating light motes & corona pulse' },
              { id: 'rain', label: '🌧️ Liquid Rain Caustics', desc: 'Falling diagonal glass raindrops' },
              { id: 'thunderstorm', label: '⚡ Electric Thunderstorm', desc: 'Lightning arcs & violet pulses' },
              { id: 'snow', label: '❄️ Glacial Snow Aurora', desc: 'Drifting hexagonal crystals' },
            ].map((scene) => (
              <button
                key={scene.id}
                onClick={() => onTriggerCondition(scene.id as WeatherConditionType)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  currentCondition === scene.id
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-400 shadow-sm'
                    : 'border-transparent bg-black/5 dark:bg-white/5 hover:border-white/20'
                }`}
              >
                <span className="text-xs font-bold block">{scene.label}</span>
                <span className="text-[10px] opacity-60 block mt-0.5">{scene.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:opacity-95 text-white font-bold text-xs transition-opacity cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          Apply & Return to Weather
        </button>
      </div>
    </div>
  );
};
