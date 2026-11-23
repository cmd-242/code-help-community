"use client";

import { motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { useSound } from "@/features/sound/sound-provider";
import { BoatArt } from "./boat-art";
import { IslandArt } from "./island-art";
import { SeaWaves } from "./sea-waves";

/**
 * Accueil : une mer vivante. Toucher l'eau fait naviguer le bateau jusqu'à ce point.
 * C'est le seul « moment fort » de la page ; le reste reste calme.
 */
export function HeroSea({ children, hint }: { children: ReactNode; hint: string }) {
  const { play } = useSound();
  const [target, setTarget] = useState({ x: 22, flip: false });

  const sail = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(88, Math.max(6, ((e.clientX - rect.left) / rect.width) * 100));
    setTarget((prev) => ({ x, flip: x < prev.x }));
    play("whoosh");
  };

  return (
    <div className="sea relative h-[58svh] min-h-80 overflow-hidden" onPointerDown={sail}>
      <SeaWaves />
      {/* soleil */}
      <div aria-hidden className="absolute right-[12%] top-[10%] size-20 rounded-full bg-accent shadow-[0_0_80px_30px_rgba(255,207,107,0.6)]" />
      {/* îles à l'horizon */}
      <IslandArt seed={0} state="cleared" className="absolute bottom-[34%] left-[4%] w-32 sm:w-44" />
      <IslandArt seed={1} state="current" className="absolute bottom-[44%] left-[44%] w-24 sm:w-36" />
      <IslandArt seed={2} state="locked" className="absolute bottom-[30%] right-[3%] w-36 sm:w-52" />

      <motion.div
        className="absolute bottom-[16%] w-20 sm:w-24"
        animate={{ left: `${target.x}%` }}
        transition={{ type: "spring", stiffness: 30, damping: 12 }}
        style={{ x: "-50%" }}
      >
        <div style={{ transform: target.flip ? "scaleX(-1)" : undefined }}>
          <BoatArt className="w-20 sm:w-24" />
        </div>
      </motion.div>

      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-surface/90 px-4 py-1.5 text-sm font-bold text-ink">{hint}</p>
      {children}
    </div>
  );
}
