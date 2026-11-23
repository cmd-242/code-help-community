import { z } from "zod";
import { encounterSchema } from "@/games/schemas";

/** Blocs d'une leçon (côté fermé : le grimoire) */
export const lessonBlockSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("h"), text: z.string() }),
  z.object({ kind: z.literal("p"), text: z.string() }),
  z.object({ kind: z.literal("code"), code: z.string(), caption: z.string().optional() }),
  z.object({ kind: z.literal("tip"), text: z.string() }),
  z.object({ kind: z.literal("warn"), text: z.string() }),
]);

export const lessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  minutes: z.number().int().positive(),
  blocks: z.array(lessonBlockSchema).min(1),
});

/** Étape du jeu (côté ouvert) : une salle avec plusieurs rencontres */
export const stageSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  xp: z.number().int().positive(),
  encounters: z.array(encounterSchema).min(1),
});

export const guardianSchema = z.object({
  name: z.string(),
  title: z.string(),
  taunt: z.string(),
});

/** Grand challenge : le combat contre le gardien de l'étage */
export const challengeSchema = z.object({
  questionCount: z.number().int().positive(),
  durationSeconds: z.number().int().positive(),
  passingScore: z.number().int().min(1).max(100),
  xp: z.number().int().positive(),
  bank: z.array(encounterSchema).min(1),
});

export const notionSchema = z.object({
  slug: z.string(),
  floor: z.number().int().positive(),
  room: z.string(),
  concept: z.string(),
  summary: z.string(),
  guardian: guardianSchema,
  lessons: z.array(lessonSchema),
  stages: z.array(stageSchema),
  challenge: challengeSchema.optional(),
});

export const trackSchema = z.object({
  slug: z.string(),
  domain: z.string(),
  title: z.string(),
  dungeon: z.string(),
  tagline: z.string(),
  notions: z.array(notionSchema).min(1),
});

export type LessonBlock = z.infer<typeof lessonBlockSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
export type Stage = z.infer<typeof stageSchema>;
export type Guardian = z.infer<typeof guardianSchema>;
export type Challenge = z.infer<typeof challengeSchema>;
export type Notion = z.infer<typeof notionSchema>;
export type Track = z.infer<typeof trackSchema>;
export type TrackInput = z.input<typeof trackSchema>;
