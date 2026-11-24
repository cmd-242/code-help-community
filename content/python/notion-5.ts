import type { TrackInput } from "@/features/catalog/types";

type NotionInput = TrackInput["notions"][number];

export const pyNotion5: NotionInput = {
  slug: "py-fichiers-erreurs",
  position: 5,
  place: "L'Île du Grimoire",
  concept: "Fichiers et gestion des erreurs",
  summary: "Lire et écrire des fichiers, et rattraper les erreurs avec try et except.",
  guardian: {
    name: "Le Basilic Bibliothécaire",
    title: "Gardien du grimoire",
    taunt: "Tu ouvres un fichier qui n'existe pas ? Mon regard fait le reste.",
  },
  lessons: [
    {
      id: "l-y5-fichiers",
      title: "Le grimoire",
      minutes: 6,
      blocks: [
        { kind: "p", text: "Pour garder des données après l'arrêt du programme, on les écrit dans un fichier. `with open(...)` ouvre le fichier et le referme tout seul." },
        { kind: "code", code: "with open(\"notes.txt\", \"w\") as f:\n    f.write(\"Bonjour\\n\")\n\nwith open(\"notes.txt\") as f:\n    contenu = f.read()\nprint(contenu)", caption: "\"w\" écrit (et efface), \"a\" ajoute, \"r\" lit (par défaut)." },
        { kind: "warn", text: "Ouvrir en mode \"w\" vide le fichier s'il existe déjà. Pour ajouter à la suite, utilise \"a\"." },
      ],
    },
    {
      id: "l-y5-erreurs",
      title: "Attraper les erreurs",
      minutes: 6,
      blocks: [
        { kind: "p", text: "Un programme peut échouer : fichier absent, texte qui n'est pas un nombre… `try` tente, `except` rattrape." },
        { kind: "code", code: "try:\n    age = int(input(\"Âge ? \"))\nexcept ValueError:\n    print(\"Ce n'est pas un nombre\")\nelse:\n    print(\"OK\")\nfinally:\n    print(\"Fin\")" },
        { kind: "tip", text: "Rattrape une erreur précise (`ValueError`, `FileNotFoundError`) plutôt que toutes : tu ne masqueras pas de vrais bugs." },
      ],
    },
  ],
  stages: [
    {
      id: "y5-1",
      title: "Ouvrir le grimoire",
      description: "Lis et écris des fichiers.",
      xp: 40,
      encounters: [
        { id: "y5-1-a", type: "qcm", prompt: "Quel mode ouvre un fichier pour écrire en l'effaçant ?", choices: ["\"w\"", "\"r\"", "\"a\"", "\"x\""], answer: [0], explanation: "\"w\" signifie write.", skill: "py-files" },
        { id: "y5-1-b", type: "qcm", prompt: "Quel mode ajoute à la fin sans effacer ?", choices: ["\"a\"", "\"w\"", "\"r\"", "\"d\""], answer: [0], explanation: "\"a\" signifie append.", skill: "py-files" },
        { id: "y5-1-c", type: "fill", prompt: "Ouvre le fichier proprement.", template: "{{0}} open(\"notes.txt\") as f:", answers: ["with"], bank: ["with", "for", "if", "def"], explanation: "with referme le fichier automatiquement.", skill: "py-files" },
        { id: "y5-1-d", type: "predict", prompt: "notes.txt contient « salut ». Qu'affiche ce programme ?", code: "with open(\"notes.txt\") as f:\n    print(f.read())", accepted: ["salut"], explanation: "read() renvoie tout le contenu.", skill: "py-files" },
      ],
    },
    {
      id: "y5-2",
      title: "Le regard du basilic",
      description: "Comprends les erreurs.",
      xp: 50,
      encounters: [
        { id: "y5-2-a", type: "qcm", prompt: "Quelle erreur provoque int(\"abc\") ?", choices: ["ValueError", "KeyError", "SyntaxError", "IndexError"], answer: [0], explanation: "Le texte ne peut pas devenir un entier.", skill: "py-try" },
        { id: "y5-2-b", type: "qcm", prompt: "Quelle erreur provoque d[\"z\"] si la clé z n'existe pas ?", choices: ["KeyError", "ValueError", "TypeError", "NameError"], answer: [0], explanation: "La clé est introuvable.", skill: "py-try" },
        { id: "y5-2-c", type: "qcm", prompt: "Quelle erreur provoque t[10] sur une liste de 3 éléments ?", choices: ["IndexError", "KeyError", "ValueError", "OSError"], answer: [0], explanation: "L'indice est hors de la liste.", skill: "py-try" },
        { id: "y5-2-d", type: "qcm", prompt: "Quelle erreur provoque l'ouverture d'un fichier inexistant en lecture ?", choices: ["FileNotFoundError", "KeyError", "ValueError", "ZeroDivisionError"], answer: [0], explanation: "Le fichier n'existe pas.", skill: "py-try" },
      ],
    },
    {
      id: "y5-3",
      title: "Try et except",
      description: "Rattrape les erreurs sans planter.",
      xp: 60,
      encounters: [
        { id: "y5-3-a", type: "predict", prompt: "Qu'affiche ce programme ?", code: "try:\n    print(int(\"abc\"))\nexcept ValueError:\n    print(\"oups\")", accepted: ["oups"], explanation: "L'erreur est rattrapée par except.", skill: "py-try" },
        { id: "y5-3-b", type: "predict", prompt: "Qu'affiche ce programme ?", code: "try:\n    x = 10 / 2\nexcept ZeroDivisionError:\n    print(\"zéro\")\nelse:\n    print(\"ok\")", accepted: ["ok"], explanation: "Aucune erreur : le bloc else s'exécute.", skill: "py-try" },
        { id: "y5-3-c", type: "qcm", prompt: "Quel bloc s'exécute toujours, erreur ou non ?", choices: ["finally", "else", "except", "try"], answer: [0], explanation: "finally passe dans tous les cas.", skill: "py-try" },
        { id: "y5-3-d", type: "qcm", prompt: "Pourquoi rattraper une erreur précise plutôt que toutes ?", choices: ["Pour ne pas cacher de vrais bugs", "C'est plus lent autrement", "Python l'interdit", "Il n'y a pas de raison"], answer: [0], explanation: "Un except trop large masque des problèmes.", skill: "py-try" },
      ],
    },
  ],
  challenge: {
    questionCount: 6,
    durationSeconds: 300,
    passingScore: 70,
    xp: 150,
    bank: [
      { id: "cy5-1", type: "qcm", prompt: "Pourquoi utiliser with open(...) ?", choices: ["Le fichier se referme tout seul", "C'est obligatoire en Python", "Il est plus rapide", "Il chiffre le fichier"], answer: [0], explanation: "with libère le fichier automatiquement.", skill: "py-files" },
      { id: "cy5-2", type: "qcm", prompt: "Que fait open(\"a.txt\", \"w\") si a.txt existe déjà ?", choices: ["Il vide le fichier", "Il ajoute à la fin", "Il refuse", "Il ne fait rien"], answer: [0], explanation: "\"w\" repart d'un fichier vide.", skill: "py-files" },
      { id: "cy5-3", type: "predict", prompt: "Qu'affiche ce programme ?", code: "try:\n    int(\"x\")\nexcept ValueError:\n    print(\"A\")\nfinally:\n    print(\"B\")", accepted: ["A\nB", "A B"], placeholder: "Deux lignes", explanation: "except puis finally.", skill: "py-try" },
      { id: "cy5-4", type: "qcm", prompt: "Quelle erreur provoque 5 / 0 ?", choices: ["ZeroDivisionError", "ValueError", "KeyError", "OverflowError"], answer: [0], explanation: "On ne divise pas par zéro.", skill: "py-try" },
      { id: "cy5-5", type: "fill", prompt: "Rattrape l'erreur de conversion.", template: "try:\n    n = int(texte)\n{{0}} ValueError:\n    n = 0", answers: ["except"], bank: ["except", "catch", "rescue", "else"], explanation: "Python écrit except.", skill: "py-try" },
      { id: "cy5-6", type: "qcm", prompt: "Quel mot-clé précède le bloc qui tente une action risquée ?", choices: ["try", "catch", "attempt", "test"], answer: [0], explanation: "try / except.", skill: "py-try" },
      { id: "cy5-7", type: "parsons", prompt: "Lis un fichier en gérant son absence.", lines: ["try:", "    with open(\"a.txt\") as f:", "        print(f.read())", "except FileNotFoundError:", "    print(\"absent\")"], distractors: ["catch:"], explanation: "try, puis open, puis except.", skill: "py-files" },
      { id: "cy5-8", type: "qcm", prompt: "Quelle méthode lit tout le contenu d'un fichier ouvert ?", choices: ["read()", "get()", "load()", "take()"], answer: [0], explanation: "f.read() renvoie le contenu.", skill: "py-files" },
    ],
  },
};
