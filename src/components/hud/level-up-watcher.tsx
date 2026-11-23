"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { RuneButton } from "@/components/ui/rune-button";
import { levelFromXp, rankKey } from "@/features/gamification/rules";
import { totalXp, useProgress } from "@/features/progression/progress-store";
import { useHydratedProgress } from "@/features/progression/use-hydrated-progress";
import { useSound } from "@/features/sound/sound-provider";
import { fireConfetti } from "@/components/fx/confetti";
import { LevelShield } from "./player-hud";

/** Surveille les XP et célèbre chaque passage de niveau, où qu'il ait lieu. */
export function LevelUpWatcher() {
  const t = useTranslations("levelUp");
  const tr = useTranslations("ranks");
  const hydrated = useHydratedProgress();
  const level = useProgress((s) => levelFromXp(totalXp(s.xpEvents)).level);
  const previous = useRef<number | null>(null);
  const [shown, setShown] = useState<number | null>(null);
  const { play } = useSound();

  useEffect(() => {
    if (!hydrated) return;
    if (previous.current !== null && level > previous.current) {
      // petit délai : on laisse d'abord jouer le son de victoire
      const id = window.setTimeout(() => {
        setShown(level);
        play("levelUp");
        fireConfetti("gold");
      }, 1400);
      previous.current = level;
      return () => window.clearTimeout(id);
    }
    previous.current = level;
  }, [hydrated, level, play]);

  return (
    <AnimatePresence>
      {shown !== null && (
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-center bg-abyss-deep/85 p-6 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="level-up-title"
        >
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ scale: 0.4, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 12 }}
          >
            <div className="relative">
              <span className="absolute inset-0 -z-10 scale-[2.2] rounded-full bg-[radial-gradient(circle,rgba(242,165,65,0.45),transparent_65%)] animate-flicker" />
              <LevelShield level={shown} size="xl" />
            </div>
            <h2 id="level-up-title" className="carved torchlight mt-6 text-5xl text-torch-bright">
              {t("title")}
            </h2>
            <p className="mt-2 text-xl text-parchment">{t("body", { level: shown, rank: tr(rankKey(shown)) })}</p>
            <RuneButton className="mt-8" onClick={() => setShown(null)} autoFocus>
              {t("continue")}
            </RuneButton>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
