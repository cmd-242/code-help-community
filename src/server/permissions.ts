import "server-only";
import type { PrismaClient } from "@/generated/prisma/client";

/**
 * Permissions (AGENTS.md, règle n°1) : vérifiées côté serveur, jamais seulement dans l'interface.
 * - un enseignant ne voit que ses classes, et seulement les étudiants inscrits dedans ;
 * - un apprenant libre n'est visible d'aucun enseignant.
 */

export class ForbiddenError extends Error {
  constructor() {
    super("Accès refusé.");
  }
}

export async function isTeacherOf(db: PrismaClient, userId: string, classroomId: string): Promise<boolean> {
  const link = await db.classroomTeacher.findUnique({ where: { classroomId_userId: { classroomId, userId } } });
  return Boolean(link);
}

export async function assertTeacherOf(db: PrismaClient, userId: string, classroomId: string): Promise<void> {
  if (!(await isTeacherOf(db, userId, classroomId))) throw new ForbiddenError();
}
