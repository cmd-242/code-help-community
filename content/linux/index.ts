import type { TrackInput } from "@/features/catalog/types";
import { notion1 } from "./notion-1";
import { notion2 } from "./notion-2";
import { notion3 } from "./notion-3";

/** Îles dont le contenu est encore en cours d'écriture. */
const sealed = (position: number, slug: string, place: string, concept: string, summary: string, guardian: TrackInput["notions"][number]["guardian"]) => ({
  slug,
  position,
  place,
  concept,
  summary,
  guardian,
  lessons: [],
  stages: [],
});

export const linuxTrack: TrackInput = {
  slug: "linux-debutant",
  domain: "linux",
  title: "Linux débutant",
  universe: "archipel",
  world: "L'Archipel du Shell",
  tagline: "Six îles à conquérir, un gardien sur chaque rivage.",
  notions: [
    notion1,
    notion2,
    notion3,
    sealed(4, "droits-et-permissions", "L'Îlot des Sceaux", "Droits et permissions", "Qui peut lire, écrire, exécuter : chmod, chown et les fameux rwx.", {
      name: "La Pieuvre aux Sceaux",
      title: "Gardienne des coffres verrouillés",
      taunt: "Permission refusée.",
    }),
    sealed(5, "processus", "Le Volcan des Processus", "Les processus", "Voir ce qui tourne, l'arrêter, le relancer : ps, top, kill.", {
      name: "Le Serpent du Volcan",
      title: "Celui qui ne s'arrête jamais",
      taunt: "Tu peux m'arrêter… si tu trouves mon numéro.",
    }),
    sealed(6, "scripts-bash", "Le Phare des Scripts", "Écrire des scripts", "Automatiser tes traversées avec des scripts bash : variables, conditions, boucles.", {
      name: "Le Kraken Ancien",
      title: "Veilleur de la dernière île",
      taunt: "Écris le sort parfait, ou reste ici pour toujours.",
    }),
  ],
};
