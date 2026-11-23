"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { FlameIcon } from "@/components/icons";
import { currentStreak, levelFromXp, rankKey, toDayKey } from "@/features/gamification/rules";
import { totalXp, useProgress } from "@/features/progression/progress-store";
import { useHydratedProgress } from "@/features/progression/use-hydrated-progress";
import { AccountButton } from "@/features/account/account-button";
import { SoundToggle } from "@/features/sound/sound-toggle";

/** Barre du haut : avatar et niveau, jauge d'XP, série de jours, son. */
export function PlayerHud() {
  const t = useTranslations("hud");
  const tr = useTranslations("ranks");
  const hydrated = useHydratedProgress();
  const events = useProgress((s) => s.xpEvents);
  const days = useProgress((s) => s.activeDays);

  const xp = hydrated ? totalXp(events) : 0;
  const lvl = levelFromXp(xp);
  const streak = hydrated ? currentStreak(days, toDayKey(new Date())) : 0;

  return (
    <header className="sticky top-0 z-40 px-3 pt-3">
      <div className="paper mx-auto flex max-w-3xl items-center gap-2 rounded-3xl px-2.5 py-2.5 sm:gap-3 sm:px-3">
        <Link href="/app" className="flex items-center gap-2.5" aria-label={t("home")}>
          <LevelBadge level={lvl.level} />
          <span className="hidden min-w-0 sm:block">
            <span className="block font-display text-lg font-semibold leading-none">{tr(rankKey(lvl.level))}</span>
            <span className="text-sm text-muted">{t("level", { level: lvl.level })}</span>
          </span>
        </Link>

        <div className="min-w-0 flex-1" title={t("xpTitle", { current: lvl.current, needed: lvl.needed })}>
          <div className="relative h-3.5 overflow-hidden rounded-full bg-track">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-info-deep"
              initial={false}
              animate={{ width: `${Math.max(3, lvl.progress * 100)}%` }}
              transition={{ type: "spring", stiffness: 70, damping: 16 }}
            >
              <span className="absolute inset-x-1 top-0.5 h-1 rounded-full bg-white/40" />
            </motion.div>
          </div>
          <p className="mt-0.5 text-right text-xs font-bold tabular-nums text-muted">{t("xp", { current: lvl.current, needed: lvl.needed })}</p>
        </div>

        <div
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 font-display text-lg font-semibold ${streak > 0 ? "bg-primary/12 text-primary-deep" : "bg-surface-sunk text-muted"}`}
          title={t("streakTitle", { count: streak })}
        >
          <FlameIcon className={`size-5 ${streak > 0 ? "text-primary" : "text-muted/60"}`} />
          <span className="tabular-nums leading-none">{streak}</span>
        </div>

        <SoundToggle />
        <AccountButton />
      </div>
    </header>
  );
}

/** Pastille de niveau : une bouée dorée avec le chiffre au centre */
export function LevelBadge({ level, size = "md" }: { level: number; size?: "md" | "xl" }) {
  const dims = size === "xl" ? "size-36 text-6xl" : "size-11 text-xl";
  return (
    <span className={`relative grid shrink-0 place-items-center ${dims}`}>
      <svg viewBox="0 0 48 48" className="absolute inset-0 size-full" aria-hidden>
        <circle cx="24" cy="24" r="20" fill="none" stroke="#ffcf6b" strokeWidth="7" />
        <circle cx="24" cy="24" r="20" fill="none" stroke="#e8503f" strokeWidth="7" strokeDasharray="7.85 7.85" />
        <circle cx="24" cy="24" r="16" fill="#147a91" />
      </svg>
      <span className="relative font-display font-bold leading-none text-white">{level}</span>
    </span>
  );
}
