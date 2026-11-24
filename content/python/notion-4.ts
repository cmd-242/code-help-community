import type { TrackInput } from "@/features/catalog/types";

type NotionInput = TrackInput["notions"][number];

export const pyNotion4: NotionInput = {
  slug: "py-fonctions-dictionnaires",
  position: 4,
  place: "L'Île de l'Atelier",
  concept: "Fonctions et dictionnaires",
  summary: "Réutiliser ton code avec des fonctions, et ranger des valeurs étiquetées dans un dictionnaire.",
  guardian: {
    name: "Le Pangolin Archiviste",
    title: "Gardien du grand classeur",
    taunt: "Une étiquette, une valeur. Ou bien tu te perds dans mes tiroirs.",
  },
  lessons: [
    {
      id: "l-y4-fonctions",
      title: "Ton propre outil",
      minutes: 6,
      blocks: [
        { kind: "p", text: "Une **fonction** est un bout de code nommé que tu peux réutiliser. On la déclare avec `def`, et elle renvoie un résultat avec `return`." },
        { kind: "code", code: "def carre(n):\n    return n * n\n\nprint(carre(3) + 1)   # 10" },
        { kind: "warn", text: "`print` affiche, `return` renvoie. Une fonction qui se contente d'afficher ne peut pas servir dans un calcul : elle donne `None`." },
        { kind: "code", code: "def saluer(nom=\"toi\"):\n    return f\"Salut {nom}\"\n\nprint(saluer())        # Salut toi\nprint(saluer(\"Aya\"))   # Salut Aya", caption: "Un paramètre peut avoir une valeur par défaut." },
      ],
    },
    {
      id: "l-y4-dictionnaires",
      title: "Des tiroirs étiquetés",
      minutes: 6,
      blocks: [
        { kind: "p", text: "Un **dictionnaire** associe une clé à une valeur, entre accolades. On retrouve une valeur grâce à sa clé." },
        { kind: "code", code: "perso = {\"nom\": \"Aya\", \"niveau\": 3}\nprint(perso[\"nom\"])      # Aya\nperso[\"niveau\"] = 4     # modifie\nperso[\"or\"] = 10        # ajoute\nfor cle, valeur in perso.items():\n    print(cle, valeur)" },
        { kind: "tip", text: "`perso.get(\"age\", 0)` renvoie 0 si la clé n'existe pas, au lieu de lever une erreur `KeyError`." },
      ],
    },
  ],
  stages: [
    {
      id: "y4-1",
      title: "L'établi",
      description: "Écris tes premières fonctions.",
      xp: 40,
      encounters: [
        {"id": "y4-1-a", "type": "code", "language": "python", "prompt": "Écris la fonction saluer(nom) qui renvoie « Salut » suivi d'un espace et du nom.", "starter": "def saluer(nom):\n    pass", "harness": "print(saluer(\"Aya\"))", "accepted": ["Salut Aya"], "solution": "def saluer(nom):\n    return \"Salut \" + nom", "explanation": "return renvoie la valeur ; + colle les textes.", "skill": "py-def"},
        { id: "y4-1-b", type: "predict", prompt: "Qu'affiche ce programme ?", code: "def doubler(n):\n    return n * 2\nprint(doubler(4))", accepted: ["8"], explanation: "doubler(4) renvoie 8.", skill: "py-def" },
        { id: "y4-1-c", type: "predict", prompt: "Qu'affiche ce programme ?", code: "def carre(n):\n    return n * n\nprint(carre(3) + 1)", accepted: ["10"], explanation: "carre(3) vaut 9.", skill: "py-return" },
        { id: "y4-1-d", type: "qcm", prompt: "Que fait return ?", choices: ["Renvoie une valeur et termine la fonction", "Affiche une valeur", "Déclare une variable", "Répète la fonction"], answer: [0], explanation: "return renvoie le résultat à l'appelant.", skill: "py-return" },
      ],
    },
    {
      id: "y4-2",
      title: "Print ou return ?",
      description: "Distingue afficher de renvoyer.",
      xp: 50,
      encounters: [
        { id: "y4-2-a", type: "predict", prompt: "Qu'affiche ce programme ?", code: "def f():\n    print(\"a\")\nx = f()\nprint(x)", accepted: ["a\nNone", "a None"], placeholder: "Deux lignes", explanation: "f affiche a mais ne renvoie rien : x vaut None.", skill: "py-return" },
        { id: "y4-2-b", type: "qcm", prompt: "Quelle fonction peut servir dans un calcul ?", choices: ["Celle qui fait return", "Celle qui fait print", "Aucune", "Les deux"], answer: [0], explanation: "Seul return rend une valeur utilisable.", skill: "py-return" },
        {"id": "y4-2-c", "type": "code", "language": "python", "prompt": "Écris la fonction aire(l, h) qui renvoie l × h.", "starter": "def aire(l, h):\n    pass", "harness": "print(aire(3, 4))\nprint(aire(5, 0))", "accepted": ["12\n0"], "solution": "def aire(l, h):\n    return l * h", "explanation": "return l * h renvoie le produit.", "skill": "py-def"},
        { id: "y4-2-d", type: "qcm", prompt: "Que devient le code après un return ?", choices: ["Il n'est jamais exécuté", "Il est exécuté ensuite", "Il boucle", "Il provoque une erreur"], answer: [0], explanation: "return termine immédiatement la fonction.", skill: "py-return" },
      ],
    },
    {
      id: "y4-3",
      title: "Le grand classeur",
      description: "Étiquette tes données avec un dictionnaire.",
      xp: 60,
      encounters: [
        { id: "y4-3-a", type: "predict", prompt: "Qu'affiche ce programme ?", code: "perso = {\"nom\": \"Aya\", \"niveau\": 3}\nprint(perso[\"nom\"])", accepted: ["Aya"], explanation: "On retrouve la valeur par sa clé.", skill: "py-dict" },
        { id: "y4-3-b", type: "predict", prompt: "Qu'affiche ce programme ?", code: "d = {\"a\": 1}\nd[\"b\"] = 2\nprint(len(d))", accepted: ["2"], explanation: "On a ajouté une clé : deux entrées.", skill: "py-dict" },
        { id: "y4-3-c", type: "qcm", prompt: "Que provoque perso[\"age\"] si la clé n'existe pas ?", choices: ["Une KeyError", "None", "0", "Une chaîne vide"], answer: [0], explanation: "Utilise .get() pour éviter l'erreur.", skill: "py-dict" },
        {"id": "y4-3-d", "type": "code", "language": "python", "prompt": "Crée le dictionnaire perso avec nom = \"Aya\" et niveau = 3, puis affiche le niveau.", "starter": "# ton code ici", "accepted": ["3"], "solution": "perso = {\"nom\": \"Aya\", \"niveau\": 3}\nprint(perso[\"niveau\"])", "explanation": "On lit une valeur avec sa clé entre crochets.", "skill": "py-dict"},
      ],
    },
  ],
  challenge: {
    questionCount: 6,
    durationSeconds: 300,
    passingScore: 70,
    xp: 150,
    bank: [
      { id: "cy4-1", type: "predict", prompt: "Qu'affiche ce programme ?", code: "def plus(a, b):\n    return a + b\nprint(plus(2, 5))", accepted: ["7"], explanation: "plus(2, 5) renvoie 7.", skill: "py-def" },
      { id: "cy4-2", type: "fill", prompt: "Renvoie le triple de n.", template: "def triple(n):\n    {{0}} n * 3", answers: ["return"], bank: ["return", "print", "give", "echo"], explanation: "return renvoie le résultat.", skill: "py-return" },
      { id: "cy4-3", type: "qcm", prompt: "Pourquoi écrire une fonction ?", choices: ["Pour réutiliser du code sans le recopier", "Pour ralentir le programme", "Parce que Python l'exige", "Pour cacher les erreurs"], answer: [0], explanation: "Une fonction évite la répétition.", skill: "py-def" },
      { id: "cy4-4", type: "predict", prompt: "Qu'affiche ce programme ?", code: "d = {\"x\": 10, \"y\": 20}\nprint(d[\"y\"])", accepted: ["20"], explanation: "La valeur de la clé y.", skill: "py-dict" },
      { id: "cy4-5", type: "qcm", prompt: "Quels symboles délimitent un dictionnaire ?", choices: ["{ }", "[ ]", "( )", "< >"], answer: [0], explanation: "Un dictionnaire s'écrit avec des accolades.", skill: "py-dict" },
      { id: "cy4-6", type: "predict", prompt: "Qu'affiche ce programme ?", code: "d = {\"a\": 1, \"b\": 2}\ntotal = 0\nfor v in d.values():\n    total += v\nprint(total)", accepted: ["3"], explanation: "On additionne 1 et 2.", skill: "py-dict" },
      { id: "cy4-7", type: "parsons", prompt: "Écris une fonction puis appelle-la.", lines: ["def dire():", "    print(\"Hello\")", "dire()"], distractors: ["dire"], explanation: "On déclare, puis on appelle avec des parenthèses.", skill: "py-def" },
      { id: "cy4-8", type: "qcm", prompt: "Que renvoie une fonction sans return ?", choices: ["None", "0", "Une chaîne vide", "Une erreur"], answer: [0], explanation: "Par défaut, elle renvoie None.", skill: "py-return" },
    ],
  },
};
