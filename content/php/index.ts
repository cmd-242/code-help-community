import type { TrackInput } from "@/features/catalog/types";
import { phpCards } from "./cards";
import { phpNotion1 } from "./notion-1";
import { phpNotion2 } from "./notion-2";
import { phpNotion3 } from "./notion-3";
import { phpNotion4 } from "./notion-4";
import { phpNotion5 } from "./notion-5";
import { phpNotion6 } from "./notion-6";

export const phpTrack: TrackInput = {
  slug: "php-debutant",
  domain: "php",
  title: "PHP, l'archipel du serveur",
  universe: "archipel",
  world: "L'Archipel du Serveur",
  tagline: "Six îles pour passer du premier echo à une page connectée à sa base de données : variables, boucles, fonctions, formulaires, outils natifs et PDO.",
  cards: phpCards,
  notions: [phpNotion1, phpNotion2, phpNotion3, phpNotion4, phpNotion5, phpNotion6],
};
