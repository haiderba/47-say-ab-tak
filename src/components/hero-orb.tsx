import { useEffect, useRef, useState } from "react";
import { CheckCircle2, FileText, Fingerprint, Sparkles } from "lucide-react";

export function HeroOrb() {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  useEffect(() => {
    const card = cardRef.current;
    const container = containerRef.current;
    if (!card || !container) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation limits (-15 to 15 deg)
      targetRotY = ((x - centerX) / centerX) * 16;
      targetRotX = -((y - centerY) / centerY) * 16;

      // Update glare position
      setGlarePos({
        x: Math.round((x / rect.width) * 100),
        y: Math.round((y / rect.height) * 100),
        opacity: 0.75,
      });
    };

    const onMouseLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
      setGlarePos((prev) => ({ ...prev, opacity: 0 }));
    };

    const updateTilt = () => {
      // Smooth lerp (interpolation)
      currentRotX += (targetRotX - currentRotX) * 0.1;
      currentRotY += (targetRotY - currentRotY) * 0.1;

      card.style.transform = `perspective(1100px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;
      animationFrameId = requestAnimationFrame(updateTilt);
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);
    animationFrameId = requestAnimationFrame(updateTilt);

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex h-[430px] w-full max-w-[480px] items-center justify-center p-4 lg:h-[490px]"
      style={{ perspective: "1100px" }}
    >
      {/* Background ambient glow */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-primary/30 via-accent/20 to-primary/10 blur-3xl" />

      {/* 3D Master Card */}
      <div
        ref={cardRef}
        className="relative flex h-[370px] w-[320px] flex-col items-center justify-between rounded-3xl border border-border/80 bg-gradient-to-b from-surface via-surface to-bg/90 p-6 shadow-2xl transition-shadow duration-300 hover:shadow-card sm:h-[410px] sm:w-[360px]"
        style={{
          transformStyle: "preserve-3d",
          boxShadow: "0 25px 60px -15px rgba(1, 65, 28, 0.25), 0 0 0 1px rgba(213, 226, 216, 0.6)",
        }}
      >
        {/* Dynamic Glare Reflection */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(201, 162, 39, 0.3) 0%, rgba(255, 255, 255, 0.15) 30%, transparent 70%)`,
            opacity: glarePos.opacity,
          }}
        />

        {/* Top Floating Badge */}
        <div
          className="flex items-center gap-2 rounded-full border border-border bg-surface/90 px-3.5 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur-md"
          style={{ transform: "translateZ(35px)" }}
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          <span>Documentation Era: 1947 → 2026</span>
        </div>

        {/* Centerpiece 3D Emblem */}
        <div
          className="relative my-auto flex flex-col items-center justify-center"
          style={{ transform: "translateZ(55px)" }}
        >
          {/* Orbital Ring */}
          <div className="absolute -inset-6 rounded-full border border-accent/30 [animation:spin_20s_linear_infinite]" />
          <div className="absolute -inset-12 rounded-full border border-dashed border-primary/20 [animation:spin_35s_linear_infinite_reverse]" />

          {/* Core Green Orb */}
          <div className="relative flex size-28 items-center justify-center rounded-full bg-gradient-to-br from-primary via-primary-light to-primary text-surface shadow-lg ring-4 ring-accent/30 sm:size-32">
            <div className="text-center">
              <div className="font-display text-4xl font-extrabold tracking-tight text-accent sm:text-5xl">
                47
              </div>
              <div className="text-xs font-medium tracking-wider text-surface/90">
                سے اب تک
              </div>
            </div>
          </div>
        </div>

        {/* Era Transformation Indicator */}
        <div
          className="w-full rounded-2xl border border-border bg-bg/80 p-3 shadow-inner backdrop-blur-sm"
          style={{ transform: "translateZ(30px)" }}
        >
          <div className="flex items-center justify-between text-xs font-medium text-muted">
            <span className="flex items-center gap-1">
              <FileText className="size-3 text-accent" /> 1947: Paper Basta
            </span>
            <span className="font-bold text-accent">→</span>
            <span className="flex items-center gap-1 font-semibold text-primary">
              <Fingerprint className="size-3 text-primary" /> 2026: Biometric Cloud
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div className="h-full w-full bg-gradient-to-r from-accent via-primary-light to-primary" />
          </div>
        </div>

        {/* Floating Satellite Badge 1: Top-Left */}
        <div
          className="absolute -left-3 top-10 flex items-center gap-2 rounded-xl border border-border/90 bg-surface/95 px-3 py-2 text-xs font-medium text-fg shadow-lg backdrop-blur-md transition-transform duration-200 hover:scale-105 sm:-left-7"
          style={{ transform: "translateZ(45px)" }}
        >
          <div className="grid size-6 place-items-center rounded-lg bg-emerald-50 text-primary">
            <CheckCircle2 className="size-4" />
          </div>
          <div>
            <div className="font-semibold text-primary">11 Rules-Wise Guides</div>
            <div className="text-[10px] text-muted">Printable Checklists</div>
          </div>
        </div>

        {/* Floating Satellite Badge 2: Bottom-Right */}
        <div
          className="absolute -bottom-4 -right-3 flex items-center gap-2 rounded-xl border border-border/90 bg-surface/95 px-3 py-2 text-xs font-medium text-fg shadow-lg backdrop-blur-md transition-transform duration-200 hover:scale-105 sm:-right-6"
          style={{ transform: "translateZ(50px)" }}
        >
          <div className="grid size-6 place-items-center rounded-lg bg-amber-50 text-accent">
            <Sparkles className="size-4" />
          </div>
          <div>
            <div className="font-semibold text-primary">Zero Agent Fees</div>
            <div className="text-[10px] text-muted">Direct Official Route</div>
          </div>
        </div>
      </div>
    </div>
  );
}

