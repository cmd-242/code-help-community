import { describe, expect, it } from "vitest";
import { linuxTrack } from "@content/linux";
import { trackSchema } from "@/features/catalog/types";
import { countBlanks, grade } from "@/games/grading";
import { solutionOf } from "@/games/public";
import type { Encounter } from "@/games/schemas";

const track = trackSchema.parse(linuxTrack);
const all: Encounter[] = track.notions.flatMap((n) => [...n.stages.flatMap((s) => s.encounters), ...(n.challenge?.bank ?? [])]);

describe("contenu Linux", () => {
  it("respecte les schémas", () => {
    expect(track.notions.length).toBeGreaterThan(0);
  });
  it("a des identifiants uniques", () => {
    const ids = [...all.map((e) => e.id), ...track.notions.flatMap((n) => n.stages.map((s) => s.id))];
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("chaque question est résoluble avec sa propre solution", () => {
    for (const e of all) {
      if (e.type === "qcm") {
        expect(e.answer.every((i) => i < e.choices.length), e.id).toBe(true);
        expect(grade(e, e.answer), e.id).toBe(true);
      } else if (e.type === "parsons") {
        expect(grade(e, e.lines), e.id).toBe(true);
      } else if (e.type === "fill") {
        expect(countBlanks(e.template), e.id).toBe(e.answers.length);
        expect(e.answers.every((a) => e.bank.includes(a)), e.id).toBe(true);
        expect(grade(e, e.answers), e.id).toBe(true);
      } else {
        expect(grade(e, solutionOf(e)), e.id).toBe(true);
      }
    }
  });
  it("chaque gardien a assez de questions dans sa banque", () => {
    for (const n of track.notions) {
      if (n.challenge) expect(n.challenge.bank.length, n.slug).toBeGreaterThanOrEqual(n.challenge.questionCount);
    }
  });
});
