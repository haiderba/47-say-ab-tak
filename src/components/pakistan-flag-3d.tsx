import { useEffect, useRef } from "react";

interface PakistanFlag3DProps {
  className?: string;
  width?: number;
  height?: number;
  tiltX?: number;
  tiltY?: number;
  windSpeed?: number;
}

export function PakistanFlag3D({
  className = "",
  width = 380,
  height = 240,
  tiltX = 0,
  tiltY = 0,
  windSpeed = 1,
}: PakistanFlag3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Offscreen canvas to pre-render the crisp high-resolution 2D Pakistan Flag
    const flagTex = document.createElement("canvas");
    flagTex.width = 600;
    flagTex.height = 400;
    const fctx = flagTex.getContext("2d");
    if (fctx) {
      const fw = flagTex.width;
      const fh = flagTex.height;

      // 1. Dark Green (#01411c) field
      fctx.fillStyle = "#01411c";
      fctx.fillRect(0, 0, fw, fh);

      // 2. White vertical stripe at the hoist (1/4th width)
      fctx.fillStyle = "#ffffff";
      fctx.fillRect(0, 0, fw * 0.25, fh);

      // 3. White Crescent & 5-pointed Star in the green portion
      // Green field center: x = fw * 0.625, y = fh * 0.5
      const cx = fw * 0.61;
      const cy = fh * 0.5;
      const r = fh * 0.3;

      fctx.save();
      // Outer crescent circle
      fctx.fillStyle = "#ffffff";
      fctx.beginPath();
      fctx.arc(cx, cy, r, 0, Math.PI * 2);
      fctx.fill();

      // Inner cut-out circle (angles towards upper fly corner)
      fctx.fillStyle = "#01411c";
      fctx.beginPath();
      const cutAngle = -Math.PI / 4.2;
      const cutOffset = r * 0.28;
      fctx.arc(cx + Math.cos(cutAngle) * cutOffset, cy + Math.sin(cutAngle) * cutOffset, r * 0.88, 0, Math.PI * 2);
      fctx.fill();

      // 5-Pointed Star
      const starX = cx + r * 0.55;
      const starY = cy - r * 0.45;
      const starR = r * 0.32;
      const starAngle = -Math.PI / 4.5;

      fctx.translate(starX, starY);
      fctx.rotate(starAngle);
      fctx.fillStyle = "#ffffff";
      fctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const outerA = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const innerA = outerA + Math.PI / 5;
        const x1 = Math.cos(outerA) * starR;
        const y1 = Math.sin(outerA) * starR;
        const x2 = Math.cos(innerA) * (starR * 0.42);
        const y2 = Math.sin(innerA) * (starR * 0.42);
        if (i === 0) fctx.moveTo(x1, y1);
        else fctx.lineTo(x1, y1);
        fctx.lineTo(x2, y2);
      }
      fctx.closePath();
      fctx.fill();
      fctx.restore();
    }

    // Grid resolution for 3D cloth deformation
    const cols = 48;
    const rows = 28;

    const render = () => {
      time += 0.045 * windSpeed;
      const cw = canvas.width;
      const ch = canvas.height;

      ctx.clearRect(0, 0, cw, ch);

      const flagW = cw * 0.76;
      const flagH = ch * 0.72;
      const startX = cw * 0.14;
      const startY = ch * 0.14;

      const cellW = flagW / cols;
      const cellH = flagH / rows;

      // Draw metallic gold flagpole
      const poleX = startX - 8;
      const poleTop = startY - 20;
      const poleBottom = ch * 0.95;

      const poleGrad = ctx.createLinearGradient(poleX - 4, 0, poleX + 4, 0);
      poleGrad.addColorStop(0, "#d4af37");
      poleGrad.addColorStop(0.5, "#fff2a8");
      poleGrad.addColorStop(1, "#997a15");

      ctx.fillStyle = poleGrad;
      ctx.fillRect(poleX - 3, poleTop, 6, poleBottom - poleTop);

      // Gold sphere finial on top of flagpole
      ctx.beginPath();
      ctx.arc(poleX, poleTop, 7, 0, Math.PI * 2);
      ctx.fillStyle = "#ffe066";
      ctx.fill();
      ctx.strokeStyle = "#b38f00";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Compute mesh vertices with sinusoidal traveling wave & vertical flutter
      const vertices: { x: number; y: number; z: number; light: number }[][] = [];

      for (let r = 0; r <= rows; r++) {
        vertices[r] = [];
        for (let c = 0; c <= cols; c++) {
          const u = c / cols;
          const v = r / rows;

          // Waving physics: amplitude increases towards the free edge (u = 1)
          const amp = Math.pow(u, 1.2) * 24;
          const wave1 = Math.sin(u * 7.5 - time * 2.8 + v * 1.5) * amp;
          const wave2 = Math.cos(u * 14 - time * 4.2 + v * 3) * (amp * 0.35);
          const z = wave1 + wave2;

          // 3D perspective mapping
          const pers = 600;
          const scale = pers / (pers + z);

          const px = startX + c * cellW + Math.sin(u * 3 - time) * (u * 6);
          const py = startY + r * cellH + Math.sin(u * 5 - time * 2) * (u * 8) + (v - 0.5) * (amp * 0.2);

          // Lighting factor derived from wave slope
          const slope = (Math.cos(u * 7.5 - time * 2.8) * amp) / 20;
          const light = Math.min(1.4, Math.max(0.65, 1 + slope * 0.45));

          vertices[r][c] = {
            x: px * scale,
            y: py * scale,
            z,
            light,
          };
        }
      }

      // Render textured 3D cloth quads
      const srcW = flagTex.width / cols;
      const srcH = flagTex.height / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p0 = vertices[r][c];
          const p1 = vertices[r][c + 1];
          const p2 = vertices[r + 1][c + 1];
          const p3 = vertices[r + 1][c];

          const sx = c * srcW;
          const sy = r * srcH;

          // Draw cloth cell from pre-rendered texture
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.closePath();
          ctx.clip();

          // Transform and draw slice
          ctx.drawImage(flagTex, sx, sy, srcW + 0.5, srcH + 0.5, p0.x, p0.y, p1.x - p0.x + 1, p3.y - p0.y + 1);

          // Apply 3D specular shading / highlight
          const avgLight = (p0.light + p1.light + p2.light + p3.light) / 4;
          if (avgLight > 1) {
            ctx.fillStyle = `rgba(255, 255, 255, ${(avgLight - 1) * 0.45})`;
            ctx.fill();
          } else if (avgLight < 1) {
            ctx.fillStyle = `rgba(0, 0, 0, ${(1 - avgLight) * 0.55})`;
            ctx.fill();
          }

          ctx.restore();
        }
      }

      // Soft ambient drop shadow underneath flag
      ctx.save();
      ctx.globalCompositeOperation = "destination-over";
      ctx.filter = "blur(18px)";
      ctx.fillStyle = "rgba(1, 65, 28, 0.25)";
      ctx.beginPath();
      ctx.ellipse(cw * 0.5, ch * 0.88, flagW * 0.45, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [windSpeed]);

  return (
    <div
      className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="transition-transform duration-300 ease-out will-change-transform drop-shadow-[0_20px_35px_rgba(1,65,28,0.25)]"
        style={{
          transform: `rotateY(${tiltY}deg) rotateX(${tiltX}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <canvas
          ref={canvasRef}
          width={width * 1.5}
          height={height * 1.5}
          style={{ width: `${width}px`, height: `${height}px` }}
          className="object-contain"
        />
      </div>
    </div>
  );
}
