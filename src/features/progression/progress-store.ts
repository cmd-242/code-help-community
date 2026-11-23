"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toDayKey, type WeeklyGoal } from "@/features/gamification/rules";

/**
 * Progression de l'étudiant — MODE DÉMO.
 * Stockée dans le navigateur en attendant l'authentification et la base de données
 * (phase 0, étape suivante). Les XP sont déjà enregistrés comme des événements
 * (règle n°11), ce qui rendra la migration vers `XpEvent` directe.
 */

/**
 * Façon d'apprendre :
 *  - "free" : autodidacte, à son rythme (par défaut) ;
 *  - "classroom" : rattaché à une classe, le planning de l'enseignant s'applique.
 * Avec les comptes, ce sera déduit des inscriptions (`TrackEnrollment`).
 */
export type LearningMode = "free" | "classroom";

export type XpEvent = { amount: number; reason: "stage" | "guardian" | "lesson"; ref: string; at: string };

type ProgressState = {
  xpEvents: XpEvent[];
  stageStars: Record<string, number>;
  cleared: Record<string, { score: number; at: string }>;
  guardianAttempts: Record<string, number>;
  lessonsRead: Record<string, true>;
  activeDays: string[];
  mode: LearningMode;
  weeklyGoal: WeeklyGoal;
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
};

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      ...initial,
      setMode: (mode) => set({ mode }),
      setWeeklyGoal: (weeklyGoal) => set({ weeklyGoal }),
      addXp: (e) => set((s) => ({ xpEvents: [...s.xpEvents, { ...e, at: new Date().toISOString() }] })),
      recordStage: (stageId, stars) =>
        set((s) => ({ stageStars: { ...s.stageStars, [stageId]: Math.max(stars, s.stageStars[stageId] ?? 0) } })),
      recordGuardian: (slug, score, passed) =>
        set((s) => ({
          guardianAttempts: { ...s.guardianAttempts, [slug]: (s.guardianAttempts[slug] ?? 0) + 1 },
          cleared: passed && !s.cleared[slug] ? { ...s.cleared, [slug]: { score, at: new Date().toISOString() } } : s.cleared,
        })),
      markLesson: (id) => set((s) => (s.lessonsRead[id] ? s : { lessonsRead: { ...s.lessonsRead, [id]: true } })),
      touchToday: () =>
        set((s) => {
          const today = toDayKey(new Date());
          return s.activeDays.includes(today) ? s : { activeDays: [...s.activeDays, today].slice(-400) };
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
