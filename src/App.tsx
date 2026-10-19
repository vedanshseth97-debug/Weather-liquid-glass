/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sun,
  Moon,
  Sparkles,
  Search,
  Sliders,
  Code2,
  RefreshCw,
  Compass,
  MapPin,
  Smartphone,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Navigation,
  Radio,
  Activity,
  PlusCircle,
  ExternalLink,
  LayoutGrid,
} from 'lucide-react';
import { WeatherData, GlassSettings, WeatherConditionType, AnimationControls } from './types/weather';
import { POPULAR_CITIES, getMockWeatherData, fetchLiveWeather, reverseGeocode } from './services/weatherService';
import { weatherAudio } from './services/audioAmbiance';
import { weatherBroadcast } from './services/weatherBroadcastService';
import { LiquidCanvasBackground } from './components/LiquidCanvasBackground';
import { WeatherAmbianceParticles } from './components/WeatherAmbianceParticles';
import { LiquidHeroWeatherCard } from './components/LiquidHeroWeatherCard';
import { WeatherBroadcastBanner } from './components/WeatherBroadcastBanner';
import { HourlyForecastStrip } from './components/HourlyForecastStrip';
import { DailyForecastList } from './components/DailyForecastList';
import { WeatherMetricTiles } from './components/WeatherMetricTiles';
import { AndroidPhoneFrame } from './components/AndroidPhoneFrame';
import { CitySearchModal } from './components/CitySearchModal';
import { LiquidGlassControlsModal, ThemeMode } from './components/LiquidGlassControlsModal';
import { AndroidCodeExporterModal } from './components/AndroidCodeExporterModal';
import { AndroidLocationPermissionDialog } from './components/AndroidLocationPermissionDialog';
import { WeatherAnimationStudio } from './components/WeatherAnimationStudio';
import { AppShortcutModal } from './components/AppShortcutModal';
import { AndroidWidgetsStudio } from './components/AndroidWidgetsStudio';

const DEFAULT_SETTINGS: GlassSettings = {
  blurIntensity: 28,
  specularBrightness: 0.75,
  fluidSpeed: 1.0,
  tiltSensitivity: 14,
  chromaticTint: 'cyan-magenta',
  hapticFeedback: true,
};

