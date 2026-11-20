'use client';

import React, { useEffect, useRef } from 'react';

interface SmokeRibbon {
  imgIndex: number;
  x: number;
  y: number;
  vx: number;
  width: number;
  height: number;
  alpha: number;
  waveSpeed: number;
  waveAmp: number;
  phase: number;
  mouseSens: number;
}

export default function SmokeAtmosphere() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Render soft smoke at 0.5x internal resolution (4x less GPU/CPU fill-rate, identical silky look!)
    const SCALE = 0.5;
    let width = 640;
    let height = 400;
    let clearGrad: CanvasGradient | null = null;
    let clearX = 320;
    let clearY = 140;
    let clearRadius = 160;

    const rebuildMaskGradient = () => {
      const isMobile = (wrapper.clientWidth || window.innerWidth) < 1024;
      clearX = width * 0.5;
      clearY = isMobile ? Math.min(height * 0.16, 175 * SCALE) : height * 0.34;
      clearRadius = isMobile
        ? Math.min(width * 0.45, 180 * SCALE)
        : Math.min(width * 0.28, 300 * SCALE);

      // Very gentle, subtle attenuation so smoke continuously wraps around portrait with zero harsh voids
      clearGrad = ctx.createRadialGradient(
        clearX,
        clearY,
        clearRadius * 0.1,
        clearX,
        clearY,
        clearRadius
      );
      clearGrad.addColorStop(0, 'rgba(0, 0, 0, 0.25)');
      clearGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.10)');
      clearGrad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
    };

    const updateDimensions = () => {
      const cssW = Math.max(wrapper.clientWidth || window.innerWidth || 800, 320);
      const cssH = Math.max(wrapper.clientHeight || 600, 480);
      const newW = Math.round(cssW * SCALE);
      const newH = Math.round(cssH * SCALE);
      if (canvas.width !== newW || canvas.height !== newH) {
        width = canvas.width = newW;
        height = canvas.height = newH;
        rebuildMaskGradient();
      }
    };

    updateDimensions();

    // Normalized mouse coordinates (-1..1) — ZERO getBoundingClientRect() layout thrashing on mousemove!
    let normMouseX = 0;
    let normMouseY = 0;
    let targetNormX = 0;
    let targetNormY = 0;
    let isVisible = true;
    let isPageHidden = document.hidden;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible || isPageHidden) return;
      targetNormX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetNormY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const img1 = new Image();
    const img2 = new Image();
    img1.decoding = 'async';
    img2.decoding = 'async';
    img1.src = '/images/smoke-tendril-1.png';
    img2.src = '/images/smoke-tendril-2.png';
    const images = [img1, img2];

    // 10 staggered, multi-layered ribbons distributed across the entire canvas
    // Perfectly continuous: Zero blank intervals, zero disappearing phases, continuous silky flow
    const ribbons: SmokeRibbon[] = [
      {
        imgIndex: 0,
        x: width * 0.05,
        y: height * 0.35,
        vx: 0.18,
        width: 580,
        height: 320,
        alpha: 0.22,
        waveSpeed: 0.007,
        waveAmp: 14,
        phase: 0.0,
        mouseSens: 12,
      },
      {
        imgIndex: 1,
        x: width * 0.30,
        y: height * 0.42,
        vx: -0.16,
        width: 620,
        height: 340,
        alpha: 0.20,
        waveSpeed: 0.006,
        waveAmp: 16,
        phase: 1.1,
        mouseSens: -14,
      },
      {
        imgIndex: 0,
        x: width * 0.55,
        y: height * 0.50,
        vx: 0.15,
        width: 600,
        height: 330,
        alpha: 0.24,
        waveSpeed: 0.008,
        waveAmp: 12,
        phase: 2.3,
        mouseSens: 10,
      },
      {
        imgIndex: 1,
        x: width * 0.80,
        y: height * 0.38,
        vx: -0.17,
        width: 640,
        height: 350,
        alpha: 0.22,
        waveSpeed: 0.005,
        waveAmp: 18,
        phase: 3.5,
        mouseSens: -15,
      },
      {
        imgIndex: 0,
        x: width * 0.15,
        y: height * 0.65,
        vx: -0.14,
        width: 560,
        height: 310,
        alpha: 0.20,
        waveSpeed: 0.007,
        waveAmp: 15,
        phase: 4.2,
        mouseSens: -11,
      },
      {
        imgIndex: 1,
        x: width * 0.40,
        y: height * 0.68,
        vx: 0.16,
        width: 610,
        height: 330,
        alpha: 0.22,
        waveSpeed: 0.006,
        waveAmp: 13,
        phase: 5.1,
        mouseSens: 11,
      },
      {
        imgIndex: 0,
        x: width * 0.70,
        y: height * 0.72,
        vx: -0.15,
        width: 590,
        height: 320,
        alpha: 0.21,
        waveSpeed: 0.008,
        waveAmp: 17,
        phase: 0.8,
        mouseSens: -13,
      },
      {
        imgIndex: 1,
        x: width * 0.95,
        y: height * 0.58,
        vx: 0.13,
        width: 630,
        height: 340,
        alpha: 0.23,
        waveSpeed: 0.005,
        waveAmp: 14,
        phase: 2.9,
        mouseSens: 9,
      },
      {
        imgIndex: 0,
        x: width * 0.50,
        y: height * 0.28,
        vx: 0.12,
        width: 680,
        height: 360,
        alpha: 0.19,
        waveSpeed: 0.006,
        waveAmp: 15,
        phase: 1.8,
        mouseSens: 8,
      },
      {
        imgIndex: 1,
        x: width * 0.25,
        y: height * 0.55,
        vx: -0.13,
        width: 650,
        height: 350,
        alpha: 0.21,
        waveSpeed: 0.007,
        waveAmp: 16,
        phase: 4.7,
        mouseSens: -10,
      },
    ];

    let animationFrameId: number | null = null;
    let time = 0;
    let lastFrameTime = 0;
    const TARGET_FRAME_MS = 30; // ~33fps silky ambient smoke — frees 50%+ GPU during scroll & hover

    const render = (now: number) => {
      if (!isVisible || isPageHidden) {
        animationFrameId = null;
        return;
      }

      animationFrameId = requestAnimationFrame(render);

      const elapsed = now - lastFrameTime;
      if (lastFrameTime !== 0 && elapsed < TARGET_FRAME_MS) {
        return;
      }
      const stepScale = lastFrameTime === 0 ? 1 : Math.min(elapsed / 16.67, 3);
      lastFrameTime = now;

      time += 0.01 * stepScale;

      // Smooth mouse easing
      const ease = Math.min(1, 0.06 * stepScale);
      normMouseX += (targetNormX - normMouseX) * ease;
      normMouseY += (targetNormY - normMouseY) * ease;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'screen';

      for (let i = 0; i < ribbons.length; i++) {
        const r = ribbons[i];
        const img = images[r.imgIndex];
        if (!img.complete || img.naturalWidth === 0) continue;

        r.x += r.vx * stepScale;
        r.phase += r.waveSpeed * stepScale;

        // Seamless zero-deadzone toroidal wrapping: continuous flow without vanishing intervals
        const span = width + r.width;
        if (r.vx > 0 && r.x > width + r.width * 0.5) {
          r.x -= span;
        } else if (r.vx < 0 && r.x < -r.width * 0.5) {
          r.x += span;
        }

        const waveY = Math.sin(r.phase) * r.waveAmp;
        const waveX = Math.cos(r.phase * 0.7) * (r.waveAmp * 0.5);
        const posX = r.x + waveX + normMouseX * r.mouseSens;
        const posY = r.y + waveY + normMouseY * r.mouseSens;
        const pulseAlpha = r.alpha * (0.90 + 0.10 * Math.sin(time * 1.2 + r.phase));

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, pulseAlpha));
        ctx.translate(posX, posY);
        ctx.rotate(Math.sin(r.phase * 0.5) * 0.05);
        ctx.drawImage(img, -r.width / 2, -r.height / 2, r.width, r.height);
        ctx.restore();
      }

      if (clearGrad) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = clearGrad;
        ctx.beginPath();
        ctx.arc(clearX, clearY, clearRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
    };

    const startLoop = () => {
      if (isVisible && !isPageHidden && animationFrameId === null) {
        lastFrameTime = 0;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const stopLoop = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    // Pause smoke loop completely when Hero scrolls out of view (0% CPU/GPU while scrolling down!)
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? false;
        if (isVisible) startLoop();
        else stopLoop();
      },
      { threshold: 0 }
    );
    observer.observe(wrapper);

    const handleVisibilityChange = () => {
      isPageHidden = document.hidden;
      if (isPageHidden) stopLoop();
      else startLoop();
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateDimensions, 150);
    };

    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (!isCoarsePointer) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    startLoop();

    return () => {
      stopLoop();
      observer.disconnect();
      clearTimeout(resizeTimer);
      if (!isCoarsePointer) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-10 select-none smoke-atmosphere-container"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-90 smoke-canvas"
      />
      {/* Subtle, delicate tint applied exclusively to the drifting smoke tendrils (background remains pure black) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none mix-blend-color opacity-25 bg-gradient-to-r from-[#22D3EE]/70 via-transparent to-[#FF5A5F]/70 smoke-tint"
      />
      {/* Seamless 4-edge vignette fade into pure black canvas */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black to-transparent pointer-events-none smoke-vignette-top" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none smoke-vignette-bottom" />
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent pointer-events-none smoke-vignette-left" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent pointer-events-none smoke-vignette-right" />
    </div>
  );
}
