"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/server/db";
import { ForbiddenError } from "@/server/permissions";
import { addClassroomTrack, createClassroom, joinClassroom, previewInvite, saveSchedule, UnknownTrackError } from "@/server/services/classroom";
import { getSession, requireUserId } from "@/server/session";
import { isValidInviteCode, normalizeInviteCode } from "./rules";

/**
 * Server Actions des classes. Ordre (AGENTS.md, règle n°2) :
 * session → validation Zod → permission (dans le service) → service → revalidation.
 * Les erreurs attendues sont renvoyées comme résultats, pas comme exceptions.
 */

const createSchema = z.object({
  name: z.string().trim().min(2).max(80),
  schoolYear: z.string().trim().max(20).default(""),
  trackSlugs: z.array(z.string().min(1)).min(1).max(12),
});

export async function createClassroomAction(input: unknown): Promise<{ ok: true; id: string } | { ok: false; reason: "unknown-track" }> {
  const userId = await requireUserId();
  const data = createSchema.parse(input);
  try {
    const c = await createClassroom(db, userId, data);
    revalidatePath("/prof");
    return { ok: true, id: c.id };
  } catch (e) {
    if (e instanceof UnknownTrackError) return { ok: false, reason: "unknown-track" };
    throw e;
  }
}

const addTrackSchema = z.object({ classroomId: z.string().min(1), trackSlug: z.string().min(1) });

export async function addClassroomTrackAction(input: unknown): Promise<{ ok: true } | { ok: false; reason: "forbidden" | "unknown-track" }> {
  const userId = await requireUserId();
  const { classroomId, trackSlug } = addTrackSchema.parse(input);
  try {
    await addClassroomTrack(db, userId, classroomId, trackSlug);
  } catch (e) {
    if (e instanceof ForbiddenError) return { ok: false, reason: "forbidden" };
    if (e instanceof UnknownTrackError) return { ok: false, reason: "unknown-track" };
    throw e;
  }
  revalidatePath(`/prof/classes/${classroomId}`);
  return { ok: true };
}

const iso = z.string().datetime({ offset: true });
const scheduleSchema = z.object({
  classroomId: z.string().min(1),
  releases: z.record(z.string(), z.object({ gameOpensAt: iso, challengeOpensAt: iso, challengeClosesAt: iso })),
});

export async function saveScheduleAction(input: unknown): Promise<{ ok: true } | { ok: false; reason: "forbidden" }> {
  const userId = await requireUserId();
  const { classroomId, releases } = scheduleSchema.parse(input);
  try {
    await saveSchedule(
      db,
      userId,
      classroomId,
      Object.fromEntries(
        Object.entries(releases).map(([slug, r]) => [
          slug,
          { gameOpensAt: new Date(r.gameOpensAt), challengeOpensAt: new Date(r.challengeOpensAt), challengeClosesAt: new Date(r.challengeClosesAt) },
        ]),
      ),
    );
  } catch (e) {
    if (e instanceof ForbiddenError) return { ok: false, reason: "forbidden" };
    throw e;
  }
  revalidatePath(`/prof/classes/${classroomId}`);
  return { ok: true };
}

const codeSchema = z.string().transform(normalizeInviteCode).refine(isValidInviteCode);

export async function previewInviteAction(code: string) {
  const parsed = codeSchema.safeParse(code);
  if (!parsed.success) return null;
  const [preview, session] = await Promise.all([previewInvite(db, parsed.data), getSession()]);
  return preview ? { ...preview, signedIn: Boolean(session) } : null;
}

export async function joinClassroomAction(code: string): Promise<{ ok: true; name: string } | { ok: false; reason: "auth" | "not-found" }> {
  const session = await getSession();
  if (!session) return { ok: false, reason: "auth" };
  const parsed = codeSchema.safeParse(code);
  if (!parsed.success) return { ok: false, reason: "not-found" };
  try {
    const c = await joinClassroom(db, session.user.id, parsed.data);
    return { ok: true, name: c.name };
  } catch {
    return { ok: false, reason: "not-found" };
  }
}
