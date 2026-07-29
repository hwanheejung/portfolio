"use client";

import { useEffect, useRef } from "react";

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const pointer = { x: 0.68, y: 0.42, active: false };
    let frame = 0;
    let width = 1;
    let height = 1;
    let start = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (now: number) => {
      const time = reducedMotion ? 0 : (now - start) / 1000;
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#0b0c09";
      context.fillRect(0, 0, width, height);

      const spacing = Math.max(12, Math.min(18, width / 42));
      const columns = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;
      const px = pointer.x * width;
      const py = pointer.y * height;

      context.fillStyle = "#d6ef6b";
      for (let row = -1; row < rows; row += 1) {
        for (let column = -1; column < columns; column += 1) {
          const baseX = column * spacing;
          const baseY = row * spacing;
          const nx = baseX / width;
          const ny = baseY / height;
          const fold =
            Math.sin(nx * 8.4 + time * 0.52) * 0.32 +
            Math.cos(ny * 7.1 - time * 0.38) * 0.25 +
            Math.sin((nx + ny) * 5.6 + time * 0.24) * 0.3;
          const ridge = Math.exp(
            -Math.pow(ny - (0.48 + Math.sin(nx * 4.2 + time * 0.3) * 0.18), 2) /
              0.018,
          );
          const distance = Math.hypot(baseX - px, baseY - py);
          const influence = pointer.active
            ? Math.max(0, 1 - distance / Math.min(width, height) / 0.42)
            : 0;
          const angle = Math.atan2(baseY - py, baseX - px);
          const displacement = fold * spacing * 1.8 + ridge * spacing * 2.8;
          const x =
            baseX +
            Math.cos(angle) * influence * 24 +
            Math.sin(ny * 9 + time) * displacement * 0.22;
          const y =
            baseY +
            Math.sin(angle) * influence * 24 +
            displacement;
          const alpha = Math.max(
            0.08,
            Math.min(0.94, 0.23 + ridge * 0.55 + influence * 0.45 + fold * 0.12),
          );
          const radius = 0.8 + ridge * 1.05 + influence * 0.8;

          context.globalAlpha = alpha;
          context.beginPath();
          context.arc(x, y, radius, 0, Math.PI * 2);
          context.fill();
        }
      }
      context.globalAlpha = 1;

      if (!reducedMotion) frame = requestAnimationFrame(draw);
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reducedMotion) draw(performance.now());
    });
    resizeObserver.observe(canvas);

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width;
      pointer.y = (event.clientY - rect.top) / rect.height;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    resize();
    start = performance.now();
    draw(start);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      aria-hidden="true"
      className="absolute inset-0 h-full w-full touch-none"
      ref={canvasRef}
    />
  );
}
