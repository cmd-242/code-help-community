"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { FlameIcon } from "@/components/icons";
import { WEEKLY_GOALS, weeklyXp, type WeeklyGoal } from "@/features/gamification/rules";
import Link from "next/link";
import { useProgress } from "@/features/progression/progress-store";
import { useHydratedProgress } from "@/features/progression/use-hydrated-progress";
import { useSound } from "@/features/sound/sound-provider";

/**
 * Le rythme de l'apprenant.
 * Libre (par défaut) : il se fixe lui-même un objectif d'XP par semaine.
 * En classe (option) : c'est l'enseignant qui ouvre les notions.
 */
export function RhythmPanel() {
  const t = useTranslations("rhythm");
  const ready = useHydratedProgress();
  const { play } = useSound();
  const classroom = useProgress((s) => s.classroom);
  const goal = useProgress((s) => s.weeklyGoal);
  const events = useProgress((s) => s.xpEvents);

  if (!ready) return <div className="mt-4 h-40 animate-pulse rounded-[2rem] bg-surface-sunk" />;

  const earned = weeklyXp(events, new Date());
  const target = WEEKLY_GOALS[goal];
  const reached = earned >= target;

  const pickGoal = (g: WeeklyGoal) => {
    play("pick");
    useProgress.getState().setWeeklyGoal(g);
  };

  return (
    <section className="mt-4 grid gap-4 sm:grid-cols-[1.3fr_1fr]" aria-label={t("label")}>
      {!classroom ? (
        <div className="paper rounded-[2rem] p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-2xl font-semibold">{t("goalTitle")}</h2>
            <span className={`shrink-0 whitespace-nowrap font-bold tabular-nums ${reached ? "text-success-deep" : "text-info-deep"}`}>
              {t("goalProgress", { earned, target })}
            </span>
          </div>
          <div className="mt-3 h-3.5 overflow-hidden rounded-full bg-[#dcefee]">
            <motion.div
              className={`h-full rounded-full ${reached ? "bg-success" : "bg-info-deep"}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (earned / target) * 100)}%` }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          </div>
          <p className="mt-2 text-sm text-muted">{reached ? t("goalReached") : t("goalHint")}</p>
          <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label={t("goalPick")}>
            {(Object.keys(WEEKLY_GOALS) as WeeklyGoal[]).map((g) => (
              <button
                key={g}
                type="button"
                role="radio"
                aria-checked={goal === g}
                onClick={() => pickGoal(g)}
                className={`flex min-h-11 items-center gap-1.5 rounded-full px-3.5 py-1.5 font-bold transition ${
                  goal === g ? "bg-ink text-white" : "bg-surface-sunk text-ink hover:bg-line"
                }`}
              >
                <FlameIcon className={`size-4 ${g === "intense" ? "text-primary" : g === "steady" ? "text-accent-deep" : "text-muted"}`} />
                {t(`goals.${g}`, { xp: WEEKLY_GOALS[g] })}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="paper rounded-[2rem] p-5">
          <p className="font-bold text-info-deep">{t("classLabel")}</p>
          <h2 className="font-display text-2xl font-semibold">{classroom.name}</h2>
          <p className="mt-2 text-muted">{t("classBody")}</p>
        </div>
      )}

      <div className="rounded-[2rem] border-2 border-line p-5">
        <h2 className="font-display text-2xl font-semibold">{t("modeTitle")}</h2>
        <p className="mt-2 text-muted">{classroom ? t("modeClass") : t("modeFree")}</p>
        {!classroom && (
          <Link href="/rejoindre" onClick={() => play("click")} className="mt-3 inline-flex min-h-11 items-center rounded-full bg-surface-sunk px-4 font-bold text-info-deep">
            {t("joinClass")}
          </Link>
        )}
      </div>
    </section>
  );
}
