import type { TrackInput } from "@/features/catalog/types";
import { pyCards } from "./cards";
import { pyNotion1 } from "./notion-1";
import { pyNotion2 } from "./notion-2";
import { pyNotion3 } from "./notion-3";
import { pyNotion4 } from "./notion-4";
import { pyNotion5 } from "./notion-5";

export const pythonTrack: TrackInput = {
  slug: "python-debutant",
  domain: "python",
  title: "Python débutant",
  universe: "archipel",
  world: "Les Îles du Serpent",
  tagline: "Cinq îles pour apprendre Python : variables, conditions, boucles, fonctions, fichiers et erreurs.",
  cards: pyCards,
  notions: [pyNotion1, pyNotion2, pyNotion3, pyNotion4, pyNotion5],
};
