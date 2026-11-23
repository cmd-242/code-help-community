"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { ScrollIcon, SkullIcon, TorchIcon } from "@/components/icons";
import { RuneLink } from "@/components/ui/rune-button";
import type { FloorSummary } from "@/features/catalog/queries";
import { useProgress } from "@/features/progression/progress-store";
import { useFloorStates } from "@/features/progression/use-floor-states";

/** La quête de la semaine : ce que l'enseignant a ouvert et ce qu'il reste à faire. */
export function WeekQuest({ floors }: { floors: FloorSummary[] }) {
  const t = useTranslations("camp");
  const { ready, states } = useFloorStates(floors);
  const mode = useProgress((s) => s.mode);
  const i = states.findIndex((s) => s.status === "open" || s.status === "guardian");
  const floor = i >= 0 ? floors[i] : null;
  const state = i >= 0 ? states[i] : null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="stone relative overflow-hidden rounded-2xl border border-torch/50 p-6 shadow-[0_30px_80px_-30px_rgba(242,165,65,0.45)] sm:p-8"
      aria-labelledby="quest-title"
    >
      <span aria-hidden className="absolute -right-10 -top-10 size-48 animate-flicker rounded-full bg-[radial-gradient(circle,rgba(242,165,65,0.35),transparent_70%)]" />
      <p className="relative flex items-center gap-2 text-torch">
        <ScrollIcon className="size-5" />
        {mode === "classroom" ? t("questLabelClass") : t("questLabelFree")}
      </p>

      {!ready ? (
        <div className="mt-3 h-24 animate-pulse rounded-lg bg-abyss/40" />
      ) : floor && state ? (
        <div className="relative">
          <h1 id="quest-title" className="carved mt-2 text-4xl text-parchment text-balance sm:text-5xl">
            {t("questTitle", { floor: floor.floor, room: floor.room })}
          </h1>
          <p className="mt-2 max-w-lg text-lg text-parchment-dim">{floor.summary}</p>

          <div className="mt-5 flex items-center gap-3">
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-abyss-deep">
              <motion.div
                className="h-full rounded-full bg-[linear-gradient(90deg,#3e8f7a,#7fe0c2)]"
                initial={{ width: 0 }}
                animate={{ width: `${floor.stageIds.length ? (state.stagesDone / floor.stageIds.length) * 100 : 0}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <span className="tabular-nums text-parchment-dim">
              {t("questProgress", { done: state.stagesDone, total: floor.stageIds.length })}
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {state.status === "guardian" ? (
              <RuneLink href={`/app/etage/${floor.slug}/gardien`} variant="ember" sfx="door">
                <SkullIcon className="size-5" />
                {t("faceGuardian", { name: floor.guardian.name })}
              </RuneLink>
            ) : (
              <RuneLink href={`/app/etage/${floor.slug}`} sfx="door">
                <TorchIcon className="size-5" />
                {state.stagesDone > 0 ? t("continue") : t("start")}
              </RuneLink>
            )}
          </div>
        </div>
      ) : (
        <div className="relative">
          <h1 id="quest-title" className="carved mt-2 text-4xl text-parchment">
            {t("allDoneTitle")}
          </h1>
          <p className="mt-2 text-lg text-parchment-dim">{mode === "classroom" ? t("allDoneBodyClass") : t("allDoneBodyFree")}</p>
        </div>
      )}
    </motion.section>
  );
}
