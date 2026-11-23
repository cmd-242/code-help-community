import "server-only";
import type { PrismaClient } from "@/generated/prisma/client";
import { findCardById, findLessonById, findStageById, getNotion } from "@/features/catalog/queries";
import { BOOSTER_XP, guardianCardId, weekKey } from "@/features/collection/rules";
import { LESSON_XP, WEEKLY_GOALS, challengeXp, stageXp, weekStart, type WeeklyGoal } from "@/features/gamification/rules";
import {
  GOAL_FROM_XP,
  isEmptySnapshot,
  opsFromGuestSnapshot,
  type ProgressOp,
  type ProgressSnapshot,
} from "@/features/progression/sync-schema";

/**
 * Service de progression : seule porte d'entrée pour écrire la progression d'un apprenant.
 * Toutes les règles (XP, cartes, coffre) sont recalculées ici à partir du contenu
 * et de l'historique en base : le navigateur ne décide jamais des XP.
 */

type Db = PrismaClient;
const XP_REASONS = ["stage", "guardian", "lesson", "booster"] as const;
type XpReason = (typeof XP_REASONS)[number];

export async function getSnapshot(db: Db, userId: string, trackSlug = "linux-debutant"): Promise<ProgressSnapshot> {
  const [user, xp, stages, notions, attempts, lessons, days, enrollment, hits, cards, boosters] = await Promise.all([
    db.user.findUniqueOrThrow({ where: { id: userId }, select: { weeklyGoalXp: true } }),
    db.xpEvent.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
    db.stageAttempt.groupBy({ by: ["stageId"], where: { userId, success: true }, _max: { stars: true } }),
    db.notionProgress.findMany({ where: { userId, status: "PASSED" } }),
    db.challengeAttempt.groupBy({ by: ["notionSlug"], where: { userId }, _count: { _all: true } }),
    db.lessonView.findMany({ where: { userId, completedAt: { not: null } } }),
    db.activeDay.findMany({ where: { userId }, orderBy: { day: "asc" } }),
    db.trackEnrollment.findUnique({ where: { userId_trackSlug: { userId, trackSlug } } }),
    db.skillHit.findMany({ where: { userId } }),
    db.userCard.findMany({ where: { userId } }),
    db.boosterOpening.findMany({ where: { userId } }),
  ]);

  return {
    xpEvents: xp
      .filter((e) => (XP_REASONS as readonly string[]).includes(e.reason))
      .map((e) => ({ amount: e.amount, reason: e.reason as XpReason, ref: e.refId ?? "", at: e.createdAt.toISOString() })),
    stageStars: Object.fromEntries(stages.map((s) => [s.stageId, s._max.stars ?? 0])),
    cleared: Object.fromEntries(notions.map((n) => [n.notionSlug, { score: n.bestScore ?? 0, at: (n.passedAt ?? n.updatedAt).toISOString() }])),
    guardianAttempts: Object.fromEntries(attempts.map((a) => [a.notionSlug, a._count._all])),
    lessonsRead: Object.fromEntries(lessons.map((l) => [l.lessonId, true as const])),
    activeDays: days.map((d) => d.day),
    mode: enrollment?.mode === "CLASSROOM" ? "classroom" : "free",
    weeklyGoal: GOAL_FROM_XP[user.weeklyGoalXp as keyof typeof GOAL_FROM_XP] ?? "steady",
    skillHits: Object.fromEntries(hits.map((h) => [h.skill, h.count])),
    cards: Object.fromEntries(cards.map((c) => [c.cardId, { at: c.obtainedAt.toISOString() }])),
    shiny: Object.fromEntries(cards.filter((c) => c.shiny).map((c) => [c.cardId, true as const])),
    boosterWeeks: boosters.map((b) => b.week),
  };
}

async function addXp(db: Db, userId: string, amount: number, reason: XpReason, refId: string) {
  if (amount <= 0) return;
  await db.xpEvent.create({ data: { userId, amount, reason, refId } });
}

