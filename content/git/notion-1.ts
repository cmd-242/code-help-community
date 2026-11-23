import type { TrackInput } from "@/features/catalog/types";

type NotionInput = TrackInput["notions"][number];

export const gitNotion1: NotionInput = {
  slug: "premier-depot",
  position: 1,
  place: "Gare du Dépôt",
  concept: "Ouvrir un dépôt et enregistrer ton travail",
  summary: "Transformer un dossier en dépôt Git, puis le photographier : init, status, add et commit.",
  guardian: {
    name: "Le Contrôleur Zéro",
    title: "Gardien du premier tourniquet",
    taunt: "Ticket, s'il vous plaît. Ah… tu n'as même pas de dépôt.",
  },
  lessons: [
    {
      id: "l-g1-depot",
      title: "Un dépôt, c'est un quai de départ",
      minutes: 5,
      blocks: [
        { kind: "p", text: "Git garde la mémoire de ton projet. Chaque fois que tu en prends une « photo », il la range dans l'historique : c'est un **commit**. Le dossier suivi par Git s'appelle un **dépôt** (repository, ou « repo »)." },
        { kind: "code", code: "$ mkdir ligne-1\n$ cd ligne-1\n$ git init\nInitialized empty Git repository in /home/aya/ligne-1/.git/", caption: "git init transforme le dossier courant en dépôt." },
        { kind: "p", text: "`git init` crée un dossier caché nommé `.git`. C'est la mémoire du dépôt : tout l'historique y vit." },
        { kind: "warn", text: "Ne supprime jamais le dossier `.git` : tu perdrais tout l'historique du projet." },
        { kind: "h", text: "Trois zones, comme un trajet en métro" },
        { kind: "p", text: "Ton **dossier de travail** est le quai où tu modifies tes fichiers. La **zone d'index** (staging area) est le train en gare : ce que tu y mets partira au prochain départ. L'**historique** contient les trains déjà partis, c'est-à-dire les commits." },
        { kind: "code", code: "dossier de travail  --git add-->  zone d'index  --git commit-->  historique" },
      ],
    },
    {
      id: "l-g1-commit",
      title: "Faire partir un train",
      minutes: 6,
      blocks: [
        { kind: "p", text: "`git status` te dit où tu en es : quels fichiers Git ne connaît pas encore, lesquels ont changé, lesquels sont prêts à partir." },
        { kind: "code", code: "$ git status\nOn branch main\nUntracked files:\n  notes.txt", caption: "« Untracked » : Git ne suit pas encore ce fichier." },
        { kind: "p", text: "Pour le faire monter dans le train, utilise `git add`. Pour faire partir le train, utilise `git commit` avec un message." },
        { kind: "code", code: "$ git add notes.txt\n$ git commit -m \"Ajoute les notes\"\n[main (root-commit) 1c0aa52] Ajoute les notes" },
        { kind: "tip", text: "`git add .` ajoute tous les fichiers modifiés du dossier courant d'un coup." },
        { kind: "warn", text: "Sans l'option `-m`, Git ouvre un éditeur de texte. Écris plutôt un message court et précis : dans six mois, c'est toi qui le liras." },
      ],
    },
  ],
  stages: [
    {
      id: "g1-1",
      title: "Le tourniquet",
      description: "Passe le portillon : ouvre un dépôt et lis son état.",
      xp: 40,
      encounters: [
        { id: "g1-1-a", type: "qcm", prompt: "Quelle commande transforme un dossier en dépôt Git ?", choices: ["git start", "git init", "git new", "git create"], answer: [1], explanation: "git init initialise un dépôt dans le dossier courant.", skill: "git-init" },
        { id: "g1-1-b", type: "predict", prompt: "Quel dossier caché Git crée-t-il dans ligne-1 ?", code: "$ cd ligne-1\n$ git init", accepted: [".git"], placeholder: "Écris son nom", explanation: "git init crée le dossier .git, qui contient toute la mémoire du dépôt.", skill: "git-init" },
        { id: "g1-1-c", type: "qcm", prompt: "À quoi sert git status ?", choices: ["À envoyer ton travail sur Internet", "À montrer l'état des fichiers : nouveaux, modifiés, prêts à partir", "À supprimer les fichiers inutiles", "À créer une branche"], answer: [1], explanation: "git status se lance souvent : c'est le panneau d'affichage de la gare.", skill: "git-status" },
        { id: "g1-1-d", type: "qcm", prompt: "Que signifie « Untracked » dans cette sortie ?", code: "$ git status\nUntracked files:\n  notes.txt", choices: ["Git ne suit pas encore ce fichier", "Le fichier a été supprimé", "Le fichier est déjà enregistré", "Le fichier est corrompu"], answer: [0], explanation: "Untracked = non suivi : Git ne l'a jamais vu. Il faut le git add.", skill: "git-status" },
      ],
    },
    {
      id: "g1-2",
      title: "Le quai de chargement",
      description: "Choisis ce qui monte dans le prochain train.",
      xp: 50,
      encounters: [
        { id: "g1-2-a", type: "fill", prompt: "Prépare notes.txt pour le prochain commit.", template: "git {{0}} notes.txt", answers: ["add"], bank: ["add", "commit", "init", "status"], explanation: "git add place le fichier dans la zone d'index.", skill: "git-add" },
        { id: "g1-2-b", type: "qcm", prompt: "Quelle zone contient ce qui partira au prochain commit ?", choices: ["La zone d'index (staging area)", "La corbeille", "Le terminal", "Le dossier node_modules"], answer: [0], explanation: "La zone d'index est le train en gare : seul ce qui s'y trouve est enregistré.", skill: "git-add" },
        { id: "g1-2-c", type: "qcm", prompt: "Comment ajouter d'un coup tous les fichiers modifiés du dossier courant ?", choices: ["git add --tout", "git add .", "git stage *.all", "git commit ."], answer: [1], explanation: "git add . ajoute tout ce qui a changé dans le dossier courant.", skill: "git-add" },
        { id: "g1-2-d", type: "qcm", prompt: "Après git add notes.txt, git status affiche « Changes to be committed ». Que veut dire cette phrase ?", choices: ["Le fichier est supprimé", "Le fichier est dans la zone d'index et partira au prochain commit", "Le fichier est déjà dans l'historique", "Le fichier contient une erreur"], answer: [1], explanation: "« à enregistrer » : il ne manque plus que git commit.", skill: "git-status" },
      ],
    },
    {
      id: "g1-3",
      title: "Le départ du train",
      description: "Enregistre ton travail avec un commit.",
      xp: 60,
      encounters: [
        { id: "g1-3-a", type: "fill", prompt: "Enregistre le travail avec un message.", template: "git commit {{0}} \"Ajoute les notes\"", answers: ["-m"], bank: ["-m", "-a", "-p", "-r"], explanation: "-m fournit le message directement, sans ouvrir d'éditeur.", skill: "git-commit" },
        { id: "g1-3-b", type: "parsons", prompt: "Fais ton tout premier commit.", lines: ["git init", "git add notes.txt", "git commit -m \"Premier commit\""], distractors: ["git push"], explanation: "On ouvre le dépôt, on prépare le fichier, puis on enregistre. git push enverrait le travail ailleurs : ce n'est pas le sujet.", skill: "git-commit" },
        { id: "g1-3-c", type: "qcm", prompt: "Quel message de commit est le plus utile ?", choices: ["\"modif\"", "\"Corrige le calcul du total du panier\"", "\"aaa\"", "\"fini\""], answer: [1], explanation: "Un bon message dit ce qui change, pas seulement qu'il y a eu un changement.", skill: "git-commit" },
        { id: "g1-3-d", type: "qcm", prompt: "Un commit, c'est…", choices: ["Un instantané de ton projet avec un message", "Une copie envoyée sur Internet", "Une suppression de fichier", "Un dossier caché"], answer: [0], explanation: "Un commit est un instantané : tu pourras y revenir quand tu veux.", skill: "git-commit" },
      ],
    },
  ],
  challenge: {
    questionCount: 6,
    durationSeconds: 300,
    passingScore: 70,
    xp: 150,
    bank: [
      { id: "cg1-1", type: "qcm", prompt: "Quelle commande crée un dépôt Git ?", choices: ["git init", "git add", "git status", "git commit"], answer: [0], explanation: "git init initialise le dépôt.", skill: "git-init" },
      { id: "cg1-2", type: "predict", prompt: "Quel dossier caché contient l'historique ?", code: "$ git init", accepted: [".git"], explanation: "Le dossier .git est la mémoire du dépôt.", skill: "git-init" },
      { id: "cg1-3", type: "qcm", prompt: "Que fait git add ?", choices: ["Il enregistre un commit", "Il place des fichiers dans la zone d'index", "Il crée une branche", "Il supprime un fichier"], answer: [1], explanation: "git add prépare les fichiers pour le prochain commit.", skill: "git-add" },
      { id: "cg1-4", type: "fill", prompt: "Enregistre avec le message « Corrige ».", template: "git commit {{0}} \"Corrige\"", answers: ["-m"], bank: ["-m", "-a", "-r", "-i"], explanation: "-m donne le message du commit.", skill: "git-commit" },
      { id: "cg1-5", type: "qcm", prompt: "Dans quel ordre travaille-t-on ?", choices: ["commit, add, modifier", "modifier, add, commit", "add, modifier, init", "commit, init, add"], answer: [1], explanation: "On modifie les fichiers, on les ajoute à l'index, puis on enregistre.", skill: "git-commit" },
      { id: "cg1-6", type: "qcm", prompt: "Un fichier tout neuf apparaît dans git status comme…", choices: ["Untracked", "Committed", "Merged", "Ignored"], answer: [0], explanation: "Il est « non suivi » tant qu'on ne l'a pas ajouté.", skill: "git-status" },
      { id: "cg1-7", type: "parsons", prompt: "Prépare puis enregistre notes.txt.", lines: ["git add notes.txt", "git commit -m \"Ajoute les notes\""], distractors: ["git status -m"], explanation: "On ajoute d'abord, on enregistre ensuite.", skill: "git-add" },
      { id: "cg1-8", type: "qcm", prompt: "Pourquoi écrire un message de commit précis ?", choices: ["Pour que Git fonctionne", "Pour retrouver plus tard ce que chaque commit change", "Pour gagner de la place", "Il n'y a aucune raison"], answer: [1], explanation: "L'historique ne sert que s'il se lit facilement.", skill: "git-commit" },
    ],
  },
};
