import { PrismaPg } from "@prisma/adapter-pg";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { PrismaClient } from "@/generated/prisma/client";
import { weekKey } from "@/features/collection/rules";
import type { ProgressSnapshot } from "@/features/progression/sync-schema";
import { applyOps, getSnapshot, importGuestProgress } from "@/server/services/progress";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const now = new Date();
let userId = "";

beforeEach(async () => {
  const user = await db.user.create({ data: { name: "Aya", email: `aya-${Date.now()}-${Math.random()}@test.local` } });
  userId = user.id;
});

afterAll(async () => {
  await db.$disconnect();
});

const xpTotal = (s: ProgressSnapshot) => s.xpEvents.reduce((n, e) => n + e.amount, 0);

describe("service de progression", () => {
  it("part d'une progression vide", async () => {
    const s = await getSnapshot(db, userId);
    expect(s.xpEvents).toEqual([]);
    expect(s.mode).toBe("free");
    expect(s.weeklyGoal).toBe("steady");
  });

  it("recalcule les XP d'une étape côté serveur, sans doublon à la rejouer", async () => {
    await applyOps(db, userId, [{ type: "stage", stageId: "s1-1", stars: 2 }], now);
    let s = await getSnapshot(db, userId);
    expect(s.stageStars["s1-1"]).toBe(2);
    expect(xpTotal(s)).toBe(50); // 40 + 10 pour la 2e étoile
    await applyOps(db, userId, [{ type: "stage", stageId: "s1-1", stars: 3 }], now);
    s = await getSnapshot(db, userId);
    expect(s.stageStars["s1-1"]).toBe(3);
    expect(xpTotal(s)).toBe(60);
  });

  it("ignore une étape inconnue", async () => {
    await applyOps(db, userId, [{ type: "stage", stageId: "inexistante", stars: 3 }], now);
    expect(xpTotal(await getSnapshot(db, userId))).toBe(0);
  });

  it("n'accorde une carte de commande qu'après une bonne réponse", async () => {
    await applyOps(db, userId, [{ type: "cards", ids: ["pwd"] }], now);
    expect((await getSnapshot(db, userId)).cards.pwd).toBeUndefined();
    await applyOps(db, userId, [{ type: "skill", skill: "pwd", count: 1 }, { type: "cards", ids: ["pwd", "guardian:se-reperer"] }], now);
    const s = await getSnapshot(db, userId);
    expect(s.cards.pwd).toBeDefined();
    expect(s.cards["guardian:se-reperer"]).toBeUndefined();
    expect(s.skillHits.pwd).toBe(1);
  });

  it("valide un gardien vaincu : XP, notion validée, carte légendaire", async () => {
    await applyOps(db, userId, [{ type: "guardian", notionSlug: "se-reperer", score: 50 }], now);
    let s = await getSnapshot(db, userId);
    expect(s.cleared["se-reperer"]).toBeUndefined();
    expect(xpTotal(s)).toBe(20);
    await applyOps(db, userId, [{ type: "guardian", notionSlug: "se-reperer", score: 83 }], now);
    s = await getSnapshot(db, userId);
    expect(s.cleared["se-reperer"].score).toBe(83);
    expect(s.cards["guardian:se-reperer"]).toBeDefined();
    expect(s.guardianAttempts["se-reperer"]).toBe(2);
    expect(xpTotal(s)).toBe(170);
  });

  it("ne compte une leçon qu'une fois", async () => {
    await applyOps(db, userId, [{ type: "lesson", lessonId: "l1-terminal" }, { type: "lesson", lessonId: "l1-terminal" }], now);
    const s = await getSnapshot(db, userId);
    expect(s.lessonsRead["l1-terminal"]).toBe(true);
    expect(xpTotal(s)).toBe(10);
  });

  it("enregistre les réglages et les jours actifs", async () => {
    await applyOps(db, userId, [{ type: "settings", mode: "classroom", weeklyGoal: "calm" }, { type: "day", day: "2026-11-23" }, { type: "day", day: "2026-11-23" }], now);
    const s = await getSnapshot(db, userId);
    expect(s.mode).toBe("classroom");
    expect(s.weeklyGoal).toBe("calm");
    expect(s.activeDays).toEqual(["2026-11-23"]);
  });

  it("n'ouvre le coffre qu'une fois le cap atteint, une fois par semaine", async () => {
    const week = weekKey(now);
    await applyOps(db, userId, [{ type: "settings", weeklyGoal: "calm" }, { type: "booster", week, cardId: null }], now);
    expect((await getSnapshot(db, userId)).boosterWeeks).toEqual([]);
    // 100 XP gagnés : cap « tranquille » atteint
    await applyOps(db, userId, [{ type: "skill", skill: "pwd", count: 1 }, { type: "cards", ids: ["pwd"] }, { type: "guardian", notionSlug: "se-reperer", score: 100 }], now);
    await applyOps(db, userId, [{ type: "booster", week, cardId: "pwd" }, { type: "booster", week, cardId: "pwd" }], now);
    const s = await getSnapshot(db, userId);
    expect(s.boosterWeeks).toEqual([week]);
    expect(s.shiny.pwd).toBe(true);
  });

  it("reprend une progression d'invité une seule fois, avec des XP recalculés", async () => {
    const guest: ProgressSnapshot = {
      xpEvents: [{ amount: 99999, reason: "stage", ref: "s1-1", at: now.toISOString() }],
      stageStars: { "s1-1": 3 },
      cleared: {},
      guardianAttempts: {},
      lessonsRead: {},
      activeDays: [],
      mode: "free",
      weeklyGoal: "steady",
      skillHits: { ls: 2 },
      cards: { ls: { at: now.toISOString() } },
      shiny: {},
      boosterWeeks: [],
    };
    expect(await importGuestProgress(db, userId, guest, now)).toBe(true);
    const s = await getSnapshot(db, userId);
    expect(xpTotal(s)).toBe(60);
    expect(s.cards.ls).toBeDefined();
    expect(await importGuestProgress(db, userId, guest, now)).toBe(false);
  });
});
