import type { TrackInput } from "@/features/catalog/types";

type NotionInput = TrackInput["notions"][number];

export const pyNotion3: NotionInput = {
  slug: "py-boucles-listes",
  position: 3,
  place: "L'Île des Anneaux",
  concept: "Boucles et listes",
  summary: "Répéter avec for et while, et ranger plusieurs valeurs dans une liste.",
  guardian: {
    name: "L'Ouroboros",
    title: "Gardien du cercle",
    taunt: "Je me mords la queue depuis toujours. Et toi, sauras-tu t'arrêter ?",
  },
  lessons: [
    {
      id: "l-y3-listes",
      title: "Une liste de valeurs",
      minutes: 6,
      blocks: [
        { kind: "p", text: "Une **liste** range plusieurs valeurs entre crochets. Les cases sont numérotées à partir de 0." },
        { kind: "code", code: "fruits = [\"pomme\", \"poire\", \"kiwi\"]\nprint(fruits[1])        # poire\nprint(len(fruits))      # 3\nfruits.append(\"figue\")  # ajoute à la fin\nprint(fruits[-1])       # figue (la dernière)" },
        { kind: "tip", text: "Un indice négatif part de la fin : `-1` est le dernier élément." },
      ],
    },
    {
      id: "l-y3-boucles",
      title: "Répéter sans se fatiguer",
      minutes: 7,
      blocks: [
        { kind: "p", text: "`for` parcourt une suite de valeurs. `range(n)` fabrique les nombres de 0 à n-1." },
        { kind: "code", code: "for i in range(3):\n    print(i)        # 0 1 2\n\nfor fruit in [\"pomme\", \"kiwi\"]:\n    print(fruit)" },
        { kind: "p", text: "`while` répète tant que la condition reste vraie." },
        { kind: "code", code: "n = 3\nwhile n > 0:\n    print(n)        # 3 2 1\n    n = n - 1" },
        { kind: "warn", text: "Si rien ne rend la condition fausse, la boucle ne s'arrête jamais. Vérifie que la variable change à chaque tour." },
      ],
    },
  ],
  stages: [
    {
      id: "y3-1",
      title: "La chaîne de cases",
      description: "Range et retrouve des valeurs.",
      xp: 40,
      encounters: [
        { id: "y3-1-a", type: "predict", prompt: "Qu'affiche ce programme ?", code: "fruits = [\"pomme\", \"poire\", \"kiwi\"]\nprint(fruits[1])", accepted: ["poire"], explanation: "La case 1 est la deuxième.", skill: "py-list" },
        { id: "y3-1-b", type: "predict", prompt: "Qu'affiche ce programme ?", code: "notes = [12, 15, 9]\nprint(len(notes))", accepted: ["3"], explanation: "len compte les éléments.", skill: "py-list" },
        { id: "y3-1-c", type: "qcm", prompt: "Comment ajouter un élément à la fin d'une liste ?", choices: ["liste.append(x)", "liste.add(x)", "liste.push(x)", "liste += x"], answer: [0], explanation: "append ajoute à la fin.", skill: "py-list" },
        { id: "y3-1-d", type: "predict", prompt: "Qu'affiche ce programme ?", code: "t = [4, 5, 6]\nprint(t[-1])", accepted: ["6"], explanation: "-1 désigne le dernier élément.", skill: "py-list" },
      ],
    },
    {
      id: "y3-2",
      title: "Le tour du cercle",
      description: "Parcours avec for.",
      xp: 50,
      encounters: [
        { id: "y3-2-a", type: "predict", prompt: "Qu'affiche ce programme (sur une seule ligne, séparé par des espaces) ?", code: "for i in range(3):\n    print(i, end=\" \")", accepted: ["0 1 2", "0 1 2 "], explanation: "range(3) donne 0, 1, 2.", skill: "py-for" },
        { id: "y3-2-b", type: "predict", prompt: "Qu'affiche ce programme ?", code: "total = 0\nfor n in [1, 2, 3]:\n    total += n\nprint(total)", accepted: ["6"], explanation: "On additionne 1, 2 et 3.", skill: "py-for" },
        { id: "y3-2-c", type: "parsons", prompt: "Affiche chaque fruit.", lines: ["for fruit in fruits:", "    print(fruit)"], distractors: ["for fruit of fruits:"], explanation: "for élément in liste:", skill: "py-for" },
        { id: "y3-2-d", type: "qcm", prompt: "Que donne list(range(4)) ?", choices: ["[0, 1, 2, 3]", "[1, 2, 3, 4]", "[0, 1, 2, 3, 4]", "[4]"], answer: [0], explanation: "range(4) s'arrête avant 4.", skill: "py-for" },
      ],
    },
    {
      id: "y3-3",
      title: "Tant que ça tourne",
      description: "Maîtrise while et la boucle infinie.",
      xp: 60,
      encounters: [
        { id: "y3-3-a", type: "predict", prompt: "Qu'affiche ce programme (une valeur par ligne, lis-les de haut en bas collées) ?", code: "n = 3\nwhile n > 0:\n    print(n, end=\"\")\n    n = n - 1", accepted: ["321"], explanation: "n vaut 3, puis 2, puis 1.", skill: "py-while" },
        { id: "y3-3-b", type: "qcm", prompt: "Que se passe-t-il si la condition d'un while ne devient jamais fausse ?", choices: ["La boucle ne s'arrête jamais", "Python corrige", "Une seule répétition", "Une erreur de syntaxe"], answer: [0], explanation: "C'est une boucle infinie.", skill: "py-while" },
        { id: "y3-3-c", type: "fill", prompt: "Sors de la boucle dès que n vaut 3.", template: "for n in range(10):\n    if n == 3:\n        {{0}}", answers: ["break"], bank: ["break", "stop", "exit", "continue"], explanation: "break arrête la boucle.", skill: "py-while" },
        { id: "y3-3-d", type: "qcm", prompt: "Quelle boucle choisir pour répéter exactement 5 fois ?", choices: ["for i in range(5)", "while True", "if i < 5", "repeat 5"], answer: [0], explanation: "for avec range quand on connaît le nombre de tours.", skill: "py-for" },
      ],
    },
  ],
  challenge: {
    questionCount: 6,
    durationSeconds: 300,
    passingScore: 70,
    xp: 150,
    bank: [
      { id: "cy3-1", type: "predict", prompt: "Qu'affiche ce programme ?", code: "t = [\"a\", \"b\", \"c\"]\nprint(t[2])", accepted: ["c"], explanation: "La case 2 est la troisième.", skill: "py-list" },
      { id: "cy3-2", type: "predict", prompt: "Qu'affiche ce programme ?", code: "t = [5, 6, 7, 8]\nprint(len(t))", accepted: ["4"], explanation: "Quatre éléments.", skill: "py-list" },
      { id: "cy3-3", type: "predict", prompt: "Qu'affiche ce programme ?", code: "s = 0\nfor i in range(4):\n    s += i\nprint(s)", accepted: ["6"], explanation: "0 + 1 + 2 + 3.", skill: "py-for" },
      { id: "cy3-4", type: "predict", prompt: "Qu'affiche ce programme ?", code: "n = 1\nwhile n < 4:\n    n += 1\nprint(n)", accepted: ["4"], explanation: "La boucle s'arrête quand n atteint 4.", skill: "py-while" },
      { id: "cy3-5", type: "qcm", prompt: "Que fait break ?", choices: ["Il quitte la boucle", "Il ignore le tour", "Il relance le programme", "Il efface la liste"], answer: [0], explanation: "break sort de la boucle.", skill: "py-while" },
      { id: "cy3-6", type: "qcm", prompt: "Quel est l'indice du premier élément d'une liste ?", choices: ["0", "1", "-1", "Ça dépend"], answer: [0], explanation: "Numérotation depuis 0.", skill: "py-list" },
      { id: "cy3-7", type: "fill", prompt: "Ajoute 9 à la fin.", template: "t.{{0}}(9)", answers: ["append"], bank: ["append", "add", "push", "insert"], explanation: "append ajoute à la fin.", skill: "py-list" },
      { id: "cy3-8", type: "qcm", prompt: "Combien de tours fait for i in range(3) ?", choices: ["3", "2", "4", "0"], answer: [0], explanation: "i vaut 0, 1, 2.", skill: "py-for" },
    ],
  },
};
