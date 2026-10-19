import React, { useEffect, useRef } from 'react';
import { WeatherConditionType } from '../types/weather';

interface Props {
  condition: WeatherConditionType;
  isDark: boolean;
}

export const WeatherAmbianceParticles: React.FC<Props> = ({ condition, isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle count based on condition
    const count = condition === 'rain' || condition === 'heavy-rain' ? 65 : condition === 'snow' ? 45 : 28;

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy:
        condition === 'rain' || condition === 'heavy-rain'
          ? 5 + Math.random() * 8
          : condition === 'snow'
          ? 0.8 + Math.random() * 1.6
          : (Math.random() - 0.5) * 0.4,
      size:
        condition === 'snow'
          ? 2 + Math.random() * 3.5
          : condition === 'rain' || condition === 'heavy-rain'
          ? 1.5 + Math.random() * 2
          : 1.5 + Math.random() * 3,
      alpha: 0.15 + Math.random() * 0.4,
      wobble: Math.random() * Math.PI * 2,
    }));

    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = Math.min(time - lastTime, 32);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.wobble += 0.03;
        p.x += p.vx + Math.sin(p.wobble) * 0.3;
        p.y += p.vy;

        // Wrap around
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        } else if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.save();
        if (condition === 'rain' || condition === 'heavy-rain') {
          // Glass raindrop trail
          ctx.strokeStyle = isDark
            ? `rgba(56, 189, 248, ${p.alpha * 0.75})`
            : `rgba(14, 165, 233, ${p.alpha * 0.6})`;
          ctx.lineWidth = p.size;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 1.5, p.y + p.size * 6);
          ctx.stroke();
        } else if (condition === 'snow') {
          // Soft glowing crystal snowflake
          ctx.fillStyle = isDark
            ? `rgba(255, 255, 255, ${p.alpha * 0.85})`
            : `rgba(255, 255, 255, ${p.alpha * 0.95})`;
          ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Solar ambient floating prismatic light mote
          ctx.fillStyle = isDark
            ? `rgba(255, 220, 120, ${p.alpha * 0.5})`
            : `rgba(14, 165, 233, ${p.alpha * 0.4})`;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [condition, isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
      style={{ color: '#f41616' }}
      aria-hidden="true"
    />
  );
};
