import type { TrackInput } from "@/features/catalog/types";

type NotionInput = TrackInput["notions"][number];

export const pyNotion2: NotionInput = {
  slug: "py-conditions",
  position: 2,
  place: "L'Île des Embranchements",
  concept: "Conditions : if, elif, else",
  summary: "Faire choisir un chemin à ton programme, avec l'indentation qui structure le code.",
  guardian: {
    name: "Le Serpent à Deux Têtes",
    title: "Gardien de la fourche",
    taunt: "Vrai ou faux ? Choisis une tête, et vite !",
  },
  lessons: [
    {
      id: "l-y2-if",
      title: "Choisir son chemin",
      minutes: 6,
      blocks: [
        { kind: "p", text: "`if` exécute un bloc seulement si la condition est vraie. Le bloc est marqué par **l'indentation** (4 espaces) et les deux-points `:`." },
        { kind: "code", code: "age = 20\nif age >= 18:\n    print(\"majeur\")\nelif age >= 16:\n    print(\"presque\")\nelse:\n    print(\"mineur\")" },
        { kind: "warn", text: "L'indentation n'est pas décorative : c'est elle qui dit à Python quelles lignes appartiennent au `if`. Un décalage mal placé donne une `IndentationError`." },
        { kind: "h", text: "Comparer" },
        { kind: "p", text: "`==` teste l'égalité, `!=` la différence, `<`, `>`, `<=`, `>=` comparent. N'écris jamais `=` pour comparer : c'est l'affectation." },
        { kind: "code", code: "print(5 == 5)    # True\nprint(5 != 5)    # False\nprint(3 < 2)     # False" },
      ],
    },
    {
      id: "l-y2-logique",
      title: "and, or, not",
      minutes: 5,
      blocks: [
        { kind: "p", text: "Combine plusieurs conditions avec `and` (les deux), `or` (au moins une) et `not` (le contraire)." },
        { kind: "code", code: "age = 20\npermis = True\nif age >= 18 and permis:\n    print(\"peut conduire\")\n\nprint(not True)   # False" },
        { kind: "tip", text: "Une chaîne vide, 0 et `None` valent faux dans un `if`. Tout le reste vaut vrai." },
      ],
    },
  ],
  stages: [
    {
      id: "y2-1",
      title: "La fourche",
      description: "Fais choisir un chemin au programme.",
      xp: 40,
      encounters: [
        { id: "y2-1-a", type: "predict", prompt: "Qu'affiche ce programme ?", code: "age = 20\nif age >= 18:\n    print(\"majeur\")\nelse:\n    print(\"mineur\")", accepted: ["majeur"], explanation: "20 >= 18 est vrai.", skill: "py-if" },
        { id: "y2-1-b", type: "qcm", prompt: "Quel caractère termine la ligne d'un if ?", choices: [":", ";", "{", "then"], answer: [0], explanation: "Les deux-points ouvrent le bloc.", skill: "py-if" },
        { id: "y2-1-c", type: "qcm", prompt: "Quel mot-clé ajoute une deuxième condition ?", choices: ["elif", "elseif", "else if", "orif"], answer: [0], explanation: "En Python on écrit elif.", skill: "py-if" },
        { id: "y2-1-d", type: "predict", prompt: "Qu'affiche ce programme ?", code: "n = 5\nif n > 10:\n    print(\"grand\")\nelif n > 3:\n    print(\"moyen\")\nelse:\n    print(\"petit\")", accepted: ["moyen"], explanation: "n > 10 est faux, n > 3 est vrai.", skill: "py-if" },
      ],
    },
    {
      id: "y2-2",
      title: "L'indentation",
      description: "Quatre espaces qui changent tout.",
      xp: 50,
      encounters: [
        { id: "y2-2-a", type: "qcm", prompt: "Comment Python reconnaît-il le bloc d'un if ?", choices: ["À l'indentation", "Aux accolades", "Aux parenthèses", "À end"], answer: [0], explanation: "Le décalage vers la droite délimite le bloc.", skill: "py-indent" },
        { id: "y2-2-b", type: "predict", prompt: "Qu'affiche ce programme ?", code: "x = 1\nif x > 5:\n    print(\"A\")\nprint(\"B\")", accepted: ["B"], explanation: "Le print(\"B\") n'est pas indenté : il s'exécute toujours.", skill: "py-indent" },
        { id: "y2-2-c", type: "qcm", prompt: "Que provoque une indentation mal placée ?", choices: ["Une IndentationError", "Rien", "Un résultat plus rapide", "Un redémarrage"], answer: [0], explanation: "Python refuse de s'exécuter.", skill: "py-indent" },
        { id: "y2-2-d", type: "parsons", prompt: "Remets le programme dans l'ordre.", lines: ["note = 12", "if note >= 10:", "    print(\"reçu\")"], distractors: ["    note = 10 end"], explanation: "Variable, condition, puis bloc indenté.", skill: "py-indent" },
      ],
    },
    {
      id: "y2-3",
      title: "Vrai ou faux",
      description: "Combine les conditions.",
      xp: 60,
      encounters: [
        { id: "y2-3-a", type: "predict", prompt: "Qu'affiche ce programme ?", code: "print(5 == 5)", accepted: ["True"], explanation: "5 est égal à 5.", skill: "py-logic" },
        { id: "y2-3-b", type: "predict", prompt: "Qu'affiche ce programme ?", code: "print(True and False)", accepted: ["False"], explanation: "and exige que les deux soient vrais.", skill: "py-logic" },
        { id: "y2-3-c", type: "predict", prompt: "Qu'affiche ce programme ?", code: "print(True or False)", accepted: ["True"], explanation: "or suffit qu'un seul soit vrai.", skill: "py-logic" },
        { id: "y2-3-d", type: "qcm", prompt: "Pour comparer deux valeurs, on écrit…", choices: ["==", "=", "=>", ":="], answer: [0], explanation: "== compare, = affecte.", skill: "py-logic" },
      ],
    },
  ],
  challenge: {
    questionCount: 6,
    durationSeconds: 300,
    passingScore: 70,
    xp: 150,
    bank: [
      { id: "cy2-1", type: "predict", prompt: "Qu'affiche ce programme ?", code: "t = 15\nif t > 20:\n    print(\"chaud\")\nelse:\n    print(\"frais\")", accepted: ["frais"], explanation: "15 n'est pas supérieur à 20.", skill: "py-if" },
      { id: "cy2-2", type: "predict", prompt: "Qu'affiche ce programme ?", code: "print(not True)", accepted: ["False"], explanation: "not inverse la valeur.", skill: "py-logic" },
      { id: "cy2-3", type: "qcm", prompt: "Que donne 3 != 4 ?", choices: ["True", "False", "Erreur", "None"], answer: [0], explanation: "3 est bien différent de 4.", skill: "py-logic" },
      { id: "cy2-4", type: "predict", prompt: "Qu'affiche ce programme ?", code: "a = 18\nb = True\nif a >= 18 and b:\n    print(\"ok\")", accepted: ["ok"], explanation: "Les deux conditions sont vraies.", skill: "py-logic" },
      { id: "cy2-5", type: "qcm", prompt: "Que signifie l'erreur IndentationError ?", choices: ["Un bloc est mal décalé", "Une variable manque", "Un nombre est trop grand", "Un fichier est absent"], answer: [0], explanation: "L'indentation n'est pas cohérente.", skill: "py-indent" },
      { id: "cy2-6", type: "fill", prompt: "Complète la deuxième condition.", template: "if x > 0:\n    print(\"+\")\n{{0}} x < 0:\n    print(\"-\")", answers: ["elif"], bank: ["elif", "elseif", "else", "if"], explanation: "elif ajoute une condition.", skill: "py-if" },
      { id: "cy2-7", type: "qcm", prompt: "Laquelle de ces valeurs est considérée comme fausse dans un if ?", choices: ["0", "\"a\"", "5", "[1]"], answer: [0], explanation: "0, \"\" et None valent faux.", skill: "py-logic" },
      { id: "cy2-8", type: "qcm", prompt: "Combien d'espaces Python recommande-t-il par niveau d'indentation ?", choices: ["4", "1", "8", "0"], answer: [0], explanation: "Quatre espaces par niveau.", skill: "py-indent" },
    ],
  },
};
