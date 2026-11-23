import type { TrackInput } from "@/features/catalog/types";

type NotionInput = TrackInput["notions"][number];

export const gitNotion3: NotionInput = {
  slug: "branches",
  position: 3,
  place: "Carrefour des Branches",
  concept: "Brancher et fusionner",
  summary: "Tester une idée sans casser la ligne principale : branch, switch et merge.",
  guardian: {
    name: "L'Aiguilleur",
    title: "Gardien du grand carrefour",
    taunt: "Une seule voie à la fois. Laquelle prends-tu ?",
  },
  lessons: [
    {
      id: "l-g3-branches",
      title: "Une ligne de métro de plus",
      minutes: 6,
      blocks: [
        { kind: "p", text: "Une **branche** est une ligne de développement parallèle. La ligne principale s'appelle `main`. Tu peux ouvrir une nouvelle ligne pour tester une idée : tant que tu n'as pas fusionné, `main` ne bouge pas." },
        { kind: "code", code: "$ git branch              # liste les branches\n  main\n* panier\n$ git switch main         # aller sur main\n$ git switch -c idee      # créer idee ET aller dessus", caption: "L'étoile * marque la branche sur laquelle tu te trouves." },
        { kind: "p", text: "**HEAD** désigne l'endroit où tu es : généralement la branche courante. Quand tu fais un commit, c'est cette branche qui avance." },
        { kind: "tip", text: "Une branche ne copie pas tes fichiers : c'est un simple pointeur vers un commit, donc elle se crée instantanément." },
      ],
    },
    {
      id: "l-g3-merge",
      title: "La jonction",
      minutes: 6,
      blocks: [
        { kind: "p", text: "Quand l'idée est prête, on **fusionne** la branche dans la ligne principale. Règle d'or : on se place d'abord sur la branche qui doit recevoir, puis on appelle `git merge`." },
        { kind: "code", code: "$ git switch main\n$ git merge idee\nUpdating 3f2a9c1..b81d0aa\nFast-forward", caption: "Fast-forward : main n'avait pas bougé, Git avance simplement le pointeur." },
        { kind: "p", text: "Si `main` a avancé de son côté, Git crée un commit de fusion qui réunit les deux lignes." },
        { kind: "code", code: "$ git branch -d idee      # supprime la branche une fois fusionnée" },
        { kind: "warn", text: "Fusionner `idee` dans `main` se fait depuis `main`, pas depuis `idee`. Vérifie toujours ta branche avec git branch." },
      ],
    },
  ],
  stages: [
    {
      id: "g3-1",
      title: "L'aiguillage",
      description: "Ouvre une nouvelle ligne et change de voie.",
      xp: 40,
      encounters: [
        { id: "g3-1-a", type: "qcm", prompt: "Que représente une branche ?", choices: ["Une ligne de développement parallèle", "Une copie du dépôt sur Internet", "Un fichier caché", "Un message de commit"], answer: [0], explanation: "Une branche permet de travailler sur une idée sans toucher à main.", skill: "git-branch" },
        { id: "g3-1-b", type: "qcm", prompt: "Quelle commande liste les branches ?", choices: ["git branch", "git list", "git switch", "git log --lines"], answer: [0], explanation: "git branch liste les branches ; l'étoile marque la courante.", skill: "git-branch" },
        { id: "g3-1-c", type: "fill", prompt: "Crée la branche panier et place-toi dessus.", template: "git switch {{0}} panier", answers: ["-c"], bank: ["-c", "-m", "-d", "-a"], explanation: "-c (create) crée la branche puis bascule dessus.", skill: "git-switch" },
        { id: "g3-1-d", type: "predict", prompt: "Sur quelle branche es-tu après cette commande ?", code: "$ git switch -c panier", accepted: ["panier"], placeholder: "Nom de la branche", explanation: "Après git switch -c panier, tu es sur la nouvelle branche panier.", skill: "git-head" },
      ],
    },
    {
      id: "g3-2",
      title: "Voyage sur deux lignes",
      description: "Travaille sur une branche sans toucher à main.",
      xp: 50,
      encounters: [
        { id: "g3-2-a", type: "parsons", prompt: "Crée une branche, place-toi dessus et enregistre un commit.", lines: ["git switch -c idee", "git add .", "git commit -m \"Teste une idée\""], distractors: ["git merge idee"], explanation: "On ouvre la ligne, on prépare les fichiers, on enregistre. Le merge viendra plus tard.", skill: "git-switch" },
        { id: "g3-2-b", type: "qcm", prompt: "Tu es sur idee, tu modifies notes.txt et tu fais un commit. Que devient main ?", choices: ["Elle reste inchangée", "Elle reçoit le commit automatiquement", "Elle est supprimée", "Elle est fusionnée"], answer: [0], explanation: "Chaque branche avance séparément. main ne bouge pas tant qu'on ne fusionne pas.", skill: "git-branch" },
        { id: "g3-2-c", type: "qcm", prompt: "Que désigne HEAD ?", choices: ["L'endroit où tu te trouves actuellement", "Le tout premier commit", "La branche distante", "Le dernier fichier modifié"], answer: [0], explanation: "HEAD est ta position : en général la branche courante.", skill: "git-head" },
        { id: "g3-2-d", type: "qcm", prompt: "Comment revenir sur la branche main ?", choices: ["git switch main", "git back main", "git cd main", "git go main"], answer: [0], explanation: "git switch change de branche.", skill: "git-switch" },
      ],
    },
    {
      id: "g3-3",
      title: "La jonction",
      description: "Réunis deux lignes en une seule.",
      xp: 60,
      encounters: [
        { id: "g3-3-a", type: "qcm", prompt: "Quelle commande fusionne la branche idee dans la branche courante ?", choices: ["git merge idee", "git join idee", "git push idee", "git add idee"], answer: [0], explanation: "git merge réunit la branche donnée dans celle où tu es.", skill: "git-merge" },
        { id: "g3-3-b", type: "parsons", prompt: "Fusionne la branche idee dans main.", lines: ["git switch main", "git merge idee"], distractors: ["git switch idee"], explanation: "On se place sur la branche qui reçoit, puis on fusionne.", skill: "git-merge" },
        { id: "g3-3-c", type: "qcm", prompt: "Pour fusionner idee DANS main, tu dois d'abord être sur…", choices: ["main", "idee", "n'importe quelle branche", "une branche distante"], answer: [0], explanation: "Le merge s'applique à la branche courante : celle qui reçoit.", skill: "git-merge" },
        { id: "g3-3-d", type: "fill", prompt: "Supprime la branche idee, maintenant fusionnée.", template: "git branch {{0}} idee", answers: ["-d"], bank: ["-d", "-m", "-c", "-a"], explanation: "-d supprime une branche déjà fusionnée.", skill: "git-branch" },
      ],
    },
  ],
  challenge: {
    questionCount: 6,
    durationSeconds: 300,
    passingScore: 70,
    xp: 150,
    bank: [
      { id: "cg3-1", type: "qcm", prompt: "Quelle commande crée la branche test et bascule dessus ?", choices: ["git switch -c test", "git branch -d test", "git merge test", "git log test"], answer: [0], explanation: "git switch -c crée et bascule.", skill: "git-switch" },
      { id: "cg3-2", type: "qcm", prompt: "Comment savoir sur quelle branche tu es ?", choices: ["git branch (l'étoile)", "git merge", "git init", "git diff --branch"], answer: [0], explanation: "L'étoile marque la branche courante.", skill: "git-branch" },
      { id: "cg3-3", type: "fill", prompt: "Fusionne la branche idee.", template: "git {{0}} idee", answers: ["merge"], bank: ["merge", "switch", "init", "restore"], explanation: "git merge idee, depuis la branche qui reçoit.", skill: "git-merge" },
      { id: "cg3-4", type: "qcm", prompt: "Une branche contient une copie complète de tous les fichiers du projet.", choices: ["Vrai", "Faux : c'est un pointeur vers un commit"], answer: [1], explanation: "C'est un simple pointeur : créer une branche est instantané.", skill: "git-branch" },
      { id: "cg3-5", type: "parsons", prompt: "Ramène l'idée dans main.", lines: ["git switch main", "git merge idee", "git branch -d idee"], distractors: ["git switch -c main"], explanation: "On va sur main, on fusionne, puis on range la branche devenue inutile.", skill: "git-merge" },
      { id: "cg3-6", type: "qcm", prompt: "Tu es sur idee. Que fait git merge main ?", choices: ["Il fusionne main dans idee", "Il fusionne idee dans main", "Il supprime main", "Il crée un dépôt"], answer: [0], explanation: "Le merge s'applique à la branche courante, ici idee.", skill: "git-merge" },
      { id: "cg3-7", type: "predict", prompt: "Sur quelle branche es-tu à la fin ?", code: "$ git switch -c panier\n$ git switch main", accepted: ["main"], explanation: "Le dernier git switch t'a ramené sur main.", skill: "git-head" },
      { id: "cg3-8", type: "qcm", prompt: "Que désigne HEAD ?", choices: ["Ta position actuelle dans l'historique", "Le plus vieux commit", "Un serveur distant", "Un fichier de configuration"], answer: [0], explanation: "HEAD indique où tu es : en général sur la branche courante.", skill: "git-head" },
    ],
  },
};
