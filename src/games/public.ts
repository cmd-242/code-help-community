import type { Encounter } from "./schemas";
import { grade, type AnyResponse } from "./grading";

/**
 * Version d'une rencontre envoyée au navigateur : sans réponse ni explication.
 * Les moteurs de jeu n'affichent que ce format, et reçoivent une fonction `check`
 * qui corrige soit localement (entraînement), soit côté serveur (grand challenge).
 */
export type PublicEncounter =
  | { id: string; type: "qcm"; prompt: string; code?: string; choices: string[]; multiple: boolean }
  | { id: string; type: "parsons"; prompt: string; pieces: string[]; slots: number }
  | { id: string; type: "fill"; prompt: string; template: string; bank: string[] }
  | { id: string; type: "predict"; prompt: string; code: string; placeholder?: string };

export type CheckResult = { correct: boolean; explanation: string; solution: string };

/** Mélange déterministe (même résultat côté serveur et client : pas d'écart d'hydratation) */
export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const rand = () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  // Un puzzle déjà dans le bon ordre n'est pas un puzzle
  if (out.length > 1 && out.every((v, i) => v === items[i])) out.push(out.shift() as T);
  return out;
}

export function toPublicEncounter(e: Encounter): PublicEncounter {
  switch (e.type) {
    case "qcm":
      return { id: e.id, type: "qcm", prompt: e.prompt, code: e.code, choices: e.choices, multiple: e.answer.length > 1 };
    case "parsons":
      return {
        id: e.id,
        type: "parsons",
        prompt: e.prompt,
        pieces: seededShuffle([...e.lines, ...e.distractors], e.id),
        slots: e.lines.length,
      };
    case "fill":
      return { id: e.id, type: "fill", prompt: e.prompt, template: e.template, bank: seededShuffle(e.bank, e.id) };
    case "predict":
      return { id: e.id, type: "predict", prompt: e.prompt, code: e.code, placeholder: e.placeholder };
  }
}

export function solutionOf(e: Encounter): string {
  switch (e.type) {
    case "qcm":
      return e.answer.map((i) => e.choices[i]).join(" + ");
    case "parsons":
      return e.lines.join("\n");
    case "fill":
      return e.template.replace(/\{\{(\d+)\}\}/g, (_, i: string) => e.answers[Number(i)] ?? "");
    case "predict":
      return e.accepted[0];
  }
}

export function check(e: Encounter, response: AnyResponse): CheckResult {
  return { correct: grade(e, response), explanation: e.explanation, solution: solutionOf(e) };
}
