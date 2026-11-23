import type { TrackInput } from "@/features/catalog/types";

/**
 * Petits outils pour écrire un parcours sans répéter la même structure.
 * Les identifiants des étapes, épreuves et leçons sont générés à partir du préfixe de la notion.
 */
type Notion = TrackInput["notions"][number];
type Card = NonNullable<TrackInput["cards"]>[number];
type Rarity = Card["rarity"];
type Block = Notion["lessons"][number]["blocks"][number];

/** Épreuve sans identifiant : il est attribué par `notion()`. */
export type Enc = { type: string; skill?: string; [key: string]: unknown };

export const q = (skill: string, prompt: string, choices: string[], answer: number, explanation: string, code?: string): Enc => ({
  type: "qcm",
  skill,
  prompt,
  choices,
  answer: [answer],
  explanation,
  ...(code ? { code } : {}),
});

export const pr = (skill: string, prompt: string, code: string, accepted: string | string[], explanation: string, placeholder?: string): Enc => ({
  type: "predict",
  skill,
  prompt,
  code,
  accepted: Array.isArray(accepted) ? accepted : [accepted],
  explanation,
  ...(placeholder ? { placeholder } : {}),
});

/** Écrire du code : `harness` est ajouté après le code ; `accepted` = sortie attendue. */
export const co = (
  skill: string,
  prompt: string,
  language: "javascript" | "python",
  starter: string,
  harness: string,
  accepted: string | string[],
  solution: string,
  explanation: string,
): Enc => ({
  type: "code",
  skill,
  prompt,
  language,
  starter,
  ...(harness ? { harness } : {}),
  accepted: Array.isArray(accepted) ? accepted : [accepted],
  solution,
  explanation,
});

/** Terminal simulé : `files` initiaux, `goal` vérifié sur l'état final, `solution` = commandes de référence. */
export const tm = (
  skill: string,
  prompt: string,
  files: Record<string, string>,
  goal: Record<string, unknown>,
  solution: string[],
  explanation: string,
  cwd?: string,
): Enc => ({ type: "terminal", skill, prompt, files, ...(cwd ? { cwd } : {}), goal, solution, explanation });

export const fl = (skill: string, prompt: string, template: string, answer: string | string[], bank: string[], explanation: string): Enc => ({
  type: "fill",
  skill,
  prompt,
  template,
  answers: Array.isArray(answer) ? answer : [answer],
  bank,
  explanation,
});

export const ps = (skill: string, prompt: string, lines: string[], distractors: string[], explanation: string): Enc => ({
  type: "parsons",
  skill,
  prompt,
  lines,
  distractors,
  explanation,
});

export const H = (text: string): Block => ({ kind: "h", text });
export const P = (text: string): Block => ({ kind: "p", text });
export const C = (code: string, caption?: string): Block => ({ kind: "code", code, ...(caption ? { caption } : {}) });
export const T = (text: string): Block => ({ kind: "tip", text });
export const W = (text: string): Block => ({ kind: "warn", text });

export type Lesson = [title: string, minutes: number, ...blocks: Block[]];
export type SkillCard = [id: string, title: string, rarity: Rarity, text: string];

export type NotionDef = {
  /** Préfixe court des identifiants (ex. « js1 ») */
  id: string;
  slug: string;
  place: string;
  concept: string;
  summary: string;
  /** Voie sur le plan Néo-Métro (0 par défaut) */
  lane?: number;
  guardian: { name: string; title: string; taunt: string };
  /** Texte de la carte du gardien vaincu */
  win: string;
  lessons: Lesson[];
  /** Trois étapes : titre, description, épreuves */
  stages: [title: string, description: string, encounters: Enc[]][];
  challenge: Enc[];
  skills: SkillCard[];
};

const XP = [40, 50, 60];

export function notion(def: NotionDef): { notion: Omit<Notion, "position">; cards: Card[] } {
  const withIds = (list: Enc[], prefix: string) => list.map((e, i) => ({ ...e, id: `${prefix}-${String.fromCharCode(97 + i)}` }));
  const notion = {
    slug: def.slug,
    place: def.place,
    concept: def.concept,
    summary: def.summary,
    lane: def.lane ?? 0,
    guardian: def.guardian,
    lessons: def.lessons.map(([title, minutes, ...blocks], i) => ({ id: `l-${def.id}-${i + 1}`, title, minutes, blocks })),
    stages: def.stages.map(([title, description, encounters], i) => ({
      id: `${def.id}-${i + 1}`,
      title,
      description,
      xp: XP[i] ?? 60,
      encounters: withIds(encounters, `${def.id}-${i + 1}`),
    })),
    challenge: {
      questionCount: Math.min(6, def.challenge.length),
      durationSeconds: 300,
      passingScore: 70,
      xp: 150,
      bank: withIds(def.challenge, `c${def.id}`),
    },
  } as unknown as Omit<Notion, "position">;
  const cards: Card[] = [
    ...def.skills.map(([id, title, rarity, text]) => ({ id, kind: "command" as const, notion: def.slug, title, rarity, text, universe: "archipel" as const })),
    { id: `guardian:${def.slug}`, kind: "guardian" as const, notion: def.slug, title: def.guardian.name, rarity: "legendary" as const, text: def.win, universe: "archipel" as const },
  ];
  return { notion, cards };
}

export type TrackMeta = Pick<TrackInput, "slug" | "domain" | "title" | "universe" | "world" | "tagline">;

/** Assemble un parcours : positions 1…n, cartes regroupées. Les notions « scellées » sont des stations à venir. */
export function track(meta: TrackMeta, defs: NotionDef[], sealed: Omit<Notion, "position" | "lessons" | "stages" | "challenge">[] = []): TrackInput {
  const built = defs.map(notion);
  const notions = [
    ...built.map((b) => b.notion),
    ...sealed.map((s) => ({ ...s, lessons: [], stages: [] }) as unknown as Omit<Notion, "position">),
  ].map((n, i) => ({ ...n, position: i + 1 }));
  return { ...meta, notions: notions as TrackInput["notions"], cards: built.flatMap((b) => b.cards) };
}
