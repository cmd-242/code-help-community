"use client";

import confetti from "canvas-confetti";

const palettes = {
  gold: ["#ffd27a", "#f2a541", "#fff1c1", "#c47a22"],
  moss: ["#7fe0c2", "#b5f5df", "#ffd27a", "#3e8f7a"],
};

/** Pluie d'étincelles (désactivée si l'utilisateur réduit les animations) */
export function fireConfetti(palette: keyof typeof palettes = "gold") {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = palettes[palette];
  const shoot = (x: number, angle: number) =>
    confetti({ particleCount: 70, angle, spread: 60, origin: { x, y: 0.75 }, colors, scalar: 0.9, ticks: 220, gravity: 0.9 });
  shoot(0.1, 60);
  shoot(0.9, 120);
  window.setTimeout(() => confetti({ particleCount: 90, spread: 110, origin: { y: 0.45 }, colors, shapes: ["star"], scalar: 1.1 }), 220);
}
