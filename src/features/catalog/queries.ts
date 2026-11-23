import "server-only";
import { linuxTrack } from "@content/linux";
import { toPublicEncounter } from "@/games/public";
import { trackSchema, type Notion, type Track } from "./types";

/**
 * Lecture du catalogue. Pour l'instant le contenu vient des fichiers `content/`
 * (versionnés avec le code) ; il sera ensuite synchronisé en base de données.
 */
const tracks: Track[] = [trackSchema.parse(linuxTrack)];

export function getTracks(): Track[] {
  return tracks;
}

export function getTrack(slug = "linux-debutant"): Track | undefined {
  return tracks.find((t) => t.slug === slug);
}

export function getNotion(slug: string, trackSlug?: string): { track: Track; notion: Notion } | undefined {
  for (const track of trackSlug ? tracks.filter((t) => t.slug === trackSlug) : tracks) {
    const notion = track.notions.find((n) => n.slug === slug);
    if (notion) return { track, notion };
  }
  return undefined;
}

/** Résumé de notion envoyé aux composants client (sans le contenu des questions) */
export function notionSummaries(track: Track) {
  return track.notions.map((n) => ({
    slug: n.slug,
    position: n.position,
    place: n.place,
    concept: n.concept,
    summary: n.summary,
    guardian: n.guardian,
    stageIds: n.stages.map((s) => s.id),
    hasGuardian: Boolean(n.challenge),
  }));
}
export type NotionSummary = ReturnType<typeof notionSummaries>[number];

/** Étape jouable : les rencontres d'entraînement sont envoyées complètes (correction instantanée) */
export function getStage(notionSlug: string, stageId: string) {
  const found = getNotion(notionSlug);
  if (!found) return undefined;
  const index = found.notion.stages.findIndex((s) => s.id === stageId);
  if (index < 0) return undefined;
  return { ...found, stage: found.notion.stages[index], index };
}

/**
 * Questions du gardien pour une tentative : tirage aléatoire dans la banque,
 * version PUBLIQUE uniquement (règle n°3).
 */
export function drawGuardianQuestions(notion: Notion, random: () => number = Math.random) {
  const bank = notion.challenge?.bank ?? [];
  const count = Math.min(notion.challenge?.questionCount ?? 0, bank.length);
  const pool = [...bank];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count).map(toPublicEncounter);
}

/** Cartes d'une notion (non secrètes : envoyées au navigateur) */
export function cardsOfNotion(track: Track, notionSlug: string) {
  return track.cards.filter((c) => c.notion === notionSlug);
}
