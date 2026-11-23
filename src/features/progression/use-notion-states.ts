"use client";

import { useMemo } from "react";
import type { NotionSummary } from "@/features/catalog/queries";
import { useProgress } from "./progress-store";
import { useHydratedProgress } from "./use-hydrated-progress";
import { demoRelease, notionStatus, guardianGate, type NotionStatus, type GuardianGate, type Release } from "./unlock";

export type NotionState = {
  /** "soon" : le lieu est accessible mais son contenu n'est pas encore écrit */
  status: NotionStatus | "soon";
  gate: GuardianGate;
  release: Release | null;
  stagesDone: number;
  stars: number;
  maxStars: number;
};

/** Statut de chaque notion pour l'étudiant courant (planning de démo + progression locale) */
export function useNotionStates(notions: NotionSummary[]): { ready: boolean; states: NotionState[] } {
  const ready = useHydratedProgress();
  const stageStars = useProgress((s) => s.stageStars);
  const cleared = useProgress((s) => s.cleared);
  const mode = useProgress((s) => s.mode);

  const states = useMemo(() => {
    // L'heure n'est lue que chez l'étudiant, jamais pendant le pré-rendu
    const now = ready ? new Date() : new Date(0);
    return notions.map((f, i) => {
      // Libre : aucun planning, seule la progression compte. En classe : planning de l'enseignant.
      const release = mode === "classroom" ? demoRelease(f.position, now) : null;
      const stars = f.stageIds.reduce((n, id) => n + (stageStars[id] ?? 0), 0);
      const stagesDone = f.stageIds.filter((id) => (stageStars[id] ?? 0) > 0).length;
      const input = {
        release,
        now,
        previousCleared: i === 0 || Boolean(cleared[notions[i - 1].slug]),
        cleared: Boolean(cleared[f.slug]),
        stagesTotal: f.stageIds.length,
        stagesDone,
      };
      const computed = notionStatus(input);
      const written = f.stageIds.length > 0;
      return {
        status: !ready ? "sealed" : !written && (computed === "open" || computed === "guardian") ? "soon" : computed,
        gate: guardianGate(input),
        release,
        stagesDone,
        stars,
        maxStars: f.stageIds.length * 3,
      } satisfies NotionState;
    });
  }, [notions, stageStars, cleared, ready, mode]);

  return { ready, states };
}
