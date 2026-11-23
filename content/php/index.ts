import type { TrackInput } from "@/features/catalog/types";
import { phpCards } from "./cards";
import { phpNotion1 } from "./notion-1";
import { phpNotion2 } from "./notion-2";
import { phpNotion3 } from "./notion-3";

export const phpTrack: TrackInput = {
  slug: "php-debutant",
  domain: "php",
  title: "PHP, l'archipel du serveur",
  universe: "archipel",
  world: "L'Archipel du Serveur",
  tagline: "Trois îles pour écrire tes premiers scripts PHP : variables, décisions, boucles, tableaux et fonctions.",
  cards: phpCards,
  notions: [phpNotion1, phpNotion2, phpNotion3],
};
