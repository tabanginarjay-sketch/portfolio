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
        x: width * 0.1,
        y: height * 0.42,
        vx: 0.35, // slow, graceful left-to-right drift
        width: 1150,
        height: 640,
        alpha: 0.32,
        waveSpeed: 0.008,
        waveAmp: 30,
        phase: 0,
        mouseSens: 0.03,
      },
      {
        imgIndex: 1,
        x: width * 0.85,
        y: height * 0.35,
        vx: -0.28, // counter-drift right-to-left
        width: 1250,
        height: 680,
        alpha: 0.28,
        waveSpeed: 0.007,
        waveAmp: 35,
        phase: Math.PI * 0.7,
        mouseSens: -0.04,
      },
      {
        imgIndex: 0,
        x: width * 0.45,
        y: height * 0.58,
        vx: 0.22,
        width: 1350,
        height: 720,
        alpha: 0.25,
        waveSpeed: 0.006,
        waveAmp: 25,
        phase: Math.PI * 1.3,
        mouseSens: 0.025,
      },
      {
        imgIndex: 1,
        x: width * 0.25,
        y: height * 0.22,
        vx: -0.42,
        width: 950,
        height: 520,
        alpha: 0.22,
        waveSpeed: 0.011,
        waveAmp: 40,
        phase: Math.PI * 0.4,
        mouseSens: -0.05,
      },
      {
        imgIndex: 0,
        x: width * 0.7,
        y: height * 0.65,
        vx: 0.3,
        width: 1050,
        height: 580,
        alpha: 0.24,
        waveSpeed: 0.009,
        waveAmp: 32,
        phase: Math.PI * 1.8,
        mouseSens: 0.035,
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
        className="w-full h-full block opacity-95 transition-opacity duration-700"
      />
      {/* Top and bottom subtle fade into pure black canvas */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
}
