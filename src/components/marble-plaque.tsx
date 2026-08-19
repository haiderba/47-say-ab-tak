import { useState, useRef } from "react";
import { Award, CheckCircle2, Eye, EyeOff, Sparkles, Touchpad } from "lucide-react";

interface MilestoneData {
  id: string;
  year: number;
  yearLabel: string;
  title: string;
  category: string;
  badge: string;
  summary: string;
  keyInnovations: string[];
  historicalContext: string;
  citizenImpact: string;
  documentType: string;
}

interface MarblePlaqueProps {
  milestone: MilestoneData;
  isActive: boolean;
  onActivate: () => void;
  index: number;
}

export function MarblePlaque({
  milestone,
  isActive,
  onActivate,
  index,
}: MarblePlaqueProps) {
  const [isUnveiled, setIsUnveiled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleUnveil = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUnveiled((prev) => !prev);
    onActivate();
  };

  return (
    <div
      className="relative w-full h-full flex flex-col transition-all duration-700"
      style={{ perspective: "1800px" }}
    >
      {/* 3D LUXURY MARBLE MONUMENT PLAQUE CONTAINER (TWO PER ROW) */}
      <div
        onClick={toggleUnveil}
        className={`group relative flex-1 flex flex-col justify-between overflow-hidden rounded-[28px] border-2 transition-all duration-700 select-none shadow-xl cursor-pointer ${
          isUnveiled
            ? "border-[#c9a227] ring-4 ring-[#c9a227]/30 shadow-[0_25px_50px_rgba(1,65,28,0.22)] scale-[1.01]"
            : "border-[#d5ded7] hover:border-[#c9a227]/60 shadow-[0_15px_30px_rgba(0,0,0,0.06)]"
        }`}
        style={{
          background: `
            radial-gradient(circle at 20% 25%, #ffffff 0%, #f7f9f7 50%, #edf3ee 100%),
            repeating-linear-gradient(45deg, rgba(180,205,190,0.12) 0px, rgba(180,205,190,0.12) 2px, transparent 2px, transparent 12px),
            repeating-linear-gradient(-45deg, rgba(160,185,170,0.08) 0px, rgba(160,185,170,0.08) 3px, transparent 3px, transparent 16px)
          `,
          boxShadow: isUnveiled
            ? "inset 0 2px 5px rgba(255,255,255,1), inset 0 -2px 6px rgba(1,65,28,0.12), 0 25px 50px -10px rgba(1,65,28,0.25)"
            : "inset 0 2px 4px rgba(255,255,255,0.95), inset 0 -2px 4px rgba(0,0,0,0.04), 0 12px 28px rgba(0,0,0,0.07)",
        }}
      >
        {/* Four Decorative Solid Brass / Gold Corner Rosette Screws */}
        <div className="absolute top-3.5 left-3.5 size-3.5 rounded-full bg-gradient-to-br from-[#ffe066] via-[#c9a227] to-[#8a6b10] border border-[#ffe066] shadow-sm flex items-center justify-center z-10 pointer-events-none">
          <div className="size-1 rounded-full bg-[#523e05] opacity-70" />
        </div>
        <div className="absolute top-3.5 right-3.5 size-3.5 rounded-full bg-gradient-to-br from-[#ffe066] via-[#c9a227] to-[#8a6b10] border border-[#ffe066] shadow-sm flex items-center justify-center z-10 pointer-events-none">
          <div className="size-1 rounded-full bg-[#523e05] opacity-70" />
        </div>
        <div className="absolute bottom-3.5 left-3.5 size-3.5 rounded-full bg-gradient-to-br from-[#ffe066] via-[#c9a227] to-[#8a6b10] border border-[#ffe066] shadow-sm flex items-center justify-center z-10 pointer-events-none">
          <div className="size-1 rounded-full bg-[#523e05] opacity-70" />
        </div>
        <div className="absolute bottom-3.5 right-3.5 size-3.5 rounded-full bg-gradient-to-br from-[#ffe066] via-[#c9a227] to-[#8a6b10] border border-[#ffe066] shadow-sm flex items-center justify-center z-10 pointer-events-none">
          <div className="size-1 rounded-full bg-[#523e05] opacity-70" />
        </div>

        {/* MARBLE ENGRAVED DETAILS (Glistening White Stone Inscription) */}
        <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
          <div>
            {/* Top Plaque Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#c9a227]/30 pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-0.5 text-[11px] font-bold text-primary border border-primary/20 shadow-xs">
                  {milestone.category}
                </span>
                <span className="font-mono text-[11px] font-extrabold text-[#9e7d17]">
                  ★ {milestone.badge}
                </span>
              </div>

              {/* Unveil / Veil toggle */}
              <button
                type="button"
                onClick={toggleUnveil}
                className="inline-flex items-center gap-1 rounded-full border border-[#c9a227]/50 bg-white px-3 py-1 text-[11px] font-bold text-primary hover:bg-[#c9a227] hover:text-white transition-all shadow-xs"
              >
                {isUnveiled ? (
                  <>
                    <EyeOff className="size-3 text-[#c9a227]" /> Veil Flag
                  </>
                ) : (
                  <>
                    <Eye className="size-3 text-primary" /> Unveil
                  </>
                )}
              </button>
            </div>

            {/* Inscribed Era Title */}
            <h3
              className="mt-4 font-display text-xl sm:text-2xl font-extrabold tracking-tight leading-snug"
              style={{
                background: "linear-gradient(135deg, #013516 0%, #01411C 45%, #0d5f2d 70%, #9e7d17 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 1px 1px rgba(255,255,255,0.8)",
              }}
            >
              {milestone.title}
            </h3>

            {/* Core Legal Impact Summary */}
            <p className="mt-2.5 text-xs text-[#2c4232] leading-relaxed font-medium">
              {milestone.summary}
            </p>

            {/* 3 Key Inscribed Reforms */}
            <div className="mt-4 space-y-1.5 rounded-2xl bg-white/70 border border-[#c9a227]/25 p-3.5 shadow-inner">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#9e7d17] block mb-1">
                🏛️ Key Structural Reforms:
              </span>
              {milestone.keyInnovations.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-[#1e3424] font-medium">
                  <CheckCircle2 className="size-3.5 shrink-0 text-[#c9a227] mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plaque Footer Inscription */}
          <div className="mt-5 border-t border-[#c9a227]/30 pt-3 flex items-center justify-between text-[11px]">
            <span className="font-mono text-[#6d8a74]">
              {milestone.documentType}
            </span>
            <span className="font-bold text-[#01411C] inline-flex items-center gap-1">
              <Sparkles className="size-3 text-[#c9a227]" /> {milestone.citizenImpact.slice(0, 32)}...
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FULL-CARD 3D CEREMONIAL PAKISTANI FLAG VEIL COVER (CLICK TO UNVEIL)       */}
        {/* ========================================================================= */}
        <div
          onClick={toggleUnveil}
          className={`absolute inset-0 z-20 overflow-hidden rounded-[26px] bg-primary transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] shadow-2xl cursor-pointer ${
            isUnveiled
              ? "opacity-0 -translate-y-[92%] scale-[0.95] pointer-events-none"
              : "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          }`}
          style={{
            transformOrigin: "top center",
          }}
        >
          {/* Edge-to-Edge 60fps High-Res Pakistani Flag Video */}
          <video
            ref={videoRef}
            src="/monument_flag_web.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover scale-105"
          />

          {/* Velvet / Cloth Shading Filter */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30 pointer-events-none" />
          <div className="absolute inset-0 ring-2 ring-inset ring-[#ffe066]/30 rounded-[26px] pointer-events-none" />

          {/* Commemorative Gold Year & Click to Unveil Prompt Badge */}
          <div className="absolute inset-0 flex flex-col items-center justify-between p-6 text-center text-surface pointer-events-none">
            {/* Top Ribbon */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ffe066]/50 bg-black/60 px-4 py-1.5 text-xs font-black text-[#ffe066] shadow-xl backdrop-blur-md">
              <Award className="size-3.5 text-[#ffe066]" />
              <span>★ {milestone.yearLabel} • {milestone.badge} ★</span>
            </div>

            {/* Center Interactive Tap Callout */}
            <div className="my-auto space-y-2 max-w-xs transform group-hover:scale-105 transition-transform duration-300">
              <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#ffe066] text-primary shadow-2xl border-2 border-white animate-bounce">
                <Sparkles className="size-6 text-primary" />
              </div>
              <h4 className="font-display text-lg font-black text-[#ffe066] drop-shadow-md">
                Click Flag to Unveil Plaque
              </h4>
              <p className="text-[11px] font-semibold text-surface/90 drop-shadow-sm">
                Lifts the 3D ceremonial veil to reveal the {milestone.yearLabel} legal milestone
              </p>
            </div>

            {/* Bottom Era Category */}
            <div className="rounded-full bg-black/50 px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-surface/80 border border-white/10 backdrop-blur-xs">
              {milestone.category}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