export default function App() {
  // Theme state: defaults to 'light' as requested
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('aether_theme_mode');
    return (saved as ThemeMode) || 'light';
  });

  const [autoModeType, setAutoModeType] = useState<'system' | 'solar'>(() => {
    const saved = localStorage.getItem('aether_auto_type');
    return (saved as 'system' | 'solar') || 'solar';
  });

  // Track system dark mode preference
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Glass settings
  const [glassSettings, setGlassSettings] = useState<GlassSettings>(() => {
    const saved = localStorage.getItem('aether_glass_settings');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Animation Controls State
  const [animations, setAnimations] = useState<AnimationControls>({
    enabled: true,
    speed: 1.0,
    particlesEnabled: true,
    fluidMeshEnabled: true,
    tiltPhysicsEnabled: true,
    radarPulseEnabled: true,
  });

  // Weather state: starts with San Francisco preset
  const [weather, setWeather] = useState<WeatherData>(() => getMockWeatherData(POPULAR_CITIES[0]));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isCurrentLocation, setIsCurrentLocation] = useState<boolean>(false);
  const [locationToast, setLocationToast] = useState<string | null>(null);

  // Sound ambiance state
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // Android device view frame toggle
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [deviceModel, setDeviceModel] = useState<'pixel' | 'galaxy'>('pixel');

  // Modals
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [glassModalOpen, setGlassModalOpen] = useState<boolean>(false);
  const [codeModalOpen, setCodeModalOpen] = useState<boolean>(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState<boolean>(false);
  const [animationStudioOpen, setAnimationStudioOpen] = useState<boolean>(false);
  const [shortcutModalOpen, setShortcutModalOpen] = useState<boolean>(false);
  const [widgetsStudioOpen, setWidgetsStudioOpen] = useState<boolean>(false);

  // Day / Night background sky mode: 'auto' (real solar time in city) | 'day' | 'night'
  const [dayNightMode, setDayNightMode] = useState<'auto' | 'day' | 'night'>('auto');

  // Compute effective day/night status for the background sky and weather artwork
  const effectiveIsDay = useMemo(() => {
    if (dayNightMode === 'day') return true;
    if (dayNightMode === 'night') return false;
    return weather.isDay;
  }, [dayNightMode, weather.isDay]);

  // Listen to system color scheme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Compute effective dark mode
  const isDark = useMemo(() => {
    if (themeMode === 'dark') return true;
    if (themeMode === 'light') return false;
    // Auto Mode:
    if (autoModeType === 'solar') {
      return !weather.isDay;
    }
    return systemPrefersDark;
  }, [themeMode, autoModeType, weather.isDay, systemPrefersDark]);

  // Synchronize <html> element class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('aether_theme_mode', themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('aether_auto_type', autoModeType);
  }, [autoModeType]);

  useEffect(() => {
    localStorage.setItem('aether_glass_settings', JSON.stringify(glassSettings));
  }, [glassSettings]);

  // Load live weather for a city
  const loadCityWeather = useCallback(async (lat: number, lon: number, cityName?: string, countryName?: string, isGPS: boolean = false) => {
    setIsLoading(true);
    try {
      const data = await fetchLiveWeather(lat, lon, cityName, countryName);
      setWeather(data);
      setIsCurrentLocation(isGPS);
      if (isGPS) {
        setLocationToast(`Detected location: ${data.cityName} (${data.currentTemp}°)`);
        setTimeout(() => setLocationToast(null), 4000);
      }
    } catch (e) {
      console.error('Weather load error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Core Geolocation detector
  const detectLocation = useCallback((highAccuracy: boolean = true) => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const geocodeRes = await reverseGeocode(latitude, longitude);
          await loadCityWeather(latitude, longitude, geocodeRes.cityName, geocodeRes.country, true);
        } catch (e) {
          await loadCityWeather(latitude, longitude, 'My Location', 'GPS', true);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error or denied:', err);
      },
      {
        enableHighAccuracy: highAccuracy,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [loadCityWeather]);

  // Automatic location fetch or URL shortcut trigger on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check URL Shortcuts (e.g. from Android Home Screen shortcut launcher)
    const urlParams = new URLSearchParams(window.location.search);
    const shortcut = urlParams.get('shortcut');

    if (shortcut === 'broadcast') {
      setTimeout(() => weatherBroadcast.speak(weather), 800);
    } else if (shortcut === 'search') {
      setSearchModalOpen(true);
    } else if (shortcut === 'animation') {
      setAnimationStudioOpen(true);
    } else if (shortcut === 'current') {
      detectLocation(true);
      return;
    }

    // Check location permission state
    if (navigator.geolocation && navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          detectLocation(true);
        } else if (result.state === 'prompt') {
          const hasSeenPrompt = sessionStorage.getItem('aether_location_prompted');
          if (!hasSeenPrompt && !shortcut) {
            setLocationDialogOpen(true);
          }
        }
      }).catch(() => {
        const hasSeenPrompt = sessionStorage.getItem('aether_location_prompted');
        if (!hasSeenPrompt && !shortcut) {
          setLocationDialogOpen(true);
        }
      });
    }
  }, [detectLocation]);

  const handleAllowLocationDialog = (precision: 'precise' | 'approximate') => {
    sessionStorage.setItem('aether_location_prompted', 'true');
    setLocationDialogOpen(false);
    detectLocation(precision === 'precise');
  };

  const handleDenyLocationDialog = () => {
    sessionStorage.setItem('aether_location_prompted', 'true');
    setLocationDialogOpen(false);
  };

  // Toggle ambient weather audio
  const handleToggleAudio = () => {
    const playing = weatherAudio.toggle(weather.condition);
    setIsAudioPlaying(playing);
  };

  // Trigger from shortcut modal
  const handleTriggerShortcut = (action: 'current' | 'broadcast' | 'search' | 'animation') => {
    if (action === 'current') detectLocation(true);
    else if (action === 'broadcast') weatherBroadcast.speak(weather);
    else if (action === 'search') setSearchModalOpen(true);
    else if (action === 'animation') setAnimationStudioOpen(true);
  };

  // Simulate specific weather for inspection
  const handleSimulateCondition = (cond: WeatherConditionType) => {
    setWeather((prev) => ({
      ...prev,
      condition: cond,
      conditionDescription: `${cond.toUpperCase().replace('-', ' ')} • Simulated Physics`,
      isDay: cond !== 'fog' ? prev.isDay : false,
    }));
    if (isAudioPlaying) {
      weatherAudio.start(cond);
    }
  };

  // Cycle theme quick-toggle: Light -> Dark -> Auto -> Light
  const handleCycleTheme = () => {
    if (themeMode === 'light') setThemeMode('dark');
    else if (themeMode === 'dark') setThemeMode('auto');
    else setThemeMode('light');
  };

  return (
    <div className={`min-h-screen relative overflow-x-hidden ${isDark ? 'bg-[#070b14] text-white' : 'bg-[#eaf0f8] text-slate-800'}`}>
      {/* 1. Fluid Caustics Canvas Background with Real Day/Night Skies */}
      {animations.fluidMeshEnabled && (
        <LiquidCanvasBackground
          condition={weather.condition}
          fluidSpeed={animations.enabled ? glassSettings.fluidSpeed * animations.speed : 0}
          chromaticTint={glassSettings.chromaticTint}
          isDark={isDark}
          isDay={effectiveIsDay}
        />
      )}

      {/* 2. Atmospheric Weather Particles */}
      {animations.particlesEnabled && animations.enabled && (
        <WeatherAmbianceParticles condition={weather.condition} isDark={isDark} />
      )}

      {/* 3. Top Navigation Bar */}
      <header className={`relative z-40 w-full px-4 md:px-8 py-3.5 border-b backdrop-blur-xl transition-colors ${
        isDark ? 'bg-[#070b14]/70 border-white/10 text-white' : 'bg-white/70 border-slate-200/80 text-slate-800'
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 via-pink-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
              <Sun className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight block leading-tight">
                Aether
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase font-mono bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                3D Liquid Glass • Android
              </span>
            </div>
          </div>

          {/* Center: Quick City Preset Pills + GPS Trigger */}
          <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
            {/* GPS Trigger Button */}
            <button
              onClick={() => detectLocation(true)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isCurrentLocation
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sm font-semibold'
                  : isDark
                  ? 'text-cyan-400 hover:text-cyan-300 hover:bg-white/5'
                  : 'text-cyan-600 hover:text-cyan-800 hover:bg-white/50'
              }`}
            >
              <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'My Location'}</span>
            </button>

            {POPULAR_CITIES.slice(0, 5).map((city) => {
              const active = !isCurrentLocation && weather.cityName.toLowerCase() === city.name.toLowerCase();
              return (
                <button
                  key={city.id}
                  onClick={() => loadCityWeather(city.lat, city.lon, city.name, city.country, false)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 text-white shadow-sm font-semibold'
                      : isDark
                      ? 'text-white/60 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {city.name}
                </button>
              );
            })}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Day / Night Sky Switcher */}
            <button
              onClick={() => {
                if (dayNightMode === 'auto') setDayNightMode('day');
                else if (dayNightMode === 'day') setDayNightMode('night');
                else setDayNightMode('auto');
              }}
              title={`Background Sky: ${dayNightMode === 'auto' ? `Auto Solar (${weather.isDay ? 'Day' : 'Night'})` : dayNightMode.toUpperCase()} (Click to toggle Day/Night)`}
              className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl border border-amber-400/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 dark:text-amber-300 text-xs font-semibold transition-all cursor-pointer shadow-sm"
            >
              {effectiveIsDay ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-300" />}
              <span className="hidden lg:inline text-[11px] font-mono">
                {dayNightMode === 'auto' ? (effectiveIsDay ? 'Day Sky' : 'Night Sky') : dayNightMode === 'day' ? 'Day Sky' : 'Night Sky'}
              </span>
            </button>

            {/* Android Widgets Studio button */}
            <button
              onClick={() => setWidgetsStudioOpen(true)}
              title="Android 3D Liquid Glass Widgets Studio"
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-cyan-400/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-500 dark:text-cyan-300 text-xs font-bold transition-all cursor-pointer shadow-sm shadow-cyan-500/15"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Widgets</span>
            </button>

            {/* App Shortcut Direct Open button */}
            <button
              onClick={() => setShortcutModalOpen(true)}
              title="App Shortcuts & Direct Home Screen Install"
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20 text-pink-500 dark:text-pink-300 text-xs font-bold transition-all cursor-pointer shadow-sm shadow-pink-500/15"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">App Shortcut</span>
            </button>

            {/* Animation & FX Studio Toggle */}
            <button
              onClick={() => setAnimationStudioOpen(true)}
              title="Animation Engine & FX Studio"
              className="flex items-center gap-1 py-1.5 px-2.5 rounded-xl border border-cyan-400/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-500 dark:text-cyan-300 text-xs font-semibold transition-all cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden md:inline font-mono">{animations.speed}x FX</span>
            </button>

            {/* Ambient Soundscape Toggle */}
            <button
              onClick={handleToggleAudio}
              title={isAudioPlaying ? 'Mute ambient weather audio' : 'Play procedural weather soundscape'}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isAudioPlaying
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                  : isDark
                  ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white/80'
                  : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
              }`}
            >
              {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* 3-Way Dark Mode Selector (Light | Dark | Auto) */}
            <div className="flex items-center p-0.5 rounded-xl bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10">
              <button
                onClick={() => setThemeMode('light')}
                title="Light Mode (Default)"
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  themeMode === 'light'
                    ? 'bg-white text-amber-500 shadow-sm'
                    : 'text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setThemeMode('dark')}
                title="Dark Mode"
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  themeMode === 'dark'
                    ? 'bg-slate-900 text-indigo-400 shadow-sm border border-white/20'
                    : 'text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setThemeMode('auto')}
                title={`Auto Dark Mode (${autoModeType === 'solar' ? 'Sunset to Sunrise' : 'Follow System'})`}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                  themeMode === 'auto'
                    ? 'bg-cyan-500 text-white shadow-sm font-semibold'
                    : 'text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Auto</span>
              </button>
            </div>

            {/* Glass Physics Studio */}
            <button
              onClick={() => setGlassModalOpen(true)}
              title="Liquid Glass Physics Studio"
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDark ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white/80' : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
              }`}
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Jetpack Compose Kotlin Code */}
            <button
              onClick={() => setCodeModalOpen(true)}
              title="Android Jetpack Compose Source Code"
              className={`hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                isDark
                  ? 'border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300'
                  : 'border-cyan-600/30 bg-cyan-50 hover:bg-cyan-100 text-cyan-700'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Android Code</span>
            </button>
          </div>
        </div>
      </header>

      {/* Location Toast Notification */}
      {locationToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 py-2 px-4 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-xs font-semibold shadow-xl shadow-cyan-500/30 backdrop-blur-md animate-in slide-in-from-top-2 duration-300 flex items-center gap-2">
          <Navigation className="w-3.5 h-3.5" />
          <span>{locationToast}</span>
        </div>
      )}

      {/* 4. Main Weather Viewport */}
      <AndroidPhoneFrame
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        deviceModel={deviceModel}
        onToggleDevice={() => setDeviceModel(deviceModel === 'pixel' ? 'galaxy' : 'pixel')}
      >
        <div className="space-y-4 pt-1">
          {/* Hero Top Bar inside the phone */}
          <div className="flex items-center justify-between py-1">
            {/* Search Location Bar */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className={`flex-1 flex items-center gap-2 px-3.5 py-2 rounded-2xl border transition-all cursor-pointer mr-2 ${
                isDark
                  ? 'bg-white/10 border-white/15 hover:bg-white/15 text-white'
                  : 'bg-white/80 border-slate-200/90 hover:bg-white text-slate-700 shadow-sm'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-cyan-500" />
              <span className="text-xs font-medium">Search any city...</span>
            </button>

            <div className="flex items-center gap-1.5">
              {/* GPS Detection button */}
              <button
                onClick={() => detectLocation(true)}
                disabled={isLocating}
                title="Detect Current GPS Location"
                className={`p-2 rounded-2xl border transition-all cursor-pointer ${
                  isCurrentLocation
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-sm'
                    : isDark
                    ? 'bg-white/10 border-white/15 text-white'
                    : 'bg-white/80 border-slate-200 text-slate-700 shadow-sm'
                }`}
              >
                <Navigation className={`w-3.5 h-3.5 text-cyan-400 ${isLocating ? 'animate-spin' : ''}`} />
              </button>

              {/* Direct App Shortcut Trigger */}
              <button
                onClick={() => setShortcutModalOpen(true)}
                title="Direct App Shortcuts"
                className="p-2 rounded-2xl border border-pink-500/30 bg-pink-500/10 text-pink-400 transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
              </button>

              {/* Android Widgets Studio Trigger */}
              <button
                onClick={() => setWidgetsStudioOpen(true)}
                title="Android 3D Widgets"
                className="p-2 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-400 transition-all cursor-pointer"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>

              {/* Quick toggle theme inside phone */}
              <button
                onClick={handleCycleTheme}
                title={`Theme: ${themeMode} (Click to toggle)`}
                className={`p-2 rounded-2xl border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-white/10 border-white/15 text-white'
                    : 'bg-white/80 border-slate-200 text-slate-700 shadow-sm'
                }`}
              >
                {themeMode === 'auto' ? (
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                ) : isDark ? (
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                )}
              </button>

              {/* Refresh weather */}
              <button
                onClick={() => loadCityWeather(weather.latitude, weather.longitude, weather.cityName, weather.country, isCurrentLocation)}
                disabled={isLoading}
                title="Refresh meteorological feed"
                className={`p-2 rounded-2xl border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-white/10 border-white/15 text-white'
                    : 'bg-white/80 border-slate-200 text-slate-700 shadow-sm'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* 3D Liquid Glass Hero Card with Interactive Spatial Tilt */}
          <LiquidHeroWeatherCard
            weather={weather}
            onOpenSearch={() => setSearchModalOpen(true)}
            isCurrentLocation={isCurrentLocation}
            onDetectLocation={() => detectLocation(true)}
            tiltEnabled={animations.tiltPhysicsEnabled && animations.enabled}
          />

          {/* LIVE METEOROLOGIST VOICE BROADCAST BANNER */}
          <WeatherBroadcastBanner weather={weather} isDark={isDark} />

          {/* Hourly Forecast with Spline Temperature Curve */}
          <HourlyForecastStrip hourly={weather.hourly} />

          {/* 7-Day Liquid Forecast */}
          <DailyForecastList daily={weather.daily} />

          {/* 3D Liquid Weather Metric Tiles */}
          <WeatherMetricTiles weather={weather} isDark={isDark} />
        </div>
      </AndroidPhoneFrame>

      {/* 5. Modals & Dialogs */}
      <AndroidLocationPermissionDialog
        isOpen={locationDialogOpen}
        onAllow={handleAllowLocationDialog}
        onDeny={handleDenyLocationDialog}
        isDark={isDark}
      />

      <CitySearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectCity={(city) => loadCityWeather(city.lat, city.lon, city.name, city.country, false)}
        onUseCurrentLocation={() => detectLocation(true)}
        selectedCityName={weather.cityName}
        isDark={isDark}
        isLocating={isLocating}
      />

      <WeatherAnimationStudio
        isOpen={animationStudioOpen}
        onClose={() => setAnimationStudioOpen(false)}
        animations={animations}
        onUpdateAnimations={(vals) => setAnimations((prev) => ({ ...prev, ...vals }))}
        currentCondition={weather.condition}
        onTriggerCondition={handleSimulateCondition}
        isDark={isDark}
      />

      <AppShortcutModal
        isOpen={shortcutModalOpen}
        onClose={() => setShortcutModalOpen(false)}
        onTriggerShortcut={handleTriggerShortcut}
        isDark={isDark}
      />

      <LiquidGlassControlsModal
        isOpen={glassModalOpen}
        onClose={() => setGlassModalOpen(false)}
        settings={glassSettings}
        onUpdateSettings={(newSet) => setGlassSettings((prev) => ({ ...prev, ...newSet }))}
        themeMode={themeMode}
        onChangeThemeMode={(m) => setThemeMode(m)}
        autoModeType={autoModeType}
        onChangeAutoModeType={(t) => setAutoModeType(t)}
        currentCondition={weather.condition}
        onSimulateCondition={handleSimulateCondition}
        isDark={isDark}
        onResetDefaults={() => setGlassSettings(DEFAULT_SETTINGS)}
      />

      <AndroidCodeExporterModal
        isOpen={codeModalOpen}
        onClose={() => setCodeModalOpen(false)}
        isDark={isDark}
      />
    </div>
  );
}
