'use client';

import React, { useState, useEffect } from 'react';

export default function GeometricShapes() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse offset from screen center (-1 to 1)
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    // Smooth lerp easing for mouse parallax
    const animate = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      setMousePos({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className="relative h-24 w-52 mb-3 select-none cursor-pointer group"
      title="Dynamic Animated Floating Shapes"
    >
      <style jsx>{`
        @keyframes floatCyanRing {
          0% {
            transform: translate3d(0px, 0px, 0px) rotate(0deg) scale(1);
          }
          20% {
            transform: translate3d(-16px, 10px, 0px) rotate(-8deg) scale(1.04);
          }
          45% {
            transform: translate3d(14px, -12px, 0px) rotate(6deg) scale(0.96);
          }
          70% {
            transform: translate3d(-10px, -14px, 0px) rotate(-5deg) scale(1.02);
          }
          88% {
            transform: translate3d(10px, 6px, 0px) rotate(4deg) scale(0.98);
          }
          100% {
            transform: translate3d(0px, 0px, 0px) rotate(0deg) scale(1);
          }
        }

        @keyframes floatCoralRing {
          0% {
            transform: translate3d(0px, 0px, 0px) scale(1) rotate(0deg);
          }
          25% {
            transform: translate3d(18px, -14px, 0px) scale(1.12) rotate(14deg);
          }
          50% {
            transform: translate3d(-14px, 14px, 0px) scale(0.9) rotate(-10deg);
          }
          75% {
            transform: translate3d(12px, 8px, 0px) scale(1.06) rotate(8deg);
          }
          100% {
            transform: translate3d(0px, 0px, 0px) scale(1) rotate(0deg);
          }
        }

        @keyframes floatCyanDot {
          0% {
            transform: translate3d(0px, 0px, 0px) scale(1);
          }
          18% {
            transform: translate3d(-20px, -18px, 0px) scale(1.22);
          }
          42% {
            transform: translate3d(18px, -12px, 0px) scale(0.86);
          }
          65% {
            transform: translate3d(-12px, 18px, 0px) scale(1.16);
          }
          82% {
            transform: translate3d(16px, 10px, 0px) scale(0.92);
          }
          100% {
            transform: translate3d(0px, 0px, 0px) scale(1);
          }
        }

        @keyframes pulseGlowCyan {
          0%, 100% {
            box-shadow: 0 0 16px rgba(34, 211, 238, 0.45), inset 0 0 10px rgba(34, 211, 238, 0.25);
            filter: drop-shadow(0 0 10px rgba(34, 211, 238, 0.6));
          }
          50% {
            box-shadow: 0 0 30px rgba(34, 211, 238, 0.85), inset 0 0 18px rgba(34, 211, 238, 0.45);
            filter: drop-shadow(0 0 18px rgba(34, 211, 238, 0.95));
          }
        }

        @keyframes pulseGlowCoral {
          0%, 100% {
            box-shadow: 0 0 14px rgba(255, 90, 95, 0.45), inset 0 0 8px rgba(255, 90, 95, 0.25);
            filter: drop-shadow(0 0 10px rgba(255, 90, 95, 0.55));
          }
          50% {
            box-shadow: 0 0 28px rgba(255, 90, 95, 0.9), inset 0 0 16px rgba(255, 90, 95, 0.5);
            filter: drop-shadow(0 0 16px rgba(255, 90, 95, 0.95));
          }
        }

        @keyframes pulseGlowDot {
          0%, 100% {
            box-shadow: 0 0 20px rgba(0, 229, 255, 0.85), 0 0 38px rgba(0, 229, 255, 0.45);
            filter: drop-shadow(0 0 8px rgba(0, 229, 255, 0.8));
          }
          50% {
            box-shadow: 0 0 36px rgba(0, 229, 255, 1), 0 0 65px rgba(0, 229, 255, 0.75);
            filter: drop-shadow(0 0 14px rgba(0, 229, 255, 1));
          }
        }

        .anim-cyan-ring {
          animation: floatCyanRing 7.5s ease-in-out infinite, pulseGlowCyan 4.2s ease-in-out infinite;
          will-change: transform;
        }

        .anim-coral-ring {
          animation: floatCoralRing 5.8s ease-in-out infinite, pulseGlowCoral 3.8s ease-in-out infinite;
          will-change: transform;
        }

        .anim-cyan-dot {
          animation: floatCyanDot 4.6s ease-in-out infinite, pulseGlowDot 3s ease-in-out infinite;
          will-change: transform;
        }
      `}</style>

      {/* 1. Large Cyan Glowing Ring */}
      <div
        className="absolute top-1 right-24 w-16 h-16 pointer-events-none"
        style={{
          transform: `translate3d(${mousePos.x * 16}px, ${mousePos.y * 16}px, 0)`,
        }}
      >
        <div className="w-full h-full rounded-full border-[2.5px] border-[#22D3EE] anim-cyan-ring group-hover:scale-110 transition-transform duration-300" />
      </div>

      {/* 2. Coral Smaller Interlocking Ring */}
      <div
        className="absolute top-4 right-16 w-10 h-10 pointer-events-none"
        style={{
          transform: `translate3d(${mousePos.x * -20}px, ${mousePos.y * -20}px, 0)`,
        }}
      >
        <div className="w-full h-full rounded-full border-[2.5px] border-[#FF5A5F] anim-coral-ring group-hover:scale-115 transition-transform duration-300" />
      </div>

      {/* 3. Solid Vibrant Glowing Cyan Orb / Dot */}
      <div
        className="absolute top-12 right-6 w-7 h-7 pointer-events-none"
        style={{
          transform: `translate3d(${mousePos.x * 28}px, ${mousePos.y * 28}px, 0)`,
        }}
      >
        <div className="w-full h-full rounded-full bg-[#00E5FF] anim-cyan-dot group-hover:scale-125 transition-transform duration-300" />
      </div>
    </div>
  );
}
