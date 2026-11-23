import { z } from "zod";

/**
 * Schémas des « rencontres » (une question / un défi dans une étape).
 * Chaque moteur de jeu possède son schéma ; le contenu est validé contre eux
 * (voir tests/unit/content.test.ts).
 */

const base = {
  id: z.string().min(1),
  prompt: z.string().min(1),
  explanation: z.string().min(1),
  skill: z.string().optional(),
};

/** Question à choix (une ou plusieurs bonnes réponses) */
export const qcmSchema = z.object({
  ...base,
  type: z.literal("qcm"),
  code: z.string().optional(),
  choices: z.array(z.string()).min(2).max(6),
  answer: z.array(z.number().int().nonnegative()).min(1),
});

/** Puzzle de lignes à remettre dans l'ordre (problème de Parsons) */
export const parsonsSchema = z.object({
  ...base,
  type: z.literal("parsons"),
  lines: z.array(z.string()).min(2).max(8),
  distractors: z.array(z.string()).default([]),
});

/** Texte à trous avec banque de mots ({{0}}, {{1}}… dans le modèle) */
export const fillSchema = z.object({
  ...base,
  type: z.literal("fill"),
  template: z.string().min(1),
  answers: z.array(z.string()).min(1),
  bank: z.array(z.string()).min(1),
});

/** Prédire la sortie d'une commande ou d'un programme */
export const predictSchema = z.object({
  ...base,
  type: z.literal("predict"),
  code: z.string().min(1),
  accepted: z.array(z.string()).min(1),
  placeholder: z.string().optional(),
});

export const encounterSchema = z.discriminatedUnion("type", [qcmSchema, parsonsSchema, fillSchema, predictSchema]);

export type QcmEncounter = z.infer<typeof qcmSchema>;
export type ParsonsEncounter = z.infer<typeof parsonsSchema>;
export type FillEncounter = z.infer<typeof fillSchema>;
export type PredictEncounter = z.infer<typeof predictSchema>;
export type Encounter = z.infer<typeof encounterSchema>;
export type EncounterInput = z.input<typeof encounterSchema>;
export type GameType = Encounter["type"];

/** Réponses attendues par chaque moteur */
export type QcmResponse = number[];
export type ParsonsResponse = string[];
export type FillResponse = string[];
export type PredictResponse = string;

export type ResponseFor<E extends Encounter> = E extends QcmEncounter
  ? QcmResponse
  : E extends ParsonsEncounter
    ? ParsonsResponse
    : E extends FillEncounter
      ? FillResponse
      : PredictResponse;
