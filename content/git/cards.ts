import type { TrackInput } from "@/features/catalog/types";

/**
 * Cartes du parcours Git (Néo-Métro).
 * Une carte « commande » par compétence, une carte « gardien » par gardien vaincu.
 */
export const gitCards: NonNullable<TrackInput["cards"]> = [
  // Gare du Dépôt
  { id: "git-init", kind: "command", notion: "premier-depot", title: "git init", rarity: "common", text: "Ouvre un dépôt : le dossier a désormais une mémoire." },
  { id: "git-status", kind: "command", notion: "premier-depot", title: "git status", rarity: "common", text: "Le panneau d'affichage de la gare : où en sont tes fichiers ?" },
  { id: "git-add", kind: "command", notion: "premier-depot", title: "git add", rarity: "rare", text: "Fait monter les fichiers dans le train du prochain commit." },
  { id: "git-commit", kind: "command", notion: "premier-depot", title: "git commit", rarity: "rare", text: "Fait partir le train : un instantané de ton projet, avec un message." },
  { id: "guardian:premier-depot", kind: "guardian", notion: "premier-depot", title: "Le Contrôleur Zéro", rarity: "legendary", text: "Vaincu au premier tourniquet. Ton ticket est valable partout." },
  // Station Historique
  { id: "git-log", kind: "command", notion: "lire-lhistorique", title: "git log", rarity: "common", text: "Le tableau des départs : tous les commits, du plus récent au plus ancien." },
  { id: "git-diff", kind: "command", notion: "lire-lhistorique", title: "git diff", rarity: "rare", text: "La loupe : vois ligne à ligne ce qui a changé." },
  { id: "git-restore", kind: "command", notion: "lire-lhistorique", title: "git restore", rarity: "epic", text: "La machine arrière. Puissante, mais ce qui n'est pas commité est perdu." },
  { id: "git-ignore", kind: "command", notion: "lire-lhistorique", title: ".gitignore", rarity: "rare", text: "La liste des fichiers qui ne montent jamais dans le train." },
  { id: "guardian:lire-lhistorique", kind: "guardian", notion: "lire-lhistorique", title: "Le Drone Archiviste", rarity: "legendary", text: "Vaincu aux archives. Plus aucun commit ne t'échappe." },
  // Carrefour des Branches
  { id: "git-branch", kind: "command", notion: "branches", title: "git branch", rarity: "rare", text: "Ouvre une ligne parallèle sans toucher à la ligne principale." },
  { id: "git-switch", kind: "command", notion: "branches", title: "git switch", rarity: "rare", text: "Change de voie. Avec -c, tu en crées une nouvelle." },
  { id: "git-head", kind: "command", notion: "branches", title: "HEAD", rarity: "epic", text: "Ta position dans le réseau : toujours savoir où tu es." },
  { id: "git-merge", kind: "command", notion: "branches", title: "git merge", rarity: "epic", text: "La jonction : réunit deux lignes en une seule." },
  { id: "guardian:branches", kind: "guardian", notion: "branches", title: "L'Aiguilleur", rarity: "legendary", text: "Vaincu au grand carrefour. Chaque train arrive à la bonne voie." },
];
