'use client';

import React, { useEffect, useRef } from 'react';

interface SmokeRibbon {
  imgIndex: number; // 0 for tendril-1, 1 for tendril-2
  x: number;
  y: number;
  vx: number;
  width: number;
  height: number;
  alpha: number;
  waveSpeed: number;
  waveAmp: number;
  phase: number;
  tint?: string;
  mouseSens: number;
}

export default function SmokeAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth || 1200);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight || 800);

    const updateDimensions = () => {
      if (!canvas || !canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const newW = Math.max(rect.width, window.innerWidth || 800);
      const newH = Math.max(rect.height, 600);
      if (canvas.width !== newW || canvas.height !== newH) {
        width = canvas.width = newW;
        height = canvas.height = newH;
      }
    };

    updateDimensions();

    // Mouse coordinates for dynamic smoke reaction
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', updateDimensions);

    // Preload both authentic smoke plumes
    const img1 = new Image();
    const img2 = new Image();
    img1.src = '/images/smoke-tendril-1.png';
    img2.src = '/images/smoke-tendril-2.png';

    const images = [img1, img2];

    // Configure 5 multi-layered, curling ribbon smoke plumes
    const ribbons: SmokeRibbon[] = [
      {
        imgIndex: 0,
        x: width * 0.12,
        y: height * 0.45,
        vx: 0.25,
        width: 1050,
        height: 600,
        alpha: 0.18,
        waveSpeed: 0.007,
        waveAmp: 25,
        phase: 0,
        mouseSens: 0.02,
      },
      {
        imgIndex: 1,
        x: width * 0.88,
        y: height * 0.38,
        vx: -0.22,
        width: 1100,
        height: 620,
        alpha: 0.16,
        waveSpeed: 0.006,
        waveAmp: 30,
        phase: Math.PI * 0.7,
        mouseSens: -0.025,
      },
      {
        imgIndex: 0,
        x: width * 0.2,
        y: height * 0.65,
        vx: 0.18,
        width: 950,
        height: 520,
        alpha: 0.14,
        waveSpeed: 0.005,
        waveAmp: 20,
        phase: Math.PI * 1.3,
        mouseSens: 0.015,
      },
      {
        imgIndex: 1,
        x: width * 0.82,
        y: height * 0.7,
        vx: -0.2,
        width: 980,
        height: 540,
        alpha: 0.15,
        waveSpeed: 0.008,
        waveAmp: 22,
        phase: Math.PI * 0.4,
        mouseSens: -0.02,
      },
    ];

    let time = 0;

    const render = () => {
      time += 0.01;

      // Smooth mouse easing
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Use screen blend mode so the smoke ribbons glow softly like ethereal light
      ctx.globalCompositeOperation = 'screen';

      for (let i = 0; i < ribbons.length; i++) {
        const r = ribbons[i];
        const img = images[r.imgIndex];

        if (!img.complete) continue;

        // Advance horizontal drift and sinusoidal wave motion
        r.x += r.vx;
        r.phase += r.waveSpeed;

        // Wrap around seamlessly
        const halfW = r.width * 0.6;
        if (r.vx > 0 && r.x > width + halfW) {
          r.x = -halfW;
        } else if (r.vx < 0 && r.x < -halfW) {
          r.x = width + halfW;
        }

        // Sinusoidal curling undulation
        const waveY = Math.sin(r.phase) * r.waveAmp;
        const waveX = Math.cos(r.phase * 0.7) * (r.waveAmp * 0.5);

        // Mouse displacement
        const dx = (mouseX - width / 2) * r.mouseSens;
        const dy = (mouseY - height / 2) * r.mouseSens;

        const posX = r.x + waveX + dx;
        const posY = r.y + waveY + dy;

        // Breathing alpha pulse
        const pulseAlpha = r.alpha * (0.85 + 0.15 * Math.sin(time * 1.5 + r.phase));

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, pulseAlpha));
        ctx.translate(posX, posY);

        // Subtle organic rotation
        const rot = Math.sin(r.phase * 0.5) * 0.05;
        ctx.rotate(rot);

        ctx.drawImage(img, -r.width / 2, -r.height / 2, r.width, r.height);
        ctx.restore();
      }

      // Gently soften smoke right behind Ar-jay's head/face so details stay crisp,
      // while allowing silky ribbons to drift seamlessly behind shoulders & lower mist (ZERO hard box!)
      const clearX = width * 0.5;
      const clearY = height * 0.34;
      const clearRadius = Math.min(width * 0.30, 340);

      ctx.globalCompositeOperation = 'destination-out';
      const clearGrad = ctx.createRadialGradient(
        clearX,
        clearY,
        clearRadius * 0.12,
        clearX,
        clearY,
        clearRadius
      );
      clearGrad.addColorStop(0, 'rgba(0, 0, 0, 0.68)');
      clearGrad.addColorStop(0.55, 'rgba(0, 0, 0, 0.35)');
      clearGrad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');

      ctx.fillStyle = clearGrad;
      ctx.beginPath();
      ctx.arc(clearX, clearY, clearRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = 'source-over';
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-90 transition-opacity duration-700"
      />
      {/* Seamless 4-edge vignette fade into pure black canvas */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent pointer-events-none" />
    </div>
  );
}
