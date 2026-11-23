/**
 * Calcul du statut d'une notion (étage) pour un étudiant.
 * Règle d'architecture n°10 : le déblocage est CALCULÉ à la lecture,
 * à partir du planning de la classe, des prérequis et des dérogations.
 */

export type FloorStatus =
  | "sealed" // pas encore ouvert par l'enseignant (date future)
  | "blocked" // ouvert, mais le gardien de l'étage précédent n'est pas vaincu
  | "open" // on peut explorer les étapes
  | "guardian" // toutes les étapes terminées : le gardien attend
  | "cleared"; // gardien vaincu, notion validée

export type Release = {
  gameOpensAt: Date;
  challengeOpensAt: Date;
  challengeClosesAt: Date;
};

export type Override = { unlock?: boolean; newClosesAt?: Date };

export type FloorInput = {
  release: Release | null;
  now: Date;
  previousCleared: boolean;
  cleared: boolean;
  stagesTotal: number;
  stagesDone: number;
  override?: Override;
};

export function floorStatus(i: FloorInput): FloorStatus {
  if (i.cleared) return "cleared";
  const forced = i.override?.unlock === true;
  if (!forced && (!i.release || i.release.gameOpensAt > i.now)) return "sealed";
  if (!forced && !i.previousCleared) return "blocked";
  if (i.stagesTotal > 0 && i.stagesDone >= i.stagesTotal) return "guardian";
  return "open";
}

export type GuardianGate = "ready" | "explore-first" | "not-yet" | "closed";

/** Peut-on affronter le gardien maintenant ? */
export function guardianGate(i: FloorInput): GuardianGate {
  if (i.stagesDone < i.stagesTotal) return "explore-first";
  if (!i.release) return "not-yet";
  const closes = i.override?.newClosesAt ?? i.release.challengeClosesAt;
  if (i.now < i.release.challengeOpensAt) return "not-yet";
  if (i.now > closes) return "closed";
  return "ready";
}

/**
 * Planning de démonstration : l'étage 1 est ouvert depuis le lundi courant,
 * chaque étage suivant s'ouvre une semaine plus tard (rythme hebdomadaire).
 * Il sera remplacé par les `NotionRelease` de la classe en base de données.
 */
export function demoRelease(floor: number, now: Date, openFloorsNow = 3): Release {
  const monday = new Date(now);
  const day = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - day);
  monday.setHours(0, 0, 0, 0);
  const weeksFromNow = floor - openFloorsNow;
  const gameOpensAt = new Date(monday);
  gameOpensAt.setDate(monday.getDate() + weeksFromNow * 7);
  const challengeOpensAt = new Date(gameOpensAt);
  const challengeClosesAt = new Date(gameOpensAt);
  challengeClosesAt.setDate(gameOpensAt.getDate() + 60);
  return { gameOpensAt, challengeOpensAt, challengeClosesAt };
}
