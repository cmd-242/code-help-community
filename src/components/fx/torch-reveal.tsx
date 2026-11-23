"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useSound } from "@/features/sound/sound-provider";

/** Commandes et mots-clés gravés dans le mur : ce qu'on apprend dans le donjon. */
const RUNES = [
  "ls -la", "cd ..", "git commit", "grep -i", "ssh", "chmod 755", "for i in", "def quete():", "SELECT *",
  "docker run", "ping 10.0.0.1", "sudo", "git branch", "cat | wc -l", "while true", "import os",
  "nmap", "aws s3 ls", "gcloud init", "mkdir -p", "tail -f", "const hero", "if [ -f ]", "git merge",
  "chown", "ps aux", "kill -9", "curl -I", "async", "return", "rm -i", "echo $PATH",
];

/**
 * Le mur du donjon : sombre, sauf là où passe la torche (le pointeur ou le doigt).
 * Sans interaction, la torche erre seule. Le rendu ne déclenche aucun re-render React :
 * seules deux variables CSS bougent.
 */
export function TorchReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { play } = useSound();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lastInput = 0;
    let raf = 0;
    const set = (x: number, y: number) => {
      el.style.setProperty("--tx", `${x}px`);
      el.style.setProperty("--ty", `${y}px`);
    };
    const rect = () => el.getBoundingClientRect();
    set(rect().width * 0.5, rect().height * 0.45);
    if (reduce) return;

    const onMove = (e: PointerEvent) => {
      const r = rect();
      lastInput = performance.now();
      set(e.clientX - r.left, e.clientY - r.top);
    };
    // La torche erre seule quand personne ne la tient
    const wander = (t: number) => {
      if (t - lastInput > 2500) {
        const r = rect();
        const s = t / 1000;
        set(r.width * (0.5 + 0.34 * Math.sin(s * 0.37)), r.height * (0.48 + 0.26 * Math.sin(s * 0.61 + 1)));
      }
      raf = requestAnimationFrame(wander);
    };
    raf = requestAnimationFrame(wander);
    el.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
    };
  }, []);

  const wall = (lit: boolean) => (
    <div
      aria-hidden
      className={`absolute inset-0 flex flex-wrap content-start items-center pt-20 justify-center gap-x-10 gap-y-6 overflow-hidden px-4 font-display leading-none ${
        lit ? "text-torch-bright" : "text-[#1c2f36]"
      }`}
      style={
        lit
          ? {
              WebkitMaskImage: "radial-gradient(circle 260px at var(--tx) var(--ty), #000 0%, rgba(0,0,0,0.7) 40%, transparent 100%)",
              maskImage: "radial-gradient(circle 260px at var(--tx) var(--ty), #000 0%, rgba(0,0,0,0.7) 40%, transparent 100%)",
              textShadow: "0 0 22px rgba(242,165,65,0.95), 0 0 4px rgba(255,210,122,0.9)",
            }
          : { textShadow: "0 1px 0 rgba(255,255,255,0.05), 0 -1px 0 rgba(0,0,0,0.7)" }
      }
    >
      {[...RUNES, ...RUNES.slice().reverse()].map((r, i) => (
        <span
          key={`${r}-${i}`}
          className="whitespace-nowrap"
          style={{ fontSize: `${2 + ((i * 7) % 5) * 0.6}rem`, transform: `rotate(${((i * 13) % 7) - 3}deg)`, opacity: lit ? 1 : 0.9 }}
        >
          {r}
        </span>
      ))}
    </div>
  );

  return (
    <div
      ref={ref}
      onPointerDown={() => play("torch")}
      className="stone relative isolate min-h-[100svh] overflow-hidden"
      style={{ ["--tx" as string]: "50%", ["--ty" as string]: "45%" }}
    >
      {wall(false)}
      {/* halo chaud de la torche */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 animate-flicker"
        style={{ background: "radial-gradient(circle 420px at var(--tx) var(--ty), rgba(242,165,65,0.38), rgba(228,87,46,0.12) 40%, transparent 72%)" }}
      />
      {wall(true)}
      {/* vignette : l'obscurité autour */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,11,13,0.85)_100%)]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
