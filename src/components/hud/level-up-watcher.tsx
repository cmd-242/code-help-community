"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { fireConfetti } from "@/components/fx/confetti";
import { GameButton } from "@/components/ui/game-button";
import { levelFromXp, rankKey } from "@/features/gamification/rules";
import { totalXp, useProgress } from "@/features/progression/progress-store";
import { useHydratedProgress } from "@/features/progression/use-hydrated-progress";
import { useSound } from "@/features/sound/sound-provider";
import { LevelBadge } from "./player-hud";

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
          className="fixed inset-0 z-[80] grid place-items-center bg-ink/60 p-6 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="level-up-title"
        >
          <motion.div
            className="paper flex w-full max-w-sm flex-col items-center rounded-[2rem] px-6 pb-8 pt-10 text-center"
            initial={{ scale: 0.5, rotate: -6 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 13 }}
          >
            <motion.div animate={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1 }}>
              <LevelBadge level={shown} size="xl" />
            </motion.div>
            <h2 id="level-up-title" className="mt-6 font-display text-4xl font-bold text-ink">
              {t("title")}
            </h2>
            <p className="mt-2 text-lg text-muted">{t("body", { level: shown, rank: tr(rankKey(shown)) })}</p>
            <GameButton className="mt-8 w-full" onClick={() => setShown(null)} autoFocus>
              {t("continue")}
            </GameButton>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
