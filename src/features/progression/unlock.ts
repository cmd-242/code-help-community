/**
 * Calcul du statut d'une notion (un lieu de la carte : île, station…) pour un apprenant.
 * Règle d'architecture n°10 : le déblocage est CALCULÉ à la lecture.
 *
 * Deux façons d'apprendre, la première étant la norme :
 *  - LIBRE (autodidacte, sans école) : pas de planning (`release = null`).
 *    Une notion s'ouvre dès que le gardien précédent est vaincu.
 *  - EN CLASSE (option) : le planning de l'enseignant (`release`) s'ajoute
 *    à la progression : une notion s'ouvre à sa date ET après le gardien précédent.
 */

export type NotionStatus =
  | "sealed" // en classe uniquement : pas encore ouvert par l'enseignant (date future)
  | "blocked" // ouvert, mais le gardien précédent n'est pas vaincu
  | "open" // on peut explorer les étapes
  | "guardian" // toutes les étapes terminées : le gardien attend
  | "cleared"; // gardien vaincu, notion validée

export type Release = {
  gameOpensAt: Date;
  challengeOpensAt: Date;
  challengeClosesAt: Date;
};

export type Override = { unlock?: boolean; newClosesAt?: Date };

export type NotionInput = {
  /** null = apprentissage libre, sans planning d'enseignant */
  release: Release | null;
  now: Date;
  previousCleared: boolean;
  cleared: boolean;
  stagesTotal: number;
  stagesDone: number;
  override?: Override;
};

export function notionStatus(i: NotionInput): NotionStatus {
  if (i.cleared) return "cleared";
  const forced = i.override?.unlock === true;
  if (!forced && i.release && i.release.gameOpensAt > i.now) return "sealed";
  if (!forced && !i.previousCleared) return "blocked";
  if (i.stagesTotal > 0 && i.stagesDone >= i.stagesTotal) return "guardian";
  return "open";
}

export type GuardianGate = "ready" | "explore-first" | "not-yet" | "closed";

/** Peut-on affronter le gardien maintenant ? */
export function guardianGate(i: NotionInput): GuardianGate {
  if (i.stagesDone < i.stagesTotal) return "explore-first";
  if (!i.release) return "ready"; // libre : le gardien attend dès que le lieu est exploré
  const closes = i.override?.newClosesAt ?? i.release.challengeClosesAt;
  if (i.now < i.release.challengeOpensAt) return "not-yet";
  if (i.now > closes) return "closed";
  return "ready";
}

/**
 * Planning de démonstration du MODE CLASSE : la notion 3 s'ouvre ce lundi,
 * chaque notion suivante s'ouvre une semaine plus tard (rythme hebdomadaire).
 * Il sera remplacé par les `NotionRelease` de la classe en base de données.
 */
export function demoRelease(position: number, now: Date, openNow = 3): Release {
  const monday = new Date(now);
  const day = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - day);
  monday.setHours(0, 0, 0, 0);
  const weeksFromNow = position - openNow;
  const gameOpensAt = new Date(monday);
  gameOpensAt.setDate(monday.getDate() + weeksFromNow * 7);
  const challengeOpensAt = new Date(gameOpensAt);
  const challengeClosesAt = new Date(gameOpensAt);
  challengeClosesAt.setDate(gameOpensAt.getDate() + 60);
  return { gameOpensAt, challengeOpensAt, challengeClosesAt };
}
