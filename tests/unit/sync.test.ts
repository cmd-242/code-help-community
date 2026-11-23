import { describe, expect, it } from "vitest";
import { isEmptySnapshot, opsFromGuestSnapshot, progressOpsSchema, progressSnapshotSchema, type ProgressSnapshot } from "@/features/progression/sync-schema";

const guest: ProgressSnapshot = {
  xpEvents: [{ amount: 999, reason: "stage", ref: "s1-1", at: "2026-11-23T08:00:00.000Z" }],
  stageStars: { "s1-1": 3, "s1-2": 0 },
  cleared: { "se-reperer": { score: 83, at: "2026-11-23T09:00:00.000Z" } },
  guardianAttempts: { "se-reperer": 2 },
  lessonsRead: { "l1-terminal": true },
  activeDays: ["2026-11-22", "2026-11-23"],
  mode: "free",
  weeklyGoal: "intense",
  skillHits: { pwd: 4, ls: 0 },
  cards: { pwd: { at: "x" }, "guardian:se-reperer": { at: "x" } },
  shiny: {},
  boosterWeeks: ["2026-11-23"],
  classroom: null,
};

describe("import de la progression d'un invité", () => {
  const ops = opsFromGuestSnapshot(guest);

  it("produit des actions valides", () => {
    expect(progressOpsSchema.safeParse(ops).success).toBe(true);
    expect(progressSnapshotSchema.safeParse(guest).success).toBe(true);
  });
  it("ne recopie jamais les XP : le serveur les recalcule", () => {
    expect(JSON.stringify(ops)).not.toContain("999");
  });
  it("ignore les étapes sans étoile et les compétences à zéro", () => {
    expect(ops).toContainEqual({ type: "stage", stageId: "s1-1", stars: 3 });
    expect(ops.find((o) => o.type === "stage" && o.stageId === "s1-2")).toBeUndefined();
    expect(ops.find((o) => o.type === "skill" && o.skill === "ls")).toBeUndefined();
  });
  it("laisse le serveur accorder les cartes de gardien", () => {
    expect(ops).toContainEqual({ type: "cards", ids: ["pwd"] });
    expect(ops).toContainEqual({ type: "guardian", notionSlug: "se-reperer", score: 83 });
  });
  it("reprend les réglages et les jours actifs", () => {
    expect(ops[0]).toEqual({ type: "settings", mode: "free", weeklyGoal: "intense" });
    expect(ops.filter((o) => o.type === "day")).toHaveLength(2);
  });
  it("reconnaît une progression vide", () => {
    expect(isEmptySnapshot(guest)).toBe(false);
    expect(isEmptySnapshot({ stageStars: {}, lessonsRead: {}, cleared: {}, skillHits: {} })).toBe(true);
  });
  it("refuse une action invalide", () => {
    expect(progressOpsSchema.safeParse([{ type: "stage", stageId: "x", stars: 9 }]).success).toBe(false);
    expect(progressOpsSchema.safeParse([{ type: "xp", amount: 1000 }]).success).toBe(false);
  });
});
