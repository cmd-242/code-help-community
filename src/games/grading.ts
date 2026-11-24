import type {
  Encounter,
  CodeEncounter,
  CodeResponse,
  FillEncounter,
  FillResponse,
  ParsonsEncounter,
  ParsonsResponse,
  PredictEncounter,
  PredictResponse,
  QcmEncounter,
  QcmResponse,
} from "./schemas";

/**
 * Correcteurs purs : aucune dépendance au navigateur.
 * Les mêmes fonctions serviront côté serveur pour corriger les grands challenges.
 */

export function gradeQcm(e: QcmEncounter, r: QcmResponse): boolean {
  const expected = [...new Set(e.answer)].sort((a, b) => a - b);
  const given = [...new Set(r)].sort((a, b) => a - b);
  return expected.length === given.length && expected.every((v, i) => v === given[i]);
}

/** On ignore les espaces en fin de ligne et l'indentation exacte reste exigée. */
export function gradeParsons(e: ParsonsEncounter, r: ParsonsResponse): boolean {
  const norm = (s: string) => s.replace(/\s+$/, "");
  return r.length === e.lines.length && e.lines.every((line, i) => norm(line) === norm(r[i] ?? ""));
}

export function gradeFill(e: FillEncounter, r: FillResponse): boolean {
  return e.answers.length === r.length && e.answers.every((a, i) => a.trim() === (r[i] ?? "").trim());
}

/** Normalise une sortie : espaces multiples, espaces de fin, lignes vides de fin. */
export function normalizeOutput(s: string): string {
  return s
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim().replace(/\s+/g, " "))
    .join("\n")
    .trim();
}

export function gradePredict(e: PredictEncounter, r: PredictResponse): boolean {
  const given = normalizeOutput(r);
  return e.accepted.some((a) => normalizeOutput(a) === given);
}

/** Écrire du code : la réponse est la sortie du programme, comparée comme « prédire ». */
export function gradeCode(e: CodeEncounter, r: CodeResponse): boolean {
  const given = normalizeOutput(r);
  return e.accepted.some((a) => normalizeOutput(a) === given);
}

export type AnyResponse = QcmResponse | ParsonsResponse | FillResponse | PredictResponse;

export function grade(e: Encounter, r: AnyResponse): boolean {
  switch (e.type) {
    case "qcm":
      return Array.isArray(r) && r.every((x) => typeof x === "number") && gradeQcm(e, r as number[]);
    case "parsons":
      return Array.isArray(r) && gradeParsons(e, r as string[]);
    case "fill":
      return Array.isArray(r) && gradeFill(e, r as string[]);
    case "predict":
      return typeof r === "string" && gradePredict(e, r);
    case "code":
      return typeof r === "string" && gradeCode(e, r);
  }
}

/** Nombre de trous dans un modèle de texte à trous */
export function countBlanks(template: string): number {
  return (template.match(/\{\{\d+\}\}/g) ?? []).length;
}
