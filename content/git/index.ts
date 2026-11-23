import type { TrackInput } from "@/features/catalog/types";
import { gitCards } from "./cards";
import { gitNotion1 } from "./notion-1";
import { gitNotion2 } from "./notion-2";
import { gitNotion3 } from "./notion-3";

/** Stations dont le contenu est encore en cours d'écriture. */
const sealed = (position: number, lane: number, slug: string, place: string, concept: string, summary: string, guardian: TrackInput["notions"][number]["guardian"]) => ({
  slug,
  position,
  lane,
  place,
  concept,
  summary,
  guardian,
  lessons: [],
  stages: [],
});

export const gitTrack: TrackInput = {
  slug: "git-metro",
  domain: "git",
  title: "Git, le réseau",
  universe: "metro",
  world: "Néo-Métro",
  tagline: "Six stations, deux lignes, un seul réseau : l'historique de tout ton code.",
  cards: gitCards,
  notions: [
    gitNotion1,
    gitNotion2,
    gitNotion3,
    sealed(4, 1, "depot-distant", "Gare du Dépôt Distant", "Dépôts distants", "Envoyer et récupérer du code : clone, push, pull.", {
      name: "Le Réseau Fantôme",
      title: "Gardien du tunnel interdit",
      taunt: "Ton code n'existe que sur ta machine. Quel dommage si elle tombait en panne…",
    }),
    sealed(5, 1, "conflits", "Station Correspondance", "Résoudre les conflits", "Deux personnes ont modifié la même ligne : comment réunir proprement ?", {
      name: "Le Court-Circuit",
      title: "Gardien des voies en conflit",
      taunt: "Deux trains, une seule voie. Qui passe en premier ?",
    }),
    sealed(6, 0, "rebase-et-releases", "Terminus Release", "Rebase, tags et releases", "Garder un historique propre et marquer les versions livrées.", {
      name: "L'Express Infini",
      title: "Gardien du dernier terminus",
      taunt: "Il n'y a pas de dernière station pour qui ne sait pas livrer.",
    }),
  ],
};
