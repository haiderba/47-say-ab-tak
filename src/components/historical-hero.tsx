import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import {
  History,
  MoveHorizontal,
  Search,
  Sparkles,
} from "lucide-react";

const MILESTONES = [
  { year: 1947, label: "Independence & Manual Era" },
  { year: 1956, label: "First Constitution" },
  { year: 1965, label: "Development Era" },
  { year: 1971, label: "A Turning Point" },
  { year: 1973, label: "Constitutional Citizen Registry" },
  { year: 1980, label: "Society & Expansion" },
  { year: 1990, label: "Computerisation Begins" },
  { year: 2000, label: "NADRA Digital Biometrics" },
  { year: 2010, label: "Smart Cards & Arazi Centers" },
  { year: 2026, label: "Citizen Cloud & 24/7 Centers" },
];

function getClosestMilestone(year: number) {
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
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Animation Refs
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const targetRotXRef = useRef<number>(0);
  const targetRotYRef = useRef<number>(0);
  const currentRotXRef = useRef<number>(0);
  const currentRotYRef = useRef<number>(0);
  const isInteractingRef = useRef<boolean>(false);
  const animFrameRef = useRef<number | null>(null);

  // Check if video is already ready or setup fallback
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (video.readyState >= 1) {
        setVideoLoaded(true);
      }
      // Safety timeout to ensure user never gets stuck
      const timer = setTimeout(() => {
        setVideoLoaded(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  // Main Smooth Lerp Loop via requestAnimationFrame
  useEffect(() => {
    const video = videoRef.current;
    const card = cardRef.current;
    const glare = glareRef.current;
    const yearDisplay = yearDisplayRef.current;
    const milestoneDisplay = milestoneDisplayRef.current;
    const progressFill = progressFillRef.current;
    const progressThumb = progressThumbRef.current;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const loop = () => {
      // 1. Smooth Progress Interpolation (lerp)
      const diff = targetProgressRef.current - currentProgressRef.current;
      currentProgressRef.current += diff * 0.12;

      const p = Math.max(0, Math.min(1, currentProgressRef.current));

      // Update video frame
      if (video && video.duration && !isNaN(video.duration) && video.duration > 0) {
        const targetTime = p * video.duration;
        if (Math.abs(video.currentTime - targetTime) > 0.02) {
          video.currentTime = targetTime;
        }
      }

      // Calculate Year & Milestone
      const year = Math.round(1947 + p * (2026 - 1947));
      const milestone = getClosestMilestone(year);

      if (yearDisplay) {
        yearDisplay.textContent = String(year);
      }
      if (milestoneDisplay) {
        milestoneDisplay.textContent = milestone.label;
      }
      if (progressFill) {
        progressFill.style.width = `${(p * 100).toFixed(2)}%`;
      }
      if (progressThumb) {
        progressThumb.style.left = `${(p * 100).toFixed(2)}%`;
      }

      // 2. 3D Tilt Interpolation (Desktop only)
      if (!prefersReducedMotion && card) {
        const rotXDiff = targetRotXRef.current - currentRotXRef.current;
        const rotYDiff = targetRotYRef.current - currentRotYRef.current;
        currentRotXRef.current += rotXDiff * 0.1;
        currentRotYRef.current += rotYDiff * 0.1;

        card.style.transform = `perspective(1400px) rotateX(${currentRotXRef.current.toFixed(2)}deg) rotateY(${currentRotYRef.current.toFixed(2)}deg)`;
      }

      // Glare reflection update
      if (glare && isInteractingRef.current) {
        glare.style.opacity = "0.45";
        glare.style.background = `radial-gradient(circle at ${(p * 100).toFixed(1)}% 40%, rgba(201, 162, 39, 0.25) 0%, rgba(255, 255, 255, 0.1) 35%, transparent 70%)`;
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Desktop Mouse Movement
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
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

  // Mobile Touch Movement
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container || !e.touches[0]) return;

    if (!hasInteracted) setHasInteracted(true);
    isInteractingRef.current = true;

    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(rect.width, touch.clientX - rect.left));

    targetProgressRef.current = x / rect.width;
    targetRotXRef.current = 0;
    targetRotYRef.current = 0;
  }, [hasInteracted]);

  // Direct Timeline Click / Seek
  const handleTimelineSeek = (e: React.MouseEvent<HTMLDivElement>) => {
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

          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-md">
            Pakistan's Governance &{" "}
            <span className="bg-gradient-to-r from-accent via-amber-200 to-white bg-clip-text text-transparent">
              Documentation Evolution
            </span>
          </h1>

          <p className="mt-3.5 max-w-2xl text-sm sm:text-base text-neutral-200 leading-relaxed font-normal">
            Move your cursor horizontally across the screen to travel through <strong className="text-accent font-bold">1947 — 2026</strong> — from British-era manual paper ledgers to modern digital citizen portals.
          </p>
        </div>

        {/* 🌟 3D FLOATING INTERACTIVE HISTORICAL WINDOW */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={() => setHasInteracted(true)}
          onTouchMove={handleTouchMove}
          className="relative mx-auto mt-8 w-full max-w-5xl cursor-ew-resize select-none"
          style={{ perspective: "1400px" }}
        >
          {/* Main 3D Card */}
          <div
            ref={cardRef}
            className="relative overflow-hidden rounded-3xl border-2 border-accent/30 bg-neutral-950 p-2 sm:p-3 shadow-2xl transition-shadow duration-300"
            style={{
              transformStyle: "preserve-3d",
              boxShadow: "0 30px 90px -15px rgba(1, 65, 28, 0.6), 0 0 0 1px rgba(201, 162, 39, 0.25)",
            }}
          >
            {/* Dynamic Glare Overlay */}
            <div
              ref={glareRef}
              className="pointer-events-none absolute inset-0 z-20 rounded-3xl transition-opacity duration-300 opacity-0"
            />

            {/* Video Container (16:9 Aspect Ratio) */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-neutral-900">
              {/* HTML5 Paused Timeline Video */}
              <video
                ref={videoRef}
                muted
                playsInline
                preload="auto"
                onLoadedMetadata={() => setVideoLoaded(true)}
                onLoadedData={() => setVideoLoaded(true)}
                onCanPlay={() => setVideoLoaded(true)}
                className="h-full w-full object-cover"
                style={{ filter: "contrast(1.05) saturate(1.1)" }}
              >
                <source src="/historical-hero.mp4" type="video/mp4" />
                <source src="/3d%20Landing%20.mp4" type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>

              {/* Top Dynamic Year & Milestone HUD Overlay */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between bg-gradient-to-b from-black/85 via-black/45 to-transparent p-4 sm:p-6 text-white">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-1.5">
                    <History className="size-3.5" /> Historical Era
                  </div>
                  <div className="mt-0.5 flex items-baseline gap-2">
                    <span
                      ref={yearDisplayRef}
                      className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white drop-shadow-lg"
                    >
                      1947
                    </span>
                    <span className="text-xs font-bold text-neutral-300">A.D.</span>
                  </div>
                </div>

                <div className="text-right max-w-[200px] sm:max-w-xs">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-accent">
                    Milestone Marker
                  </div>
                  <span
                    ref={milestoneDisplayRef}
                    className="mt-0.5 block font-display text-xs sm:text-sm font-bold text-white drop-shadow-lg"
                  >
                    Independence & Manual Era
                  </span>
                </div>
              </div>

              {/* Bottom Interactive Hover Indicator */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-between bg-gradient-to-t from-black/90 via-black/45 to-transparent p-4 sm:p-5 text-white">
                <span className="rounded-md bg-black/70 border border-white/10 px-2.5 py-1 text-[11px] font-bold text-accent backdrop-blur-md">
                  1947: Manual Paper Basta
                </span>

                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <MoveHorizontal className="size-4 text-accent animate-pulse" />
                  <span className="hidden sm:inline">Move cursor across screen to scrub timeline</span>
                  <span className="sm:hidden">Swipe left / right to travel</span>
                </div>

                <span className="rounded-md bg-black/70 border border-white/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400 backdrop-blur-md">
                  2026: Digital Citizen Cloud
                </span>
              </div>

              {/* Loading Poster / Spinner before metadata loads */}
              {!videoLoaded && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-neutral-950 text-white">
                  <div className="size-10 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                  <span className="mt-3 text-xs font-semibold tracking-wider text-neutral-300">
                    Loading 1947 → 2026 Historical Archive...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Instruction Banner (Gently fades after first interaction) */}
          {!hasInteracted && (
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 animate-bounce">
              <span className="rounded-full bg-accent px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-neutral-950 shadow-2xl flex items-center gap-1.5">
                ↔ Move Cursor to Explore 1947 — 2026
              </span>
            </div>
          )}
        </div>

        {/* 🌟 MINIMAL INTERACTIVE SCRUBBER TIMELINE */}
        <div className="mx-auto mt-6 max-w-4xl px-2">
          {/* Clickable Scrubber Bar */}
          <div
            onClick={handleTimelineSeek}
            className="group relative h-4 w-full cursor-pointer flex items-center"
            title="Click or drag to seek through history"
          >
            {/* Background Track */}
            <div className="h-1.5 w-full rounded-full bg-border/80 group-hover:h-2 transition-all">
              {/* Progress Fill */}
              <div
                ref={progressFillRef}
                className="h-full rounded-full bg-gradient-to-r from-accent via-amber-300 to-emerald-500"
                style={{ width: "0%" }}
              />
            </div>

            {/* Scrubber Pin Thumb */}
            <div
              ref={progressThumbRef}
              className="absolute -top-1.5 size-6 -translate-x-1/2 rounded-full border-2 border-accent bg-neutral-900 shadow-xl group-hover:scale-125 transition-transform flex items-center justify-center"
              style={{ left: "0%" }}
            >
              <div className="size-2 rounded-full bg-accent" />
            </div>
          </div>

          {/* Milestone Labels Grid */}
          <div className="mt-3 flex justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            <span className="text-accent font-extrabold">1947 (Founding)</span>
            <span className="hidden sm:inline">1973 (ID Cards)</span>
            <span className="hidden md:inline">2000 (NADRA)</span>
            <span className="hidden sm:inline">2010 (PLRA Fard)</span>
            <span className="text-emerald-400 font-extrabold">2026 (Digital Pakistan)</span>
          </div>
        </div>

        {/* 🌟 QUICK SEARCH & CIVIC SHORTCUT BAR */}
        <div className="mx-auto mt-10 max-w-3xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const q = (e.currentTarget.elements.namedItem("search") as HTMLInputElement)?.value;
              if (q && onSearch) onSearch(q);
            }}
            className="flex items-center gap-3 rounded-full border-2 border-accent/40 bg-surface px-4 py-2 shadow-2xl focus-within:border-accent transition-all"
          >
            <Search className="size-5 text-accent shrink-0" />
            <input
              name="search"
              placeholder="Search 30+ official citizen guides (CNIC, FRC, Mutation, Passport, Driving License, Tax)..."
              className="h-10 w-full bg-transparent text-xs sm:text-sm text-fg outline-none placeholder:text-muted"
            />
            <button
              type="submit"
              className="rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-surface hover:bg-primary-light transition-colors shrink-0"
            >
              Search Guides
            </button>
          </form>

          {/* Trending Search Pills */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-300">
            <span className="font-semibold text-accent">Trending:</span>
            {[
              { label: "Smart CNIC", to: "/guides/cnic" },
              { label: "Succession Certificate", to: "/guides/succession" },
              { label: "Land Mutation (Intiqal)", to: "/guides/land-mutation" },
              { label: "Machine Readable Passport", to: "/guides/passport" },
              { label: "Driving License (DLIMS)", to: "/guides/driving-license" },
            ].map((p) => (
              <Link
                key={p.label}
                to={p.to as any}
                className="rounded-full border border-border bg-bg px-3 py-1 text-[11px] font-medium text-fg hover:border-accent hover:text-accent transition-colors"
              >
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
