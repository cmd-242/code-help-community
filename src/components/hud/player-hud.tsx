"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { FlameIcon } from "@/components/icons";
import { currentStreak, levelFromXp, rankKey, toDayKey } from "@/features/gamification/rules";
import { totalXp, useProgress } from "@/features/progression/progress-store";
import { useHydratedProgress } from "@/features/progression/use-hydrated-progress";
import { SoundToggle } from "@/features/sound/sound-toggle";

/** Barre du haut : blason de niveau, jauge d'XP en or fondu, série, son. */
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
    <header className="sticky top-0 z-40 border-b border-stone-edge/40 bg-abyss/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-2.5">
        <Link href="/app" className="group flex items-center gap-3" aria-label={t("home")}>
          <LevelShield level={lvl.level} />
          <div className="hidden min-w-0 sm:block">
            <p className="font-display text-lg leading-none text-torch-bright">{tr(rankKey(lvl.level))}</p>
            <p className="text-sm leading-tight text-parchment-dim">{t("level", { level: lvl.level })}</p>
          </div>
        </Link>

        <div className="min-w-0 flex-1" title={t("xpTitle", { current: lvl.current, needed: lvl.needed })}>
          <div className="relative h-3.5 overflow-hidden rounded-full border border-[#6b3f10] bg-abyss-deep shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,#c47a22,#f2a541_60%,#ffd27a)]"
              initial={false}
              animate={{ width: `${Math.max(3, lvl.progress * 100)}%` }}
              transition={{ type: "spring", stiffness: 70, damping: 16 }}
            >
              <span className="absolute inset-0 animate-flicker bg-[linear-gradient(180deg,rgba(255,255,255,0.45),transparent_60%)]" />
            </motion.div>
          </div>
          <p className="mt-0.5 text-right text-xs tabular-nums text-parchment-dim">
            {t("xp", { current: lvl.current, needed: lvl.needed })}
          </p>
        </div>

        <div
          className={`flex items-center gap-1 rounded-full border px-2.5 py-1 ${streak > 0 ? "border-ember/60 text-ember" : "border-stone-edge/50 text-parchment-dim"}`}
          title={t("streakTitle", { count: streak })}
        >
          <FlameIcon className={`size-5 ${streak > 0 ? "animate-flicker" : "opacity-50"}`} />
          <span className="font-display text-lg tabular-nums leading-none">{streak}</span>
        </div>

        <SoundToggle />
      </div>
    </header>
  );
}

export function LevelShield({ level, size = "md" }: { level: number; size?: "md" | "xl" }) {
  const dims = size === "xl" ? "size-36 text-6xl" : "size-11 text-xl";
  return (
    <span className={`relative grid shrink-0 place-items-center ${dims}`}>
      <svg viewBox="0 0 48 52" className="absolute inset-0 size-full drop-shadow-[0_0_8px_rgba(242,165,65,0.45)]" aria-hidden>
        <defs>
          <linearGradient id={`shield-${size}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffd27a" />
            <stop offset="0.5" stopColor="#f2a541" />
            <stop offset="1" stopColor="#8a5420" />
          </linearGradient>
        </defs>
        <path d="M24 2l20 6v16c0 13-9 22-20 26C13 46 4 37 4 24V8z" fill={`url(#shield-${size})`} />
        <path d="M24 6.5l16 4.8v12.9c0 10.4-7.1 17.6-16 21-8.9-3.4-16-10.6-16-21V11.3z" fill="#1f3138" />
      </svg>
      <span className="relative font-display font-black leading-none text-torch-bright torchlight">{level}</span>
    </span>
  );
}
