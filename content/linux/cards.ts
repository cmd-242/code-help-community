import type { TrackInput } from "@/features/catalog/types";

/**
 * Cartes du parcours Linux débutant.
 * - Une carte « commande » par compétence (`skill` des épreuves) : gagnée en la réussissant.
 * - Une carte « gardien » par gardien vaincu (légendaire).
 */
export const linuxCards: NonNullable<TrackInput["cards"]> = [
  // Île 1
  { id: "pwd", kind: "command", notion: "se-reperer", title: "pwd", rarity: "common", text: "Affiche le chemin complet du dossier où tu te trouves." },
  { id: "ls", kind: "command", notion: "se-reperer", title: "ls", rarity: "common", text: "Liste ce qui t'entoure. Avec -a, même les fichiers cachés." },
  { id: "cd", kind: "command", notion: "se-reperer", title: "cd", rarity: "common", text: "Te déplace de dossier en dossier. cd .. pour remonter." },
  { id: "chemins", kind: "command", notion: "se-reperer", title: "/ ~ ..", rarity: "rare", text: "Chemins absolus et relatifs : savoir toujours où mène la route." },
  { id: "guardian:se-reperer", kind: "guardian", notion: "se-reperer", title: "Écho le Perroquet", rarity: "legendary", text: "Vaincu sur l'Île du Terminal. Il répète tout, sauf tes erreurs." },
  // Île 2
  { id: "mkdir", kind: "command", notion: "fichiers-et-dossiers", title: "mkdir", rarity: "common", text: "Construit un dossier. Avec -p, toute une arborescence d'un coup." },
  { id: "touch", kind: "command", notion: "fichiers-et-dossiers", title: "touch", rarity: "common", text: "Crée un fichier vide en un geste." },
  { id: "cp", kind: "command", notion: "fichiers-et-dossiers", title: "cp", rarity: "rare", text: "Copie un fichier, ou un dossier entier avec -r." },
  { id: "mv", kind: "command", notion: "fichiers-et-dossiers", title: "mv", rarity: "rare", text: "Déplace ou renomme : deux pouvoirs dans une seule commande." },
  { id: "rm", kind: "command", notion: "fichiers-et-dossiers", title: "rm", rarity: "epic", text: "Efface pour de bon. Il n'y a pas de corbeille : manie-la avec -i." },
  { id: "guardian:fichiers-et-dossiers", kind: "guardian", notion: "fichiers-et-dossiers", title: "Le Kraken des Fichiers", rarity: "legendary", text: "Vaincu au chantier naval. Ta cargaison est en sécurité." },
  // Île 3
  { id: "cat", kind: "command", notion: "lire-les-fichiers", title: "cat", rarity: "common", text: "Déroule tout le parchemin d'un coup." },
  { id: "head-tail", kind: "command", notion: "lire-les-fichiers", title: "head / tail", rarity: "rare", text: "Lis seulement le début ou la fin d'un long parchemin." },
  { id: "grep", kind: "command", notion: "lire-les-fichiers", title: "grep", rarity: "epic", text: "Fouille un fichier et ne garde que les lignes qui contiennent le motif." },
  { id: "pipe", kind: "command", notion: "lire-les-fichiers", title: "|", rarity: "epic", text: "Le tuyau : la sortie d'une commande devient l'entrée de la suivante." },
  { id: "guardian:lire-les-fichiers", kind: "guardian", notion: "lire-les-fichiers", title: "Le Serpent des Archives", rarity: "legendary", text: "Vaincu au Récif des Parchemins. Plus aucune ligne ne t'échappe." },
];
