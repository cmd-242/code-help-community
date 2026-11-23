import { describe, expect, it } from "vitest";
import {
  generateInviteCode,
  guardianWindowOpen,
  isValidInviteCode,
  isValidRelease,
  normalizeInviteCode,
  studentRisk,
  weeklySchedule,
} from "@/features/classroom/rules";

describe("codes d'invitation", () => {
  it("génère des codes de 6 caractères sans caractère ambigu", () => {
    for (let i = 0; i < 200; i++) {
      const code = generateInviteCode();
      expect(isValidInviteCode(code)).toBe(true);
      expect(code).not.toMatch(/[01OIL]/);
    }
  });
  it("normalise un code saisi à la main", () => {
    expect(normalizeInviteCode(" ab3-x7k ")).toBe("AB3X7K");
    expect(isValidInviteCode("AB3X7K")).toBe(true);
    expect(isValidInviteCode("AB0X7K")).toBe(false);
    expect(isValidInviteCode("ABC")).toBe(false);
  });
});

describe("planning type", () => {
  const plan = weeklySchedule(["a", "b"], new Date("2026-11-23T10:00:00"));
  it("ouvre une notion par semaine, le lundi", () => {
    expect(plan.a.gameOpensAt.getDate()).toBe(23);
    expect(plan.a.gameOpensAt.getHours()).toBe(0);
    expect(plan.b.gameOpensAt.getDate()).toBe(30);
  });
  it("réveille le gardien le vendredi pour deux semaines", () => {
    expect(plan.a.challengeOpensAt.getDate()).toBe(27);
    expect(plan.a.challengeClosesAt.getDate()).toBe(11);
    expect(isValidRelease(plan.a)).toBe(true);
  });
  it("refuse un planning incohérent", () => {
    expect(isValidRelease({ gameOpensAt: new Date(2), challengeOpensAt: new Date(1), challengeClosesAt: new Date(3) })).toBe(false);
  });
  it("sait si la salle du gardien est ouverte", () => {
    expect(guardianWindowOpen(plan.a, new Date("2026-11-28T10:00:00"))).toBe(true);
    expect(guardianWindowOpen(plan.a, new Date("2026-11-24T10:00:00"))).toBe(false);
    expect(guardianWindowOpen(undefined, new Date())).toBe(false);
  });
});

describe("alertes de décrochage", () => {
  const now = new Date("2026-12-02T10:00:00");
  const releases = weeklySchedule(["a", "b"], new Date("2026-11-23T00:00:00"));
  const base = { now, releases, cleared: new Set<string>(["a"]), failsByNotion: {} };

  it("ne signale rien pour un étudiant à jour", () => {
    expect(studentRisk({ ...base, lastActiveDay: "2026-12-01" })).toEqual([]);
  });
  it("signale l'inactivité", () => {
    expect(studentRisk({ ...base, lastActiveDay: "2026-11-27" })).toContain("inactive");
    expect(studentRisk({ ...base, lastActiveDay: null })).toContain("inactive");
  });
  it("signale le retard sur le planning", () => {
    expect(studentRisk({ ...base, cleared: new Set(), lastActiveDay: "2026-12-01" })).toEqual(["behind"]);
  });
  it("signale les échecs répétés", () => {
    expect(studentRisk({ ...base, lastActiveDay: "2026-12-01", failsByNotion: { b: 2 } })).toEqual(["struggling"]);
    expect(studentRisk({ ...base, lastActiveDay: "2026-12-01", failsByNotion: { a: 3 } })).toEqual([]);
  });
});
