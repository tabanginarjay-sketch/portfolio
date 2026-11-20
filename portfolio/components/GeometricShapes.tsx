'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface GeometricShapesProps {
  children?: React.ReactNode;
  className?: string;
}

export default function GeometricShapes({ children, className = '' }: GeometricShapesProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Switch to Display Margin mode when scrolled past Hero (55% of viewport height)
          const threshold = Math.max(window.innerHeight * 0.55, 340);
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
        {/* 1. Hero 3D Continuous Orbital Halo System (Anchor has NO isolating z-index; shapes pass in FRONT at z-30 and BEHIND at z-10) */}
        <div className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 pointer-events-none">
          {/* A. Cyan Glowing Ring — 100% Perfect Round Circle, True 3D Front & Back Orbit */}
          <div
            className={`absolute w-0 h-0 anim-orbit-cyan pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isScrolled ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
            }`}
          >
            <div
              className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full aspect-square border-[2.5px] border-[#22D3EE] relative shrink-0 -translate-x-1/2 -translate-y-1/2"
              style={{
                boxShadow:
                  '0 0 24px rgba(34, 211, 238, 0.95), inset 0 0 12px rgba(34, 211, 238, 0.45)',
              }}
            >
              <div className="absolute inset-0 rounded-full bg-[#22D3EE]/25 blur-sm pointer-events-none" />
            </div>
          </div>

          {/* B. Coral Glowing Ring — 100% Perfect Round Circle, True 3D Front & Back Orbit */}
          <div
            className={`absolute w-0 h-0 anim-orbit-coral pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isScrolled ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
            }`}
          >
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full aspect-square border-[2.5px] border-[#FF5A5F] relative shrink-0 -translate-x-1/2 -translate-y-1/2"
              style={{
                boxShadow:
                  '0 0 22px rgba(255, 90, 95, 0.95), inset 0 0 10px rgba(255, 90, 95, 0.45)',
              }}
            >
              <div className="absolute inset-0 rounded-full bg-[#FF5A5F]/25 blur-sm pointer-events-none" />
            </div>
          </div>

          {/* C. Solid Vibrant Cyan Dot / Orb — 100% Perfect Round Circle, Fast 3D Satellite Orbit */}
          <div
            className={`absolute w-0 h-0 anim-orbit-dot pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isScrolled ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
            }`}
          >
            <div
              className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 rounded-full aspect-square bg-[#00E5FF] relative shrink-0 -translate-x-1/2 -translate-y-1/2"
              style={{
                boxShadow: '0 0 26px rgba(0, 229, 255, 1), 0 0 50px rgba(0, 229, 255, 0.75)',
              }}
            >
              <div className="absolute -inset-1 rounded-full bg-[#00E5FF]/45 blur-sm pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 2. Ar-jay's Cutout Portrait (Foreground layer at z-20; front 3D orbit sweeps across suit at z-30, back orbit passes behind at z-10) */}
        <div className="relative z-20 flex items-center justify-center pointer-events-auto">
          {children}
        </div>

        {/* 3. Global Playful Display Margin Floating Shapes — Portaled directly into document.body so they stay fixed ALL ALONG the entire website down to the footer! */}
        {mounted &&
          createPortal(
            <div
              aria-hidden="true"
              className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
            >
              {/* Ball 1: Perfect Cyan Circular Ring — Smooth Traveling Transition from Center Ar-jay to Left Open Margin */}
              <div
                className="absolute transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto cursor-pointer group"
                style={
                  isScrolled
                    ? {
                        left: 'clamp(12px, 3.5vw, 48px)',
                        top: '38%',
                        transform: 'translate(0, -50%) scale(1)',
                        opacity: 0.92,
                      }
                    : {
                        left: '50%',
                        top: '44%',
                        transform: 'translate(-50%, -50%) scale(0.3)',
                        opacity: 0,
                        pointerEvents: 'none',
                      }
                }
                title="Playful Cyan Halo"
              >
                <div className="anim-playful-bob-1">
                  <div
                    className="w-9 h-9 sm:w-11 sm:h-11 lg:w-14 lg:h-14 rounded-full aspect-square border-[2.5px] border-[#22D3EE] group-hover:scale-125 transition-transform duration-300 relative shrink-0"
                    style={{
                      boxShadow:
                        '0 0 22px rgba(34, 211, 238, 0.9), inset 0 0 10px rgba(34, 211, 238, 0.4)',
                    }}
                  >
                    <div className="absolute inset-0 rounded-full bg-[#22D3EE]/20 blur-sm pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Ball 2: Perfect Coral Circular Ring — Smooth Traveling Transition from Center Ar-jay to Right Open Margin */}
              <div
                className="absolute transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto cursor-pointer group"
                style={
                  isScrolled
                    ? {
                        right: 'clamp(12px, 3.5vw, 48px)',
                        top: '64%',
                        transform: 'translate(0, -50%) scale(1)',
                        opacity: 0.92,
                      }
                    : {
                        right: '50%',
                        top: '44%',
                        transform: 'translate(50%, -50%) scale(0.3)',
                        opacity: 0,
                        pointerEvents: 'none',
                      }
                }
                title="Playful Coral Halo"
              >
                <div className="anim-playful-bob-2">
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full aspect-square border-[2.5px] border-[#FF5A5F] group-hover:scale-125 transition-transform duration-300 relative shrink-0"
                    style={{
                      boxShadow:
                        '0 0 20px rgba(255, 90, 95, 0.95), inset 0 0 9px rgba(255, 90, 95, 0.4)',
                    }}
                  >
                    <div className="absolute inset-0 rounded-full bg-[#FF5A5F]/20 blur-sm pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Ball 3: Perfect Cyan Circular Dot — Smooth Traveling Transition from Center Ar-jay to Upper-Right Open Margin */}
              <div
                className="absolute transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto cursor-pointer group"
                style={
                  isScrolled
                    ? {
                        right: 'clamp(20px, 5vw, 68px)',
                        top: '20%',
                        transform: 'translate(0, -50%) scale(1)',
                        opacity: 0.98,
                      }
                    : {
                        right: '50%',
                        top: '44%',
                        transform: 'translate(50%, -50%) scale(0.3)',
                        opacity: 0,
                        pointerEvents: 'none',
                      }
                }
                title="Playful Cyan Orb"
              >
                <div className="anim-playful-bob-3">
                  <div
                    className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-full aspect-square bg-[#00E5FF] group-hover:scale-150 transition-transform duration-300 relative shrink-0"
                    style={{
                      boxShadow:
                        '0 0 26px rgba(0, 229, 255, 1), 0 0 50px rgba(0, 229, 255, 0.75)',
                    }}
                  >
                    <div className="absolute -inset-1 rounded-full bg-[#00E5FF]/40 blur-sm pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}
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
