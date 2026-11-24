import { z } from "zod";
import { encounterSchema } from "@/games/schemas";

/** Blocs d'une leçon (côté fermé : le cours) */
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

/** Grand challenge : le combat contre le gardien du lieu */
export const challengeSchema = z.object({
  questionCount: z.number().int().positive(),
  durationSeconds: z.number().int().positive(),
  passingScore: z.number().int().min(1).max(100),
  xp: z.number().int().positive(),
  bank: z.array(encounterSchema).min(1),
});

/**
 * Univers visuel d'un parcours.
 * archipel : les débuts (îles, mer, bateau) ; metro : les parcours avancés (ville, stations, lignes).
 */
export const universeSchema = z.enum(["archipel", "metro"]);
export type Universe = z.infer<typeof universeSchema>;

export const notionSchema = z.object({
  slug: z.string(),
  /** Ordre dans le parcours (1, 2, 3…) */
  position: z.number().int().positive(),
  /** Nom du lieu dans l'univers du parcours (une île, une station…) */
  place: z.string(),
  concept: z.string(),
  summary: z.string(),
  guardian: guardianSchema,
  lessons: z.array(lessonSchema),
  stages: z.array(stageSchema),
  challenge: challengeSchema.optional(),
  /**
   * Voie sur le plan (Néo-Métro) : 0 = ligne principale, 1 = ligne de dérivation.
   * Quand la voie change d'une notion à la suivante, le plan dessine un embranchement
   * ou une jonction. Ignoré dans l'Archipel.
   */
  lane: z.number().int().min(0).max(1).default(0),
  /**
   * Prérequis au niveau de la notion (slugs, dans n'importe quel parcours) : en plus de la
   * notion précédente de la ligne, ces notions doivent être validées. C'est ce qui relie
   * l'Archipel au Néo-Métro sans obliger à tout finir avant de monter à bord.
   */
  requires: z.array(z.string()).default([]),
  /** Correspondance : ce que cette station partage avec une autre ligne (texte affiché sur le plan) */
  interchange: z.string().optional(),
});

/** Rareté d'une carte de collection */
export const raritySchema = z.enum(["common", "rare", "epic", "legendary"]);
export type Rarity = z.infer<typeof raritySchema>;

/**
 * Carte de collection.
 * kind "command" : liée à une compétence (`skill` des épreuves), gagnée en la réussissant.
 * kind "guardian" : gagnée en battant le gardien de la notion (id = "guardian:<slug>").
 */
export const cardSchema = z.object({
  id: z.string(),
  kind: z.enum(["command", "guardian"]),
  notion: z.string(),
  title: z.string(),
  rarity: raritySchema,
  text: z.string(),
  /** Univers de la carte, rempli par le catalogue d'après son parcours */
  universe: universeSchema.default("archipel"),
});
export type Card = z.infer<typeof cardSchema>;

export const trackSchema = z.object({
  slug: z.string(),
  domain: z.string(),
  title: z.string(),
  universe: universeSchema,
  /** Nom de la carte dans l'univers (ex. « L'Archipel du Shell ») */
  world: z.string(),
  tagline: z.string(),
  notions: z.array(notionSchema).min(1),
  cards: z.array(cardSchema).default([]),
});

export type LessonBlock = z.infer<typeof lessonBlockSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
export type Stage = z.infer<typeof stageSchema>;
export type Guardian = z.infer<typeof guardianSchema>;
export type Challenge = z.infer<typeof challengeSchema>;
export type Notion = z.infer<typeof notionSchema>;
export type Track = z.infer<typeof trackSchema>;
export type TrackInput = z.input<typeof trackSchema>;
