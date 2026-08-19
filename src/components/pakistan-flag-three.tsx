import { useEffect, useRef } from "react";
import * as THREE from "three";

interface PakistanFlagThreeProps {
  className?: string;
  width?: number;
  height?: number;
  windSpeed?: number;
  tiltX?: number;
  tiltY?: number;
}

export function PakistanFlagThree({
  className = "",
  width = 460,
  height = 300,
  windSpeed = 1.0,
  tiltX = 0,
  tiltY = 0,
}: PakistanFlagThreeProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Scene & Transparent WebGL Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // 100% Transparent
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    mount.appendChild(renderer.domElement);

    // 2. High-Resolution Pakistan Flag Texture (2048 x 1365)
    const texCanvas = document.createElement("canvas");
    texCanvas.width = 2048;
    texCanvas.height = 1365;
    const tctx = texCanvas.getContext("2d");
    if (tctx) {
      const tw = texCanvas.width;
      const th = texCanvas.height;

      // Dark Green (#01411c) field
      tctx.fillStyle = "#01411c";
      tctx.fillRect(0, 0, tw, th);

      // White vertical hoist bar (1/4th width)
      tctx.fillStyle = "#ffffff";
      tctx.fillRect(0, 0, tw * 0.25, th);

      // White Crescent & Star
      const cx = tw * 0.615;
      const cy = th * 0.5;
      const r = th * 0.31;

      tctx.save();
      // Outer crescent circle
      tctx.fillStyle = "#ffffff";
      tctx.beginPath();
      tctx.arc(cx, cy, r, 0, Math.PI * 2);
      tctx.fill();

      // Inner green cut circle
      tctx.fillStyle = "#01411c";
      tctx.beginPath();
      const cutAngle = -Math.PI / 4.1;
      const cutOffset = r * 0.28;
      tctx.arc(cx + Math.cos(cutAngle) * cutOffset, cy + Math.sin(cutAngle) * cutOffset, r * 0.89, 0, Math.PI * 2);
      tctx.fill();

      // 5-Pointed Star
      const starX = cx + r * 0.56;
      const starY = cy - r * 0.44;
      const starR = r * 0.33;
      const starAngle = -Math.PI / 4.5;

      tctx.translate(starX, starY);
      tctx.rotate(starAngle);
      tctx.fillStyle = "#ffffff";
      tctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const outerA = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const innerA = outerA + Math.PI / 5;
        const x1 = Math.cos(outerA) * starR;
        const y1 = Math.sin(outerA) * starR;
        const x2 = Math.cos(innerA) * (starR * 0.42);
        const y2 = Math.sin(innerA) * (starR * 0.42);
        if (i === 0) tctx.moveTo(x1, y1);
        else tctx.lineTo(x1, y1);
        tctx.lineTo(x2, y2);
      }
      tctx.closePath();
      tctx.fill();
      tctx.restore();

      // Subtle fabric weave texture overlay
      tctx.fillStyle = "rgba(255,255,255,0.03)";
      for (let y = 0; y < th; y += 4) {
        tctx.fillRect(0, y, tw, 1.5);
      }
    }

    const flagTexture = new THREE.CanvasTexture(texCanvas);
    flagTexture.generateMipmaps = true;
    flagTexture.minFilter = THREE.LinearMipmapLinearFilter;

    // 3. 3D Cloth Physics Mesh
    const flagWidth = 5.2;
    const flagHeight = 3.3;
    const cols = 50;
    const rows = 32;
    const geometry = new THREE.PlaneGeometry(flagWidth, flagHeight, cols, rows);

    const material = new THREE.MeshStandardMaterial({
      map: flagTexture,
      side: THREE.DoubleSide,
      roughness: 0.45,
      metalness: 0.08,
    });

    const flagMesh = new THREE.Mesh(geometry, material);
    flagMesh.position.set(flagWidth * 0.5 - 2.5, 0, 0);
    scene.add(flagMesh);

    // 4. Gold Metallic Flagpole
    const poleRadius = 0.045;
    const poleHeight = 4.6;
    const poleGeo = new THREE.CylinderGeometry(poleRadius, poleRadius, poleHeight, 24);
    const poleMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.2,
    });
    const poleMesh = new THREE.Mesh(poleGeo, poleMat);
    poleMesh.position.set(-2.5, -0.3, 0);
    scene.add(poleMesh);

    // Gold Finial Sphere
    const sphereGeo = new THREE.SphereGeometry(0.12, 24, 24);
    const sphereMesh = new THREE.Mesh(sphereGeo, poleMat);
    sphereMesh.position.set(-2.5, poleHeight / 2 - 0.3, 0);
    scene.add(sphereMesh);

    // 5. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff8e7, 2.2);
    sunLight.position.set(4, 6, 6);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xa5d6a7, 0.8);
    fillLight.position.set(-4, -2, 4);
    scene.add(fillLight);

    // 6. Animation Loop (Cloth Simulation)
    let animId: number;
    const startTime = performance.now();

    const posAttr = geometry.attributes.position;
    const initialPositions = posAttr.array.slice();

    const animate = () => {
      const elapsedTime = ((performance.now() - startTime) / 1000) * windSpeed * 2.2;

      for (let i = 0; i < posAttr.count; i++) {
        const u = (initialPositions[i * 3] + flagWidth / 2) / flagWidth;
        const v = (initialPositions[i * 3 + 1] + flagHeight / 2) / flagHeight;

        // Wave amplitude increases toward the free fly edge
        const amp = Math.pow(Math.max(0, u), 1.3) * 0.38;
        const wave1 = Math.sin(u * 5.5 - elapsedTime * 2.5 + v * 1.2) * amp;
        const wave2 = Math.cos(u * 10 - elapsedTime * 3.8 + v * 2) * (amp * 0.25);
        const wave3 = Math.sin(v * 4 - elapsedTime) * 0.06 * u;

        posAttr.setZ(i, wave1 + wave2 + wave3);
        posAttr.setY(i, initialPositions[i * 3 + 1] + Math.sin(u * 3 - elapsedTime) * (u * 0.08));
      }

      posAttr.needsUpdate = true;
      geometry.computeVertexNormals();

      // Smooth tilt
      scene.rotation.y = (tiltY * Math.PI) / 180;
      scene.rotation.x = (tiltX * Math.PI) / 180;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      flagTexture.dispose();
      poleGeo.dispose();
      poleMat.dispose();
      sphereGeo.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [width, height, windSpeed, tiltX, tiltY]);

  return (
    <div
      ref={mountRef}
      className={`flex items-center justify-center select-none pointer-events-none drop-shadow-[0_20px_35px_rgba(1,65,28,0.3)] ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
}
