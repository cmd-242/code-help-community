import type { TrackInput } from "@/features/catalog/types";
import { floor1 } from "./floor-1";
import { floor2 } from "./floor-2";
import { floor3 } from "./floor-3";

/** Étages encore scellés : leur contenu sera rédigé au fil des semaines. */
const sealed = (floor: number, slug: string, room: string, concept: string, summary: string, guardian: TrackInput["notions"][number]["guardian"]) => ({
  slug,
  floor,
  room,
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
  dungeon: "Les Catacombes du Shell",
  tagline: "Six étages sous la terre, un gardien à chaque palier.",
  notions: [
    floor1,
    floor2,
    floor3,
    sealed(4, "droits-et-permissions", "La Crypte des Sceaux", "Droits et permissions", "Qui peut lire, écrire, exécuter : chmod, chown et les fameux rwx.", {
      name: "Le Sceau vivant",
      title: "Verrou animé de la crypte",
      taunt: "Permission refusée.",
    }),
    sealed(5, "processus", "Les Forges hurlantes", "Les processus", "Voir ce qui tourne, l'arrêter, le relancer : ps, top, kill.", {
      name: "Le Démon des processus",
      title: "Celui qui ne s'arrête jamais",
      taunt: "Tu peux m'arrêter… si tu trouves mon numéro.",
    }),
    sealed(6, "scripts-bash", "Le Sanctum du Scribe", "Écrire des scripts", "Automatiser tes quêtes avec des scripts bash : variables, conditions, boucles.", {
      name: "L'Archiscribe",
      title: "Gardien du dernier étage",
      taunt: "Écris le sort parfait, ou reste ici pour toujours.",
    }),
  ],
};
