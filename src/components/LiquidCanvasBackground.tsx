import React, { useEffect, useRef } from 'react';
import { WeatherConditionType } from '../types/weather';

interface Props {
  condition: WeatherConditionType;
  fluidSpeed?: number;
  chromaticTint?: 'cyan-magenta' | 'amber-violet' | 'aurora-emerald' | 'crystal-ice';
  interactive?: boolean;
  isDark?: boolean;
  isDay?: boolean;
}

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  color: string;
  alpha: number;
  phase: number;
  phaseSpeed: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
}

export const LiquidCanvasBackground: React.FC<Props> = ({
  condition,
  fluidSpeed = 1,
  chromaticTint = 'cyan-magenta',
  isDark = false,
  isDay = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean; radius: number }>({
    x: 0,
    y: 0,
    active: false,
    radius: 190,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Stars pool for Night sky
    const stars: Star[] = Array.from({ length: 85 }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.75),
      size: Math.random() * 1.8 + 0.6,
      alpha: Math.random() * 0.7 + 0.3,
      baseAlpha: Math.random() * 0.5 + 0.3,
      twinkleSpeed: Math.random() * 0.04 + 0.015,
      phase: Math.random() * Math.PI * 2,
    }));

    // Color definitions based on Day/Night & Condition
    const getColors = () => {
      if (isDay) {
        // DAYTIME: Luminous, warm, sun-drenched atmospheric daylight caustics
        if (condition === 'rain' || condition === 'heavy-rain') {
          return [
            { color: 'rgb(14, 165, 233)', alpha: 0.5 },  // Ocean Azure
            { color: 'rgb(56, 189, 248)', alpha: 0.45 }, // Sky Cyan
            { color: 'rgb(99, 102, 241)', alpha: 0.38 }, // Rain Indigo
            { color: 'rgb(20, 184, 166)', alpha: 0.35 }, // Emerald Teal
          ];
        }
        if (condition === 'thunderstorm') {
          return [
            { color: 'rgb(124, 58, 237)', alpha: 0.55 }, // Violet Nimbus
            { color: 'rgb(56, 189, 248)', alpha: 0.45 }, // Electric Cyan
            { color: 'rgb(236, 72, 153)', alpha: 0.35 }, // Magenta Flash
            { color: 'rgb(71, 85, 105)', alpha: 0.4 },   // Slate Cloud
          ];
        }
        if (condition === 'snow') {
          return [
            { color: 'rgb(56, 189, 248)', alpha: 0.45 }, // Glacial Cyan
            { color: 'rgb(186, 230, 253)', alpha: 0.5 }, // Frost Blue
            { color: 'rgb(232, 121, 249)', alpha: 0.3 }, // Pale Daylight Iris
            { color: 'rgb(255, 255, 255)', alpha: 0.4 }, // Sunlight Glisten
          ];
        }

        // Sunny / Clear Daylight: Warm golden solar peach & azure
        return [
          { color: 'rgb(251, 146, 60)', alpha: 0.5 },  // Solar Peach/Amber
          { color: 'rgb(250, 204, 21)', alpha: 0.42 }, // Radiant Sun Gold
          { color: 'rgb(14, 165, 233)', alpha: 0.45 }, // Deep Sky Cyan
          { color: 'rgb(236, 72, 153)', alpha: 0.32 }, // Daylight Coral Rose
          { color: 'rgb(56, 189, 248)', alpha: 0.4 },  // Azure Ambient
        ];
      } else {
        // NIGHTTIME: Deep cosmic starlight, lunar glow & aurora caustics
        if (condition === 'thunderstorm') {
          return [
            { color: 'rgb(147, 51, 234)', alpha: 0.65 }, // Electric Purple
            { color: 'rgb(56, 189, 248)', alpha: 0.55 }, // Cyan Lightning
            { color: 'rgb(67, 56, 202)', alpha: 0.7 },   // Deep Midnight Indigo
            { color: 'rgb(244, 63, 94)', alpha: 0.35 },  // Neon Storm Red
          ];
        }
        if (condition === 'snow') {
          return [
            { color: 'rgb(34, 211, 238)', alpha: 0.55 }, // Glacial Ice Cyan
            { color: 'rgb(99, 102, 241)', alpha: 0.5 },  // Midnight Aurora
            { color: 'rgb(168, 85, 247)', alpha: 0.45 }, // Starlit Lavender
            { color: 'rgb(255, 255, 255)', alpha: 0.35 },// Lunar Frost
          ];
        }
        if (condition === 'rain' || condition === 'heavy-rain') {
          return [
            { color: 'rgb(6, 182, 212)', alpha: 0.6 },   // Night Cyan
            { color: 'rgb(30, 64, 175)', alpha: 0.65 },  // Deep Ocean Blue
            { color: 'rgb(16, 185, 129)', alpha: 0.45 }, // Aurora Teal
            { color: 'rgb(139, 92, 246)', alpha: 0.4 },  // Twilight Violet
          ];
        }

        // Clear Night: Cosmic Aurora & Lunar Neon Caustics
        return [
          { color: 'rgb(0, 229, 255)', alpha: 0.55 },  // Neon Cyan
          { color: 'rgb(213, 0, 249)', alpha: 0.5 },   // Electric Magenta
          { color: 'rgb(99, 102, 241)', alpha: 0.55 }, // Celestial Indigo
          { color: 'rgb(16, 185, 129)', alpha: 0.4 },  // Aurora Emerald
          { color: 'rgb(245, 158, 11)', alpha: 0.3 },  // Distant City Amber
        ];
      }
    };

    const colorConfig = getColors();

    // Create 4-5 organic fluid orbs
    const orbs: Orb[] = colorConfig.map((cfg, i) => {
      const angle = (i / colorConfig.length) * Math.PI * 2;
      const dist = Math.min(width, height) * 0.35;
      return {
        x: width * 0.5 + Math.cos(angle) * dist,
        y: height * 0.45 + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.8 * fluidSpeed,
        vy: (Math.random() - 0.5) * 0.8 * fluidSpeed,
        baseRadius: Math.min(width, height) * (0.42 + i * 0.08),
        radius: Math.min(width, height) * (0.42 + i * 0.08),
        color: cfg.color,
        alpha: cfg.alpha,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: (0.008 + Math.random() * 0.006) * fluidSpeed,
      };
    });

    let lastTime = performance.now();
    let lightningTimer = 0;
    let lightningFlash = 0;

    const render = (time: number) => {
      const delta = Math.min(time - lastTime, 32);
      lastTime = time;

      // 1. Draw Atmospheric Base Gradient (Day vs Night)
      if (isDay) {
        // Daytime Sky: Radiant azure daylight with warm horizon glow
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        if (condition === 'rain' || condition === 'heavy-rain') {
          skyGrad.addColorStop(0, '#0369a1');
          skyGrad.addColorStop(0.5, '#38bdf8');
          skyGrad.addColorStop(1, '#bae6fd');
        } else if (condition === 'thunderstorm') {
          skyGrad.addColorStop(0, '#1e1b4b');
          skyGrad.addColorStop(0.6, '#312e81');
          skyGrad.addColorStop(1, '#64748b');
        } else {
          // Sunny / Clear Day Sky
          skyGrad.addColorStop(0, '#0284c7');
          skyGrad.addColorStop(0.4, '#38bdf8');
          skyGrad.addColorStop(0.8, '#93c5fd');
          skyGrad.addColorStop(1, '#e0f2fe');
        }
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Volumetric Sunbeams / Solar Shafts in Day
        ctx.save();
        const beamGrad = ctx.createLinearGradient(width * 0.8, 0, width * 0.2, height);
        beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
        beamGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.12)');
        beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(width * 0.6, 0);
        ctx.lineTo(width * 0.95, 0);
        ctx.lineTo(width * 0.4, height);
        ctx.lineTo(width * 0.1, height);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else {
        // Nighttime Sky: Deep starlit cosmic obsidian
        const nightGrad = ctx.createLinearGradient(0, 0, 0, height);
        nightGrad.addColorStop(0, '#020617');
        nightGrad.addColorStop(0.5, '#070b14');
        nightGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = nightGrad;
        ctx.fillRect(0, 0, width, height);

        // Twinkling Starlight Field
        stars.forEach((star) => {
          star.phase += star.twinkleSpeed;
          star.alpha = star.baseAlpha + Math.sin(star.phase) * 0.35;

          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(1, star.alpha))})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
        });

        // 3D Luminous Lunar Glow in Night Sky
        const moonX = width * 0.82;
        const moonY = height * 0.16;
        const moonRadius = 40;

        // Lunar Corona Aura
        const moonCorona = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.5, moonX, moonY, moonRadius * 3.5);
        moonCorona.addColorStop(0, 'rgba(186, 230, 253, 0.45)');
        moonCorona.addColorStop(0.5, 'rgba(56, 189, 248, 0.15)');
        moonCorona.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = moonCorona;
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonRadius * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Moon Orb
        const moonBody = ctx.createRadialGradient(moonX - 8, moonY - 8, 2, moonX, moonY, moonRadius);
        moonBody.addColorStop(0, '#ffffff');
        moonBody.addColorStop(0.7, '#e0f2fe');
        moonBody.addColorStop(1, '#7dd3fc');
        ctx.fillStyle = moonBody;
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
        ctx.fill();

        // Subtle Moon Craters
        ctx.fillStyle = 'rgba(125, 211, 252, 0.35)';
        ctx.beginPath();
        ctx.arc(moonX - 10, moonY + 4, 7, 0, Math.PI * 2);
        ctx.arc(moonX + 12, moonY - 8, 5, 0, Math.PI * 2);
        ctx.arc(moonX + 6, moonY + 14, 9, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Thunderstorm Lightning Flashes
      if (condition === 'thunderstorm') {
        lightningTimer += delta;
        if (lightningTimer > 3500 && Math.random() < 0.02) {
          lightningFlash = 0.55;
          lightningTimer = 0;
        }
        if (lightningFlash > 0) {
          ctx.fillStyle = `rgba(224, 231, 255, ${lightningFlash})`;
          ctx.fillRect(0, 0, width, height);
          lightningFlash = Math.max(0, lightningFlash - delta * 0.0035);
        }
      }

      // 3. Fluid Caustic Orbs Animation (Prismatic sub-surface liquid dispersion)
      orbs.forEach((orb) => {
        orb.phase += orb.phaseSpeed;
        const breath = Math.sin(orb.phase) * 35;
        orb.radius = orb.baseRadius + breath;

        orb.x += orb.vx * delta * 0.06;
        orb.y += orb.vy * delta * 0.06;

        const margin = orb.radius * 0.3;
        if (orb.x < -margin) {
          orb.x = -margin;
          orb.vx *= -1;
        } else if (orb.x > width + margin) {
          orb.x = width + margin;
          orb.vx *= -1;
        }
        if (orb.y < -margin) {
          orb.y = -margin;
          orb.vy *= -1;
        } else if (orb.y > height + margin) {
          orb.y = height + margin;
          orb.vy *= -1;
        }

        // Pointer fluid repulsion
        if (mouseRef.current.active) {
          const dx = orb.x - mouseRef.current.x;
          const dy = orb.y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouseRef.current.radius + orb.radius * 0.5) {
            const force = (1 - distance / (mouseRef.current.radius + orb.radius * 0.5)) * 1.5;
            orb.x += (dx / (distance || 1)) * force * 4;
            orb.y += (dy / (distance || 1)) * force * 4;
          }
        }

        const gradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          orb.radius * 0.05,
          orb.x,
          orb.y,
          orb.radius
        );

        const baseColor = orb.color.replace('rgb', 'rgba').replace(')', `, ${orb.alpha})`);
        const midColor = orb.color.replace('rgb', 'rgba').replace(')', `, ${orb.alpha * 0.45})`);
        const edgeColor = orb.color.replace('rgb', 'rgba').replace(')', ', 0)');

        gradient.addColorStop(0, baseColor);
        gradient.addColorStop(0.5, midColor);
        gradient.addColorStop(1, edgeColor);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      mouseRef.current.x = clientX;
      mouseRef.current.y = clientY;
      mouseRef.current.active = true;
    };

    const onPointerLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('mouseleave', onPointerLeave);
    window.addEventListener('touchend', onPointerLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('mouseleave', onPointerLeave);
      window.removeEventListener('touchend', onPointerLeave);
    };
  }, [condition, fluidSpeed, chromaticTint, isDark, isDay]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      style={{ filter: 'blur(35px) saturate(180%)' }}
      aria-hidden="true"
    />
  );
};
