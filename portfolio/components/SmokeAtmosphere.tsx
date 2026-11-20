'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  alpha: number;
  targetAlpha: number;
  life: number;
  maxLife: number;
  colorType: 'smoke' | 'coral' | 'cyan';
  swirlOffset: number;
}

export default function SmokeAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Mouse coordinates for gentle interaction
    let mouseX = width / 2;
    let mouseY = height / 2;
    let hasMouseMoved = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      hasMouseMoved = true;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle resize
    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate balanced smoke particles
    const PARTICLE_COUNT = 24;
    const particles: Particle[] = [];

    const createParticle = (spawnY?: number): Particle => {
      const colorRand = Math.random();
      let colorType: 'smoke' | 'coral' | 'cyan' = 'smoke';
      if (colorRand > 0.82) colorType = 'coral';
      else if (colorRand > 0.70) colorType = 'cyan';

      const maxAlpha =
        colorType === 'coral'
          ? 0.05 + Math.random() * 0.04
          : colorType === 'cyan'
          ? 0.04 + Math.random() * 0.03
          : 0.06 + Math.random() * 0.05;

      const baseRadius = 140 + Math.random() * 220;

      return {
        x: Math.random() * width,
        y: spawnY !== undefined ? spawnY : Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.2 - Math.random() * 0.35, // slow upward drift
        radius: baseRadius,
        baseRadius,
        alpha: 0,
        targetAlpha: maxAlpha,
        life: 0,
        maxLife: 350 + Math.random() * 450,
        colorType,
        swirlOffset: Math.random() * Math.PI * 2,
      };
    };

    // Initial distribution across height
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle(Math.random() * height));
    }

    let time = 0;

    const render = () => {
      time += 0.008;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;

        // Life cycle alpha fade in and fade out
        const progress = p.life / p.maxLife;
        if (progress < 0.25) {
          p.alpha = (progress / 0.25) * p.targetAlpha;
        } else if (progress > 0.7) {
          p.alpha = (1 - (progress - 0.7) / 0.3) * p.targetAlpha;
        } else {
          p.alpha = p.targetAlpha;
        }

        // Gentle sin wave wisp motion
        const wave = Math.sin(time + p.swirlOffset) * 0.4;
        p.x += p.vx + wave;
        p.y += p.vy;

        // Subtle expansion as smoke rises
        p.radius = p.baseRadius * (1 + progress * 0.4);

        // Gentle interactive mouse influence
        if (hasMouseMoved) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 320 && dist > 1) {
            const force = (1 - dist / 320) * 0.4;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        // Respawn when life expires or floats off top/sides
        if (p.life >= p.maxLife || p.y < -p.radius || p.x < -p.radius || p.x > width + p.radius) {
          particles[i] = createParticle(height + p.radius * 0.5);
          continue;
        }

        // Color definitions
        let r = 26, g = 28, b = 34; // deep charcoal smoke
        if (p.colorType === 'coral') {
          r = 255; g = 90; b = 95; // #FF5A5F
        } else if (p.colorType === 'cyan') {
          r = 0; g = 229; b = 255; // #00E5FF
        }

        // Draw soft radial volumetric smoke puff
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${p.alpha})`);
        grad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.6})`);
        grad.addColorStop(0.8, `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.2})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-90 transition-opacity duration-1000"
      />
      {/* Central vignette mask to guarantee face and core typography remain crisp and unclouded */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/60 pointer-events-none" />
    </div>
  );
}
