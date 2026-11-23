import "server-only";
import type { PrismaClient } from "@/generated/prisma/client";
import { getTrack } from "@/features/catalog/queries";
import { generateInviteCode, isValidRelease, studentRisk, type ReleaseDates, type RiskAlert } from "@/features/classroom/rules";
import { weekStart } from "@/features/gamification/rules";
import { assertTeacherOf } from "@/server/permissions";

/**
 * Service des classes (option enseignant). Chaque fonction qui expose des données
 * d'étudiants vérifie d'abord que l'utilisateur est enseignant de la classe.
 */

type Db = PrismaClient;

export class InviteNotFoundError extends Error {
  constructor() {
    super("Ce code de classe n'existe pas.");
  }
}

export async function createClassroom(db: Db, teacherId: string, input: { name: string; schoolYear: string; trackSlug: string }) {
  if (!getTrack(input.trackSlug)) throw new Error("Parcours inconnu.");
  for (let attempt = 0; attempt < 8; attempt++) {
    const inviteCode = generateInviteCode();
    const taken = await db.classroom.findUnique({ where: { inviteCode } });
    if (taken) continue;
    return db.classroom.create({
      data: {
        name: input.name,
        schoolYear: input.schoolYear,
        inviteCode,
        teachers: { create: { userId: teacherId, role: "OWNER" } },
        assignedTracks: { create: { trackSlug: input.trackSlug } },
      },
    });
  }
  throw new Error("Impossible de générer un code d'invitation unique.");
}

export async function listTeacherClassrooms(db: Db, teacherId: string) {
  const rows = await db.classroom.findMany({
    where: { teachers: { some: { userId: teacherId } }, archivedAt: null },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { enrollments: true } }, assignedTracks: true },
  });
  return rows.map((c) => ({
    id: c.id,
    name: c.name,
    schoolYear: c.schoolYear,
    inviteCode: c.inviteCode,
    studentCount: c._count.enrollments,
    trackSlug: c.assignedTracks[0]?.trackSlug ?? null,
  }));
}

function toDates(r: { gameOpensAt: Date; challengeOpensAt: Date; challengeClosesAt: Date }): ReleaseDates {
  return { gameOpensAt: r.gameOpensAt, challengeOpensAt: r.challengeOpensAt, challengeClosesAt: r.challengeClosesAt };
}

export type StudentRow = {
  id: string;
  name: string;
  lastActiveDay: string | null;
  xpWeek: number;
  xpTotal: number;
  stagesDone: number;
  cleared: string[];
  failsByNotion: Record<string, number>;
  alerts: RiskAlert[];
};

/** Tableau de bord d'une classe : réservé à ses enseignants. */
export async function getClassroomDashboard(db: Db, teacherId: string, classroomId: string, now = new Date()) {
  await assertTeacherOf(db, teacherId, classroomId);
  const classroom = await db.classroom.findUniqueOrThrow({
    where: { id: classroomId },
    include: { assignedTracks: true, releases: true, enrollments: { include: { user: { select: { id: true, name: true } } } } },
  });
  const trackSlug = classroom.assignedTracks[0]?.trackSlug ?? "linux-debutant";
  const track = getTrack(trackSlug);
  const notionSlugs = new Set(track?.notions.map((n) => n.slug) ?? []);
  const stageIds = new Set(track?.notions.flatMap((n) => n.stages.map((s) => s.id)) ?? []);
  const releases = Object.fromEntries(classroom.releases.map((r) => [r.notionSlug, toDates(r)]));
  const studentIds = classroom.enrollments.map((e) => e.userId);

  const [days, xpAll, xpWeek, stages, clears, fails] = await Promise.all([
    db.activeDay.groupBy({ by: ["userId"], where: { userId: { in: studentIds } }, _max: { day: true } }),
    db.xpEvent.groupBy({ by: ["userId"], where: { userId: { in: studentIds } }, _sum: { amount: true } }),
    db.xpEvent.groupBy({ by: ["userId"], where: { userId: { in: studentIds }, createdAt: { gte: weekStart(now) } }, _sum: { amount: true } }),
    db.stageAttempt.groupBy({ by: ["userId", "stageId"], where: { userId: { in: studentIds }, success: true } }),
    db.notionProgress.findMany({ where: { userId: { in: studentIds }, status: "PASSED" } }),
    db.challengeAttempt.groupBy({ by: ["userId", "notionSlug"], where: { userId: { in: studentIds }, passed: false }, _count: { _all: true } }),
  ]);

  const students: StudentRow[] = classroom.enrollments
    .map(({ user }) => {
      const cleared = clears.filter((c) => c.userId === user.id && notionSlugs.has(c.notionSlug)).map((c) => c.notionSlug);
      const failsByNotion = Object.fromEntries(
        fails.filter((f) => f.userId === user.id && notionSlugs.has(f.notionSlug)).map((f) => [f.notionSlug, f._count._all]),
      );
      const lastActiveDay = days.find((d) => d.userId === user.id)?._max.day ?? null;
      return {
        id: user.id,
        name: user.name,
        lastActiveDay,
        xpWeek: xpWeek.find((x) => x.userId === user.id)?._sum.amount ?? 0,
        xpTotal: xpAll.find((x) => x.userId === user.id)?._sum.amount ?? 0,
        stagesDone: stages.filter((s) => s.userId === user.id && stageIds.has(s.stageId)).length,
        cleared,
        failsByNotion,
        alerts: studentRisk({ now, lastActiveDay, releases, cleared: new Set(cleared), failsByNotion }),
      };
    })
    .sort((a, b) => b.alerts.length - a.alerts.length || a.name.localeCompare(b.name, "fr"));

  return {
    classroom: { id: classroom.id, name: classroom.name, schoolYear: classroom.schoolYear, inviteCode: classroom.inviteCode, trackSlug },
    releases: Object.fromEntries(
      Object.entries(releases).map(([slug, r]) => [slug, { gameOpensAt: r.gameOpensAt.toISOString(), challengeOpensAt: r.challengeOpensAt.toISOString(), challengeClosesAt: r.challengeClosesAt.toISOString() }]),
    ),
    students,
  };
}

