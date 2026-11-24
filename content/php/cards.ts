import type { TrackInput } from "@/features/catalog/types";

/** Cartes du parcours PHP (Archipel) : une par compétence, une par gardien. */
export const phpCards: NonNullable<TrackInput["cards"]> = [
  // L'Île du Serveur
  { id: "php-echo", kind: "command", notion: "php-echo-variables", title: "echo", rarity: "common", text: "Fait parler ton script : le texte part du serveur vers l'écran." },
  { id: "php-variables", kind: "command", notion: "php-echo-variables", title: "$variable", rarity: "common", text: "Un coffre qui commence par $ et garde une valeur." },
  { id: "php-concat", kind: "command", notion: "php-echo-variables", title: "Le point .", rarity: "rare", text: "Colle deux textes bout à bout." },
  { id: "guardian:php-echo-variables", kind: "guardian", notion: "php-echo-variables", title: "Le Toucan Muet", rarity: "legendary", text: "Vaincu sur la première île. Ton script a trouvé sa voix." },
  // L'Île des Carrefours
  { id: "php-if", kind: "command", notion: "php-conditions-boucles", title: "if / else", rarity: "common", text: "Un carrefour : le script choisit son chemin." },
  { id: "php-compare", kind: "command", notion: "php-conditions-boucles", title: "=== strict", rarity: "epic", text: "Compare la valeur et le type : aucune surprise." },
  { id: "php-for", kind: "command", notion: "php-conditions-boucles", title: "for", rarity: "rare", text: "Répète un nombre de fois connu à l'avance." },
  { id: "php-while", kind: "command", notion: "php-conditions-boucles", title: "while", rarity: "rare", text: "Répète tant que la condition reste vraie." },
  { id: "guardian:php-conditions-boucles", kind: "guardian", notion: "php-conditions-boucles", title: "Le Kraken des Boucles", rarity: "legendary", text: "Vaincu au grand carrefour. Tes boucles savent s'arrêter." },
  // L'Île des Tableaux
  { id: "php-array", kind: "command", notion: "php-tableaux-fonctions", title: "[ ] tableau", rarity: "common", text: "Une caisse à compartiments numérotés dès 0." },
  { id: "php-foreach", kind: "command", notion: "php-tableaux-fonctions", title: "foreach", rarity: "rare", text: "Le tapis roulant : parcourt chaque case sans compteur." },
  { id: "php-function", kind: "command", notion: "php-tableaux-fonctions", title: "function", rarity: "rare", text: "Ton propre outil, prêt à être réutilisé." },
  { id: "php-return", kind: "command", notion: "php-tableaux-fonctions", title: "return", rarity: "epic", text: "Renvoie un résultat à celui qui appelle la fonction." },
  { id: "guardian:php-tableaux-fonctions", kind: "guardian", notion: "php-tableaux-fonctions", title: "Le Serpent des Tableaux", rarity: "legendary", text: "Vaincu dans sa case cachée. Tu ranges et réutilises comme un pro." },
  // L'Île du Courrier
  { id: "php-post", kind: "command", notion: "php-formulaires", title: "$_POST", rarity: "common", text: "Le courrier envoyé en coulisses par un formulaire." },
  { id: "php-get", kind: "command", notion: "php-formulaires", title: "$_GET", rarity: "common", text: "Les données qui voyagent dans l'adresse de la page." },
  { id: "php-escape", kind: "command", notion: "php-formulaires", title: "htmlspecialchars", rarity: "epic", text: "Désamorce les balises piégées avant l'affichage." },
  { id: "php-filter", kind: "command", notion: "php-formulaires", title: "filter_var", rarity: "rare", text: "Vérifie qu'une donnée a bien la forme attendue." },
  { id: "guardian:php-formulaires", kind: "guardian", notion: "php-formulaires", title: "La Mouette Postière", rarity: "legendary", text: "Vaincue à la boîte aux lettres. Tu ne fais plus confiance au courrier." },
  // L'Île de la Boîte à outils
  { id: "php-strings", kind: "command", notion: "php-fonctions-natives", title: "Fonctions de texte", rarity: "common", text: "strlen, trim, substr… des outils de texte déjà forgés." },
  { id: "php-arrays-fn", kind: "command", notion: "php-fonctions-natives", title: "Fonctions de tableau", rarity: "rare", text: "sort, in_array, implode, explode : le rayon complet." },
  { id: "guardian:php-fonctions-natives", kind: "guardian", notion: "php-fonctions-natives", title: "Le Crabe Forgeron", rarity: "legendary", text: "Vaincu à l'atelier. Tu cherches avant de forger." },
  // L'Île du Coffre-fort
  { id: "php-pdo", kind: "command", notion: "php-base-de-donnees", title: "PDO", rarity: "rare", text: "La clé qui ouvre la base de données." },
  { id: "php-injection", kind: "command", notion: "php-base-de-donnees", title: "Injection SQL", rarity: "epic", text: "L'attaque à connaître pour mieux la bloquer." },
  { id: "php-prepare", kind: "command", notion: "php-base-de-donnees", title: "prepare()", rarity: "epic", text: "Sépare le SQL des données : la serrure infaillible." },
  { id: "guardian:php-base-de-donnees", kind: "guardian", notion: "php-base-de-donnees", title: "Le Dragon des Requêtes", rarity: "legendary", text: "Vaincu au coffre-fort. Ta base est bien gardée." },
];
