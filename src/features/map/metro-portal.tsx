"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { MetroIcon } from "@/components/icons";
import { GameButton } from "@/components/ui/game-button";
import { useSound } from "@/features/sound/sound-provider";
import { CitySkyline } from "@/universes/metro/city-scene";

/**
 * La porte d'entrée de Néo-Métro, depuis l'Archipel : une bouche de métro dans la nuit.
 * Au clic, deux portes se ferment sur l'écran, puis la ville apparaît.
 */
export function MetroPortal({ href, trackTitle, stations }: { href: string; trackTitle: string; stations: number }) {
  const t = useTranslations("portal");
  const router = useRouter();
  const { play } = useSound();
  const [going, setGoing] = useState(false);

  const go = () => {
    if (going) return;
    setGoing(true);
    play("enter");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => router.push(href), reduce ? 0 : 1100);
  };

  return (
    <section aria-labelledby="portal-title" data-universe="metro" className="city relative mt-10 overflow-hidden rounded-[2rem] text-ink">
      <CitySkyline className="absolute inset-x-0 bottom-0 h-1/2 w-full opacity-50" />
      <div className="relative px-6 pb-10 pt-8">
        <p className="flex items-center gap-2 font-bold text-info-deep">
          <MetroIcon className="size-8" />
          {t("line", { title: trackTitle, count: stations })}
        </p>
        <h2 id="portal-title" className="mt-3 font-display text-5xl font-bold leading-none text-white">
          {t("title")}
        </h2>
        <p className="mt-3 max-w-md text-lg text-white/85">{t("lede")}</p>
        <GameButton onClick={go} disabled={going} sfx="click" className="mt-6">
          {going ? t("going") : t("go")}
        </GameButton>
      </div>
      <AnimatePresence>
        {going && (
          <div className="pointer-events-none fixed inset-0 z-[90] flex" aria-hidden>
            <motion.div className="h-full w-1/2 bg-night" initial={{ x: "-100%" }} animate={{ x: 0 }} transition={{ duration: 0.55, ease: [0.7, 0, 0.3, 1] }} />
            <motion.div className="h-full w-1/2 bg-night" initial={{ x: "100%" }} animate={{ x: 0 }} transition={{ duration: 0.55, ease: [0.7, 0, 0.3, 1] }} />
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
