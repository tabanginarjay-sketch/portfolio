'use client';

import React, { useState, useEffect } from 'react';

interface GeometricShapesProps {
  children?: React.ReactNode;
  className?: string;
}

export default function GeometricShapes({ children, className = '' }: GeometricShapesProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Keep shapes orbiting Ar-jay while Hero is in view (threshold is 65% of viewport height)
          const threshold = Math.max(window.innerHeight * 0.65, 380);
          setIsScrolled(window.scrollY > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // When wrapping Ar-jay's portrait:
  if (children) {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        {/* 1. Hero Continuous Orbit (Strictly behind portrait at z-0, clean pitch-black background with ZERO distortion) */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-visible transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
          }`}
        >
          {/* Centered Orbit Anchor at chest height */}
          <div className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center pointer-events-none">
            {/* A. Cyan Glowing Ring — 100% Perfect Round Circle, Continuous Linear Orbit */}
            <div className="absolute w-0 h-0 flex items-center justify-center anim-orbit-cyan pointer-events-none">
              <div
                className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full aspect-square border-[2.5px] border-[#22D3EE] relative shrink-0 -translate-x-1/2 -translate-y-1/2"
                style={{
                  boxShadow:
                    '0 0 22px rgba(34, 211, 238, 0.85), inset 0 0 10px rgba(34, 211, 238, 0.4)',
                }}
              >
                <div className="absolute inset-0 rounded-full bg-[#22D3EE]/20 blur-sm pointer-events-none" />
              </div>
            </div>

            {/* B. Coral Glowing Ring — 100% Perfect Round Circle, Continuous Linear Orbit */}
            <div className="absolute w-0 h-0 flex items-center justify-center anim-orbit-coral pointer-events-none">
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full aspect-square border-[2.5px] border-[#FF5A5F] relative shrink-0 -translate-x-1/2 -translate-y-1/2"
                style={{
                  boxShadow:
                    '0 0 20px rgba(255, 90, 95, 0.9), inset 0 0 8px rgba(255, 90, 95, 0.4)',
                }}
              >
                <div className="absolute inset-0 rounded-full bg-[#FF5A5F]/20 blur-sm pointer-events-none" />
              </div>
            </div>

            {/* C. Solid Vibrant Cyan Dot / Orb — 100% Perfect Round Circle, Fast Continuous Orbit */}
            <div className="absolute w-0 h-0 flex items-center justify-center anim-orbit-dot pointer-events-none">
              <div
                className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 rounded-full aspect-square bg-[#00E5FF] relative shrink-0 -translate-x-1/2 -translate-y-1/2"
                style={{
                  boxShadow: '0 0 24px rgba(0, 229, 255, 1), 0 0 45px rgba(0, 229, 255, 0.65)',
                }}
              >
                <div className="absolute -inset-1 rounded-full bg-[#00E5FF]/40 blur-sm pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Playful Display Margin Floating Shapes — Follow along on scroll down, fly back on scroll up */}
        <div
          aria-hidden={!isScrolled}
          className={`fixed inset-0 pointer-events-none z-30 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Playful Ball 1: Perfect Cyan Circular Ring — Left open margin space */}
          <div
            className={`absolute left-3 sm:left-6 lg:left-10 top-[35%] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto cursor-pointer group ${
              isScrolled
                ? 'translate-x-0 scale-100 opacity-90'
                : 'translate-x-20 sm:translate-x-32 scale-50 opacity-0 pointer-events-none'
            }`}
            title="Playful Cyan Halo"
          >
            <div className="anim-playful-bob-1">
              <div
                className="w-8 h-8 sm:w-11 sm:h-11 lg:w-14 lg:h-14 rounded-full aspect-square border-[2.5px] border-[#22D3EE] group-hover:scale-125 transition-transform duration-300 relative"
                style={{
                  boxShadow:
                    '0 0 20px rgba(34, 211, 238, 0.85), inset 0 0 10px rgba(34, 211, 238, 0.35)',
                }}
              >
                <div className="absolute inset-0 rounded-full bg-[#22D3EE]/20 blur-sm pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Playful Ball 2: Perfect Coral Circular Ring — Right open margin space */}
          <div
            className={`absolute right-3 sm:right-6 lg:right-10 top-[58%] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto cursor-pointer group ${
              isScrolled
                ? 'translate-x-0 scale-100 opacity-90'
                : '-translate-x-20 sm:-translate-x-32 scale-50 opacity-0 pointer-events-none'
            }`}
            title="Playful Coral Halo"
          >
            <div className="anim-playful-bob-2">
              <div
                className="w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 rounded-full aspect-square border-[2.5px] border-[#FF5A5F] group-hover:scale-125 transition-transform duration-300 relative"
                style={{
                  boxShadow:
                    '0 0 18px rgba(255, 90, 95, 0.9), inset 0 0 8px rgba(255, 90, 95, 0.35)',
                }}
              >
                <div className="absolute inset-0 rounded-full bg-[#FF5A5F]/20 blur-sm pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Playful Ball 3: Perfect Cyan Circular Dot — Upper-Right open margin space */}
          <div
            className={`absolute right-5 sm:right-10 lg:right-16 top-[18%] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto cursor-pointer group ${
              isScrolled
                ? 'translate-y-0 scale-100 opacity-95'
                : 'translate-y-20 scale-50 opacity-0 pointer-events-none'
            }`}
            title="Playful Cyan Orb"
          >
            <div className="anim-playful-bob-3">
              <div
                className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 rounded-full aspect-square bg-[#00E5FF] group-hover:scale-150 transition-transform duration-300 relative"
                style={{
                  boxShadow: '0 0 24px rgba(0, 229, 255, 1), 0 0 45px rgba(0, 229, 255, 0.7)',
                }}
              >
                <div className="absolute -inset-1 rounded-full bg-[#00E5FF]/40 blur-sm pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Ar-jay's Portrait (Clean, crisp, unobstructed at foreground z-20) */}
        <div className="relative z-20 flex items-center justify-center pointer-events-auto">
          {children}
        </div>
      </div>
    );
  }

  // Fallback Standalone floating shapes
  return (
    <div
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
