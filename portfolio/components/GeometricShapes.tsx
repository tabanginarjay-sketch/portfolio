'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface GeometricShapesProps {
  children?: React.ReactNode;
  className?: string;
}

export default function GeometricShapes({ children, className = '' }: GeometricShapesProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFastScrolled, setIsFastScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          // Trigger breakaway immediately as soon as user scrolls past header (~40px)
          setIsScrolled(y > 40);
          // If user scrolled deeply past hero (> 240px), skip transition lag
          setIsFastScrolled(y > 240);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', checkMobile, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // When wrapping Ar-jay's portrait:
  if (children) {
    // Starting coordinates corresponding to Ar-jay's portrait position
    const startLeft = isMobile ? '72%' : '50%';
    const startTop = isMobile ? '24%' : '44%';

    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        {/* 1. Hero 3D Continuous Orbital Halo System (Shapes pass in FRONT at z-30 across suit and BEHIND at z-10) */}
        <div className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 pointer-events-none">
          {/* A. Hero Cyan Glowing Ring — Rapid 220ms breakaway dissolve */}
          <div
            className={`absolute w-0 h-0 anim-orbit-cyan pointer-events-none transition-all duration-220 ease-out ${
              isScrolled ? 'opacity-0 scale-115 pointer-events-none' : 'opacity-100 scale-100'
            }`}
            style={{
              transitionDelay: isScrolled ? '0ms' : '80ms',
            }}
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

          {/* B. Hero Coral Glowing Ring — Rapid breakaway dissolve at 50ms delay */}
          <div
            className={`absolute w-0 h-0 anim-orbit-coral pointer-events-none transition-all duration-220 ease-out ${
              isScrolled ? 'opacity-0 scale-115 pointer-events-none' : 'opacity-100 scale-100'
            }`}
            style={{
              transitionDelay: isScrolled ? '50ms' : '40ms',
            }}
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

          {/* C. Hero Solid Vibrant Cyan Dot — Rapid breakaway dissolve at 100ms delay */}
          <div
            className={`absolute w-0 h-0 anim-orbit-dot pointer-events-none transition-all duration-220 ease-out ${
              isScrolled ? 'opacity-0 scale-115 pointer-events-none' : 'opacity-100 scale-100'
            }`}
            style={{
              transitionDelay: isScrolled ? '100ms' : '0ms',
            }}
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

        {/* 2. Ar-jay's Cutout Portrait (Foreground layer at z-20) */}
        <div className="relative z-20 flex items-center justify-center pointer-events-auto">
          {children}
        </div>

        {/* 3. Global Playful Display Margin Floating Shapes — Portaled directly into document.body at z-40 so they stay visible ALL ALONG down to the footer! */}
        {mounted &&
          createPortal(
            <div
              aria-hidden="true"
              className="fixed inset-0 pointer-events-none z-40"
            >
              {/* Ball 1: Perfect Cyan Circular Ring — Leaves first (0ms delay) to Left Margin */}
              <div
                className="absolute pointer-events-auto cursor-pointer group"
                style={{
                  transition: isFastScrolled
                    ? 'opacity 180ms ease-out'
                    : 'all 320ms cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: isScrolled ? '0ms' : '80ms',
                  ...(isScrolled
                    ? {
                        left: isMobile ? '4px' : 'clamp(16px, 3.5vw, 48px)',
                        top: isMobile ? '32%' : '38%',
                        transform: 'translate(0, -50%) scale(1)',
                        opacity: 0.95,
                      }
                    : {
                        left: startLeft,
                        top: startTop,
                        transform: 'translate(-50%, -50%) scale(0.6)',
                        opacity: 0,
                        pointerEvents: 'none',
                      }),
                }}
                title="Playful Cyan Halo"
              >
                <div className="anim-playful-bob-1">
                  <div
                    className="w-5 h-5 sm:w-11 sm:h-11 lg:w-14 lg:h-14 rounded-full aspect-square border-[2px] sm:border-[2.5px] border-[#22D3EE] group-hover:scale-125 transition-transform duration-300 relative shrink-0"
                    style={{
                      boxShadow:
                        '0 0 18px rgba(34, 211, 238, 0.95), 0 0 35px rgba(34, 211, 238, 0.4), inset 0 0 8px rgba(34, 211, 238, 0.4)',
                    }}
                  >
                    <div className="absolute inset-0 rounded-full bg-[#22D3EE]/25 blur-sm pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Ball 2: Perfect Coral Circular Ring — Leaves second (50ms delay) to Right Margin */}
              <div
                className="absolute pointer-events-auto cursor-pointer group"
                style={{
                  transition: isFastScrolled
                    ? 'opacity 180ms ease-out'
                    : 'all 320ms cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: isScrolled ? '50ms' : '40ms',
                  ...(isScrolled
                    ? {
                        right: isMobile ? '4px' : 'clamp(16px, 3.5vw, 48px)',
                        top: isMobile ? '74%' : '64%',
                        transform: 'translate(0, -50%) scale(1)',
                        opacity: 0.95,
                      }
                    : {
                        right: isMobile ? 'calc(100% - 72%)' : '50%',
                        top: startTop,
                        transform: 'translate(50%, -50%) scale(0.6)',
                        opacity: 0,
                        pointerEvents: 'none',
                      }),
                }}
                title="Playful Coral Halo"
              >
                <div className="anim-playful-bob-2">
                  <div
                    className="w-4.5 h-4.5 sm:w-9 sm:h-9 lg:w-12 lg:h-12 rounded-full aspect-square border-[2px] sm:border-[2.5px] border-[#FF5A5F] group-hover:scale-125 transition-transform duration-300 relative shrink-0"
                    style={{
                      boxShadow:
                        '0 0 16px rgba(255, 90, 95, 0.95), 0 0 30px rgba(255, 90, 95, 0.4), inset 0 0 7px rgba(255, 90, 95, 0.4)',
                    }}
                  >
                    <div className="absolute inset-0 rounded-full bg-[#FF5A5F]/25 blur-sm pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Ball 3: Perfect Cyan Circular Dot — Leaves third (100ms delay) to Upper-Right Margin */}
              <div
                className="absolute pointer-events-auto cursor-pointer group"
                style={{
                  transition: isFastScrolled
                    ? 'opacity 180ms ease-out'
                    : 'all 320ms cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: isScrolled ? '100ms' : '0ms',
                  ...(isScrolled
                    ? {
                        right: isMobile ? '6px' : 'clamp(20px, 4.5vw, 64px)',
                        top: isMobile ? '12%' : '20%',
                        transform: 'translate(0, -50%) scale(1)',
                        opacity: 1,
                      }
                    : {
                        right: isMobile ? 'calc(100% - 72%)' : '50%',
                        top: startTop,
                        transform: 'translate(50%, -50%) scale(0.6)',
                        opacity: 0,
                        pointerEvents: 'none',
                      }),
                }}
                title="Playful Cyan Orb"
              >
                <div className="anim-playful-bob-3">
                  <div
                    className="w-3.5 h-3.5 sm:w-5.5 sm:h-5.5 lg:w-7 lg:h-7 rounded-full aspect-square bg-[#00E5FF] group-hover:scale-150 transition-transform duration-300 relative shrink-0"
                    style={{
                      boxShadow:
                        '0 0 18px rgba(0, 229, 255, 1), 0 0 35px rgba(0, 229, 255, 0.75)',
                    }}
                  >
                    <div className="absolute -inset-1 rounded-full bg-[#00E5FF]/45 blur-sm pointer-events-none" />
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
