import "server-only";
import { gitTrack } from "@content/git";
import { linuxTrack } from "@content/linux";
import { toPublicEncounter } from "@/games/public";
import { trackSchema, type Notion, type Track } from "./types";

/**
 * Lecture du catalogue. Pour l'instant le contenu vient des fichiers `content/`
 * (versionnés avec le code) ; il sera ensuite synchronisé en base de données.
 */
const tracks: Track[] = [linuxTrack, gitTrack].map((input) => {
  const track = trackSchema.parse(input);
  return { ...track, cards: track.cards.map((c) => ({ ...c, universe: track.universe })) };
});

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


/** Parcours auquel appartient une notion (pour choisir l'univers d'une page) */
export function universeOfNotion(slug: string) {
  return getNotion(slug)?.track.universe ?? "archipel";
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
    lane: n.lane,
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

// ─── Recherches utilisées par le serveur pour valider la progression ───

export function findStageById(stageId: string) {
  for (const track of tracks)
    for (const notion of track.notions) {
      const stage = notion.stages.find((s) => s.id === stageId);
      if (stage) return { track, notion, stage };
    }
  return undefined;
}

export function findLessonById(lessonId: string) {
  for (const track of tracks)
    for (const notion of track.notions) if (notion.lessons.some((l) => l.id === lessonId)) return { track, notion };
  return undefined;
}

export function findCardById(cardId: string) {
  for (const track of tracks) {
    const card = track.cards.find((c) => c.id === cardId);
    if (card) return { track, card };
  }
  return undefined;
}
