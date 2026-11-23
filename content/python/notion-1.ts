import type { TrackInput } from "@/features/catalog/types";

type NotionInput = TrackInput["notions"][number];

export const pyNotion1: NotionInput = {
  slug: "py-premiers-pas",
  position: 1,
  place: "L'Île de l'Œuf",
  concept: "print, variables et types",
  summary: "Faire parler Python, ranger des valeurs et comprendre la différence entre un nombre et un texte.",
  guardian: {
    name: "Le Lézardeau",
    title: "Gardien du nid",
    taunt: "Un œuf, un nom, un type. Tu sais déjà ce que tu couves ?",
  },
  lessons: [
    {
      id: "l-y1-print",
      title: "Ton premier serpent",
      minutes: 5,
      blocks: [
        { kind: "p", text: "Python se lit presque comme de l'anglais. `print()` affiche quelque chose à l'écran. Pas de point-virgule à la fin : un retour à la ligne suffit." },
        { kind: "code", code: "print(\"Bonjour\")\nprint(2 + 3)   # 5", caption: "Le texte va entre guillemets, un calcul non." },
        { kind: "tip", text: "Ce qui suit un `#` est un commentaire : Python l'ignore." },
        { kind: "h", text: "Des coffres appelés variables" },
        { kind: "code", code: "age = 17\nnom = \"Aya\"\nage = age + 1\nprint(nom, age)   # Aya 18", caption: "Pas de $ ni de mot-clé : on écrit le nom, =, la valeur." },
      ],
    },
    {
      id: "l-y1-types",
      title: "Nombre ou texte ?",
      minutes: 6,
      blocks: [
        { kind: "p", text: "Chaque valeur a un **type** : `int` (entier), `float` (nombre à virgule), `str` (texte), `bool` (vrai ou faux). `type()` te le dit." },
        { kind: "code", code: "print(type(3))        # <class 'int'>\nprint(type(3.5))      # <class 'float'>\nprint(type(\"3\"))      # <class 'str'>\nprint(type(True))     # <class 'bool'>" },
        { kind: "warn", text: "`\"3\"` est un texte, pas un nombre : `\"3\" + \"4\"` donne `\"34\"`, alors que `3 + 4` donne `7`. Convertis avec `int(\"3\")` ou `str(3)`." },
        { kind: "code", code: "prenom = \"Aya\"\nprint(f\"Salut {prenom} !\")   # f-string : Salut Aya !" },
      ],
    },
  ],
  stages: [
    {
      id: "y1-1",
      title: "Le premier cri",
      description: "Affiche tes premiers messages.",
      xp: 40,
      encounters: [
        { id: "y1-1-a", type: "qcm", prompt: "Quelle fonction affiche du texte en Python ?", choices: ["print()", "echo", "show()", "write()"], answer: [0], explanation: "print() affiche à l'écran.", skill: "py-print" },
        { id: "y1-1-b", type: "predict", prompt: "Qu'affiche ce programme ?", code: "print(2 + 3)", accepted: ["5"], explanation: "Python calcule puis affiche 5.", skill: "py-print" },
        { id: "y1-1-c", type: "qcm", prompt: "Comment écrit-on un commentaire ?", choices: ["# commentaire", "// commentaire", "-- commentaire", "<!-- commentaire -->"], answer: [0], explanation: "En Python, le commentaire commence par #.", skill: "py-print" },
        {"id": "y1-1-d", "type": "code", "language": "python", "prompt": "Affiche le mot Salut.", "starter": "# ton code ici", "accepted": ["Salut"], "solution": "print(\"Salut\")", "explanation": "print affiche le texte entre guillemets.", "skill": "py-print"},
      ],
    },
    {
      id: "y1-2",
      title: "Les coffres du nid",
      description: "Range des valeurs dans des variables.",
      xp: 50,
      encounters: [
        { id: "y1-2-a", type: "predict", prompt: "Qu'affiche ce programme ?", code: "age = 17\nage = age + 1\nprint(age)", accepted: ["18"], explanation: "On remplace age par age + 1.", skill: "py-variables" },
        { id: "y1-2-b", type: "qcm", prompt: "Quel nom de variable est valide ?", choices: ["mon_score", "2score", "mon-score", "mon score"], answer: [0], explanation: "Lettres, chiffres et _ : pas de chiffre au début, ni de tiret ni d'espace.", skill: "py-variables" },
        {"id": "y1-2-c", "type": "code", "language": "python", "prompt": "Crée deux variables a (4) et b (6), puis affiche leur somme.", "starter": "# ton code ici", "accepted": ["10"], "solution": "a = 4\nb = 6\nprint(a + b)", "explanation": "Les variables gardent les valeurs, + les additionne.", "skill": "py-variables"},
        { id: "y1-2-d", type: "qcm", prompt: "Que fait x = 5 ?", choices: ["Range 5 dans x", "Compare x et 5", "Affiche 5", "Supprime x"], answer: [0], explanation: "= est l'affectation.", skill: "py-variables" },
      ],
    },
    {
      id: "y1-3",
      title: "Quel type d'œuf ?",
      description: "Distingue nombres, textes et booléens.",
      xp: 60,
      encounters: [
        { id: "y1-3-a", type: "predict", prompt: "Qu'affiche ce programme ?", code: "print(\"3\" + \"4\")", accepted: ["34"], explanation: "Entre guillemets, ce sont des textes : ils se collent.", skill: "py-types" },
        { id: "y1-3-b", type: "predict", prompt: "Qu'affiche ce programme ?", code: "print(int(\"3\") + 4)", accepted: ["7"], explanation: "int() convertit le texte en nombre.", skill: "py-types" },
        { id: "y1-3-c", type: "qcm", prompt: "Quel est le type de 3.5 ?", choices: ["float", "int", "str", "bool"], answer: [0], explanation: "float : nombre à virgule.", skill: "py-types" },
        { id: "y1-3-d", type: "predict", prompt: "Qu'affiche ce programme ?", code: "prenom = \"Aya\"\nprint(f\"Salut {prenom} !\")", accepted: ["Salut Aya !"], explanation: "La f-string remplace {prenom} par sa valeur.", skill: "py-fstring" },
      ],
    },
  ],
  challenge: {
    questionCount: 6,
    durationSeconds: 300,
    passingScore: 70,
    xp: 150,
    bank: [
      { id: "cy1-1", type: "qcm", prompt: "Quelle fonction demande une saisie au clavier ?", choices: ["input()", "read()", "scan()", "get()"], answer: [0], explanation: "input() lit une saisie.", skill: "py-print" },
      { id: "cy1-2", type: "predict", prompt: "Qu'affiche ce programme ?", code: "a = 4\nb = 6\nprint(a * b)", accepted: ["24"], explanation: "4 × 6 = 24.", skill: "py-variables" },
      { id: "cy1-3", type: "qcm", prompt: "Quel est le type de \"42\" ?", choices: ["str", "int", "float", "bool"], answer: [0], explanation: "Entre guillemets, c'est un texte.", skill: "py-types" },
      { id: "cy1-4", type: "predict", prompt: "Qu'affiche ce programme ?", code: "print(str(7) + \"1\")", accepted: ["71"], explanation: "str(7) donne le texte \"7\", collé à \"1\".", skill: "py-types" },
      { id: "cy1-5", type: "predict", prompt: "Qu'affiche ce programme ?", code: "n = 3\nprint(f\"n vaut {n}\")", accepted: ["n vaut 3"], explanation: "La f-string insère la valeur.", skill: "py-fstring" },
      { id: "cy1-6", type: "qcm", prompt: "Quel est le type de True ?", choices: ["bool", "int", "str", "float"], answer: [0], explanation: "True et False sont des booléens.", skill: "py-types" },
      { id: "cy1-7", type: "fill", prompt: "Convertis le texte en entier.", template: "total = {{0}}(\"5\") + 1", answers: ["int"], bank: ["int", "str", "float(", "print"], explanation: "int() transforme \"5\" en 5.", skill: "py-types" },
      { id: "cy1-8", type: "qcm", prompt: "Que signifie # en Python ?", choices: ["Début d'un commentaire", "Une erreur", "Une division", "Une variable"], answer: [0], explanation: "Python ignore ce qui suit le #.", skill: "py-print" },
    ],
  },
};
