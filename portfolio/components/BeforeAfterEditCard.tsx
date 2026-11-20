'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export interface BeforeAfterEditCardProps {
  title: string;
  subject: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  editNotes: string;
  techniques: string[];
  delayOffsetMs?: number;
  priority?: boolean;
}

export default function BeforeAfterEditCard({
  title,
  subject,
  category,
  beforeImage,
  afterImage,
  editNotes,
  techniques,
  delayOffsetMs = 0,
  priority = false,
}: BeforeAfterEditCardProps) {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startXRef = useRef<number>(0);
  const startYRef = useRef<number>(0);
  const userInteractedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Only run auto-sweep animation when this card is actually on screen!
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setIsVisible(entries[0]?.isIntersecting ?? false);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Pause auto-sweep while user interacts, then smoothly resume after 6 seconds of inactivity
  const handleUserInteraction = useCallback(() => {
    setUserInteracted(true);
    if (userInteractedTimeoutRef.current) {
      clearTimeout(userInteractedTimeoutRef.current);
    }
    userInteractedTimeoutRef.current = setTimeout(() => {
      setUserInteracted(false);
    }, 6000);
  }, []);

  useEffect(() => {
    return () => {
      if (userInteractedTimeoutRef.current) {
        clearTimeout(userInteractedTimeoutRef.current);
      }
    };
  }, []);

  // Smooth GPU Auto-Sweep Transition (only runs while visible in viewport):
  // Glides Left to 4% (full After) -> Center 50% (1s rest) -> Glides Right to 96% (full Before) -> Center 50% (1s rest)
  useEffect(() => {
    if (!isVisible || userInteracted || isDragging) {
      return;
    }

    let isMounted = true;
    let timer: ReturnType<typeof setTimeout>;

    const steps = [
      { pos: 4, delay: 2000 },
      { pos: 50, delay: 2600 },
      { pos: 96, delay: 2000 },
      { pos: 50, delay: 2600 },
    ];

    let currentStep = 0;

    const runNextStep = () => {
      if (!isMounted) return;
      const step = steps[currentStep];
      setSliderPos(step.pos);
      currentStep = (currentStep + 1) % steps.length;
      timer = setTimeout(runNextStep, step.delay);
    };

    timer = setTimeout(runNextStep, 600 + delayOffsetMs);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isVisible, userInteracted, isDragging, delayOffsetMs]);

  const updateSliderFromClientX = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const raw = ((clientX - rect.left) / rect.width) * 100;
      const clamped = Math.max(4, Math.min(96, raw));
      setSliderPos(clamped);
      handleUserInteraction();
    },
    [handleUserInteraction]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    handleUserInteraction();

    if (e.pointerType === 'mouse') {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
      setIsDragging(true);
      updateSliderFromClientX(e.clientX);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' && !isDragging) {
      const dx = Math.abs(e.clientX - startXRef.current);
      const dy = Math.abs(e.clientY - startYRef.current);
      if (dx > 12 && dx > dy * 1.4) {
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {}
        setIsDragging(true);
        updateSliderFromClientX(e.clientX);
      }
      return;
    }

    if (!isDragging) return;
    updateSliderFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
    setIsDragging(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    handleUserInteraction();
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPos((prev) => Math.max(4, prev - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPos((prev) => Math.min(96, prev + 5));
    }
  };

  return (
    <div
      ref={cardRef}
      className="group h-full rounded-3xl overflow-hidden flex flex-col transition-colors duration-300 bg-zinc-950 text-white border border-zinc-800 hover:border-[#FF5A5F]/50 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.75)]"
    >
      {/* Interactive Before & After Split Viewport */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: 'pan-y' }}
        className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900 select-none cursor-ew-resize border-b border-zinc-800/80 touch-pan-y"
      >
        {/* Base Layer: AFTER Image */}
        <Image
          src={afterImage}
          alt={`${title} - After Edit`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover pointer-events-none"
          priority={priority}
        />

        {/* Top Clipped Layer: BEFORE Image (GPU-promoted clip-path) */}
        <div
          className={`absolute inset-0 overflow-hidden pointer-events-none will-change-[clip-path] ${
            isDragging
              ? ''
              : 'transition-[clip-path] duration-[1600ms] ease-[cubic-bezier(0.4,0,0.2,1)]'
          }`}
          style={{
            clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
            transform: 'translateZ(0)',
          }}
        >
          <Image
            src={beforeImage}
            alt={`${title} - Before Edit`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover pointer-events-none"
            priority={priority}
          />
        </div>

        {/* GPU-Composited Split Divider Line & Handle (uses translate3d instead of layout-thrashing left!) */}
        <div
          role="slider"
          tabIndex={0}
          aria-label={`Compare before and after edit for ${title}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(sliderPos)}
          onKeyDown={handleKeyDown}
          className={`absolute inset-0 z-10 pointer-events-none will-change-transform ${
            isDragging
              ? ''
              : 'transition-transform duration-[1600ms] ease-[cubic-bezier(0.4,0,0.2,1)]'
          }`}
          style={{ transform: `translate3d(${sliderPos}%, 0, 0)` }}
        >
          <div className="absolute inset-y-0 left-0 w-[2px] -translate-x-1/2 bg-white shadow-[0_0_14px_rgba(255,255,255,0.8)]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/95 border border-black/15 text-zinc-900 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
              <svg
                className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-zinc-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.4}
                  d="M8 9l-3 3 3 3m8-6l3 3-3 3"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Animated Sliding Toggle Pill: BEFORE <-> AFTER */}
        <div className="absolute top-2.5 sm:top-3.5 left-2.5 sm:left-3.5 z-20 flex items-center p-0.5 sm:p-1 rounded-full bg-black/85 border border-white/20 shadow-md select-none">
          <div className="relative flex items-center">
            <div
              className={`absolute top-0 bottom-0 left-0 w-13 sm:w-16 rounded-full bg-white shadow-xs transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-none ${
                sliderPos >= 50 ? 'translate-x-0' : 'translate-x-full'
              }`}
            />

            <button
              type="button"
              onClick={() => {
                setSliderPos(96);
                handleUserInteraction();
              }}
              className={`relative z-10 w-13 sm:w-16 py-0.5 sm:py-1 text-center text-[9px] sm:text-[10.5px] font-black uppercase tracking-wider transition-colors duration-300 cursor-pointer ${
                sliderPos >= 50 ? 'text-zinc-950' : 'text-zinc-300 hover:text-white'
              }`}
            >
              Before
            </button>

            <button
              type="button"
              onClick={() => {
                setSliderPos(4);
                handleUserInteraction();
              }}
              className={`relative z-10 w-13 sm:w-16 py-0.5 sm:py-1 text-center text-[9px] sm:text-[10.5px] font-black uppercase tracking-wider transition-colors duration-300 cursor-pointer ${
                sliderPos < 50 ? 'text-zinc-950' : 'text-zinc-300 hover:text-white'
              }`}
            >
              After
            </button>
          </div>
        </div>

        {/* Category Badge */}
        <span className="absolute top-2.5 sm:top-3.5 right-2.5 sm:right-3.5 z-20 rounded-full bg-black/85 border border-zinc-700/80 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[#FF5A5F] shadow-xs">
          {category}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">
              {subject}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-mono font-semibold tracking-wider uppercase bg-rose-500/10 text-[#FF5A5F] border border-rose-500/20 shrink-0">
              <Sparkles className="w-2.5 h-2.5" />
              Retouch Sample
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-[#FF5A5F] transition-colors leading-snug">
            {title}
          </h3>

          <div className="rounded-2xl p-3.5 bg-white/[0.025] border border-zinc-800/80 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-300">
                Edit &amp; Restoration Notes
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">{editNotes}</p>
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {techniques.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-0.5 rounded-lg bg-zinc-900 text-[11px] font-medium text-zinc-300 border border-zinc-800"
              >
                {tech}
              </span>
            ))}
          </div>
          <span className="text-[10px] font-mono text-zinc-500 shrink-0">
            Drag or tap toggle
          </span>
        </div>
      </div>
    </div>
  );
}
