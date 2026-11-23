/**
 * Règles de gamification : fonctions pures, testées (tests/unit/gamification.test.ts).
 */

/** XP cumulés nécessaires pour atteindre un niveau : 0, 100, 300, 600, 1000… */
export function xpForLevel(level: number): number {
  return 50 * level * (level - 1);
}

export function levelFromXp(xp: number): { level: number; current: number; needed: number; progress: number } {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level++;
  const floor = xpForLevel(level);
  const next = xpForLevel(level + 1);
  return { level, current: xp - floor, needed: next - floor, progress: (xp - floor) / (next - floor) };
}

/** Clé du titre de rang (traduit dans messages/fr.json → ranks.*) */
export function rankKey(level: number): "novice" | "explorer" | "pathfinder" | "captain" | "shellmaster" {
  if (level <= 2) return "novice";
  if (level <= 4) return "explorer";
  if (level <= 7) return "pathfinder";
  if (level <= 10) return "captain";
  return "shellmaster";
}

export const MAX_HEARTS = 3;

/** Étoiles d'une étape selon les cœurs restants (0 = défaite) */
export function starsFromHearts(heartsLeft: number): number {
  return Math.max(0, Math.min(3, heartsLeft));
}

/**
 * XP gagnés en terminant une étape.
 * Première réussite : XP de base + 10 par étoile au-delà de la première.
 * Amélioration : la différence. Rejouer sans améliorer : 5 XP d'entraînement.
 */
export function stageXp(baseXp: number, previousStars: number, newStars: number): number {
  if (newStars <= 0) return 0;
  const value = (stars: number) => (stars <= 0 ? 0 : baseXp + (stars - 1) * 10);
  const gain = value(newStars) - value(previousStars);
  return gain > 0 ? gain : 5;
}

/** Score d'un combat de gardien, en pourcentage arrondi */
export function challengeScore(correct: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((correct / total) * 100);
}

export function challengeXp(baseXp: number, passed: boolean, alreadyPassed: boolean): number {
  if (!passed) return 20; // l'effort compte aussi
  return alreadyPassed ? 10 : baseXp;
}

/** Série de jours actifs consécutifs, en comptant aujourd'hui ou hier comme point de départ */
export function currentStreak(activeDays: readonly string[], today: string): number {
  const set = new Set(activeDays);
  const day = new Date(`${today}T12:00:00Z`);
  if (!set.has(today)) {
    day.setUTCDate(day.getUTCDate() - 1);
    if (!set.has(toDayKey(day))) return 0;
  }
  let streak = 0;
  while (set.has(toDayKey(day))) {
    streak++;
    day.setUTCDate(day.getUTCDate() - 1);
  }
  return streak;
}

export function toDayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** XP pour une page du cours lue (une seule fois) */
export const LESSON_XP = 10;

/** Objectifs hebdomadaires proposés à l'apprenant libre (XP par semaine) */
export const WEEKLY_GOALS = { calm: 100, steady: 250, intense: 500 } as const;
export type WeeklyGoal = keyof typeof WEEKLY_GOALS;

/** Lundi 00:00 (heure locale) de la semaine de `now` */
export function weekStart(now: Date): Date {
  const d = new Date(now);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  d.setHours(0, 0, 0, 0);
  return d;
}

/** XP gagnés depuis le début de la semaine */
export function weeklyXp(events: readonly { amount: number; at: string }[], now: Date): number {
  const start = weekStart(now).getTime();
  return events.reduce((n, e) => (new Date(e.at).getTime() >= start ? n + e.amount : n), 0);
}
