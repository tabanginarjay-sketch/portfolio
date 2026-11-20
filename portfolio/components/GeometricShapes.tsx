'use client';

import React, { useEffect, useRef } from 'react';

export default function GeometricShapes() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cyanRingRef = useRef<HTMLDivElement | null>(null);
  const coralRingRef = useRef<HTMLDivElement | null>(null);
  const cyanDotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Skip mouse parallax completely on touch-only mobile devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let animationFrameId: number | null = null;
    let isVisible = true;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const applyTransforms = () => {
      if (cyanRingRef.current) {
        cyanRingRef.current.style.transform = `translate3d(${(currentX * 16).toFixed(2)}px, ${(currentY * 16).toFixed(2)}px, 0)`;
      }
      if (coralRingRef.current) {
        coralRingRef.current.style.transform = `translate3d(${(currentX * -20).toFixed(2)}px, ${(currentY * -20).toFixed(2)}px, 0)`;
      }
      if (cyanDotRef.current) {
        cyanDotRef.current.style.transform = `translate3d(${(currentX * 28).toFixed(2)}px, ${(currentY * 28).toFixed(2)}px, 0)`;
      }
    };

    // Only animate while cursor is actively easing — auto-sleeps at 0% CPU when settled or offscreen!
    const animate = () => {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      const dx = targetX - currentX;
      const dy = targetY - currentY;

      currentX += dx * 0.1;
      currentY += dy * 0.1;
      applyTransforms();

      if (Math.abs(dx) > 0.002 || Math.abs(dy) > 0.002) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        animationFrameId = null;
      }
    };

    const scheduleAnimate = () => {
      if (isVisible && animationFrameId === null) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) return;
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
      scheduleAnimate();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? false;
        if (!isVisible && animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      },
      { threshold: 0 }
    );
    observer.observe(container);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-24 w-52 mb-3 select-none cursor-pointer group contain-layout"
      title="Dynamic Animated Floating Shapes"
    >
      {/* 1. Large Cyan Glowing Ring */}
      <div
        ref={cyanRingRef}
        className="absolute top-1 right-24 w-16 h-16 pointer-events-none will-change-transform"
      >
        <div
          className="w-full h-full rounded-full border-[2.5px] border-[#22D3EE] anim-cyan-ring group-hover:scale-110 transition-transform duration-300"
          style={{
            boxShadow:
              '0 0 22px rgba(34, 211, 238, 0.6), inset 0 0 12px rgba(34, 211, 238, 0.3)',
          }}
        />
      </div>

      {/* 2. Coral Smaller Interlocking Ring */}
      <div
        ref={coralRingRef}
        className="absolute top-4 right-16 w-10 h-10 pointer-events-none will-change-transform"
      >
        <div
          className="w-full h-full rounded-full border-[2.5px] border-[#FF5A5F] anim-coral-ring group-hover:scale-115 transition-transform duration-300"
          style={{
            boxShadow:
              '0 0 20px rgba(255, 90, 95, 0.65), inset 0 0 10px rgba(255, 90, 95, 0.35)',
          }}
        />
      </div>

      {/* 3. Solid Vibrant Glowing Cyan Orb / Dot */}
      <div
        ref={cyanDotRef}
        className="absolute top-12 right-6 w-7 h-7 pointer-events-none will-change-transform"
      >
        <div
          className="w-full h-full rounded-full bg-[#00E5FF] anim-cyan-dot group-hover:scale-125 transition-transform duration-300"
          style={{
            boxShadow:
              '0 0 26px rgba(0, 229, 255, 0.9), 0 0 48px rgba(0, 229, 255, 0.5)',
          }}
        />
      </div>
    </div>
  );
}
