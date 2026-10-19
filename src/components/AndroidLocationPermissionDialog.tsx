import React, { useState } from 'react';
import { MapPin, Navigation, ShieldCheck, Crosshair } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onAllow: (precision: 'precise' | 'approximate') => void;
  onDeny: () => void;
  isDark: boolean;
}

export const AndroidLocationPermissionDialog: React.FC<Props> = ({
  isOpen,
  onAllow,
  onDeny,
  isDark,
}) => {
  const [precision, setPrecision] = useState<'precise' | 'approximate'>('precise');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-sm rounded-[36px] p-6 shadow-2xl transition-all border ${
          isDark
            ? 'bg-[#1b2234] border-white/15 text-white'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Android Location Icon Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 shadow-lg shadow-cyan-500/10">
            <Navigation className="w-7 h-7 animate-pulse text-cyan-400" />
          </div>

          <h2 className="text-xl font-bold tracking-tight">
            Allow Aether to access this device's location?
          </h2>

          <p className="text-xs opacity-70 mt-2 leading-relaxed">
            Aether uses Android location services to provide real-time atmospheric conditions, precipitation alerts, and local solar data.
          </p>
        </div>

        {/* Android-style Precise vs Approximate Visual Pill Selector */}
        <div className="grid grid-cols-2 gap-3 my-5">
          {/* Precise */}
          <button
            type="button"
            onClick={() => setPrecision('precise')}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
              precision === 'precise'
                ? 'border-cyan-400 bg-cyan-500/15 shadow-sm'
                : 'border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="relative w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mb-2">
              <Crosshair className="w-6 h-6 text-cyan-400" />
              <div className="absolute inset-1 rounded-full border border-cyan-400/50 animate-ping opacity-25" />
            </div>
            <span className="text-xs font-semibold">Precise</span>
            <span className="text-[10px] opacity-60">Exact coordinates</span>
          </button>

          {/* Approximate */}
          <button
            type="button"
            onClick={() => setPrecision('approximate')}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
              precision === 'approximate'
                ? 'border-cyan-400 bg-cyan-500/15 shadow-sm'
                : 'border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-slate-500/20 flex items-center justify-center mb-2">
              <MapPin className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-xs font-semibold">Approximate</span>
            <span className="text-[10px] opacity-60">City level area</span>
          </button>
        </div>

        {/* Android Permission Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => onAllow(precision)}
            className="w-full py-3.5 px-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-sm transition-all shadow-md shadow-cyan-500/25 cursor-pointer active:scale-[0.98]"
          >
            While using the app
          </button>

          <button
            onClick={() => onAllow(precision)}
            className={`w-full py-3 px-4 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
              isDark
                ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white'
                : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            Only this time
          </button>

          <button
            onClick={onDeny}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-medium opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
          >
            Don't allow
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] opacity-40">
          <ShieldCheck className="w-3 h-3" />
          <span>Android Location Privacy Protected</span>
        </div>
      </div>
    </div>
  );
};
