import type { TrackInput } from "@/features/catalog/types";

type NotionInput = TrackInput["notions"][number];

export const gitNotion2: NotionInput = {
  slug: "lire-lhistorique",
  position: 2,
  place: "Station Historique",
  concept: "Remonter le temps : log, diff, restore",
  summary: "Relire les commits passés, voir ce qui a changé et annuler une modification : log, diff, restore et .gitignore.",
  guardian: {
    name: "Le Drone Archiviste",
    title: "Gardien des archives de la ville",
    taunt: "Bzzz. Tes souvenirs sont incomplets. Prouve que tu sais les relire.",
  },
  lessons: [
    {
      id: "l-g2-log",
      title: "Le tableau des départs",
      minutes: 5,
      blocks: [
        { kind: "p", text: "`git log` affiche l'historique : les commits du plus récent au plus ancien. Chacun a un identifiant unique, le **hash**, et un message." },
        { kind: "code", code: "$ git log --oneline\n3f2a9c1 Corrige le total\n8b1d4e7 Ajoute le panier\n1c0aa52 Premier commit", caption: "--oneline : un commit par ligne, hash raccourci." },
        { kind: "p", text: "Pour voir ce qu'un commit a changé, donne son hash à `git show`." },
        { kind: "code", code: "$ git show 8b1d4e7" },
        { kind: "tip", text: "Tu n'as pas besoin de recopier tout le hash : les 7 premiers caractères suffisent." },
      ],
    },
    {
      id: "l-g2-diff",
      title: "La loupe et la machine arrière",
      minutes: 7,
      blocks: [
        { kind: "p", text: "`git diff` montre ce que tu as modifié mais pas encore ajouté. Les lignes qui commencent par `+` sont ajoutées, celles qui commencent par `-` sont supprimées." },
        { kind: "code", code: "$ git diff\n-  total = prix\n+  total = prix * quantite" },
        { kind: "tip", text: "`git diff --staged` compare la zone d'index avec le dernier commit : c'est ce qui va partir." },
        { kind: "h", text: "Annuler une modification" },
        { kind: "code", code: "$ git restore notes.txt   # remet le fichier comme au dernier commit" },
        { kind: "warn", text: "git restore efface tes modifications non enregistrées. Il n'y a pas de retour possible : vérifie avec git diff avant." },
        { kind: "h", text: "Ignorer des fichiers" },
        { kind: "p", text: "Certains fichiers n'ont pas leur place dans l'historique : dépendances, journaux, secrets. Liste-les dans un fichier `.gitignore` à la racine du dépôt." },
        { kind: "code", code: "$ echo \"node_modules/\" >> .gitignore" },
      ],
    },
  ],
  stages: [
    {
      id: "g2-1",
      title: "Le tableau des départs",
      description: "Lis l'historique du dépôt.",
      xp: 40,
      encounters: [
        { id: "g2-1-a", type: "qcm", prompt: "Quelle commande affiche l'historique des commits ?", choices: ["git history", "git log", "git list", "git commits"], answer: [1], explanation: "git log liste les commits du plus récent au plus ancien.", skill: "git-log" },
        { id: "g2-1-b", type: "qcm", prompt: "Que fait git log --oneline ?", choices: ["Il affiche un commit par ligne, en version courte", "Il supprime les anciens commits", "Il n'affiche que le dernier commit", "Il crée un commit"], answer: [0], explanation: "--oneline condense chaque commit sur une ligne : hash court et message.", skill: "git-log" },
        { id: "g2-1-c", type: "predict", prompt: "Quel est le message du commit le plus ancien ?", code: "$ git log --oneline\n3f2a9c1 Corrige le total\n8b1d4e7 Ajoute le panier\n1c0aa52 Premier commit", accepted: ["Premier commit"], placeholder: "Recopie le message", explanation: "L'historique se lit du plus récent au plus ancien : le dernier de la liste est le premier commit.", skill: "git-log" },
        { id: "g2-1-d", type: "qcm", prompt: "Dans la sortie de git log, le commit le plus récent apparaît…", choices: ["en dernier", "en premier", "au milieu", "nulle part"], answer: [1], explanation: "Le plus récent est en haut, comme sur un tableau des départs.", skill: "git-log" },
      ],
    },
    {
      id: "g2-2",
      title: "La loupe",
      description: "Vois exactement ce qui a changé.",
      xp: 50,
      encounters: [
        { id: "g2-2-a", type: "qcm", prompt: "Quelle commande montre ce que tu as modifié mais pas encore ajouté ?", choices: ["git diff", "git log", "git add", "git init"], answer: [0], explanation: "git diff compare le dossier de travail avec la zone d'index.", skill: "git-diff" },
        { id: "g2-2-b", type: "fill", prompt: "Compare la zone d'index avec le dernier commit.", template: "git diff {{0}}", answers: ["--staged"], bank: ["--staged", "--oneline", "-m", "--all"], explanation: "--staged montre ce qui partira au prochain commit.", skill: "git-diff" },
        { id: "g2-2-c", type: "qcm", prompt: "Que signifie la ligne qui commence par + ?", code: "-  total = prix\n+  total = prix * quantite", choices: ["Une ligne ajoutée", "Une ligne supprimée", "Une ligne ignorée", "Un conflit"], answer: [0], explanation: "+ marque les lignes ajoutées, - les lignes supprimées.", skill: "git-diff" },
        { id: "g2-2-d", type: "qcm", prompt: "Quelle commande montre le contenu d'un commit précis ?", choices: ["git show 8b1d4e7", "git open 8b1d4e7", "git cat 8b1d4e7", "git status 8b1d4e7"], answer: [0], explanation: "git show affiche le message et les changements d'un commit.", skill: "git-log" },
      ],
    },
    {
      id: "g2-3",
      title: "La machine arrière",
      description: "Annule, ignore, garde un dépôt propre.",
      xp: 60,
      encounters: [
        { id: "g2-3-a", type: "qcm", prompt: "Comment annuler tes modifications non enregistrées de notes.txt ?", choices: ["git restore notes.txt", "git undo notes.txt", "git remove notes.txt", "git log notes.txt"], answer: [0], explanation: "git restore remet le fichier comme dans le dernier commit.", skill: "git-restore" },
        { id: "g2-3-b", type: "qcm", prompt: "Que se passe-t-il après git restore notes.txt ?", choices: ["Tes modifications non enregistrées sont perdues", "Un nouveau commit est créé", "Le fichier disparaît de l'historique", "Rien : tout est réversible"], answer: [0], explanation: "Ce qui n'a jamais été commité ne peut pas être récupéré : relis git diff avant de restaurer.", skill: "git-restore" },
        { id: "g2-3-c", type: "fill", prompt: "Dis à Git d'ignorer le dossier node_modules.", template: "echo \"{{0}}\" >> .gitignore", answers: ["node_modules/"], bank: ["node_modules/", "*.all", ".git", "git add"], explanation: "On ajoute son nom dans .gitignore : Git ne le suivra plus.", skill: "git-ignore" },
        { id: "g2-3-d", type: "qcm", prompt: "À quoi sert le fichier .gitignore ?", choices: ["À lister les fichiers que Git ne doit pas suivre", "À supprimer des fichiers", "À chiffrer le dépôt", "À lister les commits"], answer: [0], explanation: "Parfait pour les dépendances, les journaux et les secrets.", skill: "git-ignore" },
      ],
    },
  ],
  challenge: {
    questionCount: 6,
    durationSeconds: 300,
    passingScore: 70,
    xp: 150,
    bank: [
      { id: "cg2-1", type: "qcm", prompt: "Quelle commande affiche l'historique ?", choices: ["git log", "git show-all", "git diff", "git history"], answer: [0], explanation: "git log liste les commits.", skill: "git-log" },
      { id: "cg2-2", type: "fill", prompt: "Affiche l'historique en version courte.", template: "git log {{0}}", answers: ["--oneline"], bank: ["--oneline", "--staged", "-m", "-p"], explanation: "--oneline : un commit par ligne.", skill: "git-log" },
      { id: "cg2-3", type: "qcm", prompt: "git diff --staged compare…", choices: ["l'index et le dernier commit", "deux branches", "le dépôt et Internet", "deux hash"], answer: [0], explanation: "Il montre ce qui partira au prochain commit.", skill: "git-diff" },
      { id: "cg2-4", type: "qcm", prompt: "Une ligne qui commence par - dans git diff est…", choices: ["supprimée", "ajoutée", "ignorée", "en conflit"], answer: [0], explanation: "- marque ce qui disparaît.", skill: "git-diff" },
      { id: "cg2-5", type: "qcm", prompt: "Quelle commande remet notes.txt comme au dernier commit ?", choices: ["git restore notes.txt", "git log notes.txt", "git add notes.txt", "git init notes.txt"], answer: [0], explanation: "git restore annule les modifications non enregistrées.", skill: "git-restore" },
      { id: "cg2-6", type: "qcm", prompt: "Pourquoi ne faut-il jamais committer un fichier de mots de passe ?", choices: ["Il resterait dans l'historique, visible de tous ceux qui ont le dépôt", "Git est trop lent", "Ça casse les branches", "Ce n'est pas un problème"], answer: [0], explanation: "L'historique garde tout : un secret commité est un secret exposé. Utilise .gitignore.", skill: "git-ignore" },
      { id: "cg2-7", type: "predict", prompt: "Quel est le message du commit le plus récent ?", code: "$ git log --oneline\n9d41be2 Ajoute le menu\n5a7c3f0 Corrige le titre\n0e8b112 Premier commit", accepted: ["Ajoute le menu"], explanation: "Le plus récent est en haut de la liste.", skill: "git-log" },
      { id: "cg2-8", type: "parsons", prompt: "Regarde tes changements, puis annule-les.", lines: ["git diff", "git restore notes.txt"], distractors: ["git commit -m \"annule\""], explanation: "On vérifie d'abord ce qu'on va perdre, puis on restaure.", skill: "git-restore" },
    ],
  },
};
