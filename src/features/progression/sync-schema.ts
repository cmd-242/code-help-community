import { z } from "zod";

/**
 * Format d'échange de la progression entre le navigateur et le serveur.
 *
 * - `ProgressOp` : une action de l'apprenant envoyée au serveur. Le serveur ne fait
 *   jamais confiance aux XP envoyés : il les recalcule à partir du contenu et de
 *   l'historique (règle n°11, XP = événements calculés côté serveur).
 * - `ProgressSnapshot` : l'état complet renvoyé par le serveur, même forme que le
 *   magasin du navigateur.
 */

const id = z.string().min(1).max(120);
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const progressOpSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("day"), day }),
  z.object({ type: z.literal("stage"), stageId: id, stars: z.number().int().min(0).max(3) }),
  z.object({ type: z.literal("guardian"), notionSlug: id, score: z.number().int().min(0).max(100) }),
  z.object({ type: z.literal("lesson"), lessonId: id }),
  z.object({ type: z.literal("skill"), skill: id, count: z.number().int().min(1).max(500).default(1) }),
  z.object({ type: z.literal("cards"), ids: z.array(id).max(50) }),
  z.object({ type: z.literal("booster"), week: day, cardId: id.nullable() }),
  z.object({
    type: z.literal("settings"),
    mode: z.enum(["free", "classroom"]).optional(),
    weeklyGoal: z.enum(["calm", "steady", "intense"]).optional(),
  }),
]);
export type ProgressOp = z.infer<typeof progressOpSchema>;
export const progressOpsSchema = z.array(progressOpSchema).min(1).max(200);

export const progressSnapshotSchema = z.object({
  xpEvents: z.array(z.object({ amount: z.number().int(), reason: z.enum(["stage", "guardian", "lesson", "booster"]), ref: z.string(), at: z.string() })).max(20000),
  stageStars: z.record(z.string(), z.number().int().min(0).max(3)),
  cleared: z.record(z.string(), z.object({ score: z.number().int(), at: z.string() })),
  guardianAttempts: z.record(z.string(), z.number().int().min(0)),
  lessonsRead: z.record(z.string(), z.literal(true)),
  activeDays: z.array(day).max(2000),
  mode: z.enum(["free", "classroom"]),
  weeklyGoal: z.enum(["calm", "steady", "intense"]),
  skillHits: z.record(z.string(), z.number().int().min(0)),
  cards: z.record(z.string(), z.object({ at: z.string() })),
  shiny: z.record(z.string(), z.literal(true)),
  boosterWeeks: z.array(day).max(1000),
  /** Classe de l'apprenant pour ce parcours (null : apprentissage libre) */
  classroom: z
    .object({
      id: z.string(),
      name: z.string(),
      /** Notions du parcours de la classe : le planning ne s'applique qu'à celles-ci */
      notionSlugs: z.array(z.string()).default([]),
      releases: z.record(z.string(), z.object({ gameOpensAt: z.string(), challengeOpensAt: z.string(), challengeClosesAt: z.string() })),
    })
    .nullable()
    .default(null),
});
export type ProgressSnapshot = z.infer<typeof progressSnapshotSchema>;
export type ClassroomInfo = NonNullable<ProgressSnapshot["classroom"]>;

/** Une progression vide (apprenant qui n'a encore rien fait) ? */
export function isEmptySnapshot(s: Pick<ProgressSnapshot, "stageStars" | "lessonsRead" | "cleared" | "skillHits">): boolean {
  return (
    Object.keys(s.stageStars).length === 0 &&
    Object.keys(s.lessonsRead).length === 0 &&
    Object.keys(s.cleared).length === 0 &&
    Object.keys(s.skillHits).length === 0
  );
}

/**
 * Transforme la progression d'un invité (jouée avant de créer son compte) en actions
 * à rejouer sur le serveur. Les XP ne sont pas recopiés : le serveur les recalcule.
 * Les coffres de la semaine ne sont pas importés (ils dépendent des XP de la semaine).
 */
export function opsFromGuestSnapshot(s: ProgressSnapshot): ProgressOp[] {
  const ops: ProgressOp[] = [{ type: "settings", mode: s.mode, weeklyGoal: s.weeklyGoal }];
  for (const d of s.activeDays) ops.push({ type: "day", day: d });
  for (const [skill, count] of Object.entries(s.skillHits)) if (count > 0) ops.push({ type: "skill", skill, count: Math.min(count, 500) });
  for (const [stageId, stars] of Object.entries(s.stageStars)) if (stars > 0) ops.push({ type: "stage", stageId, stars });
  for (const lessonId of Object.keys(s.lessonsRead)) ops.push({ type: "lesson", lessonId });
  for (const [notionSlug, { score }] of Object.entries(s.cleared)) ops.push({ type: "guardian", notionSlug, score });
  const commandCards = Object.keys(s.cards).filter((c) => !c.startsWith("guardian:"));
  if (commandCards.length) ops.push({ type: "cards", ids: commandCards.slice(0, 50) });
  return ops;
}

/** Correspondance entre l'objectif choisi et les XP stockés en base */
export const GOAL_FROM_XP = { 100: "calm", 250: "steady", 500: "intense" } as const;
