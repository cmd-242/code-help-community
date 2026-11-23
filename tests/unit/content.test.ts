import { describe, expect, it } from "vitest";
import { gitTrack } from "@content/git";
import { linuxTrack } from "@content/linux";
import { mapHref } from "@/features/catalog/paths";
import { trackSchema } from "@/features/catalog/types";
import { countBlanks, grade } from "@/games/grading";
import { solutionOf } from "@/games/public";
import type { Encounter } from "@/games/schemas";

const tracks = [linuxTrack, gitTrack].map((t) => trackSchema.parse(t));
const encountersOf = (track: (typeof tracks)[number]): Encounter[] =>
  track.notions.flatMap((n) => [...n.stages.flatMap((s) => s.encounters), ...(n.challenge?.bank ?? [])]);

describe("catalogue", () => {
  it("n'a aucun identifiant en double entre parcours (épreuves, étapes, leçons, cartes, notions)", () => {
    const ids = tracks.flatMap((t) => [
      ...encountersOf(t).map((e) => e.id),
      ...t.notions.flatMap((n) => [n.slug, ...n.stages.map((s) => s.id), ...n.lessons.map((l) => l.id)]),
      ...t.cards.map((c) => c.id),
    ]);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("a des positions consécutives et des voies cohérentes", () => {
    for (const t of tracks) {
      expect(t.notions.map((n) => n.position), t.slug).toEqual(t.notions.map((_, i) => i + 1));
    }
  });
  it("commence chaque parcours sur la voie principale et ne dérive que sur la voie 1", () => {
    for (const t of tracks) {
      expect(t.notions[0].lane, t.slug).toBe(0);
      expect(t.notions.every((n) => n.lane === 0 || n.lane === 1), t.slug).toBe(true);
    }
  });
  it("renvoie la bonne page de carte selon l'univers", () => {
    expect(mapHref({ slug: "linux-debutant" })).toBe("/app");
    expect(mapHref({ slug: "php-debutant" })).toBe("/app/parcours/php-debutant");
    expect(mapHref({ slug: "git-metro" })).toBe("/app/parcours/git-metro");
  });
  it("a une carte pour chaque compétence travaillée et pour chaque gardien", () => {
    for (const t of tracks) {
      const cardIds = new Set(t.cards.map((c) => c.id));
      for (const n of t.notions) {
        if (n.challenge) expect(cardIds.has(`guardian:${n.slug}`), `${t.slug}/${n.slug}`).toBe(true);
      }
      for (const e of encountersOf(t)) if (e.skill) expect(cardIds.has(e.skill), `${t.slug}/${e.id}`).toBe(true);
    }
  });
});

describe.each(tracks)("contenu $slug", (track) => {
  const all = encountersOf(track);
  it("respecte les schémas", () => {
    expect(track.notions.length).toBeGreaterThan(0);
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
