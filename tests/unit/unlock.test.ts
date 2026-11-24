import { describe, expect, it } from "vitest";
import { demoRelease, notionStatus, guardianGate, type NotionInput } from "@/features/progression/unlock";

const now = new Date("2026-11-25T10:00:00");
const release = {
  gameOpensAt: new Date("2026-11-23T08:00:00"),
  challengeOpensAt: new Date("2026-11-27T08:00:00"),
  challengeClosesAt: new Date("2026-11-29T23:00:00"),
};
const base: NotionInput = { release, now, previousCleared: true, cleared: false, stagesTotal: 3, stagesDone: 0 };

describe("statut d'une notion", () => {
  it("en classe, est scellé avant la date d'ouverture", () => {
    expect(notionStatus({ ...base, now: new Date("2026-11-22T10:00:00") })).toBe("sealed");
  });
  it("en apprentissage libre, ne dépend que de la progression", () => {
    expect(notionStatus({ ...base, release: null })).toBe("open");
    expect(notionStatus({ ...base, release: null, previousCleared: false })).toBe("blocked");
    expect(guardianGate({ ...base, release: null, stagesDone: 3 })).toBe("ready");
    expect(guardianGate({ ...base, release: null, stagesDone: 1 })).toBe("explore-first");
  });
  it("est bloqué tant que le gardien précédent n'est pas vaincu", () => {
    expect(notionStatus({ ...base, previousCleared: false })).toBe("blocked");
  });
  it("reste bloqué tant qu'un prérequis d'une autre ligne n'est pas validé", () => {
    expect(notionStatus({ ...base, requirementsMet: false })).toBe("blocked");
    expect(notionStatus({ ...base, requirementsMet: true })).toBe("open");
    expect(notionStatus({ ...base, requirementsMet: false, override: { unlock: true } })).toBe("open");
  });
  it("est ouvert puis attend le gardien quand toutes les salles sont faites", () => {
    expect(notionStatus(base)).toBe("open");
    expect(notionStatus({ ...base, stagesDone: 3 })).toBe("guardian");
  });
  it("est validé une fois le gardien vaincu, quelle que soit la date", () => {
    expect(notionStatus({ ...base, cleared: true, release: null })).toBe("cleared");
  });
  it("une dérogation de l'enseignant ouvre une notion scellée ou bloquée", () => {
    expect(notionStatus({ ...base, release: null, previousCleared: false, override: { unlock: true } })).toBe("open");
  });
});

describe("porte du gardien", () => {
  it("exige d'avoir exploré tout le lieu", () => {
    expect(guardianGate({ ...base, stagesDone: 2 })).toBe("explore-first");
  });
  it("respecte la fenêtre du challenge", () => {
    expect(guardianGate({ ...base, stagesDone: 3 })).toBe("not-yet");
    expect(guardianGate({ ...base, stagesDone: 3, now: new Date("2026-11-28T10:00:00") })).toBe("ready");
    expect(guardianGate({ ...base, stagesDone: 3, now: new Date("2026-11-30T10:00:00") })).toBe("closed");
  });
  it("une prolongation individuelle rouvre la fenêtre", () => {
    const later = new Date("2026-11-30T10:00:00");
    expect(guardianGate({ ...base, stagesDone: 3, now: later, override: { newClosesAt: new Date("2026-12-02T00:00:00") } })).toBe("ready");
  });
});

describe("planning de démonstration", () => {
  it("ouvre une notion par semaine à partir du lundi", () => {
    const monday = new Date("2026-11-23T10:00:00");
    expect(demoRelease(3, monday).gameOpensAt.getDate()).toBe(23);
    expect(demoRelease(4, monday).gameOpensAt.getDate()).toBe(30);
    expect(demoRelease(1, monday).gameOpensAt.getDate()).toBe(9);
  });
});
