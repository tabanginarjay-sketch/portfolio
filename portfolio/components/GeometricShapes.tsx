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
          // Switch to Display Margin mode when scrolled past Hero (140px threshold)
          setIsScrolled(window.scrollY > 140);
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
        {/* 1. Hero Continuous Orbit (Strictly behind portrait at z-0, clean pitch-black background with NO colored blooms) */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-visible transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
          }`}
        >
          {/* A. Cyan Glowing Ring — Continuous Uninterrupted Elliptical Orbit */}
          <div
            className="absolute top-[46%] left-1/2 w-0 h-0 pointer-events-none"
            style={{ transform: 'rotate(-14deg) scale(1, 0.44)' }}
          >
            <div className="w-0 h-0 anim-orbit-spin-cyan">
              <div className="w-0 h-0" style={{ transform: 'translateX(var(--orbit-cyan-r))' }}>
                <div className="w-0 h-0 anim-orbit-counter-cyan">
                  <div
                    style={{ transform: 'scale(1, 2.27) rotate(14deg)' }}
                    className="flex items-center justify-center -ml-5 -mt-5 sm:-ml-7 sm:-mt-7 lg:-ml-8 lg:-mt-8"
                  >
                    <div
                      className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border-[2px] sm:border-[2.5px] border-[#22D3EE] relative"
                      style={{
                        boxShadow:
                          '0 0 24px rgba(34, 211, 238, 0.85), 0 0 48px rgba(34, 211, 238, 0.45), inset 0 0 12px rgba(34, 211, 238, 0.4)',
                      }}
                    >
                      <div className="absolute inset-0 rounded-full bg-[#22D3EE]/25 blur-md pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* B. Coral Glowing Ring — Continuous Intersecting Elliptical Orbit */}
          <div
            className="absolute top-[46%] left-1/2 w-0 h-0 pointer-events-none"
            style={{ transform: 'rotate(20deg) scale(1, 0.45)' }}
          >
            <div className="w-0 h-0 anim-orbit-spin-coral">
              <div className="w-0 h-0" style={{ transform: 'translateX(var(--orbit-coral-r))' }}>
                <div className="w-0 h-0 anim-orbit-counter-coral">
                  <div
                    style={{ transform: 'scale(1, 2.22) rotate(-20deg)' }}
                    className="flex items-center justify-center -ml-4 -mt-4 sm:-ml-5 sm:-mt-5 lg:-ml-6 lg:-mt-6"
                  >
                    <div
                      className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full border-[2px] sm:border-[2.5px] border-[#FF5A5F] relative"
                      style={{
                        boxShadow:
                          '0 0 22px rgba(255, 90, 95, 0.9), 0 0 44px rgba(255, 90, 95, 0.45), inset 0 0 10px rgba(255, 90, 95, 0.4)',
                      }}
                    >
                      <div className="absolute inset-0 rounded-full bg-[#FF5A5F]/25 blur-md pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* C. Solid Vibrant Cyan Glowing Dot / Orb — Fast Continuous Satellite Orbit */}
          <div
            className="absolute top-[46%] left-1/2 w-0 h-0 pointer-events-none"
            style={{ transform: 'rotate(-6deg) scale(1, 0.42)' }}
          >
            <div className="w-0 h-0 anim-orbit-spin-dot">
              <div className="w-0 h-0" style={{ transform: 'translateX(var(--orbit-dot-r))' }}>
                <div className="w-0 h-0 anim-orbit-counter-dot">
                  <div
                    style={{ transform: 'scale(1, 2.38) rotate(6deg)' }}
                    className="flex items-center justify-center -ml-2.5 -mt-2.5 sm:-ml-3.5 sm:-mt-3.5 lg:-ml-4 lg:-mt-4"
                  >
                    <div
                      className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-[#00E5FF] relative"
                      style={{
                        boxShadow: '0 0 28px rgba(0, 229, 255, 1), 0 0 56px rgba(0, 229, 255, 0.7)',
                      }}
                    >
                      <div className="absolute -inset-2 rounded-full bg-[#00E5FF]/45 blur-lg pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Playful Display Margin Floating Shapes — Follow along on scroll down, glide back on scroll up */}
        <div
          aria-hidden={!isScrolled}
          className={`fixed inset-0 pointer-events-none z-30 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Playful Ball 1: Cyan Glowing Ring — Left open margin space */}
          <div
            className={`absolute left-3 sm:left-6 lg:left-10 top-[35%] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto cursor-pointer group ${
              isScrolled
                ? 'translate-x-0 scale-100 opacity-90'
                : 'translate-x-16 sm:translate-x-32 scale-50 opacity-0 pointer-events-none'
            }`}
            title="Playful Cyan Halo"
          >
            <div className="anim-playful-bob-1">
              <div
                className="w-8 h-8 sm:w-11 sm:h-11 lg:w-14 lg:h-14 rounded-full border-[2px] sm:border-[2.5px] border-[#22D3EE] group-hover:scale-125 transition-transform duration-300 relative"
                style={{
                  boxShadow:
                    '0 0 20px rgba(34, 211, 238, 0.85), 0 0 40px rgba(34, 211, 238, 0.4), inset 0 0 10px rgba(34, 211, 238, 0.35)',
                }}
              >
                <div className="absolute inset-0 rounded-full bg-[#22D3EE]/20 blur-sm pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Playful Ball 2: Coral Glowing Ring — Right open margin space */}
          <div
            className={`absolute right-3 sm:right-6 lg:right-10 top-[58%] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto cursor-pointer group ${
              isScrolled
                ? 'translate-x-0 scale-100 opacity-90'
                : '-translate-x-16 sm:-translate-x-32 scale-50 opacity-0 pointer-events-none'
            }`}
            title="Playful Coral Halo"
          >
            <div className="anim-playful-bob-2">
              <div
                className="w-7 h-7 sm:w-9 sm:h-9 lg:w-12 lg:h-12 rounded-full border-[2px] sm:border-[2.5px] border-[#FF5A5F] group-hover:scale-125 transition-transform duration-300 relative"
                style={{
                  boxShadow:
                    '0 0 18px rgba(255, 90, 95, 0.9), 0 0 36px rgba(255, 90, 95, 0.45), inset 0 0 8px rgba(255, 90, 95, 0.35)',
                }}
              >
                <div className="absolute inset-0 rounded-full bg-[#FF5A5F]/20 blur-sm pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Playful Ball 3: Solid Cyan Glowing Orb — Upper-Right open margin space */}
          <div
            className={`absolute right-5 sm:right-10 lg:right-16 top-[18%] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto cursor-pointer group ${
              isScrolled
                ? 'translate-y-0 scale-100 opacity-95'
                : 'translate-y-16 scale-50 opacity-0 pointer-events-none'
            }`}
            title="Playful Cyan Orb"
          >
            <div className="anim-playful-bob-3">
              <div
                className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 rounded-full bg-[#00E5FF] group-hover:scale-150 transition-transform duration-300 relative"
                style={{
                  boxShadow: '0 0 24px rgba(0, 229, 255, 1), 0 0 48px rgba(0, 229, 255, 0.7)',
                }}
              >
                <div className="absolute -inset-1.5 rounded-full bg-[#00E5FF]/40 blur-md pointer-events-none" />
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
