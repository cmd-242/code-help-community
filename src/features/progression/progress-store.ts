"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toDayKey, type WeeklyGoal } from "@/features/gamification/rules";
import { enqueue } from "./sync-queue";
import type { ClassroomInfo } from "./sync-schema";

/**
 * Progression de l'apprenant, côté navigateur.
 * - Invité : stockée sur l'appareil uniquement.
 * - Connecté : sert de cache ; chaque action est aussi envoyée au serveur
 *   (`sync-queue`), qui recalcule les XP et fait foi. Au chargement, l'état du
 *   serveur remplace ce cache (voir `progress-sync.tsx`).
 */

/**
 * Façon d'apprendre :
 *  - "free" : autodidacte, à son rythme (par défaut) ;
 *  - "classroom" : rattaché à une classe, le planning de l'enseignant s'applique.
 * Avec les comptes, ce sera déduit des inscriptions (`TrackEnrollment`).
 */
export type LearningMode = "free" | "classroom";

export type XpEvent = { amount: number; reason: "stage" | "guardian" | "lesson" | "booster"; ref: string; at: string };

export type ProgressState = {
  xpEvents: XpEvent[];
  stageStars: Record<string, number>;
  cleared: Record<string, { score: number; at: string }>;
  guardianAttempts: Record<string, number>;
  lessonsRead: Record<string, true>;
  activeDays: string[];
  mode: LearningMode;
  weeklyGoal: WeeklyGoal;
  /** Bonnes réponses par compétence (sert à la maîtrise des cartes) */
  skillHits: Record<string, number>;
  /** Cartes possédées, avec leur date d'obtention */
  cards: Record<string, { at: string }>;
  /** Cartes rendues brillantes par un coffre de la semaine */
  shiny: Record<string, true>;
  /** Semaines dont le coffre a déjà été ouvert (clé = lundi) */
  boosterWeeks: string[];
  /** Classe de l'apprenant (reçue du serveur) ; null en apprentissage libre */
  classroom: ClassroomInfo | null;
  addSkillHit: (skill: string) => void;
  unlockCards: (ids: string[]) => void;
  openBooster: (week: string, shinyCardId: string | null) => void;
  setMode: (mode: LearningMode) => void;
  setWeeklyGoal: (goal: WeeklyGoal) => void;
  addXp: (e: Omit<XpEvent, "at">) => void;
  recordStage: (stageId: string, stars: number) => void;
  recordGuardian: (notionSlug: string, score: number, passed: boolean) => void;
  markLesson: (lessonId: string) => void;
  touchToday: () => void;
  reset: () => void;
};

const initial = {
  xpEvents: [],
  stageStars: {},
  cleared: {},
  guardianAttempts: {},
  lessonsRead: {},
  activeDays: [],
  mode: "free" as LearningMode,
  weeklyGoal: "steady" as WeeklyGoal,
  skillHits: {} as Record<string, number>,
  cards: {} as Record<string, { at: string }>,
  shiny: {} as Record<string, true>,
  boosterWeeks: [] as string[],
  classroom: null as ClassroomInfo | null,
};

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      ...initial,
      setMode: (mode) => {
        set({ mode });
        enqueue({ type: "settings", mode });
      },
      setWeeklyGoal: (weeklyGoal) => {
        set({ weeklyGoal });
        enqueue({ type: "settings", weeklyGoal });
      },
      addSkillHit: (skill) => {
        set((s) => ({ skillHits: { ...s.skillHits, [skill]: (s.skillHits[skill] ?? 0) + 1 } }));
        enqueue({ type: "skill", skill, count: 1 });
      },
      unlockCards: (ids) => {
        enqueue({ type: "cards", ids });
        set((s) => {
          const at = new Date().toISOString();
          const next = { ...s.cards };
          for (const id of ids) if (!next[id]) next[id] = { at };
          return { cards: next };
        });
      },
      openBooster: (week, shinyCardId) => {
        enqueue({ type: "booster", week, cardId: shinyCardId });
        set((s) => ({
          boosterWeeks: s.boosterWeeks.includes(week) ? s.boosterWeeks : [...s.boosterWeeks, week],
          shiny: shinyCardId ? { ...s.shiny, [shinyCardId]: true } : s.shiny,
        }));
      },
      addXp: (e) => set((s) => ({ xpEvents: [...s.xpEvents, { ...e, at: new Date().toISOString() }] })),
      recordStage: (stageId, stars) => {
        enqueue({ type: "stage", stageId, stars });
        set((s) => ({ stageStars: { ...s.stageStars, [stageId]: Math.max(stars, s.stageStars[stageId] ?? 0) } }));
      },
      recordGuardian: (slug, score, passed) => {
        enqueue({ type: "guardian", notionSlug: slug, score });
        set((s) => ({
          guardianAttempts: { ...s.guardianAttempts, [slug]: (s.guardianAttempts[slug] ?? 0) + 1 },
          cleared: passed && !s.cleared[slug] ? { ...s.cleared, [slug]: { score, at: new Date().toISOString() } } : s.cleared,
        }));
      },
      markLesson: (id) => {
        enqueue({ type: "lesson", lessonId: id });
        set((s) => (s.lessonsRead[id] ? s : { lessonsRead: { ...s.lessonsRead, [id]: true } }));
      },
      touchToday: () =>
        set((s) => {
          const today = toDayKey(new Date());
          if (s.activeDays.includes(today)) return s;
          enqueue({ type: "day", day: today });
          return { activeDays: [...s.activeDays, today].slice(-400) };
        }),
      reset: () => set(initial),
    }),
    {
      name: "chc:progress:v1",
      storage: createJSONStorage(() => {
        try {
          return window.localStorage;
        } catch {
          return sessionStorage;
        }
      }),
      skipHydration: true,
    },
  ),
);

export const totalXp = (events: XpEvent[]) => events.reduce((n, e) => n + e.amount, 0);

/** Ce qui est synchronisé avec le serveur (tout sauf les fonctions) */
export function snapshotOf(s: ProgressState) {
  return {
    xpEvents: s.xpEvents,
    stageStars: s.stageStars,
    cleared: s.cleared,
    guardianAttempts: s.guardianAttempts,
    lessonsRead: s.lessonsRead,
    activeDays: s.activeDays,
    mode: s.mode,
    weeklyGoal: s.weeklyGoal,
    skillHits: s.skillHits,
    cards: s.cards,
    shiny: s.shiny,
    boosterWeeks: s.boosterWeeks,
    classroom: s.classroom,
  };
}
