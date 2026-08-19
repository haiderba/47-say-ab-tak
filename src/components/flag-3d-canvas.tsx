import { useEffect, useRef, useState } from "react";

interface Flag3DCanvasProps {
  scrollProgress?: number; // 0 to 1
  tiltX?: number;
  tiltY?: number;
  className?: string;
  autoPlay?: boolean;
}

export function Flag3DCanvas({
  scrollProgress = 0,
  tiltX = 0,
  tiltY = 0,
  className = "",
  autoPlay = true,
}: Flag3DCanvasProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let animationFrameId: number;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const processFrame = () => {
      if (video.readyState >= 2 && ctx && !canvas.hidden && video.videoWidth > 0) {
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(video, 0, 0, w, h);

        const frame = ctx.getImageData(0, 0, w, h);
        const d = frame.data;
        const len = d.length;

        for (let i = 0; i < len; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];

          // High-precision green chroma key removal
          // Studio chroma green: g is bright (g > 80) and significantly larger than r and b
          // Pakistani flag dark green is #01411c (r ~ 1-15, g ~ 45-75, b ~ 15-30 -> g is dark!)
          // White crescent/star & white bar: r, g, b are all high (~ 200+)
          if (g > 80 && g > r * 1.18 && g > b * 1.18) {
            d[i + 3] = 0; // 100% Transparent
          } else if (g > 65 && g > r * 1.1 && g > b * 1.1) {
            // Smooth anti-aliased edge blending
            const diff = (g - Math.max(r, b)) / g;
            if (diff > 0.12) {
              d[i + 3] = Math.max(0, Math.round(d[i + 3] * (1 - diff * 2.2)));
            }
          }
        }
        ctx.putImageData(frame, 0, 0);
      }
      animationFrameId = requestAnimationFrame(processFrame);
    };

    video.play().then(() => setIsPlaying(true)).catch(() => {});
    animationFrameId = requestAnimationFrame(processFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Dynamic 3D transform based on scroll & tilt
  const rotY = Math.sin(scrollProgress * Math.PI * 4) * 20 + tiltY;
  const rotX = Math.cos(scrollProgress * Math.PI * 2) * 10 + tiltX;
  const scale = 1 + Math.sin(scrollProgress * Math.PI) * 0.12;

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Hidden background video source */}
      <video
        ref={videoRef}
        playsInline
        muted
        loop
        autoPlay={autoPlay}
        crossOrigin="anonymous"
        src="/flag.mp4"
        className="hidden"
      />

      {/* 3D Rendered Canvas with 100% Chroma Background Removed */}
      <div
        className="transition-transform duration-300 ease-out will-change-transform drop-shadow-[0_25px_40px_rgba(1,65,28,0.3)]"
        style={{
          transform: `rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${scale})`,
          transformStyle: "preserve-3d",
        }}
      >
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          className="h-auto w-[260px] sm:w-[340px] md:w-[420px] object-contain drop-shadow-2xl"
        />
      </div>
    </div>
  );
}
