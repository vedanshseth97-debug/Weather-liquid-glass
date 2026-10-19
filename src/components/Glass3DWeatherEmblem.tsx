import React, { useEffect, useRef } from 'react';
import { WeatherConditionType } from '../types/weather';

interface Props {
  condition: WeatherConditionType;
  size?: number;
  isDay?: boolean;
}

export const Glass3DWeatherEmblem: React.FC<Props> = ({
  condition,
  size = 180,
  isDay = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dpr = window.devicePixelRatio || 2;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let startTime = performance.now();

    // Rain / Snow particle pool
    const particles = Array.from({ length: 14 }, () => ({
      x: 30 + Math.random() * (size - 60),
      y: size * 0.55 + Math.random() * (size * 0.4),
      speed: 1.5 + Math.random() * 2.5,
      length: 8 + Math.random() * 10,
      opacity: 0.3 + Math.random() * 0.5,
      size: 2 + Math.random() * 2.5,
      angle: 0.15,
    }));

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, size, size);

      // Smooth organic floating offset
      const floatY = Math.sin(elapsed * 2.2) * 5;
      const pulse = Math.sin(elapsed * 3.5) * 0.05 + 1;

      const centerX = size / 2;
      const centerY = size / 2 + floatY;

      // 1. Draw Sun or Moon if condition includes clear / partly cloudy / day
      const showSun = condition === 'clear' || condition === 'partly-cloudy' || condition === 'fog';
      const showMoon = !isDay && condition === 'clear';

      if (showSun && isDay) {
        const sunX = condition === 'clear' ? centerX : centerX + 26;
        const sunY = condition === 'clear' ? centerY : centerY - 20;
        const sunR = condition === 'clear' ? 44 : 32;

        // Outer solar corona
        const corona = ctx.createRadialGradient(sunX, sunY, sunR * 0.4, sunX, sunY, sunR * 2.1);
        corona.addColorStop(0, 'rgba(255, 213, 79, 0.65)');
        corona.addColorStop(0.5, 'rgba(255, 145, 0, 0.25)');
        corona.addColorStop(1, 'rgba(255, 111, 0, 0)');
        ctx.fillStyle = corona;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunR * 2.1 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // 3D Glass Sun core
        const sunBody = ctx.createLinearGradient(sunX - sunR, sunY - sunR, sunX + sunR, sunY + sunR);
        sunBody.addColorStop(0, '#FFE082');
        sunBody.addColorStop(0.4, '#FFB300');
        sunBody.addColorStop(1, '#FF6F00');
        ctx.fillStyle = sunBody;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
        ctx.fill();

        // Specular 3D Glass Crescent Highlight
        ctx.save();
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunR - 2, 0, Math.PI * 2);
        ctx.clip();

        const specular = ctx.createRadialGradient(
          sunX - sunR * 0.35,
          sunY - sunR * 0.35,
          2,
          sunX - sunR * 0.35,
          sunY - sunR * 0.35,
          sunR * 0.8
        );
        specular.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        specular.addColorStop(0.3, 'rgba(255, 255, 255, 0.4)');
        specular.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = specular;
        ctx.beginPath();
        ctx.arc(sunX - sunR * 0.35, sunY - sunR * 0.35, sunR * 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Glass Rim Stroke
        ctx.lineWidth = 1.5;
        const sunRim = ctx.createLinearGradient(sunX - sunR, sunY - sunR, sunX + sunR, sunY + sunR);
        sunRim.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        sunRim.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
        sunRim.addColorStop(1, 'rgba(255, 200, 50, 0.6)');
        ctx.strokeStyle = sunRim;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
        ctx.stroke();
      } else if (showMoon) {
        // 3D Glass Moon
        const moonX = centerX;
        const moonY = centerY - 4;
        const moonR = 40;

        const moonCorona = ctx.createRadialGradient(moonX, moonY, moonR * 0.4, moonX, moonY, moonR * 1.8);
        moonCorona.addColorStop(0, 'rgba(186, 230, 253, 0.4)');
        moonCorona.addColorStop(1, 'rgba(14, 165, 233, 0)');
        ctx.fillStyle = moonCorona;
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonR * 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Crescent shape
        ctx.fillStyle = '#E0F2FE';
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonR, 0.2 * Math.PI, 1.8 * Math.PI, false);
        ctx.arc(moonX + 16, moonY - 6, moonR * 0.82, 1.8 * Math.PI, 0.2 * Math.PI, true);
        ctx.closePath();
        ctx.fill();

        // Moon Specular
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // 2. Draw 3D Frosted Glass Cloud (if not pure clear sky)
      const hasCloud = condition !== 'clear';
      if (hasCloud) {
        const cloudBaseY = centerY + 18;
        const cloudScale = size / 160;

        // Path for organic cloud
        const drawCloudPath = () => {
          ctx.beginPath();
          ctx.moveTo(centerX - 46 * cloudScale, cloudBaseY);
          ctx.bezierCurveTo(
            centerX - 68 * cloudScale, cloudBaseY - 6 * cloudScale,
            centerX - 58 * cloudScale, cloudBaseY - 36 * cloudScale,
            centerX - 30 * cloudScale, cloudBaseY - 32 * cloudScale
          );
          ctx.bezierCurveTo(
            centerX - 20 * cloudScale, cloudBaseY - 58 * cloudScale,
            centerX + 26 * cloudScale, cloudBaseY - 58 * cloudScale,
            centerX + 38 * cloudScale, cloudBaseY - 32 * cloudScale
          );
          ctx.bezierCurveTo(
            centerX + 64 * cloudScale, cloudBaseY - 30 * cloudScale,
            centerX + 70 * cloudScale, cloudBaseY - 6 * cloudScale,
            centerX + 48 * cloudScale, cloudBaseY
          );
          ctx.closePath();
        };

        // Cloud Shadow / Depth projection
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 12;

        // Cloud Translucent Frosted Body
        const cloudGrad = ctx.createLinearGradient(
          centerX - 50 * cloudScale,
          cloudBaseY - 50 * cloudScale,
          centerX + 50 * cloudScale,
          cloudBaseY
        );

        if (condition === 'thunderstorm') {
          cloudGrad.addColorStop(0, 'rgba(167, 139, 250, 0.7)');
          cloudGrad.addColorStop(0.5, 'rgba(76, 29, 149, 0.6)');
          cloudGrad.addColorStop(1, 'rgba(15, 23, 42, 0.5)');
        } else if (condition === 'rain' || condition === 'heavy-rain') {
          cloudGrad.addColorStop(0, 'rgba(224, 242, 254, 0.65)');
          cloudGrad.addColorStop(0.5, 'rgba(125, 211, 252, 0.45)');
          cloudGrad.addColorStop(1, 'rgba(56, 189, 248, 0.25)');
        } else if (condition === 'snow') {
          cloudGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
          cloudGrad.addColorStop(0.5, 'rgba(224, 242, 254, 0.55)');
          cloudGrad.addColorStop(1, 'rgba(186, 230, 253, 0.3)');
        } else {
          // Partly cloudy / normal
          cloudGrad.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
          cloudGrad.addColorStop(0.4, 'rgba(186, 230, 253, 0.4)');
          cloudGrad.addColorStop(1, 'rgba(255, 255, 255, 0.15)');
        }

        ctx.fillStyle = cloudGrad;
        drawCloudPath();
        ctx.fill();
        ctx.restore();

        // Apple-style Glass Specular Rim Reflection (Bevel Highlight)
        ctx.save();
        drawCloudPath();
        ctx.lineWidth = 2.2;
        const rimGrad = ctx.createLinearGradient(
          centerX - 50 * cloudScale,
          cloudBaseY - 55 * cloudScale,
          centerX + 50 * cloudScale,
          cloudBaseY
        );
        rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        rimGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.4)');
        rimGrad.addColorStop(0.7, 'rgba(0, 229, 255, 0.45)');
        rimGrad.addColorStop(1, 'rgba(213, 0, 249, 0.3)');
        ctx.strokeStyle = rimGrad;
        ctx.stroke();
        ctx.restore();

        // Inner Caustic / Top Flare
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(
          centerX + 5 * cloudScale,
          cloudBaseY - 44 * cloudScale,
          18 * cloudScale,
          7 * cloudScale,
          0,
          0,
          Math.PI * 2
        );
        const flare = ctx.createRadialGradient(
          centerX + 5 * cloudScale,
          cloudBaseY - 44 * cloudScale,
          2,
          centerX + 5 * cloudScale,
          cloudBaseY - 44 * cloudScale,
          18 * cloudScale
        );
        flare.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        flare.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = flare;
        ctx.fill();
        ctx.restore();
      }

      // 3. Falling Raindrops or Snowflakes or Lightning
      if (condition === 'rain' || condition === 'heavy-rain') {
        particles.forEach((p) => {
          p.y += p.speed;
          if (p.y > size - 8) {
            p.y = centerY + 18;
            p.x = centerX - 40 + Math.random() * 80;
          }

          // Liquid glass bead raindrop
          ctx.save();
          ctx.strokeStyle = `rgba(0, 229, 255, ${p.opacity})`;
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.speed * 0.4, p.y + p.length);
          ctx.stroke();

          // Droplet specular tip
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 1.2})`;
          ctx.beginPath();
          ctx.arc(p.x - p.speed * 0.4, p.y + p.length, 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      } else if (condition === 'snow') {
        particles.forEach((p, idx) => {
          p.y += p.speed * 0.4;
          const wobble = Math.sin(elapsed * 2 + idx) * 3;
          if (p.y > size - 6) {
            p.y = centerY + 16;
            p.x = centerX - 42 + Math.random() * 84;
          }

          // Crystal snow bead
          ctx.save();
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.shadowColor = 'rgba(0, 229, 255, 0.8)';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x + wobble, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      } else if (condition === 'thunderstorm') {
        // Dramatic electric lightning arc every few seconds
        const thunderCycle = (elapsed * 1.5) % 3;
        if (thunderCycle < 0.22) {
          ctx.save();
          ctx.strokeStyle = '#FDE047';
          ctx.shadowColor = '#00E5FF';
          ctx.shadowBlur = 14;
          ctx.lineWidth = 2.5;
          ctx.lineJoin = 'miter';
          ctx.beginPath();
          ctx.moveTo(centerX - 8, centerY + 14);
          ctx.lineTo(centerX - 16, centerY + 34);
          ctx.lineTo(centerX - 4, centerY + 34);
          ctx.lineTo(centerX - 12, centerY + 58);
          ctx.stroke();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [condition, size, isDay]);

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="pointer-events-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
      />
    </div>
  );
};
