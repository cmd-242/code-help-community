"use client";

import { useMemo } from "react";
import type { FloorSummary } from "@/features/catalog/queries";
import { useProgress } from "./progress-store";
import { useHydratedProgress } from "./use-hydrated-progress";
import { demoRelease, floorStatus, guardianGate, type FloorStatus, type GuardianGate, type Release } from "./unlock";

export type FloorState = {
  status: FloorStatus;
  gate: GuardianGate;
  release: Release;
  stagesDone: number;
  stars: number;
  maxStars: number;
};

/** Statut de chaque étage pour l'étudiant courant (planning de démo + progression locale) */
export function useFloorStates(floors: FloorSummary[]): { ready: boolean; states: FloorState[] } {
  const ready = useHydratedProgress();
  const stageStars = useProgress((s) => s.stageStars);
  const cleared = useProgress((s) => s.cleared);

  const states = useMemo(() => {
    // L'heure n'est lue que chez l'étudiant, jamais pendant le pré-rendu
    const now = ready ? new Date() : new Date(0);
    return floors.map((f, i) => {
      const release = demoRelease(f.floor, now);
      const stars = f.stageIds.reduce((n, id) => n + (stageStars[id] ?? 0), 0);
      const stagesDone = f.stageIds.filter((id) => (stageStars[id] ?? 0) > 0).length;
      const input = {
        release,
        now,
        previousCleared: i === 0 || Boolean(cleared[floors[i - 1].slug]),
        cleared: Boolean(cleared[f.slug]),
        stagesTotal: f.stageIds.length,
        stagesDone,
      };
      return {
        status: ready ? floorStatus(input) : "sealed",
        gate: guardianGate(input),
        release,
        stagesDone,
        stars,
        maxStars: f.stageIds.length * 3,
      } satisfies FloorState;
    });
  }, [floors, stageStars, cleared, ready]);

  return { ready, states };
}
