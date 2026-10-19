import React, { ReactNode } from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone, Maximize2, Minimize2 } from 'lucide-react';

interface Props {
  children: ReactNode;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  deviceModel?: 'pixel' | 'galaxy';
  onToggleDevice?: () => void;
}

export const AndroidPhoneFrame: React.FC<Props> = ({
  children,
  isFullscreen,
  onToggleFullscreen,
  deviceModel = 'pixel',
  onToggleDevice,
}) => {
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });

  if (isFullscreen) {
    return (
      <div className="relative w-full min-h-screen bg-[#070b14] overflow-x-hidden">
        {/* Android Native Status Bar */}
        <div className="sticky top-0 z-40 w-full px-6 pt-3 pb-2 flex items-center justify-between text-white/80 text-xs backdrop-blur-md bg-[#070b14]/40 select-none">
          <span className="font-semibold tracking-tight text-sm font-mono">{currentTime}</span>
          <div className="flex items-center gap-3">
            <Signal className="w-3.5 h-3.5 text-white/70" />
            <Wifi className="w-3.5 h-3.5 text-white/70" />
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono text-white/60">88%</span>
              <BatteryMedium className="w-4 h-4 text-emerald-400" />
            </div>
            <button
              onClick={onToggleFullscreen}
              title="Exit fullscreen / Show Android device frame"
              className="ml-2 p-1 rounded-md bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
            >
              <Minimize2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-2 pb-24">
          {children}
        </div>

        {/* Android Gesture Navigation Pill */}
        <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-40 w-36 h-1 bg-white/30 rounded-full backdrop-blur-md pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen py-6 px-4">
      {/* Top Floating Control Bar for Device Customization */}
      <div className="mb-4 flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/15 px-3 py-1.5 rounded-full shadow-lg text-xs text-white/80">
        <span className="flex items-center gap-1.5 text-cyan-300 font-medium">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Android {deviceModel === 'pixel' ? 'Pixel 9 Pro' : 'Galaxy S24'}</span>
        </span>
        <span className="text-white/20">|</span>
        {onToggleDevice && (
          <button
            onClick={onToggleDevice}
            className="hover:text-white transition-colors cursor-pointer text-white/70 hover:underline"
          >
            Switch to {deviceModel === 'pixel' ? 'Galaxy S24' : 'Pixel 9 Pro'}
          </button>
        )}
        <span className="text-white/20">|</span>
        <button
          onClick={onToggleFullscreen}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-white/70 hover:underline"
        >
          <Maximize2 className="w-3 h-3" />
          <span>Expand View</span>
        </button>
      </div>

      {/* Realistic Android Hardware Frame */}
      <div
        className={`relative w-full max-w-[412px] h-[870px] rounded-[52px] p-[10px] shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.18)] ${
          deviceModel === 'pixel'
            ? 'bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900'
            : 'bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-950'
        }`}
      >
        {/* Hardware Matte Titanium Edge Sheen */}
        <div className="absolute inset-0 rounded-[52px] pointer-events-none p-[1.5px] bg-gradient-to-tr from-white/30 via-transparent to-cyan-500/20" />

        {/* Screen Bezel */}
        <div className="relative w-full h-full rounded-[44px] overflow-hidden bg-[#070b14] flex flex-col border border-black/80 shadow-inner">
          {/* Top Status Bar with Camera Punch-hole */}
          <div className="relative z-30 w-full pt-3 px-6 pb-1 flex items-center justify-between text-white/80 select-none text-xs">
            {/* Clock */}
            <span className="font-semibold text-xs font-mono tracking-tight">{currentTime}</span>

            {/* Android Camera Punch Hole */}
            <div className="absolute left-1/2 top-3 -translate-x-1/2 w-4 h-4 rounded-full bg-black border border-white/10 flex items-center justify-center shadow-inner">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-950/80 ring-1 ring-cyan-500/30" />
            </div>

            {/* Status Icons */}
            <div className="flex items-center gap-2">
              <Signal className="w-3 h-3 text-white/75" />
              <Wifi className="w-3 h-3 text-white/75" />
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono text-white/60">94%</span>
                <BatteryMedium className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Scrollable Screen Content */}
          <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar px-4 pt-2 pb-16">
            {children}
          </div>

          {/* Android Gesture Navigation Bar Pill */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 w-32 h-1 bg-white/40 rounded-full pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
