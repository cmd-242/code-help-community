import type { TrackInput } from "@/features/catalog/types";

type NotionInput = TrackInput["notions"][number];

export const floor3: NotionInput = {
  slug: "lire-les-fichiers",
  floor: 3,
  room: "La Bibliothèque oubliée",
  concept: "Lire et fouiller les fichiers",
  summary: "Lire des parchemins sans les ouvrir en entier : cat, head, tail, grep, wc et le tuyau |.",
  guardian: {
    name: "La Bibliothécaire spectrale",
    title: "Gardienne des parchemins interdits",
    taunt: "Des milliers de lignes… et tu ne trouveras jamais la bonne.",
  },
  lessons: [
    {
      id: "l3-lire",
      title: "Lire un fichier",
      minutes: 6,
      blocks: [
        { kind: "p", text: "`cat` affiche tout le contenu d'un fichier. Pratique pour les petits fichiers." },
        { kind: "code", code: "$ cat potion.txt\nherbe\nracine\neau de source" },
        { kind: "p", text: "Pour les gros fichiers, on lit seulement le début ou la fin :" },
        { kind: "code", code: "$ head -n 5 journal.log    # les 5 premières lignes\n$ tail -n 5 journal.log    # les 5 dernières lignes\n$ less journal.log         # lecture page par page (q pour quitter)" },
        { kind: "tip", text: "Sans `-n`, head et tail affichent 10 lignes." },
      ],
    },
    {
      id: "l3-grep",
      title: "Chercher et enchaîner",
      minutes: 8,
      blocks: [
        { kind: "p", text: "`grep` affiche les lignes qui contiennent un mot. `wc -l` compte les lignes." },
        { kind: "code", code: "$ grep dragon bestiaire.txt\ndragon rouge\ndragon des glaces\n$ wc -l bestiaire.txt\n42 bestiaire.txt" },
        { kind: "h", text: "Le tuyau |" },
        { kind: "p", text: "Le symbole `|` envoie la sortie d'une commande à l'entrée de la suivante. On construit ainsi des chaînes puissantes." },
        { kind: "code", code: "$ grep dragon bestiaire.txt | wc -l\n2" },
        { kind: "tip", text: "`grep -i` ignore les majuscules, `grep -n` affiche le numéro de ligne." },
      ],
    },
  ],
  stages: [
    {
      id: "s3-1",
      title: "Les parchemins courts",
      description: "Affiche ce que contiennent les rouleaux.",
      xp: 40,
      encounters: [
        { id: "s3-1-a", type: "qcm", prompt: "Quelle commande affiche tout le contenu de potion.txt ?", choices: ["ls potion.txt", "cat potion.txt", "cd potion.txt", "touch potion.txt"], answer: [1], explanation: "cat affiche le contenu du fichier.", skill: "cat" },
        { id: "s3-1-b", type: "predict", prompt: "potion.txt contient trois lignes : herbe, racine, eau. Qu'affiche cette commande ?", code: "$ head -n 1 potion.txt", accepted: ["herbe"], explanation: "head -n 1 affiche uniquement la première ligne.", skill: "head-tail" },
        { id: "s3-1-c", type: "fill", prompt: "Affiche les 3 dernières lignes de journal.log.", template: "{{0}} -n {{1}} journal.log", answers: ["tail", "3"], bank: ["tail", "head", "3", "cat", "-3"], explanation: "tail lit la fin d'un fichier, -n précise le nombre de lignes.", skill: "head-tail" },
        { id: "s3-1-d", type: "qcm", prompt: "Combien de lignes affiche head sans option ?", choices: ["1", "5", "10", "Tout le fichier"], answer: [2], explanation: "Par défaut head et tail affichent 10 lignes.", skill: "head-tail" },
      ],
    },
    {
      id: "s3-2",
      title: "Le mot caché",
      description: "Retrouve une ligne parmi des milliers.",
      xp: 50,
      encounters: [
        { id: "s3-2-a", type: "qcm", prompt: "Quelle commande affiche les lignes contenant « troll » dans bestiaire.txt ?", choices: ["cat troll bestiaire.txt", "grep troll bestiaire.txt", "find troll", "ls troll"], answer: [1], explanation: "grep motif fichier affiche les lignes qui contiennent le motif.", skill: "grep" },
        { id: "s3-2-b", type: "predict", prompt: "bestiaire.txt contient : Troll des cavernes, gobelin, troll des marais. Qu'affiche la commande ?", code: "$ grep troll bestiaire.txt", accepted: ["troll des marais"], explanation: "grep respecte la casse : « Troll » avec majuscule ne correspond pas.", skill: "grep" },
        { id: "s3-2-c", type: "fill", prompt: "Cherche « troll » sans tenir compte des majuscules.", template: "grep {{0}} troll bestiaire.txt", answers: ["-i"], bank: ["-i", "-n", "-r", "-l"], explanation: "-i (ignore case) ignore les majuscules et minuscules.", skill: "grep" },
        { id: "s3-2-d", type: "qcm", prompt: "Quelle option de grep affiche le numéro des lignes trouvées ?", choices: ["-c", "-n", "-v", "-l"], answer: [1], explanation: "-n affiche le numéro de chaque ligne.", skill: "grep" },
      ],
    },
    {
      id: "s3-3",
      title: "Le tuyau des alchimistes",
      description: "Relie les commandes entre elles pour obtenir l'élixir.",
      xp: 60,
      encounters: [
        { id: "s3-3-a", type: "qcm", prompt: "Que fait le symbole | entre deux commandes ?", choices: ["Il exécute les deux en même temps", "Il envoie la sortie de la première à la seconde", "Il écrit dans un fichier", "Il annule la première"], answer: [1], explanation: "Le tuyau relie la sortie d'une commande à l'entrée de la suivante.", skill: "pipe" },
        { id: "s3-3-b", type: "parsons", prompt: "Compte combien de lignes de journal.log contiennent « erreur ».", lines: ["grep erreur journal.log", "| wc -l"], distractors: ["| head -n 1", "cat erreur"], explanation: "grep filtre les lignes, wc -l les compte.", skill: "pipe" },
        { id: "s3-3-c", type: "predict", prompt: "journal.log contient 3 lignes avec « erreur » parmi 50. Qu'affiche la commande ?", code: "$ grep erreur journal.log | wc -l", accepted: ["3"], explanation: "grep garde 3 lignes, wc -l les compte : 3.", skill: "pipe" },
        { id: "s3-3-d", type: "fill", prompt: "Affiche les 2 premières lignes contenant « or ».", template: "grep or tresor.txt {{0}} {{1}} -n 2", answers: ["|", "head"], bank: ["|", "head", "tail", ">", "wc"], explanation: "On filtre avec grep, puis head garde les 2 premières lignes.", skill: "pipe" },
      ],
    },
  ],
  challenge: {
    questionCount: 6,
    durationSeconds: 300,
    passingScore: 70,
    xp: 150,
    bank: [
      { id: "c3-1", type: "qcm", prompt: "Quelle commande lit un très gros fichier page par page ?", choices: ["cat", "less", "head", "wc"], answer: [1], explanation: "less permet de défiler dans un fichier.", skill: "cat" },
      { id: "c3-2", type: "fill", prompt: "Affiche les 20 premières lignes de data.csv.", template: "{{0}} -n 20 data.csv", answers: ["head"], bank: ["head", "tail", "cat", "less"], explanation: "head lit le début du fichier.", skill: "head-tail" },
      { id: "c3-3", type: "predict", prompt: "noms.txt contient 4 lignes. Qu'affiche la commande ?", code: "$ wc -l noms.txt", accepted: ["4 noms.txt"], explanation: "wc -l affiche le nombre de lignes suivi du nom du fichier.", skill: "pipe" },
      { id: "c3-4", type: "qcm", prompt: "Que fait grep -v erreur journal.log ?", choices: ["Affiche les lignes avec erreur", "Affiche les lignes sans erreur", "Compte les erreurs", "Supprime les erreurs"], answer: [1], explanation: "-v inverse la recherche : lignes qui ne contiennent pas le motif.", skill: "grep" },
      { id: "c3-5", type: "parsons", prompt: "Affiche la dernière ligne contenant « porte ».", lines: ["grep porte plan.txt", "| tail -n 1"], distractors: ["| head -n 1"], explanation: "grep filtre, tail -n 1 garde la dernière.", skill: "pipe" },
      { id: "c3-6", type: "qcm", prompt: "Comment chercher « Dragon » et « dragon » en une fois ?", choices: ["grep -n dragon", "grep -i dragon", "grep -v dragon", "grep dragon Dragon"], answer: [1], explanation: "-i ignore la casse.", skill: "grep" },
      { id: "c3-7", type: "predict", prompt: "potion.txt contient : herbe, racine, eau. Qu'affiche la commande ?", code: "$ tail -n 1 potion.txt", accepted: ["eau"], explanation: "tail -n 1 affiche la dernière ligne.", skill: "head-tail" },
      { id: "c3-8", type: "qcm", prompt: "Dans « cat a.txt | grep x », qui reçoit la sortie de cat ?", choices: ["Le terminal", "grep", "Le fichier x", "Personne"], answer: [1], explanation: "Le tuyau envoie la sortie de cat à grep.", skill: "pipe" },
    ],
  },
};
