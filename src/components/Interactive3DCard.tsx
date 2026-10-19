import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  maxTilt?: number;
  className?: string;
  intensity?: number;
  specular?: boolean;
}

export const Interactive3DCard: React.FC<Props> = ({
  children,
  maxTilt = 12,
  className = '',
  intensity = 1,
  specular = true,
}) => {
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [glarePos, setGlarePos] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Mouse & Touch tracking
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width) * 2 - 1; // -1 to +1
    const normY = (y / rect.height) * 2 - 1; // -1 to +1

    const targetRotX = -normY * maxTilt * intensity;
    const targetRotY = normX * maxTilt * intensity;

    setRotateX(targetRotX);
    setRotateY(targetRotY);

    if (specular) {
      setGlarePos({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.65,
      });
    }
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  // Optional Gyroscope tilt on mobile devices
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      // beta: front to back tilt (-180 to 180), gamma: left to right (-90 to 90)
      const clampedBeta = Math.max(-25, Math.min(25, e.beta - 45));
      const clampedGamma = Math.max(-25, Math.min(25, e.gamma));
      setRotateX(-clampedBeta * 0.4);
      setRotateY(clampedGamma * 0.4);
    };

    if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
      return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    }
  }, []);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`relative perspective-container transition-transform duration-200 select-none ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        touchAction: 'pan-y',
      }}
    >
      <div
        className="relative w-full h-full rounded-[32px] overflow-hidden transition-all duration-150 ease-out"
        style={{
          transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${
            isHovered ? 1.015 : 1
          }, ${isHovered ? 1.015 : 1}, 1)`,
          transformStyle: 'preserve-3d',
          boxShadow: isHovered
            ? '0 30px 60px -12px rgba(0, 0, 0, 0.45), 0 18px 36px -18px rgba(0, 229, 255, 0.2)'
            : '0 20px 40px -15px rgba(0, 0, 0, 0.35)',
        }}
      >
        {/* Dynamic Specular Glare Layer that tracks tilt light reflection */}
        {specular && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20"
            style={{
              opacity: glarePos.opacity,
              background: `radial-gradient(circle 320px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0.05) 50%, transparent 80%)`,
              mixBlendMode: 'overlay',
            }}
          />
        )}

        {/* Refractive Bevel / Specular Rim Highlight */}
        <div
          className="absolute inset-0 rounded-[32px] pointer-events-none z-10 p-[1.2px]"
          style={{
            background: `linear-gradient(${135 + rotateY * 2}deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.18) 40%, rgba(255,255,255,0.02) 70%, rgba(0,229,255,0.35) 100%)`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Content */}
        <div className="relative z-0 h-full">{children}</div>
      </div>
    </div>
  );
};
