'use client';

import React, { useEffect, useRef } from 'react';

interface SmokePuff {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  rotation: number;
  rotationSpeed: number;
  swirlSpeed: number;
  seed: number;
  color: { r: number; g: number; b: number };
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

    // Mouse coordinates for interactive smoke disturbance
    let mouseX = width / 2;
    let mouseY = height / 2;
    let isMouseActive = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isMouseActive = true;
    };

    const handleMouseLeave = () => {
      isMouseActive = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', updateDimensions);

    // 44 dynamic smoke puffs for dense, silky, billowing atmosphere
    const PUFF_COUNT = 44;
    const puffs: SmokePuff[] = [];

    const createPuff = (spawnY?: number): SmokePuff => {
      const randColor = Math.random();
      // Silky silvery slate smoke by default, with occasional ambient coral and cyan mist
      let color = { r: 190, g: 205, b: 225 }; // Bright visible silver smoke
      let maxAlpha = 0.20 + Math.random() * 0.16; // 20% to 36% opacity (clearly visible!)

      if (randColor > 0.82) {
        // Soft glowing coral mist matching #FF5A5F
        color = { r: 255, g: 90, b: 95 };
        maxAlpha = 0.16 + Math.random() * 0.12;
      } else if (randColor > 0.68) {
        // Soft glowing cyan mist matching #22D3EE
        color = { r: 34, g: 211, b: 238 };
        maxAlpha = 0.15 + Math.random() * 0.12;
      }

      const baseRadius = 180 + Math.random() * 240; // 180px - 420px wide puffs

      return {
        x: Math.random() * width,
        y: spawnY !== undefined ? spawnY : Math.random() * (height + 120),
        vx: (Math.random() - 0.5) * 0.6, // lateral drift
        vy: -0.65 - Math.random() * 0.75, // clear, steady upward billowing
        baseRadius,
        radius: baseRadius,
        alpha: 0,
        maxAlpha,
        life: 0,
        maxLife: 320 + Math.random() * 380,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.005,
        swirlSpeed: 0.6 + Math.random() * 0.8,
        seed: Math.random() * 100,
        color,
      };
    };

    // Pre-populate particles across the hero height with staggered life
    for (let i = 0; i < PUFF_COUNT; i++) {
      const p = createPuff(Math.random() * height);
      p.life = Math.random() * p.maxLife * 0.85;
      puffs.push(p);
    }

    let time = 0;

    const render = () => {
      time += 0.012;
      ctx.clearRect(0, 0, width, height);

      // Use screen blend mode so overlapping puffs create dense, velvety volumetric clouds
      ctx.globalCompositeOperation = 'screen';

      for (let i = 0; i < puffs.length; i++) {
        const p = puffs[i];
        p.life++;

        // Life cycle: billows up softly, sustains, and gracefully diffuses
        const progress = p.life / p.maxLife;
        if (progress < 0.22) {
          p.alpha = (progress / 0.22) * p.maxAlpha;
        } else if (progress > 0.60) {
          p.alpha = (1 - (progress - 0.60) / 0.40) * p.maxAlpha;
        } else {
          p.alpha = p.maxAlpha;
        }

        // Natural swirling fluid harmonic motion
        const waveX = Math.sin(time * p.swirlSpeed + p.seed) * 1.1 + Math.cos(time * 0.6 + p.seed * 2) * 0.6;
        const waveY = Math.cos(time * p.swirlSpeed * 0.8 + p.seed) * 0.4;

        p.x += p.vx + waveX;
        p.y += p.vy + waveY;
        p.rotation += p.rotationSpeed;

        // Smoke billows and expands as it rises
        p.radius = p.baseRadius * (1 + progress * 0.8);

        // Interactive mouse curl
        if (isMouseActive) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 380;
          if (dist < maxDist && dist > 1) {
            const force = (1 - dist / maxDist) * 1.1;
            p.x += (dx / dist) * force * 1.8 - (dy / dist) * force * 0.9;
            p.y += (dy / dist) * force * 1.8 + (dx / dist) * force * 0.9;
          }
        }

        // Respawn when puffed off-screen or life expired
        if (p.life >= p.maxLife || p.y < -p.radius * 1.3 || p.x < -p.radius * 1.3 || p.x > width + p.radius * 1.3) {
          puffs[i] = createPuff(height + p.radius * 0.4);
          continue;
        }

        // Multi-stop soft radial puff
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        const { r, g, b } = p.color;

        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.95})`);
        grad.addColorStop(0.25, `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.65})`);
        grad.addColorStop(0.55, `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.28})`);
        grad.addColorStop(0.80, `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.08})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-100 transition-opacity duration-700"
      />
      {/* Top & bottom soft edge blend into solid page black */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
}
