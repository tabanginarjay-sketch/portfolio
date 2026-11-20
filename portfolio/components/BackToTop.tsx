'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    // Show after scrolling past 350px
    setIsVisible(currentScrollY > 350);

    // Calculate scroll progress percentage (0 to 100)
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      const progress = Math.min(100, Math.max(0, (currentScrollY / docHeight) * 100));
      setScrollProgress(progress);
    }
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', onScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Circular progress calculations for SVG ring
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-8 scale-75 pointer-events-none'
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        className="group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-zinc-950/90 hover:bg-black border border-white/20 hover:border-[#FF5A5F]/80 text-white hover:text-[#FF5A5F] shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_0_24px_rgba(255,90,95,0.45)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer backdrop-blur-md back-to-top-btn"
        title="Back to Top"
      >
        {/* SVG Scroll Progress Circle */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
          viewBox="0 0 48 48"
        >
          {/* Background track circle */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            className="stroke-white/10 fill-none"
            strokeWidth="2.5"
          />
          {/* Animated active progress circle */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            className="stroke-[#FF5A5F] fill-none transition-all duration-150 ease-out"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Arrow Up Icon with smooth hover float animation */}
        <span className="relative z-10 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-1">
          <ArrowUp className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.5]" />
        </span>

        {/* Ambient Glow Aura on hover */}
        <span
          aria-hidden="true"
          className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#FF5A5F]/0 to-[#22D3EE]/0 group-hover:from-[#FF5A5F]/25 group-hover:to-[#22D3EE]/25 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 pointer-events-none"
        />
      </button>
    </div>
  );
}
