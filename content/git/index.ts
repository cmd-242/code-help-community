import type { TrackInput } from "@/features/catalog/types";
import { gitCards } from "./cards";
import { gitNotion1 } from "./notion-1";
import { gitNotion2 } from "./notion-2";
import { gitNotion3 } from "./notion-3";
import { notion } from "../kit";
import { gitStations } from "./notion-456";

export const gitTrack: TrackInput = {
  slug: "git-metro",
  domain: "git",
  title: "Git, le réseau",
  universe: "metro",
  world: "Néo-Métro",
  tagline: "Six stations, deux lignes, un seul réseau : l'historique de tout ton code.",
  cards: [...gitCards, ...gitStations.flatMap((def) => notion(def).cards)],
  notions: [
    gitNotion1,
    gitNotion2,
    gitNotion3,
    ...gitStations.map((def, i) => ({ ...notion(def).notion, position: 4 + i })),
  ],
};
