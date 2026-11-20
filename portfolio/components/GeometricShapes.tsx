'use client';

import React from 'react';

interface GeometricShapesProps {
  children?: React.ReactNode;
  className?: string;
}

export default function GeometricShapes({ children, className = '' }: GeometricShapesProps) {
  // When wrapping Ar-jay's portrait: 100% continuous, buttery smooth linear orbit (never stops, never stutters)
  if (children) {
    return (
      <div
        className={`relative flex items-center justify-center select-none ${className}`}
      >
        {/* 1. Dynamic Synced Ambient Lighting Auroras (Strictly behind portrait at z-0, pure GPU composited) */}
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          {/* Dual cross-fading cyan & coral studio blooms — pure opacity & scale, ZERO CPU repaint! */}
          <div className="absolute w-[240px] h-[300px] sm:w-[320px] sm:h-[400px] md:w-[360px] md:h-[450px] lg:w-[480px] lg:h-[580px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.24)_0%,rgba(34,211,238,0.06)_45%,transparent_72%)] anim-aura-cyan -translate-y-2 md:-translate-y-6 lg:-translate-y-8 pointer-events-none" />
          <div className="absolute w-[240px] h-[300px] sm:w-[320px] sm:h-[400px] md:w-[360px] md:h-[450px] lg:w-[480px] lg:h-[580px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,90,95,0.26)_0%,rgba(255,90,95,0.06)_45%,transparent_72%)] anim-aura-coral -translate-y-2 md:-translate-y-6 lg:-translate-y-8 pointer-events-none" />

          {/* Left Cyan Silhouette Rim Reflection */}
          <div className="absolute -left-2 sm:-left-4 md:-left-6 lg:-left-8 top-[18%] bottom-[18%] w-12 sm:w-16 lg:w-20 rounded-full bg-[radial-gradient(ellipse_at_left,rgba(34,211,238,0.42)_0%,transparent_75%)] anim-aura-cyan pointer-events-none" />

          {/* Right Coral Silhouette Rim Reflection */}
          <div className="absolute -right-2 sm:-right-4 md:-right-6 lg:-right-8 top-[18%] bottom-[18%] w-12 sm:w-16 lg:w-20 rounded-full bg-[radial-gradient(ellipse_at_right,rgba(255,90,95,0.45)_0%,transparent_75%)] anim-aura-coral pointer-events-none" />
        </div>

        {/* 2. Fluid Continuous Orbital Halo System (Strictly behind portrait at z-0, 100% linear uninterrupted spin) */}
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-visible">
          {/* A. Cyan Glowing Ring — Continuous Uninterrupted Elliptical Orbit */}
          <div className="absolute top-[46%] left-1/2 w-0 h-0 pointer-events-none" style={{ transform: 'rotate(-14deg) scale(1, 0.44)' }}>
            <div className="w-0 h-0 anim-orbit-spin-cyan">
              <div className="w-0 h-0" style={{ transform: 'translateX(var(--orbit-cyan-r))' }}>
                <div className="w-0 h-0 anim-orbit-counter-cyan">
                  <div style={{ transform: 'scale(1, 2.27) rotate(14deg)' }} className="flex items-center justify-center -ml-5 -mt-5 sm:-ml-7 sm:-mt-7 lg:-ml-8 lg:-mt-8">
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
          <div className="absolute top-[46%] left-1/2 w-0 h-0 pointer-events-none" style={{ transform: 'rotate(20deg) scale(1, 0.45)' }}>
            <div className="w-0 h-0 anim-orbit-spin-coral">
              <div className="w-0 h-0" style={{ transform: 'translateX(var(--orbit-coral-r))' }}>
                <div className="w-0 h-0 anim-orbit-counter-coral">
                  <div style={{ transform: 'scale(1, 2.22) rotate(-20deg)' }} className="flex items-center justify-center -ml-4 -mt-4 sm:-ml-5 sm:-mt-5 lg:-ml-6 lg:-mt-6">
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
          <div className="absolute top-[46%] left-1/2 w-0 h-0 pointer-events-none" style={{ transform: 'rotate(-6deg) scale(1, 0.42)' }}>
            <div className="w-0 h-0 anim-orbit-spin-dot">
              <div className="w-0 h-0" style={{ transform: 'translateX(var(--orbit-dot-r))' }}>
                <div className="w-0 h-0 anim-orbit-counter-dot">
                  <div style={{ transform: 'scale(1, 2.38) rotate(6deg)' }} className="flex items-center justify-center -ml-2.5 -mt-2.5 sm:-ml-3.5 sm:-mt-3.5 lg:-ml-4 lg:-mt-4">
                    <div
                      className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-[#00E5FF] relative"
                      style={{
                        boxShadow:
                          '0 0 28px rgba(0, 229, 255, 1), 0 0 56px rgba(0, 229, 255, 0.7)',
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

        {/* 3. Ar-jay's Portrait (Rendered cleanly at z-20 foreground, always on top of the lighting halo) */}
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
