import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Navigation,
  Radio,
  Search,
  Sparkles,
  Download,
  Share2,
  Check,
  ExternalLink,
  PlusCircle,
  Zap,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTriggerShortcut: (action: 'current' | 'broadcast' | 'search' | 'animation') => void;
  isDark: boolean;
}

export const AppShortcutModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onTriggerShortcut,
  isDark,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  useEffect(() => {
    // Check if running in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      // Fallback instruction
      alert('To add a direct app shortcut:\n• On Android: Tap Chrome menu (⋮) -> "Add to Home screen" or "Install App".\n• On iPhone: Tap Share -> "Add to Home Screen".');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const modalBg = isDark
    ? 'bg-[#0b1325]/95 border-white/20 text-white'
    : 'bg-white/95 border-slate-200 text-slate-800';

  const cardBg = isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar rounded-3xl border p-6 shadow-2xl backdrop-blur-2xl transition-all ${modalBg}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-pink-500 to-amber-400 p-[1.5px] shadow-md shadow-pink-500/20">
              <div className="w-full h-full rounded-[14px] bg-[#070b14] flex items-center justify-center text-white">
                <Smartphone className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">App Shortcuts & Direct Open</h2>
              <p className="text-xs opacity-60">Add 1-tap launcher shortcut to your Android screen</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Android Direct Open Shortcuts (Like long-pressing the home screen icon) */}
        <div className="mb-4">
          <span className="text-[11px] font-bold tracking-wider uppercase opacity-75 block mb-2.5">
            Instant Action Shortcuts (Direct Launch)
          </span>

          <div className="space-y-2">
            {[
              {
                id: 'current',
                title: 'Current Weather (GPS)',
                desc: 'Direct launch into detected coordinates',
                icon: Navigation,
                color: 'text-cyan-400 bg-cyan-500/15 border-cyan-400/30',
              },
              {
                id: 'broadcast',
                title: 'Live Voice Broadcast',
                desc: 'Direct launch with voice meteorologist bulletin',
                icon: Radio,
                color: 'text-pink-400 bg-pink-500/15 border-pink-400/30',
              },
              {
                id: 'search',
                title: 'Global City Search',
                desc: 'Direct launch with world search bar active',
                icon: Search,
                color: 'text-amber-400 bg-amber-500/15 border-amber-400/30',
              },
              {
                id: 'animation',
                title: 'Animation & FX Studio',
                desc: 'Direct launch into 3D particle & caustics engine',
                icon: Sparkles,
                color: 'text-purple-400 bg-purple-500/15 border-purple-400/30',
              },
            ].map((sc) => {
              const Icon = sc.icon;
              return (
                <button
                  key={sc.id}
                  onClick={() => {
                    onTriggerShortcut(sc.id as any);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left cursor-pointer hover:scale-[1.01] ${cardBg}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${sc.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">{sc.title}</span>
                      <span className="text-[10px] opacity-60 block">{sc.desc}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-40 hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Direct Android Home Screen Install Box */}
        <div className={`p-4 rounded-2xl border mb-4 bg-gradient-to-br from-cyan-500/15 via-pink-500/10 to-amber-500/15 border-cyan-400/30`}>
          <div className="flex items-center gap-3 mb-2.5">
            <PlusCircle className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <span className="text-xs font-bold block">
                {isInstalled ? 'App Already Added to Home Screen' : 'Add Direct Shortcut to Device'}
              </span>
              <span className="text-[10px] opacity-75 block">
                Opens standalone without browser address bar
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleInstallClick}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 hover:opacity-95 text-white font-bold text-xs transition-opacity cursor-pointer shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isInstalled ? 'Installed' : 'Install App Shortcut'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              title="Copy direct share URL"
              className={`p-2.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${cardBg}`}
            >
              {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* How to add direct shortcut on Android guide */}
        <div className="p-3 rounded-xl bg-black/5 dark:bg-black/30 text-[10px] opacity-60 leading-relaxed">
          💡 <strong>Tip for Android users:</strong> Long-press the Aether icon on your home screen anytime to reveal direct action shortcuts for instant GPS weather or voice broadcasts.
        </div>
      </div>
    </div>
  );
};
