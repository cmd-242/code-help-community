"use client";

import { useMemo } from "react";
import type { NotionSummary } from "@/features/catalog/queries";
import { useProgress } from "./progress-store";
import { useHydratedProgress } from "./use-hydrated-progress";
import { notionStatus, guardianGate, type NotionStatus, type GuardianGate, type Release } from "./unlock";

export type NotionState = {
  /** "soon" : le lieu est accessible mais son contenu n'est pas encore écrit */
  status: NotionStatus | "soon";
  gate: GuardianGate;
  release: Release | null;
  stagesDone: number;
  stars: number;
  maxStars: number;
  /** Prérequis (stations d'autres lignes comprises) pas encore validés */
  missing: { slug: string; place: string; trackTitle: string }[];
  /** La station précédente de la ligne n'est pas validée */
  previousMissing: boolean;
};

/** Statut de chaque notion pour l'étudiant courant (planning de démo + progression locale) */
export function useNotionStates(notions: NotionSummary[]): { ready: boolean; states: NotionState[] } {
  const ready = useHydratedProgress();
  const stageStars = useProgress((s) => s.stageStars);
  const cleared = useProgress((s) => s.cleared);
  const classroom = useProgress((s) => s.classroom);

  const states = useMemo(() => {
    // L'heure n'est lue que chez l'étudiant, jamais pendant le pré-rendu
    const now = ready ? new Date() : new Date(0);
    return notions.map((f, i) => {
      // Libre : aucun planning, seule la progression compte. En classe : planning de l'enseignant.
      const raw = classroom?.releases[f.slug];
      const release = raw
        ? { gameOpensAt: new Date(raw.gameOpensAt), challengeOpensAt: new Date(raw.challengeOpensAt), challengeClosesAt: new Date(raw.challengeClosesAt) }
        : null;
      // En classe, une notion que l'enseignant n'a pas encore programmée reste fermée
      const unscheduled = Boolean(classroom?.notionSlugs.includes(f.slug)) && !raw;
      const stars = f.stageIds.reduce((n, id) => n + (stageStars[id] ?? 0), 0);
      const stagesDone = f.stageIds.filter((id) => (stageStars[id] ?? 0) > 0).length;
      const missing = f.requires.filter((r) => !cleared[r.slug]);
      const previousCleared = i === 0 || Boolean(cleared[notions[i - 1].slug]);
      const input = {
        release,
        now,
        previousCleared,
        requirementsMet: missing.length === 0,
        cleared: Boolean(cleared[f.slug]),
        stagesTotal: f.stageIds.length,
        stagesDone,
      };
      const computed = unscheduled ? "sealed" : notionStatus(input);
      const written = f.stageIds.length > 0;
      return {
        status: !ready ? "sealed" : !written && (computed === "open" || computed === "guardian") ? "soon" : computed,
        gate: unscheduled ? "not-yet" : guardianGate(input),
        release,
        stagesDone,
        stars,
        maxStars: f.stageIds.length * 3,
        missing,
        previousMissing: !previousCleared,
      } satisfies NotionState;
    });
  }, [notions, stageStars, cleared, ready, classroom]);

  return { ready, states };
}
