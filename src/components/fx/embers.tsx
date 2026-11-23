"use client";

import { useEffect, useRef } from "react";

type Ember = { x: number; y: number; vx: number; vy: number; r: number; life: number; max: number; hue: number };

/**
 * Braises qui montent doucement. Canvas unique, ~60 particules :
 * léger pour les téléphones. Désactivé si l'utilisateur préfère réduire les animations.
 */
export function Embers({ density = 1, className = "" }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const count = Math.round(Math.min(70, (w * h) / 16000) * density);
    const spawn = (initial = false): Ember => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 10,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(0.25 + Math.random() * 0.7),
      r: 0.6 + Math.random() * 1.8,
      life: 0,
      max: 220 + Math.random() * 320,
      hue: 22 + Math.random() * 22,
    });
    const embers = Array.from({ length: count }, () => spawn(true));

    let raf = 0;
    let t = 0;
    const frame = () => {
      t += 1;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.life += 1;
        e.x += e.vx + Math.sin((t + i * 37) / 60) * 0.25;
        e.y += e.vy;
        const k = e.life / e.max;
        const alpha = k < 0.1 ? k * 10 : 1 - k;
        if (e.y < -10 || k >= 1) {
          embers[i] = spawn();
          continue;
        }
        const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 4);
        g.addColorStop(0, `hsla(${e.hue}, 100%, 70%, ${alpha})`);
        g.addColorStop(1, `hsla(${e.hue}, 100%, 50%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
