import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  History,
  MoveHorizontal,
  Play,
  Pause,
} from "lucide-react";

interface Milestone {
  year: number;
  label: string;
  desc: string;
}

const MILESTONES: Milestone[] = [
  { year: 1947, label: "Independence & Manual Era", desc: "Paper basta records, physical gazettes & registry ledgers" },
  { year: 1965, label: "National Archival System", desc: "Centralized physical documentation & manual ID passes" },
  { year: 1973, label: "Constitutional Citizen Registry", desc: "Introduction of national identity card act & paper CNIC" },
  { year: 1990, label: "Early Computerized Registries", desc: "Electromechanical database records & automated ledgers" },
  { year: 2000, label: "Establishment of NADRA", desc: "Digital national database & automated biometric identity" },
  { year: 2010, label: "Smart National Identity Cards", desc: "Microchip-embedded smart CNIC & multi-factor verification" },
  { year: 2026, label: "Citizen Cloud & AI Vault", desc: "AES-256 cloud vaults, Pak-ID app & paperless public services" },
];

function getClosestMilestone(year: number): Milestone {
  let closest = MILESTONES[0];
  let minDiff = Math.abs(year - MILESTONES[0].year);
  for (const m of MILESTONES) {
    const diff = Math.abs(year - m.year);
    if (diff < minDiff) {
      minDiff = diff;
      closest = m;
    }
  }
  return closest;
}

