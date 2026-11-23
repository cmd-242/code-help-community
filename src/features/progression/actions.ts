"use server";

import { db } from "@/server/db";
import { applyOps, getSnapshot, importGuestProgress } from "@/server/services/progress";
import { getSession, requireUserId } from "@/server/session";
import { progressOpsSchema, progressSnapshotSchema, type ProgressSnapshot } from "./sync-schema";

/**
 * Server Actions de la progression. Ordre imposé (AGENTS.md, règle n°2) :
 * session → validation Zod → permission → service.
 * Permission : un apprenant n'écrit et ne lit que SA progression (identifiant tiré de la session).
 */

/** Progression de l'apprenant connecté, ou null pour un invité. */
export async function loadProgress(): Promise<ProgressSnapshot | null> {
  const session = await getSession();
  if (!session) return null;
  return getSnapshot(db, session.user.id);
}

/** Enregistre un lot d'actions (envoyé par la file de synchronisation du navigateur). */
export async function syncProgress(input: unknown): Promise<void> {
  const userId = await requireUserId();
  const ops = progressOpsSchema.parse(input);
  await applyOps(db, userId, ops);
}

/** Reprend la progression jouée en invité (une seule fois, si le compte est vide). */
export async function importGuest(input: unknown): Promise<boolean> {
  const userId = await requireUserId();
  const snapshot = progressSnapshotSchema.parse(input);
  return importGuestProgress(db, userId, snapshot);
}
