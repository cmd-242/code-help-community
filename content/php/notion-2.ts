import type { TrackInput } from "@/features/catalog/types";

type NotionInput = TrackInput["notions"][number];

export const phpNotion2: NotionInput = {
  slug: "php-conditions-boucles",
  position: 2,
  place: "L'Île des Carrefours",
  concept: "Décider et répéter : if et boucles",
  summary: "Faire choisir un chemin à ton script avec if, comparer correctement et répéter avec for et while.",
  guardian: {
    name: "Le Kraken des Boucles",
    title: "Gardien du grand carrefour",
    taunt: "Tu tournes en rond ? Moi aussi. Éternellement.",
  },
  lessons: [
    {
      id: "l-p2-conditions",
      title: "Choisir son chemin",
      minutes: 6,
      blocks: [
        { kind: "p", text: "`if` exécute un bloc seulement si la condition est vraie. `else` donne l'autre chemin, `elseif` ajoute une condition intermédiaire." },
        { kind: "code", code: "<?php\n$age = 20;\nif ($age >= 18) {\n  echo \"majeur\";\n} elseif ($age >= 16) {\n  echo \"presque\";\n} else {\n  echo \"mineur\";\n}" },
        { kind: "h", text: "== ou === ?" },
        { kind: "p", text: "`==` compare les valeurs, `===` compare la valeur **et** le type. Prends l'habitude d'utiliser `===` : elle évite les surprises." },
        { kind: "code", code: "<?php\nvar_dump(5 == \"5\");   // true\nvar_dump(5 === \"5\");  // false : un nombre n'est pas un texte" },
        { kind: "warn", text: "Depuis PHP 8, `0 == \"a\"` vaut `false`. Dans les anciennes versions, c'était `true` : un classique des vieux tutoriels." },
      ],
    },
    {
      id: "l-p2-boucles",
      title: "Répéter sans se fatiguer",
      minutes: 6,
      blocks: [
        { kind: "p", text: "`for` convient quand tu sais combien de fois répéter ; `while` répète tant qu'une condition reste vraie." },
        { kind: "code", code: "<?php\nfor ($i = 1; $i <= 3; $i++) {\n  echo $i;      // 123\n}\n\n$n = 3;\nwhile ($n > 0) {\n  echo $n;      // 321\n  $n--;\n}" },
        { kind: "tip", text: "`$i++` ajoute 1 à `$i`, `$n--` retire 1." },
        { kind: "warn", text: "Si la condition d'un `while` ne devient jamais fausse, le script tourne sans fin. Vérifie toujours que quelque chose change à chaque tour." },
      ],
    },
  ],
  stages: [
    {
      id: "p2-1",
      title: "Le carrefour",
      description: "Fais prendre le bon chemin à ton script.",
      xp: 40,
      encounters: [
        { id: "p2-1-a", type: "qcm", prompt: "Quelle structure exécute du code seulement si une condition est vraie ?", choices: ["if", "for", "echo", "function"], answer: [0], explanation: "if teste une condition.", skill: "php-if" },
        { id: "p2-1-b", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\n$age = 20;\nif ($age >= 18) {\n  echo \"majeur\";\n} else {\n  echo \"mineur\";\n}", accepted: ["majeur"], explanation: "20 >= 18 est vrai : le premier bloc s'exécute.", skill: "php-if" },
        { id: "p2-1-c", type: "fill", prompt: "Complète l'autre chemin.", template: "if ($ok) { echo \"oui\"; } {{0}} { echo \"non\"; }", answers: ["else"], bank: ["else", "elif", "otherwise", "then"], explanation: "else donne le chemin quand la condition est fausse.", skill: "php-if" },
        { id: "p2-1-d", type: "qcm", prompt: "Quel mot-clé ajoute une seconde condition ?", choices: ["elseif", "elif", "orif", "also"], answer: [0], explanation: "En PHP on écrit elseif (elif existe en Python).", skill: "php-if" },
      ],
    },
    {
      id: "p2-2",
      title: "Égal ou identique ?",
      description: "Compare sans te faire piéger.",
      xp: 50,
      encounters: [
        { id: "p2-2-a", type: "qcm", prompt: "Que donne la comparaison 5 === \"5\" ?", choices: ["false", "true", "Une erreur", "null"], answer: [0], explanation: "=== compare aussi le type : un nombre n'est pas un texte.", skill: "php-compare" },
        { id: "p2-2-b", type: "qcm", prompt: "Que donne la comparaison 5 == \"5\" ?", choices: ["true", "false", "Une erreur", "null"], answer: [0], explanation: "== convertit puis compare les valeurs : 5 et \"5\" sont égaux.", skill: "php-compare" },
        { id: "p2-2-c", type: "qcm", prompt: "Quel opérateur compare la valeur ET le type ?", choices: ["===", "==", "=", "!="], answer: [0], explanation: "=== est l'égalité stricte.", skill: "php-compare" },
        { id: "p2-2-d", type: "predict", prompt: "Qu'affiche ce script en PHP 8 ?", code: "<?php\nif (0 == \"a\") {\n  echo \"A\";\n} else {\n  echo \"B\";\n}", accepted: ["B"], explanation: "Depuis PHP 8, 0 == \"a\" est faux : c'est le bloc else qui s'exécute.", skill: "php-compare" },
      ],
    },
    {
      id: "p2-3",
      title: "Le tourniquet",
      description: "Répète une action autant de fois qu'il faut.",
      xp: 60,
      encounters: [
        { id: "p2-3-a", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\nfor ($i = 1; $i <= 3; $i++) {\n  echo $i;\n}", accepted: ["123"], explanation: "$i vaut 1, 2 puis 3 : les chiffres se suivent sans séparateur.", skill: "php-for" },
        { id: "p2-3-b", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\n$n = 3;\nwhile ($n > 0) {\n  echo $n;\n  $n--;\n}", accepted: ["321"], explanation: "$n décroît de 3 à 1 ; à 0 la condition devient fausse.", skill: "php-while" },
        { id: "p2-3-c", type: "fill", prompt: "Répète de 0 à 4 (cinq tours).", template: "for ($i = 0; $i {{0}} 5; $i++)", answers: ["<"], bank: ["<", "<=", ">", "="], explanation: "$i < 5 s'arrête avant 5 : 0, 1, 2, 3, 4.", skill: "php-for" },
        { id: "p2-3-d", type: "qcm", prompt: "Que se passe-t-il si la condition d'un while ne devient jamais fausse ?", choices: ["La boucle ne s'arrête jamais", "PHP corrige tout seul", "Une seule répétition", "Une erreur de syntaxe"], answer: [0], explanation: "C'est une boucle infinie : il faut qu'une variable change à chaque tour.", skill: "php-while" },
      ],
    },
  ],
  challenge: {
    questionCount: 6,
    durationSeconds: 300,
    passingScore: 70,
    xp: 150,
    bank: [
      { id: "cp2-1", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\n$t = 15;\nif ($t > 20) {\n  echo \"chaud\";\n} else {\n  echo \"frais\";\n}", accepted: ["frais"], explanation: "15 n'est pas supérieur à 20.", skill: "php-if" },
      { id: "cp2-2", type: "qcm", prompt: "Que donne 10 === \"10\" ?", choices: ["false", "true"], answer: [0], explanation: "Types différents : nombre contre texte.", skill: "php-compare" },
      { id: "cp2-3", type: "qcm", prompt: "Quelle est la différence entre == et === ?", choices: ["=== compare aussi le type", "== compare aussi le type", "Aucune", "=== affecte une valeur"], answer: [0], explanation: "=== est l'égalité stricte.", skill: "php-compare" },
      { id: "cp2-4", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\nfor ($i = 0; $i < 3; $i++) {\n  echo \"x\";\n}", accepted: ["xxx"], explanation: "Trois tours : 0, 1, 2.", skill: "php-for" },
      { id: "cp2-5", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\n$n = 1;\nwhile ($n < 4) {\n  echo $n;\n  $n++;\n}", accepted: ["123"], explanation: "$n vaut 1, 2, 3 puis 4 arrête la boucle.", skill: "php-while" },
      { id: "cp2-6", type: "fill", prompt: "Complète le deuxième chemin.", template: "if ($a > 0) { echo \"+\"; } {{0}} ($a < 0) { echo \"-\"; }", answers: ["elseif"], bank: ["elseif", "elif", "else", "if"], explanation: "elseif ajoute une condition.", skill: "php-if" },
      { id: "cp2-7", type: "parsons", prompt: "Écris une boucle qui affiche 1, 2, 3.", lines: ["for ($i = 1; $i <= 3; $i++) {", "echo $i;", "}"], distractors: ["while ($i <= 3) {"], explanation: "L'en-tête, le corps, puis l'accolade fermante.", skill: "php-for" },
      { id: "cp2-8", type: "qcm", prompt: "Quel risque comporte un while sans changement de la condition ?", choices: ["Une boucle infinie", "Un résultat faux mais fini", "Aucun", "Une variable supprimée"], answer: [0], explanation: "Si rien ne change, la condition reste vraie.", skill: "php-while" },
    ],
  },
};
