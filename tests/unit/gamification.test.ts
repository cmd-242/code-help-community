import { describe, expect, it } from "vitest";
import {
  challengeScore,
  challengeXp,
  currentStreak,
  levelFromXp,
  stageXp,
  starsFromHearts,
  weeklyXp,
  weekStart,
  xpForLevel,
} from "@/features/gamification/rules";

describe("niveaux", () => {
  it("suit la courbe 0, 100, 300, 600, 1000", () => {
    expect([1, 2, 3, 4, 5].map(xpForLevel)).toEqual([0, 100, 300, 600, 1000]);
  });
  it("calcule le niveau et la progression", () => {
    expect(levelFromXp(0)).toMatchObject({ level: 1, current: 0, needed: 100 });
    expect(levelFromXp(99).level).toBe(1);
    expect(levelFromXp(100)).toMatchObject({ level: 2, current: 0, needed: 200 });
    expect(levelFromXp(450)).toMatchObject({ level: 3, current: 150, needed: 300, progress: 0.5 });
  });
});

describe("étoiles et XP d'étape", () => {
  it("donne une étoile par cœur restant", () => {
    expect(starsFromHearts(3)).toBe(3);
    expect(starsFromHearts(1)).toBe(1);
    expect(starsFromHearts(0)).toBe(0);
    expect(starsFromHearts(-1)).toBe(0);
  });
  it("récompense la première réussite selon les étoiles", () => {
    expect(stageXp(40, 0, 1)).toBe(40);
    expect(stageXp(40, 0, 3)).toBe(60);
  });
  it("ne donne que la différence quand on s'améliore", () => {
    expect(stageXp(40, 1, 3)).toBe(20);
  });
  it("donne 5 XP d'entraînement sans amélioration, 0 en cas de défaite", () => {
    expect(stageXp(40, 3, 3)).toBe(5);
    expect(stageXp(40, 3, 1)).toBe(5);
    expect(stageXp(40, 2, 0)).toBe(0);
  });
});

describe("gardien", () => {
  it("calcule un score arrondi", () => {
    expect(challengeScore(4, 6)).toBe(67);
    expect(challengeScore(5, 6)).toBe(83);
    expect(challengeScore(0, 0)).toBe(0);
  });
  it("donne l'XP pleine une seule fois", () => {
    expect(challengeXp(150, true, false)).toBe(150);
    expect(challengeXp(150, true, true)).toBe(10);
    expect(challengeXp(150, false, false)).toBe(20);
  });
});

describe("série de jours", () => {
  it("compte les jours consécutifs jusqu'à aujourd'hui", () => {
    expect(currentStreak(["2026-11-21", "2026-11-22", "2026-11-23"], "2026-11-23")).toBe(3);
  });
  it("reste active si on a joué hier mais pas encore aujourd'hui", () => {
    expect(currentStreak(["2026-11-21", "2026-11-22"], "2026-11-23")).toBe(2);
  });
  it("tombe à zéro après un jour manqué", () => {
    expect(currentStreak(["2026-11-20"], "2026-11-23")).toBe(0);
    expect(currentStreak([], "2026-11-23")).toBe(0);
  });
});

describe("objectif hebdomadaire", () => {
  it("commence la semaine le lundi à minuit", () => {
    const start = weekStart(new Date("2026-11-26T15:00:00"));
    expect(start.getDay()).toBe(1);
    expect(start.getDate()).toBe(23);
    expect(start.getHours()).toBe(0);
    expect(weekStart(new Date("2026-11-29T23:00:00")).getDate()).toBe(23);
  });
  it("ne compte que les XP de la semaine en cours", () => {
    const events = [
      { amount: 40, at: new Date("2026-11-22T20:00:00").toISOString() },
      { amount: 50, at: new Date("2026-11-23T09:00:00").toISOString() },
      { amount: 10, at: new Date("2026-11-25T09:00:00").toISOString() },
    ];
    expect(weeklyXp(events, new Date("2026-11-26T12:00:00"))).toBe(60);
  });
});
