import type { Card } from "@/features/catalog/types";
import { toDayKey, weekStart } from "@/features/gamification/rules";

/**
 * Règles de la collection de cartes : fonctions pures, testées
 * (tests/unit/collection.test.ts).
 */

/** Bonnes réponses nécessaires pour chaque niveau de maîtrise d'une carte */
export const MASTERY_STEPS = [5, 12] as const;
export const MAX_MASTERY = 3;

/** Maîtrise d'une carte possédée : 1, 2 ou 3 selon le nombre de bonnes réponses */
export function masteryLevel(hits: number): 1 | 2 | 3 {
  if (hits >= MASTERY_STEPS[1]) return 3;
  if (hits >= MASTERY_STEPS[0]) return 2;
  return 1;
}

/** Bonnes réponses restantes avant le niveau de maîtrise suivant (null au maximum) */
export function hitsToNextMastery(hits: number): number | null {
  const next = MASTERY_STEPS.find((step) => hits < step);
  return next === undefined ? null : next - hits;
}

export const guardianCardId = (notionSlug: string) => `guardian:${notionSlug}`;

/**
 * Cartes « commande » gagnées à la fin d'une épreuve réussie :
 * une carte par compétence réussie au moins une fois, si elle n'est pas déjà possédée.
 */
export function cardsEarnedFromSkills(cards: readonly Card[], succeededSkills: readonly string[], owned: Readonly<Record<string, unknown>>): string[] {
  const skills = new Set(succeededSkills);
  return cards.filter((c) => c.kind === "command" && skills.has(c.id) && !owned[c.id]).map((c) => c.id);
}

/** Clé de la semaine (lundi), pour n'ouvrir qu'un coffre par semaine */
export function weekKey(now: Date): string {
  const monday = weekStart(now);
  return toDayKey(new Date(Date.UTC(monday.getFullYear(), monday.getMonth(), monday.getDate())));
}

export function boosterAvailable(weeklyXp: number, goalXp: number, key: string, openedWeeks: readonly string[]): boolean {
  return weeklyXp >= goalXp && !openedWeeks.includes(key);
}

/**
 * Contenu du coffre de la semaine : une carte possédée devient « brillante ».
 * Si toutes le sont déjà (ou aucune n'est possédée), le coffre donne de l'XP bonus.
 */
export function pickBoosterCard(ownedIds: readonly string[], shiny: Readonly<Record<string, boolean>>, random: () => number = Math.random): string | null {
  const candidates = ownedIds.filter((id) => !shiny[id]);
  if (candidates.length === 0) return null;
  return candidates[Math.floor(random() * candidates.length)];
}

export const BOOSTER_XP = 30;

export function collectionStats(cards: readonly Card[], owned: Readonly<Record<string, unknown>>) {
  return {
    owned: cards.filter((c) => owned[c.id]).length,
    total: cards.length,
  };
}