/** Enregistre le planning de la classe (une ligne par notion programmée). */
export async function saveSchedule(db: Db, teacherId: string, classroomId: string, releases: Record<string, ReleaseDates>) {
  await assertTeacherOf(db, teacherId, classroomId);
  const assigned = await db.classroomTrack.findMany({ where: { classroomId } });
  const allowed = new Set(assigned.flatMap((a) => getTrack(a.trackSlug)?.notions.map((n) => n.slug) ?? []));
  const entries = Object.entries(releases).filter(([slug, r]) => allowed.has(slug) && isValidRelease(r));
  await db.notionRelease.deleteMany({ where: { classroomId, notionSlug: { notIn: entries.map(([slug]) => slug) } } });
  for (const [notionSlug, r] of entries) {
    const data = { gameOpensAt: r.gameOpensAt, courseOpensAt: r.gameOpensAt, challengeOpensAt: r.challengeOpensAt, challengeClosesAt: r.challengeClosesAt };
    await db.notionRelease.upsert({
      where: { classroomId_notionSlug: { classroomId, notionSlug } },
      create: { classroomId, notionSlug, ...data },
      update: data,
    });
  }
}

/** Ce qu'un étudiant voit avant de rejoindre : nom de la classe et de l'enseignant. */
export async function previewInvite(db: Db, code: string) {
  const c = await db.classroom.findUnique({
    where: { inviteCode: code },
    include: { teachers: { where: { role: "OWNER" }, include: { user: { select: { name: true } } } } },
  });
  if (!c || c.archivedAt) return null;
  return { name: c.name, teacher: c.teachers[0]?.user.name ?? null };
}

/** Rejoindre une classe : le planning de la classe s'applique désormais aux parcours assignés. */
export async function joinClassroom(db: Db, userId: string, code: string) {
  const c = await db.classroom.findUnique({ where: { inviteCode: code }, include: { assignedTracks: true } });
  if (!c || c.archivedAt) throw new InviteNotFoundError();
  await db.enrollment.upsert({ where: { classroomId_userId: { classroomId: c.id, userId } }, create: { classroomId: c.id, userId }, update: {} });
  for (const { trackSlug } of c.assignedTracks) {
    await db.trackEnrollment.upsert({
      where: { userId_trackSlug: { userId, trackSlug } },
      create: { userId, trackSlug, mode: "CLASSROOM", classroomId: c.id },
      update: { mode: "CLASSROOM", classroomId: c.id },
    });
  }
  return { id: c.id, name: c.name };
}

/** Classe d'un étudiant pour un parcours, avec son planning (null s'il apprend librement). */
export async function getStudentClassroom(db: Db, userId: string, trackSlug: string) {
  const enrollment = await db.trackEnrollment.findUnique({
    where: { userId_trackSlug: { userId, trackSlug } },
    include: { classroom: { include: { releases: true } } },
  });
  if (!enrollment || enrollment.mode !== "CLASSROOM" || !enrollment.classroom) return null;
  const c = enrollment.classroom;
  return {
    id: c.id,
    name: c.name,
    notionSlugs: getTrack(trackSlug)?.notions.map((n) => n.slug) ?? [],
    releases: Object.fromEntries(c.releases.map((r) => [r.notionSlug, toDates(r)])),
  };
}