export function HistoricalHero({ onSearch }: { onSearch?: (q: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const yearDisplayRef = useRef<HTMLSpanElement>(null);
  const milestoneDisplayRef = useRef<HTMLSpanElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const progressThumbRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Animation Refs
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const targetRotXRef = useRef<number>(0);
  const targetRotYRef = useRef<number>(0);
  const currentRotXRef = useRef<number>(0);
  const currentRotYRef = useRef<number>(0);
  const isInteractingRef = useRef<boolean>(false);
  const animFrameRef = useRef<number | null>(null);

  // Mobile relative touch drag refs
  const touchStartXRef = useRef<number>(0);
  const touchStartProgressRef = useRef<number>(0);

  // Auto-play journey animation loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      targetProgressRef.current += 0.008;
      if (targetProgressRef.current >= 1) {
        targetProgressRef.current = 0;
      }
      setHasInteracted(true);
    }, 40);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Main Smooth Lerp Loop via requestAnimationFrame
  useEffect(() => {
    const video = videoRef.current;
    const card = cardRef.current;
    const glare = glareRef.current;
    const yearDisplay = yearDisplayRef.current;
    const milestoneDisplay = milestoneDisplayRef.current;
    const progressFill = progressFillRef.current;
    const progressThumb = progressThumbRef.current;

    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const loop = () => {
      // 1. Smooth Progress Interpolation (lerp)
      const diff = targetProgressRef.current - currentProgressRef.current;
      currentProgressRef.current += diff * 0.15;

      const p = Math.max(0, Math.min(1, currentProgressRef.current));

      // Update video frame
      if (video && video.duration && !isNaN(video.duration) && video.duration > 0) {
        const targetTime = p * video.duration;
        if (Math.abs(video.currentTime - targetTime) > 0.015) {
          video.currentTime = targetTime;
        }
      }

      // Calculate Year (1947 to 2026)
      const exactYear = 1947 + p * (2026 - 1947);
      const currentYear = Math.round(exactYear);
      const closest = getClosestMilestone(currentYear);

      // Update Year text
      if (yearDisplay) {
        yearDisplay.textContent = String(currentYear);
      }
      if (milestoneDisplay) {
        milestoneDisplay.textContent = closest.label;
      }

      // Update Progress Bar
      const percent = p * 100;
      if (progressFill) {
        progressFill.style.width = percent + "%";
      }
      if (progressThumb) {
        progressThumb.style.left = percent + "%";
      }

      // 2. Smooth 3D Rotation (lerp)
      if (!prefersReducedMotion && card) {
        currentRotXRef.current += (targetRotXRef.current - currentRotXRef.current) * 0.1;
        currentRotYRef.current += (targetRotYRef.current - currentRotYRef.current) * 0.1;

        card.style.transform = "perspective(1200px) rotateX(" + currentRotXRef.current + "deg) rotateY(" + currentRotYRef.current + "deg)";

        if (glare) {
          const glareX = percent;
          const glareY = 50 + currentRotXRef.current * 4;
          glare.style.background = "radial-gradient(circle at " + glareX + "% " + glareY + "%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 45%, transparent 70%)";
          glare.style.opacity = isInteractingRef.current ? "1" : "0";
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Jump to specific year
  const seekToYear = (year: number) => {
    setIsPlaying(false);
    const p = (year - 1947) / (2026 - 1947);
    targetProgressRef.current = Math.max(0, Math.min(1, p));
    setHasInteracted(true);
  };

  // Desktop Mouse Movement
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsPlaying(false);
    const container = containerRef.current;
    if (!container) return;

    if (!hasInteracted) setHasInteracted(true);
    isInteractingRef.current = true;

    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

    targetProgressRef.current = x / rect.width;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    targetRotYRef.current = ((x - centerX) / centerX) * 4.5;
    targetRotXRef.current = -((y - centerY) / centerY) * 2.5;
  }, [hasInteracted]);

  const handleMouseLeave = useCallback(() => {
    isInteractingRef.current = false;
    targetRotXRef.current = 0;
    targetRotYRef.current = 0;
    if (glareRef.current) {
      glareRef.current.style.opacity = "0";
    }
  }, []);

  // Mobile Touch Handlers: Smooth relative finger dragging
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsPlaying(false);
    if (!e.touches[0]) return;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartProgressRef.current = targetProgressRef.current;
    isInteractingRef.current = true;
    if (!hasInteracted) setHasInteracted(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - touchStartXRef.current;
    const deltaProgress = deltaX / (rect.width * 0.95);
    targetProgressRef.current = Math.max(0, Math.min(1, touchStartProgressRef.current + deltaProgress));
  };

  const handleTouchEnd = () => {
    isInteractingRef.current = false;
  };

  // Direct Timeline Seek Click
  const handleTimelineSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsPlaying(false);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    targetProgressRef.current = x / rect.width;
    if (!hasInteracted) setHasInteracted(true);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#02180d] via-[#042414] to-bg px-4 pb-20 pt-12 text-fg">
      {/* Background Ambient Glow Accent */}
      <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 size-[700px] rounded-full bg-gradient-to-tr from-emerald-600/30 via-accent/25 to-transparent blur-[140px]" />

      <div className="mx-auto max-w-6xl">
        {/* Top Header Badge & High-Contrast Headline */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent backdrop-blur-md shadow-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            <span>47 SY AB TAK • 1947 → 2026 HISTORICAL JOURNEY</span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-md">
            Pakistan's Governance &amp;{" "}
            <span className="bg-gradient-to-r from-accent via-amber-200 to-white bg-clip-text text-transparent">
              Documentation Evolution
            </span>
          </h1>

          <p className="mx-auto mt-2.5 max-w-2xl text-xs font-medium text-emerald-100/90 sm:text-base leading-relaxed">
            Move cursor, drag, or <strong className="text-accent">tap any year</strong> to explore{" "}
            <strong className="text-accent font-bold">1947 — 2026</strong> from paper ledgers to digital citizen portals.
          </p>
        </div>

        {/* 3D INTERACTIVE HERO VIEWER */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative mt-6 sm:mt-8 select-none cursor-ew-resize touch-none"
          style={{ perspective: "1400px" }}
        >
          {/* Desktop-Only Top Instruction Pill */}
          <div className="hidden sm:flex absolute -top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
            <div className="flex items-center gap-2 rounded-full border border-accent/60 bg-accent px-4 py-1.5 text-xs font-black uppercase tracking-wider text-primary shadow-xl animate-pulse">
              <MoveHorizontal className="size-4 text-primary" />
              <span>Move Cursor to Explore 1947 — 2026</span>
            </div>
          </div>

          {/* Holographic 3D Luxury Rounded Bezel Frame Shell */}
          <div
            ref={cardRef}
            className="relative mx-auto aspect-[16/9] max-h-[520px] w-full max-w-4xl rounded-[32px] sm:rounded-[52px] p-2 sm:p-3.5 bg-gradient-to-b from-[#ffe066]/40 via-[#01411c]/90 to-[#c9a227]/30 border-2 border-[#ffe066]/60 shadow-[0_30px_70px_-15px_rgba(1,65,28,0.85),inset_0_2px_5px_rgba(255,255,255,0.4)] backdrop-blur-2xl transition-all duration-200"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {/* Inner Precision Bezel Screen Window */}
            <div className="relative h-full w-full overflow-hidden rounded-[26px] sm:rounded-[42px] bg-black border border-white/20 shadow-inner">
              {/* Scrubber Video Track */}
              <video
                ref={videoRef}
                src="/historical-hero.mp4"
                poster="/monument_thumb.jpg"
                muted
                playsInline
                preload="metadata"
                className="h-full w-full object-cover rounded-[26px] sm:rounded-[42px]"
              />

              {/* Holographic Light Glare Reflection */}
              <div
                ref={glareRef}
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{ mixBlendMode: "overlay", opacity: 0 }}
              />

              {/* Subtle Vignette Overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

              {/* Overlaid Real-Time Holographic Metadata HUD */}
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 sm:p-6 pb-3.5 sm:pb-7">
                {/* Top Row: Year & Milestone Tag */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[9px] sm:text-xs font-black uppercase tracking-wider text-accent/90 block whitespace-nowrap">
                      HISTORICAL ERA
                    </span>
                    <div className="flex items-baseline gap-1.5 sm:gap-2">
                      <span
                        ref={yearDisplayRef}
                        className="font-display text-2xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                      >
                        1947
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold text-accent">A.D.</span>
                    </div>
                  </div>

                  <div className="text-right max-w-[130px] sm:max-w-xs">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-accent/90 block">
                      MILESTONE MARKER
                    </span>
                    <span
                      ref={milestoneDisplayRef}
                      className="block font-display text-xs sm:text-base md:text-lg font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] leading-tight"
                    >
                      Independence &amp; Manual Era
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Tappable Quick Era Badges */}
                <div className="flex items-end justify-between gap-2 pointer-events-auto">
                  <button
                    type="button"
                    onClick={() => seekToYear(1947)}
                    className="rounded-lg sm:rounded-xl border border-white/20 bg-black/50 hover:bg-black/80 active:scale-95 px-2.5 sm:px-3.5 py-1 sm:py-1.5 backdrop-blur-md transition-all text-left"
                  >
                    <span className="text-[9px] sm:text-[10px] font-bold text-emerald-300 block leading-none">1947: Manual</span>
                    <p className="text-[10px] sm:text-xs font-bold sm:font-black text-white mt-0.5 leading-none">Paper Basta</p>
                  </button>

                  <div className="hidden sm:block text-center pointer-events-none">
                    <span className="rounded-full bg-accent/20 px-3 py-1 text-[11px] font-bold text-accent border border-accent/40 backdrop-blur-md">
                      ↔ Swipe left / right to travel
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => seekToYear(2026)}
                    className="text-right rounded-lg sm:rounded-xl border border-white/20 bg-black/50 hover:bg-black/80 active:scale-95 px-2.5 sm:px-3.5 py-1 sm:py-1.5 backdrop-blur-md transition-all"
                  >
                    <span className="text-[9px] sm:text-[10px] font-bold text-accent block leading-none">2026: Digital</span>
                    <p className="text-[10px] sm:text-xs font-bold sm:font-black text-white mt-0.5 leading-none">Citizen Cloud</p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Progress Bar Scrubber with Auto-Play and Quick Year Jump */}
          <div className="mx-auto mt-6 max-w-4xl">
            {/* Scrubber Track */}
            <div
              onClick={handleTimelineSeek}
              className="group relative cursor-pointer py-3"
            >
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/15 backdrop-blur-sm border border-white/10">
                <div
                  ref={progressFillRef}
                  className="h-full bg-gradient-to-r from-accent via-amber-300 to-emerald-400"
                  style={{ width: "0%" }}
                />
              </div>

              {/* Draggable Illuminated Thumb Handle */}
              <div
                ref={progressThumbRef}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 size-5 rounded-full border-2 border-white bg-accent shadow-[0_0_15px_rgba(201,162,39,0.9)] transition-transform group-hover:scale-125"
                style={{ left: "0%" }}
              />
            </div>

            {/* Controls Row: Play/Pause Auto-Play & Tappable Era Buttons */}
            <div className="mt-2 flex items-center justify-between gap-2 px-1 text-[11px] font-bold">
              {/* Play Journey Toggle Button */}
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className={"inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black transition-all border shadow-sm " + (
                  isPlaying
                    ? "bg-amber-400 text-black border-amber-300 animate-pulse"
                    : "bg-accent text-primary border-accent/80 hover:bg-accent-hover"
                )}
              >
                {isPlaying ? (
                  <>
                    <Pause className="size-3 fill-current" />
                    <span>Pause Tour</span>
                  </>
                ) : (
                  <>
                    <Play className="size-3 fill-current" />
                    <span>Play 79-Yr Tour</span>
                  </>
                )}
              </button>

              {/* Tappable Year Milestones */}
              <div className="flex items-center gap-1 sm:gap-2">
                {[1947, 1965, 1973, 1990, 2000, 2010, 2026].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => seekToYear(yr)}
                    className="rounded px-1.5 py-0.5 font-mono text-[10px] sm:text-xs text-emerald-200/70 hover:text-accent hover:bg-white/10 active:scale-95 transition-all"
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/timeline"
            className="flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-xs font-black text-primary hover:bg-accent-hover transition-transform hover:scale-105 shadow-xl"
          >
            <History className="size-4" /> Open 79-Year Evolution Timeline
          </Link>
          <Link
            to="/tools"
            className="flex items-center gap-2 rounded-full border-2 border-accent/40 bg-surface/10 px-7 py-3 text-xs font-black text-white hover:bg-surface/20 transition-all backdrop-blur-md"
          >
            <Sparkles className="size-4 text-accent" /> Open 2026 Encrypted Vault
          </Link>
        </div>
      </div>
    </section>
  );
}
