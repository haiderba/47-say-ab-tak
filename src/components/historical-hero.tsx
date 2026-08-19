import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import {
  Compass,
  History,
  MoveHorizontal,
  Search,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

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
  const [gyroActive, setGyroActive] = useState(false);
  const [gyroSupported, setGyroSupported] = useState(false);

  // Animation Refs
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const targetRotXRef = useRef<number>(0);
  const targetRotYRef = useRef<number>(0);
  const currentRotXRef = useRef<number>(0);
  const currentRotYRef = useRef<number>(0);
  const isInteractingRef = useRef<boolean>(false);
  const animFrameRef = useRef<number | null>(null);

  // Check if video is already ready
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (video.readyState >= 1) {
        setVideoLoaded(true);
      }
      const timer = setTimeout(() => {
        setVideoLoaded(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  // Check device orientation / Gyroscope support
  useEffect(() => {
    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      setGyroSupported(true);
      // On Android / non-iOS, try listening automatically
      const isIos = typeof (window.DeviceOrientationEvent as any).requestPermission === "function";
      if (!isIos) {
        const testHandler = (e: DeviceOrientationEvent) => {
          if (e.gamma !== null || e.beta !== null) {
            setGyroActive(true);
            window.removeEventListener("deviceorientation", testHandler);
          }
        };
        window.addEventListener("deviceorientation", testHandler, { once: true });
      }
    }
  }, []);

  // Gyroscope orientation listener
  useEffect(() => {
    if (!gyroActive || typeof window === "undefined") return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;

      // gamma is left-to-right tilt (-30 deg to +30 deg)
      const clampedGamma = Math.max(-30, Math.min(30, e.gamma));
      const normProgress = (clampedGamma + 30) / 60; // 0 (1947) to 1 (2026)
      targetProgressRef.current = normProgress;

      // 3D Card tilt calculation
      targetRotYRef.current = (clampedGamma / 30) * 8; // -8deg to +8deg

      // beta is forward/backward tilt (typical holding angle: 45deg)
      const clampedBeta = Math.max(15, Math.min(75, e.beta));
      const betaOffset = clampedBeta - 45;
      targetRotXRef.current = (-betaOffset / 30) * 6; // -6deg to +6deg

      if (!hasInteracted) setHasInteracted(true);
    };

    window.addEventListener("deviceorientation", handleOrientation, { passive: true });
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, [gyroActive, hasInteracted]);

  // Request iOS / Mobile Gyroscope Permission
  const enableGyroscope = async () => {
    if (typeof window === "undefined") return;

    if (typeof (window.DeviceOrientationEvent as any)?.requestPermission === "function") {
      try {
        const state = await (window.DeviceOrientationEvent as any).requestPermission();
        if (state === "granted") {
          setGyroActive(true);
          toast.success("Gyroscope enabled! Tilt your phone left & right to travel through history.");
        } else {
          toast.error("Gyroscope permission denied.");
        }
      } catch (err) {
        console.warn("DeviceOrientation error:", err);
      }
    } else {
      setGyroActive(true);
      toast.success("Gyroscope enabled! Tilt your phone left & right.");
    }
  };

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
        progressFill.style.width = `${percent}%`;
      }
      if (progressThumb) {
        progressThumb.style.left = `${percent}%`;
      }

      // 2. Smooth 3D Rotation (lerp)
      if (!prefersReducedMotion && card) {
        currentRotXRef.current += (targetRotXRef.current - currentRotXRef.current) * 0.1;
        currentRotYRef.current += (targetRotYRef.current - currentRotYRef.current) * 0.1;

        card.style.transform = `perspective(1200px) rotateX(${currentRotXRef.current}deg) rotateY(${currentRotYRef.current}deg)`;

        if (glare) {
          const glareX = percent;
          const glareY = 50 + currentRotXRef.current * 4;
          glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 45%, transparent 70%)`;
          glare.style.opacity = isInteractingRef.current || gyroActive ? "1" : "0";
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gyroActive]);

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

          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-md">
            Pakistan's Governance &amp;{" "}
            <span className="bg-gradient-to-r from-accent via-amber-200 to-white bg-clip-text text-transparent">
              Documentation Evolution
            </span>
          </h1>

          <p className="mx-auto mt-2.5 max-w-2xl text-xs font-medium text-emerald-100/90 sm:text-base leading-relaxed">
            Move cursor horizontally or <strong className="text-accent">tilt phone</strong> to explore{" "}
            <strong className="text-accent font-bold">1947 — 2026</strong> from paper ledgers to digital citizen portals.
          </p>

          {/* GYROSCOPE MOTION ACTIVATOR BAR (Mobile Specific) */}
          <div className="mt-4 block sm:hidden">
            {gyroActive ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-950/80 px-4 py-1.5 text-[11px] font-bold text-emerald-300 shadow-md backdrop-blur-md animate-pulse">
                <Compass className="size-3.5 text-accent animate-spin" style={{ animationDuration: "8s" }} />
                <span>📱 Gyroscope Active • Tilt Left/Right to Travel</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={enableGyroscope}
                className="inline-flex items-center gap-2 rounded-full border border-accent/60 bg-accent/20 px-4 py-1.5 text-[11px] font-black text-accent hover:bg-accent hover:text-primary transition-all shadow-md backdrop-blur-md active:scale-95"
              >
                <Smartphone className="size-3.5 text-accent" />
                <span>⚡ Enable Phone Tilt Mode (3D Motion)</span>
              </button>
            )}
          </div>
        </div>

        {/* 3D INTERACTIVE HERO VIEWER */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleTouchMove}
          className="relative mt-6 sm:mt-8 select-none cursor-ew-resize touch-pan-y"
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
            className="relative mx-auto aspect-[16/9] max-h-[520px] w-full max-w-4xl rounded-[36px] sm:rounded-[52px] p-2.5 sm:p-3.5 bg-gradient-to-b from-[#ffe066]/40 via-[#01411c]/90 to-[#c9a227]/30 border-2 border-[#ffe066]/60 shadow-[0_30px_70px_-15px_rgba(1,65,28,0.85),inset_0_2px_5px_rgba(255,255,255,0.4)] backdrop-blur-2xl transition-all duration-200"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {/* Inner Precision Bezel Screen Window */}
            <div className="relative h-full w-full overflow-hidden rounded-[28px] sm:rounded-[42px] bg-black border border-white/20 shadow-inner">
              {/* Scrubber Video Track */}
              <video
                ref={videoRef}
                src="/historical-hero.mp4"
                muted
                playsInline
                preload="auto"
                className="h-full w-full object-cover rounded-[28px] sm:rounded-[42px]"
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
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-5 sm:p-7 pb-6 sm:pb-8">
              {/* Top Row: Year & Milestone Tag */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-accent/90">
                    HISTORICAL ERA
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span
                      ref={yearDisplayRef}
                      className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
                    >
                      1947
                    </span>
                    <span className="text-xs font-bold text-accent">A.D.</span>
                  </div>
                </div>

                <div className="text-right max-w-[200px] sm:max-w-xs">
                  <span className="text-[10px] font-black uppercase tracking-widest text-accent/90">
                    MILESTONE MARKER
                  </span>
                  <span
                    ref={milestoneDisplayRef}
                    className="block font-display text-sm sm:text-lg font-extrabold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                  >
                    Independence &amp; Manual Era
                  </span>
                </div>
              </div>

              {/* Bottom Row: Quick Era Jump Cards */}
              <div className="flex items-end justify-between">
                <div className="rounded-xl border border-white/20 bg-black/60 px-3.5 py-1.5 backdrop-blur-md">
                  <span className="text-[10px] font-bold text-emerald-300">1947: Manual</span>
                  <p className="text-xs font-black text-white">Paper Basta</p>
                </div>

                <div className="hidden sm:block text-center">
                  <span className="rounded-full bg-accent/20 px-3 py-1 text-[11px] font-bold text-accent border border-accent/40 backdrop-blur-md">
                    {gyroActive ? "📱 Tilting Phone Controls Time" : "↔ Swipe left / right to travel"}
                  </span>
                </div>

                <div className="text-right rounded-xl border border-white/20 bg-black/60 px-3.5 py-1.5 backdrop-blur-md">
                  <span className="text-[10px] font-bold text-accent">2026: Digital</span>
                  <p className="text-xs font-black text-white">Citizen Cloud</p>
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Interactive Progress Bar Scrubber */}
          <div
            onClick={handleTimelineSeek}
            className="group relative mx-auto mt-6 max-w-4xl cursor-pointer py-3"
          >
            {/* Base Line */}
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/15 backdrop-blur-sm">
              {/* Progress Fill */}
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

            {/* Era Milestone Dots */}
            <div className="mt-3 flex items-center justify-between px-1 text-[10px] font-bold text-emerald-200/70">
              <span>1947</span>
              <span>1965</span>
              <span>1973</span>
              <span>1990</span>
              <span>2000</span>
              <span>2010</span>
              <span>2026</span>
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
