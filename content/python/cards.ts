import type { TrackInput } from "@/features/catalog/types";

/** Cartes du parcours Python (Archipel). */
export const pyCards: NonNullable<TrackInput["cards"]> = [
  // L'Île de l'Œuf
  { id: "py-print", kind: "command", notion: "py-premiers-pas", title: "print()", rarity: "common", text: "Fait parler ton programme." },
  { id: "py-variables", kind: "command", notion: "py-premiers-pas", title: "variable", rarity: "common", text: "Un coffre nommé, sans $ ni mot-clé." },
  { id: "py-types", kind: "command", notion: "py-premiers-pas", title: "int, str, float", rarity: "rare", text: "Chaque valeur a un type : \"3\" n'est pas 3." },
  { id: "py-fstring", kind: "command", notion: "py-premiers-pas", title: "f-string", rarity: "rare", text: "Glisse des variables dans un texte avec {}." },
  { id: "guardian:py-premiers-pas", kind: "guardian", notion: "py-premiers-pas", title: "Le Lézardeau", rarity: "legendary", text: "Vaincu au nid. L'œuf a éclos." },
  // L'Île des Embranchements
  { id: "py-if", kind: "command", notion: "py-conditions", title: "if / elif / else", rarity: "common", text: "La fourche : ton programme choisit son chemin." },
  { id: "py-indent", kind: "command", notion: "py-conditions", title: "indentation", rarity: "epic", text: "Quatre espaces qui dessinent la structure du code." },
  { id: "py-logic", kind: "command", notion: "py-conditions", title: "and / or / not", rarity: "rare", text: "Combine les conditions comme des interrupteurs." },
  { id: "guardian:py-conditions", kind: "guardian", notion: "py-conditions", title: "Le Serpent à Deux Têtes", rarity: "legendary", text: "Vaincu à la fourche. Tu choisis la bonne tête." },
  // L'Île des Anneaux
  { id: "py-list", kind: "command", notion: "py-boucles-listes", title: "liste [ ]", rarity: "common", text: "Une caisse à cases numérotées dès 0." },
  { id: "py-for", kind: "command", notion: "py-boucles-listes", title: "for … in", rarity: "rare", text: "Parcourt une suite, élément après élément." },
  { id: "py-while", kind: "command", notion: "py-boucles-listes", title: "while", rarity: "rare", text: "Répète tant que la condition tient." },
  { id: "guardian:py-boucles-listes", kind: "guardian", notion: "py-boucles-listes", title: "L'Ouroboros", rarity: "legendary", text: "Vaincu dans son cercle. Tes boucles savent s'arrêter." },
  // L'Île de l'Atelier
  { id: "py-def", kind: "command", notion: "py-fonctions-dictionnaires", title: "def", rarity: "rare", text: "Fabrique ton propre outil réutilisable." },
  { id: "py-return", kind: "command", notion: "py-fonctions-dictionnaires", title: "return", rarity: "epic", text: "Rend un résultat : print affiche, return renvoie." },
  { id: "py-dict", kind: "command", notion: "py-fonctions-dictionnaires", title: "dictionnaire { }", rarity: "rare", text: "Des tiroirs étiquetés : une clé, une valeur." },
  { id: "guardian:py-fonctions-dictionnaires", kind: "guardian", notion: "py-fonctions-dictionnaires", title: "Le Pangolin Archiviste", rarity: "legendary", text: "Vaincu au classeur. Tout est rangé, tout est nommé." },
  // L'Île du Grimoire
  { id: "py-files", kind: "command", notion: "py-fichiers-erreurs", title: "with open", rarity: "rare", text: "Lit et écrit des fichiers, puis les referme seul." },
  { id: "py-try", kind: "command", notion: "py-fichiers-erreurs", title: "try / except", rarity: "epic", text: "Rattrape l'erreur avant qu'elle ne plante tout." },
  { id: "guardian:py-fichiers-erreurs", kind: "guardian", notion: "py-fichiers-erreurs", title: "Le Basilic Bibliothécaire", rarity: "legendary", text: "Vaincu au grimoire. Les erreurs ne te font plus peur." },
];
