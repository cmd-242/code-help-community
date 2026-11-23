/**
 * Règles de la classe (option enseignant) : fonctions pures, testées
 * (tests/unit/classroom.test.ts).
 */

/** Alphabet sans caractères ambigus (pas de 0/O, 1/I/L) : facile à dicter en classe */
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const INVITE_CODE_LENGTH = 6;

export function generateInviteCode(random: () => number = Math.random): string {
  let code = "";
  for (let i = 0; i < INVITE_CODE_LENGTH; i++) code += CODE_ALPHABET[Math.floor(random() * CODE_ALPHABET.length)];
  return code;
}

/** Normalise un code saisi par un étudiant (espaces, minuscules, tirets) */
export function normalizeInviteCode(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function isValidInviteCode(code: string): boolean {
  return code.length === INVITE_CODE_LENGTH && [...code].every((c) => CODE_ALPHABET.includes(c));
}

export type ReleaseDates = { gameOpensAt: Date; challengeOpensAt: Date; challengeClosesAt: Date };

/**
 * Planning type : une notion par semaine à partir de `start` (lundi conseillé).
 * Le gardien se réveille le vendredi et reste disponible deux semaines (rattrapage).
 */
export function weeklySchedule(slugs: readonly string[], start: Date, guardianOffsetDays = 4, windowDays = 14): Record<string, ReleaseDates> {
  const out: Record<string, ReleaseDates> = {};
  slugs.forEach((slug, i) => {
    const gameOpensAt = new Date(start);
    gameOpensAt.setHours(0, 0, 0, 0);
    gameOpensAt.setDate(gameOpensAt.getDate() + i * 7);
    const challengeOpensAt = new Date(gameOpensAt);
    challengeOpensAt.setDate(challengeOpensAt.getDate() + guardianOffsetDays);
    const challengeClosesAt = new Date(challengeOpensAt);
    challengeClosesAt.setDate(challengeClosesAt.getDate() + windowDays);
    challengeClosesAt.setHours(23, 59, 0, 0);
    out[slug] = { gameOpensAt, challengeOpensAt, challengeClosesAt };
  });
  return out;
}

/** Un planning cohérent : ouverture ≤ réveil du gardien < fermeture */
export function isValidRelease(r: ReleaseDates): boolean {
  return r.gameOpensAt <= r.challengeOpensAt && r.challengeOpensAt < r.challengeClosesAt;
}

export type RiskAlert = "inactive" | "behind" | "struggling";

export const INACTIVE_AFTER_DAYS = 4;
export const STRUGGLING_AFTER_FAILS = 2;

/**
 * Signaux de décrochage d'un étudiant, pour le tableau de bord enseignant.
 * - inactive : aucune activité depuis 4 jours ou plus (ou jamais) ;
 * - behind : une notion dont le gardien est réveillé depuis 3 jours ou plus n'est pas validée ;
 * - struggling : au moins 2 combats perdus sur une notion pas encore validée.
 */
export function studentRisk(input: {
  now: Date;
  lastActiveDay: string | null;
  releases: Record<string, ReleaseDates>;
  cleared: ReadonlySet<string>;
  failsByNotion: Readonly<Record<string, number>>;
}): RiskAlert[] {
  const alerts: RiskAlert[] = [];
  if (!input.lastActiveDay) alerts.push("inactive");
  else {
    const last = new Date(`${input.lastActiveDay}T12:00:00`);
    const days = Math.floor((input.now.getTime() - last.getTime()) / 86_400_000);
    if (days >= INACTIVE_AFTER_DAYS) alerts.push("inactive");
  }
  const behind = Object.entries(input.releases).some(([slug, r]) => {
    const awakeSince = (input.now.getTime() - r.challengeOpensAt.getTime()) / 86_400_000;
    return awakeSince >= 3 && !input.cleared.has(slug);
  });
  if (behind) alerts.push("behind");
  const struggling = Object.entries(input.failsByNotion).some(([slug, fails]) => fails >= STRUGGLING_AFTER_FAILS && !input.cleared.has(slug));
  if (struggling) alerts.push("struggling");
  return alerts;
}

/** Le gardien d'une notion est-il ouvert pour un étudiant de la classe à cet instant ? */
export function guardianWindowOpen(r: ReleaseDates | undefined, now: Date): boolean {
  if (!r) return false;
  return now >= r.challengeOpensAt && now <= r.challengeClosesAt;
}
