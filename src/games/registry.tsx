"use client";

import type { ComponentType } from "react";
import type { AnyResponse } from "./grading";
import type { PublicEncounter } from "./public";
import { CodePlay } from "./code/code-play";
import { FillPlay } from "./fill/fill-play";
import { ParsonsPlay } from "./parsons/parsons-play";
import { PredictPlay } from "./predict/predict-play";
import { QcmPlay } from "./qcm/qcm-play";

/**
 * Registre des moteurs de jeu (règle n°12).
 * Pour ajouter un type d'exercice :
 *   1. son schéma Zod dans `schemas.ts`,
 *   2. son correcteur pur dans `grading.ts`,
 *   3. sa version publique dans `public.ts`,
 *   4. son composant ici.
 */
export type EngineProps = {
  encounter: PublicEncounter;
  disabled: boolean;
  /** null tant que la réponse n'est pas corrigée */
  verdict: boolean | null;
  onChange: (response: AnyResponse | null) => void;
  onSubmit: () => void;
};

export const engines: Record<PublicEncounter["type"], ComponentType<EngineProps>> = {
  qcm: ({ encounter, ...p }) => (encounter.type === "qcm" ? <QcmPlay encounter={encounter} {...p} /> : null),
  parsons: ({ encounter, ...p }) => (encounter.type === "parsons" ? <ParsonsPlay encounter={encounter} {...p} /> : null),
  fill: ({ encounter, ...p }) => (encounter.type === "fill" ? <FillPlay encounter={encounter} {...p} /> : null),
  code: ({ encounter, ...p }) => (encounter.type === "code" ? <CodePlay encounter={encounter} {...p} /> : null),
  predict: ({ encounter, ...p }) => (encounter.type === "predict" ? <PredictPlay encounter={encounter} {...p} /> : null),
};
