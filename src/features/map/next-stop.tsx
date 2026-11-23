"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { AnchorIcon, SailIcon } from "@/components/icons";
import { GameLink } from "@/components/ui/game-button";
import type { NotionSummary } from "@/features/catalog/queries";
import { useProgress } from "@/features/progression/progress-store";
import { useNotionStates } from "@/features/progression/use-notion-states";
import { CreatureArt } from "@/universes/archipel/creature-art";

/** La prochaine escale : la notion en cours et la prochaine action à faire. */
export function NextStop({ notions }: { notions: NotionSummary[] }) {
  const t = useTranslations("camp");
  const { ready, states } = useNotionStates(notions);
  const inClass = useProgress((s) => Boolean(s.classroom));
  const i = states.findIndex((s) => s.status === "open" || s.status === "guardian");
  const notion = i >= 0 ? notions[i] : null;
  const state = i >= 0 ? states[i] : null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="paper relative overflow-hidden rounded-[2rem] p-6 sm:p-8"
      aria-labelledby="quest-title"
    >
      <p className="flex items-center gap-2 font-bold text-info-deep">
        <AnchorIcon className="size-5" />
        {inClass ? t("questLabelClass") : t("questLabelFree")}
      </p>

      {!ready ? (
        <div className="mt-3 h-28 animate-pulse rounded-2xl bg-surface-sunk" />
      ) : notion && state ? (
        <div className="relative">
          {state.status === "guardian" && (
            <CreatureArt position={notion.position} className="absolute -right-4 -top-10 hidden w-36 animate-bob sm:block" />
          )}
          <h1 id="quest-title" className="mt-1 font-display text-4xl font-bold leading-tight text-balance">
            {notion.place}
          </h1>
          <p className="mt-2 max-w-lg text-lg text-muted">{notion.summary}</p>

          <div className="mt-5 flex items-center gap-3">
            <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-[#dcefee]">
              <motion.div
                className="h-full rounded-full bg-success"
                initial={{ width: 0 }}
                animate={{ width: `${notion.stageIds.length ? (state.stagesDone / notion.stageIds.length) * 100 : 0}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <span className="font-bold tabular-nums text-muted">{t("questProgress", { done: state.stagesDone, total: notion.stageIds.length })}</span>
          </div>

          <div className="mt-6">
            {state.status === "guardian" ? (
              <GameLink href={`/app/notion/${notion.slug}/gardien`} sfx="enter" className="w-full sm:w-auto">
                {t("faceGuardian", { name: notion.guardian.name })}
              </GameLink>
            ) : (
              <GameLink href={`/app/notion/${notion.slug}`} sfx="enter" className="w-full sm:w-auto">
                <SailIcon className="size-6 text-white" />
                {state.stagesDone > 0 ? t("continue") : t("start")}
              </GameLink>
            )}
          </div>
        </div>
      ) : (
        <div className="relative">
          <h1 id="quest-title" className="mt-1 font-display text-4xl font-bold">
            {t("allDoneTitle")}
          </h1>
          <p className="mt-2 text-lg text-muted">{inClass ? t("allDoneBodyClass") : t("allDoneBodyFree")}</p>
        </div>
      )}
    </motion.section>
  );
}
