import { describe, expect, it } from "vitest";
import { countBlanks, grade, normalizeOutput } from "@/games/grading";
import { encounterSchema, type Encounter } from "@/games/schemas";
import { check, seededShuffle, solutionOf, toPublicEncounter } from "@/games/public";

const qcm = encounterSchema.parse({ id: "q", type: "qcm", prompt: "?", choices: ["a", "b", "c"], answer: [0, 2], explanation: "." });
const parsons = encounterSchema.parse({ id: "p", type: "parsons", prompt: "?", lines: ["cd a", "pwd"], distractors: ["ls"], explanation: "." });
const fill = encounterSchema.parse({ id: "f", type: "fill", prompt: "?", template: "ls {{0}}{{1}}", answers: ["-l", "a"], bank: ["-l", "a", "x"], explanation: "." });
const predict = encounterSchema.parse({ id: "r", type: "predict", prompt: "?", code: "$ pwd", accepted: ["/home/aya"], explanation: "." });

describe("correcteurs", () => {
  it("QCM : toutes les bonnes réponses, ordre indifférent", () => {
    expect(grade(qcm, [2, 0])).toBe(true);
    expect(grade(qcm, [0])).toBe(false);
    expect(grade(qcm, [0, 1, 2])).toBe(false);
  });
  it("Parsons : l'ordre compte, les pièges sont refusés", () => {
    expect(grade(parsons, ["cd a", "pwd"])).toBe(true);
    expect(grade(parsons, ["pwd", "cd a"])).toBe(false);
    expect(grade(parsons, ["cd a", "ls"])).toBe(false);
  });
  it("Texte à trous", () => {
    expect(grade(fill, ["-l", "a"])).toBe(true);
    expect(grade(fill, ["a", "-l"])).toBe(false);
    expect(countBlanks("ls {{0}}{{1}}")).toBe(2);
  });
  it("Prédire la sortie : espaces normalisés", () => {
    expect(grade(predict, "  /home/aya  ")).toBe(true);
    expect(grade(predict, "/home/Aya")).toBe(false);
    expect(normalizeOutput("a   b\n\n")).toBe("a b");
  });
  it("refuse une réponse du mauvais type", () => {
    expect(grade(qcm, "0")).toBe(false);
    expect(grade(predict, ["/home/aya"])).toBe(false);
  });
});

describe("version publique (règle n°3)", () => {
  const leaks = (e: Encounter) => JSON.stringify(toPublicEncounter(e));
  it("ne contient jamais la réponse ni l'explication", () => {
    expect(leaks(qcm)).not.toContain("answer");
    expect(leaks(predict)).not.toContain("/home/aya");
    expect(leaks(fill)).not.toContain("answers");
    for (const e of [qcm, parsons, fill, predict]) expect(leaks(e)).not.toContain("explanation");
  });
  it("mélange les lignes du puzzle sans jamais les laisser dans l'ordre", () => {
    const pub = toPublicEncounter(parsons);
    expect(pub.type === "parsons" && [...pub.pieces].sort()).toEqual(["cd a", "ls", "pwd"]);
    expect(seededShuffle(["a", "b"], "x")).toEqual(seededShuffle(["a", "b"], "x"));
    expect(seededShuffle(["a", "b"], "seed")).not.toEqual(["a", "b"]);
  });
  it("affiche la solution lisible", () => {
    expect(solutionOf(fill)).toBe("ls -la");
    expect(check(qcm, [0, 2])).toMatchObject({ correct: true, solution: "a + c" });
  });
});
