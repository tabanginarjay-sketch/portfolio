'use client';

import React, { useEffect, useRef } from 'react';

interface GeometricShapesProps {
  children?: React.ReactNode;
  className?: string;
}

export default function GeometricShapes({ children, className = '' }: GeometricShapesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const parallaxRef = useRef<HTMLDivElement | null>(null);

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
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate3d(${(currentX * 12).toFixed(2)}px, ${(currentY * 12).toFixed(2)}px, 0)`;
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

  // When wrapping Ar-jay's portrait, render the full orbital lighting halo and dynamic studio aura!
  if (children) {
    return (
      <div
        ref={containerRef}
        className={`relative flex items-center justify-center select-none group ${className}`}
      >
        {/* Parallax-responsive ambient lighting container */}
        <div ref={parallaxRef} className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* 1. Dynamic Synced Studio Lighting Aura behind Ar-jay (Color-shifting radial aura) */}
          <div
            aria-hidden="true"
            className="w-[230px] h-[280px] sm:w-[320px] sm:h-[390px] md:w-[360px] md:h-[440px] lg:w-[480px] lg:h-[570px] xl:w-[560px] xl:h-[660px] rounded-full anim-studio-lighting pointer-events-none -translate-y-2 md:-translate-y-6 lg:-translate-y-8"
          />

          {/* 2. Left Edge Cyan Silhouette Rim Light Reflection */}
          <div
            aria-hidden="true"
            className="absolute -left-2 sm:-left-4 md:-left-6 lg:-left-8 top-[18%] bottom-[18%] w-12 sm:w-16 lg:w-20 rounded-full bg-[radial-gradient(ellipse_at_left,rgba(34,211,238,0.45)_0%,transparent_75%)] anim-left-rim-cyan pointer-events-none z-[4]"
          />

          {/* 3. Right Edge Coral Silhouette Rim Light Reflection */}
          <div
            aria-hidden="true"
            className="absolute -right-2 sm:-right-4 md:-right-6 lg:-right-8 top-[18%] bottom-[18%] w-12 sm:w-16 lg:w-20 rounded-full bg-[radial-gradient(ellipse_at_right,rgba(255,90,95,0.48)_0%,transparent_75%)] anim-right-rim-coral pointer-events-none z-[4]"
          />

          {/* 4. Large Cyan Glowing Ring — 3D Elliptical Orbit around Ar-jay */}
          <div
            className="absolute top-[46%] left-1/2 -ml-5 -mt-5 sm:-ml-7 sm:-mt-7 lg:-ml-8 lg:-mt-8 anim-orbit-cyan-ring pointer-events-none will-change-transform"
          >
            <div
              className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border-[2px] sm:border-[2.5px] border-[#22D3EE] relative group-hover:scale-110 transition-transform duration-300"
              style={{
                boxShadow:
                  '0 0 22px rgba(34, 211, 238, 0.8), 0 0 44px rgba(34, 211, 238, 0.4), inset 0 0 12px rgba(34, 211, 238, 0.35)',
              }}
            >
              <div className="absolute inset-0 rounded-full bg-[#22D3EE]/20 blur-md pointer-events-none" />
            </div>
          </div>

          {/* 5. Coral Glowing Interlocking Ring — Intersecting Tilted Orbit around Ar-jay */}
          <div
            className="absolute top-[46%] left-1/2 -ml-4 -mt-4 sm:-ml-5 sm:-mt-5 lg:-ml-6 lg:-mt-6 anim-orbit-coral-ring pointer-events-none will-change-transform"
          >
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full border-[2px] sm:border-[2.5px] border-[#FF5A5F] relative group-hover:scale-115 transition-transform duration-300"
              style={{
                boxShadow:
                  '0 0 20px rgba(255, 90, 95, 0.85), 0 0 40px rgba(255, 90, 95, 0.45), inset 0 0 10px rgba(255, 90, 95, 0.35)',
              }}
            >
              <div className="absolute inset-0 rounded-full bg-[#FF5A5F]/20 blur-md pointer-events-none" />
            </div>
          </div>

          {/* 6. Solid Vibrant Cyan Glowing Dot / Orb — Fast Satellite Orbit around Ar-jay */}
          <div
            className="absolute top-[46%] left-1/2 -ml-2.5 -mt-2.5 sm:-ml-3.5 sm:-mt-3.5 lg:-ml-4 lg:-mt-4 anim-orbit-cyan-dot pointer-events-none will-change-transform"
          >
            <div
              className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-[#00E5FF] relative group-hover:scale-125 transition-transform duration-300"
              style={{
                boxShadow:
                  '0 0 26px rgba(0, 229, 255, 0.95), 0 0 55px rgba(0, 229, 255, 0.65)',
              }}
            >
              <div className="absolute -inset-2 rounded-full bg-[#00E5FF]/40 blur-lg pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 7. Ar-jay's Cutout Portrait (Rendered at z-10, between front and back orbit layers!) */}
        <div className="relative z-10 flex items-center justify-center">
          {children}
        </div>
      </div>
    );
  }

  // Fallback Standalone floating shapes (if used elsewhere without children)
  return (
    <div
      ref={containerRef}
      className={`relative h-20 md:h-20 lg:h-24 w-48 lg:w-52 mb-0 md:mb-2 lg:mb-3 select-none cursor-pointer group contain-layout ${className}`}
      title="Dynamic Animated Floating Shapes"
    >
      <div className="absolute top-1 right-24 w-16 h-16 pointer-events-none will-change-transform">
        <div
          className="w-full h-full rounded-full border-[2.5px] border-[#22D3EE] anim-cyan-ring group-hover:scale-110 transition-transform duration-300"
          style={{
            boxShadow:
              '0 0 22px rgba(34, 211, 238, 0.6), inset 0 0 12px rgba(34, 211, 238, 0.3)',
          }}
        />
      </div>

      <div className="absolute top-4 right-16 w-10 h-10 pointer-events-none will-change-transform">
        <div
          className="w-full h-full rounded-full border-[2.5px] border-[#FF5A5F] anim-coral-ring group-hover:scale-115 transition-transform duration-300"
          style={{
            boxShadow:
              '0 0 20px rgba(255, 90, 95, 0.65), inset 0 0 10px rgba(255, 90, 95, 0.35)',
          }}
        />
      </div>

      <div className="absolute top-12 right-6 w-7 h-7 pointer-events-none will-change-transform">
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
