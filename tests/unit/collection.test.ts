import { describe, expect, it } from "vitest";
import { linuxTrack } from "@content/linux";
import { trackSchema } from "@/features/catalog/types";
import {
  boosterAvailable,
  cardsEarnedFromSkills,
  collectionStats,
  guardianCardId,
  hitsToNextMastery,
  masteryLevel,
  pickBoosterCard,
  weekKey,
} from "@/features/collection/rules";

const track = trackSchema.parse(linuxTrack);

describe("maîtrise", () => {
  it("monte de 1 à 3 avec les bonnes réponses", () => {
    expect([0, 4, 5, 11, 12, 40].map(masteryLevel)).toEqual([1, 1, 2, 2, 3, 3]);
  });
  it("indique ce qu'il reste à faire", () => {
    expect(hitsToNextMastery(3)).toBe(2);
    expect(hitsToNextMastery(5)).toBe(7);
    expect(hitsToNextMastery(12)).toBeNull();
  });
});

describe("gains", () => {
  it("donne une carte par compétence réussie, sans doublon", () => {
    expect(cardsEarnedFromSkills(track.cards, ["pwd", "ls", "ls"], {})).toEqual(["pwd", "ls"]);
    expect(cardsEarnedFromSkills(track.cards, ["pwd", "ls"], { pwd: true })).toEqual(["ls"]);
  });
  it("ne donne jamais une carte de gardien par une épreuve", () => {
    expect(cardsEarnedFromSkills(track.cards, [guardianCardId("se-reperer")], {})).toEqual([]);
  });
  it("compte la collection", () => {
    expect(collectionStats(track.cards, { pwd: true, ls: true })).toEqual({ owned: 2, total: track.cards.length });
  });
});

describe("coffre de la semaine", () => {
  it("s'ouvre une seule fois par semaine, une fois le cap atteint", () => {
    const key = weekKey(new Date("2026-11-26T15:00:00"));
    expect(key).toBe("2026-11-23");
    expect(weekKey(new Date("2026-11-29T22:00:00"))).toBe(key);
    expect(boosterAvailable(260, 250, key, [])).toBe(true);
    expect(boosterAvailable(200, 250, key, [])).toBe(false);
    expect(boosterAvailable(260, 250, key, [key])).toBe(false);
  });
  it("rend brillante une carte possédée qui ne l'est pas encore", () => {
    expect(pickBoosterCard(["pwd", "ls"], { pwd: true }, () => 0)).toBe("ls");
    expect(pickBoosterCard(["pwd"], { pwd: true })).toBeNull();
    expect(pickBoosterCard([], {})).toBeNull();
  });
});

describe("contenu des cartes", () => {
  it("chaque compétence des épreuves a sa carte, et chaque gardien aussi", () => {
    const ids = new Set(track.cards.map((c) => c.id));
    const skills = track.notions.flatMap((n) => [...n.stages.flatMap((s) => s.encounters), ...(n.challenge?.bank ?? [])]).map((e) => e.skill);
    for (const s of skills) expect(s && ids.has(s), String(s)).toBe(true);
    for (const n of track.notions.filter((x) => x.challenge)) expect(ids.has(guardianCardId(n.slug)), n.slug).toBe(true);
  });
  it("a des identifiants uniques rattachés à une vraie notion", () => {
    expect(new Set(track.cards.map((c) => c.id)).size).toBe(track.cards.length);
    const slugs = new Set(track.notions.map((n) => n.slug));
    for (const c of track.cards) expect(slugs.has(c.notion), c.id).toBe(true);
  });
});