/** Applique une liste d'actions de l'apprenant, dans l'ordre. Les actions invalides sont ignorées. */
export async function applyOps(db: Db, userId: string, ops: ProgressOp[], now = new Date(), trackSlug = "linux-debutant"): Promise<void> {
  for (const op of ops) {
    switch (op.type) {
      case "day": {
        await db.activeDay.upsert({ where: { userId_day: { userId, day: op.day } }, create: { userId, day: op.day }, update: {} });
        break;
      }

      case "skill": {
        const found = findCardById(op.skill);
        if (!found || found.card.kind !== "command") break;
        await db.skillHit.upsert({
          where: { userId_skill: { userId, skill: op.skill } },
          create: { userId, skill: op.skill, count: op.count },
          update: { count: { increment: op.count } },
        });
        break;
      }

      case "stage": {
        const found = findStageById(op.stageId);
        if (!found) break;
        const previous = await db.stageAttempt.aggregate({ where: { userId, stageId: op.stageId, success: true }, _max: { stars: true } });
        await db.stageAttempt.create({ data: { userId, stageId: op.stageId, stars: op.stars, success: op.stars > 0 } });
        await addXp(db, userId, stageXp(found.stage.xp, previous._max.stars ?? 0, op.stars), "stage", op.stageId);
        break;
      }

      case "lesson": {
        if (!findLessonById(op.lessonId)) break;
        const existing = await db.lessonView.findUnique({ where: { userId_lessonId: { userId, lessonId: op.lessonId } } });
        if (existing?.completedAt) break;
        await db.lessonView.upsert({
          where: { userId_lessonId: { userId, lessonId: op.lessonId } },
          create: { userId, lessonId: op.lessonId, completedAt: now },
          update: { completedAt: now },
        });
        await addXp(db, userId, LESSON_XP, "lesson", op.lessonId);
        break;
      }

      case "guardian": {
        const challenge = getNotion(op.notionSlug)?.notion.challenge;
        if (!challenge) break;
        const passed = op.score >= challenge.passingScore;
        const progress = await db.notionProgress.findUnique({ where: { userId_notionSlug: { userId, notionSlug: op.notionSlug } } });
        const already = progress?.status === "PASSED";
        await db.challengeAttempt.create({
          data: { userId, notionSlug: op.notionSlug, score: op.score, passed, status: "GRADED", submittedAt: now },
        });
        await addXp(db, userId, challengeXp(challenge.xp, passed, already), "guardian", op.notionSlug);
        if (passed) {
          await db.notionProgress.upsert({
            where: { userId_notionSlug: { userId, notionSlug: op.notionSlug } },
            create: { userId, notionSlug: op.notionSlug, status: "PASSED", bestScore: op.score, passedAt: now },
            update: { status: "PASSED", bestScore: Math.max(op.score, progress?.bestScore ?? 0), passedAt: progress?.passedAt ?? now },
          });
          // La carte légendaire du gardien est accordée par le serveur, jamais demandée par le navigateur
          const cardId = guardianCardId(op.notionSlug);
          if (findCardById(cardId)) {
            await db.userCard.upsert({ where: { userId_cardId: { userId, cardId } }, create: { userId, cardId }, update: {} });
          }
        }
        break;
      }

      case "cards": {
        for (const cardId of op.ids) {
          const found = findCardById(cardId);
          if (!found || found.card.kind !== "command") continue;
          // Une carte « commande » n'est accordée que si la compétence a déjà été réussie
          const hit = await db.skillHit.findUnique({ where: { userId_skill: { userId, skill: cardId } } });
          if (!hit || hit.count < 1) continue;
          await db.userCard.upsert({ where: { userId_cardId: { userId, cardId } }, create: { userId, cardId }, update: {} });
        }
        break;
      }

      case "booster": {
        if (op.week !== weekKey(now)) break;
        const opened = await db.boosterOpening.findUnique({ where: { userId_week: { userId, week: op.week } } });
        if (opened) break;
        const [user, weekly] = await Promise.all([
          db.user.findUniqueOrThrow({ where: { id: userId }, select: { weeklyGoalXp: true } }),
          db.xpEvent.aggregate({ where: { userId, createdAt: { gte: weekStart(now) } }, _sum: { amount: true } }),
        ]);
        if ((weekly._sum.amount ?? 0) < user.weeklyGoalXp) break;
        let shinyCard: string | null = null;
        if (op.cardId) {
          const card = await db.userCard.findUnique({ where: { userId_cardId: { userId, cardId: op.cardId } } });
          if (card && !card.shiny) {
            await db.userCard.update({ where: { userId_cardId: { userId, cardId: op.cardId } }, data: { shiny: true } });
            shinyCard = op.cardId;
          }
        }
        await db.boosterOpening.create({ data: { userId, week: op.week, cardId: shinyCard } });
        if (!shinyCard) await addXp(db, userId, BOOSTER_XP, "booster", op.week);
        break;
      }

      case "settings": {
        if (op.weeklyGoal) {
          await db.user.update({ where: { id: userId }, data: { weeklyGoalXp: WEEKLY_GOALS[op.weeklyGoal as WeeklyGoal] } });
        }
        if (op.mode) {
          const mode = op.mode === "classroom" ? "CLASSROOM" : "FREE";
          await db.trackEnrollment.upsert({
            where: { userId_trackSlug: { userId, trackSlug } },
            create: { userId, trackSlug, mode },
            update: { mode },
          });
        }
        break;
      }
    }
  }
}

/**
 * Reprend la progression jouée en invité, une seule fois : seulement si le compte
 * n'a encore rien en base. Renvoie true si l'import a eu lieu.
 */
export async function importGuestProgress(db: Db, userId: string, guest: ProgressSnapshot, now = new Date()): Promise<boolean> {
  if (isEmptySnapshot(guest)) return false;
  const current = await getSnapshot(db, userId);
  if (!isEmptySnapshot(current)) return false;
  await applyOps(db, userId, opsFromGuestSnapshot(guest), now);
  return true;
}
