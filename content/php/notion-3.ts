import type { TrackInput } from "@/features/catalog/types";

type NotionInput = TrackInput["notions"][number];

export const phpNotion3: NotionInput = {
  slug: "php-tableaux-fonctions",
  position: 3,
  place: "L'Île des Tableaux",
  concept: "Tableaux et fonctions",
  summary: "Ranger plusieurs valeurs dans un tableau, les parcourir avec foreach et réutiliser ton code avec des fonctions.",
  guardian: {
    name: "Le Serpent des Tableaux",
    title: "Gardien de la case cachée",
    taunt: "Dans quelle case caches-tu la bonne réponse ?",
  },
  lessons: [
    {
      id: "l-p3-tableaux",
      title: "Une caisse à compartiments",
      minutes: 7,
      blocks: [
        { kind: "p", text: "Un **tableau** range plusieurs valeurs dans une seule variable. Chaque case a un numéro, qui commence à **0**." },
        { kind: "code", code: "<?php\n$fruits = [\"pomme\", \"poire\", \"kiwi\"];\necho $fruits[1];        // poire\necho count($fruits);    // 3\n$fruits[] = \"figue\";     // ajoute à la fin" },
        { kind: "h", text: "Des étiquettes à la place des numéros" },
        { kind: "code", code: "<?php\n$perso = [\"nom\" => \"Aya\", \"niv\" => 3];\necho $perso[\"nom\"];     // Aya" },
        { kind: "h", text: "Parcourir un tableau" },
        { kind: "code", code: "<?php\nforeach ($fruits as $fruit) {\n  echo $fruit;\n}\nforeach ($perso as $cle => $valeur) {\n  echo \"$cle : $valeur\";\n}" },
        { kind: "tip", text: "`foreach` est la boucle la plus pratique de PHP : pas de compteur à gérer, elle s'arrête toute seule." },
      ],
    },
    {
      id: "l-p3-fonctions",
      title: "Ton propre outil",
      minutes: 6,
      blocks: [
        { kind: "p", text: "Une **fonction** est un bout de code auquel tu donnes un nom pour le réutiliser. Elle reçoit des paramètres et peut renvoyer un résultat avec `return`." },
        { kind: "code", code: "<?php\nfunction carre($n) {\n  return $n * $n;\n}\necho carre(3) + 1;   // 10" },
        { kind: "warn", text: "`return` arrête la fonction immédiatement. Ce qui est écrit après n'est jamais exécuté." },
        { kind: "tip", text: "`echo` affiche, `return` renvoie : une fonction qui renvoie sa valeur peut servir dans un calcul, une qui affiche seulement non." },
      ],
    },
  ],
  stages: [
    {
      id: "p3-1",
      title: "La caisse",
      description: "Range et retrouve des valeurs.",
      xp: 40,
      encounters: [
        { id: "p3-1-a", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\n$fruits = [\"pomme\", \"poire\", \"kiwi\"];\necho $fruits[1];", accepted: ["poire"], explanation: "Les cases sont numérotées à partir de 0 : la case 1 est la deuxième.", skill: "php-array" },
        { id: "p3-1-b", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\n$notes = [12, 15, 9];\necho count($notes);", accepted: ["3"], explanation: "count() donne le nombre d'éléments.", skill: "php-array" },
        { id: "p3-1-c", type: "qcm", prompt: "Comment ajouter \"figue\" à la fin de $fruits ?", choices: ["$fruits[] = \"figue\";", "$fruits.add(\"figue\");", "push($fruits, \"figue\");", "$fruits += \"figue\";"], answer: [0], explanation: "Les crochets vides ajoutent une case à la fin.", skill: "php-array" },
        { id: "p3-1-d", type: "qcm", prompt: "À quel numéro se trouve le premier élément d'un tableau ?", choices: ["0", "1", "-1", "Ça dépend"], answer: [0], explanation: "La numérotation commence à 0.", skill: "php-array" },
      ],
    },
    {
      id: "p3-2",
      title: "Le tapis roulant",
      description: "Parcours un tableau, case après case.",
      xp: 50,
      encounters: [
        { id: "p3-2-a", type: "parsons", prompt: "Affiche chaque note du tableau $notes.", lines: ["foreach ($notes as $note) {", "echo $note;", "}"], distractors: ["for each $notes"], explanation: "foreach (tableau as élément) { ... }", skill: "php-foreach" },
        { id: "p3-2-b", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\n$perso = [\"nom\" => \"Aya\", \"niv\" => 3];\necho $perso[\"nom\"];", accepted: ["Aya"], explanation: "On retrouve la valeur grâce à son étiquette.", skill: "php-array" },
        { id: "p3-2-c", type: "fill", prompt: "Parcours les paires clé et valeur.", template: "foreach ($perso as $cle {{0}} $valeur)", answers: ["=>"], bank: ["=>", "->", "=", ":"], explanation: "=> relie la clé à sa valeur.", skill: "php-foreach" },
        { id: "p3-2-d", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\n$tot = 0;\nforeach ([1, 2, 3] as $n) {\n  $tot += $n;\n}\necho $tot;", accepted: ["6"], explanation: "On ajoute 1, puis 2, puis 3 : le total est 6.", skill: "php-foreach" },
      ],
    },
    {
      id: "p3-3",
      title: "L'atelier de fonctions",
      description: "Fabrique tes propres outils.",
      xp: 60,
      encounters: [
        { id: "p3-3-a", type: "fill", prompt: "Déclare une fonction nommée saluer.", template: "{{0}} saluer($nom) {", answers: ["function"], bank: ["function", "def", "func", "fn("], explanation: "En PHP, une fonction se déclare avec le mot function.", skill: "php-function" },
        { id: "p3-3-b", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\nfunction doubler($n) {\n  return $n * 2;\n}\necho doubler(4);", accepted: ["8"], explanation: "doubler(4) renvoie 8, qui est affiché par echo.", skill: "php-return" },
        { id: "p3-3-c", type: "qcm", prompt: "Que fait return ?", choices: ["Renvoie une valeur et termine la fonction", "Affiche une valeur", "Déclare une variable", "Répète la fonction"], answer: [0], explanation: "return renvoie le résultat à celui qui a appelé la fonction.", skill: "php-return" },
        { id: "p3-3-d", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\nfunction carre($n) {\n  return $n * $n;\n}\necho carre(3) + 1;", accepted: ["10"], explanation: "carre(3) vaut 9, plus 1 donne 10.", skill: "php-return" },
      ],
    },
  ],
  challenge: {
    questionCount: 6,
    durationSeconds: 300,
    passingScore: 70,
    xp: 150,
    bank: [
      { id: "cp3-1", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\n$t = [\"a\", \"b\", \"c\"];\necho $t[2];", accepted: ["c"], explanation: "La case 2 est la troisième.", skill: "php-array" },
      { id: "cp3-2", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\n$t = [5, 6, 7, 8];\necho count($t);", accepted: ["4"], explanation: "Quatre éléments.", skill: "php-array" },
      { id: "cp3-3", type: "qcm", prompt: "Que représente la flèche => dans un tableau ?", choices: ["Le lien entre une clé et sa valeur", "Une comparaison", "Une fonction", "Une erreur"], answer: [0], explanation: "clé => valeur.", skill: "php-foreach" },
      { id: "cp3-4", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\n$s = \"\";\nforeach ([\"x\", \"y\"] as $l) {\n  $s .= $l;\n}\necho $s;", accepted: ["xy"], explanation: ".= ajoute chaque lettre à la fin du texte.", skill: "php-foreach" },
      { id: "cp3-5", type: "fill", prompt: "Renvoie le triple de $n.", template: "function triple($n) { {{0}} $n * 3; }", answers: ["return"], bank: ["return", "echo", "print", "give"], explanation: "return renvoie le résultat.", skill: "php-return" },
      { id: "cp3-6", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\nfunction plus($a, $b) {\n  return $a + $b;\n}\necho plus(2, 5);", accepted: ["7"], explanation: "plus(2, 5) renvoie 7.", skill: "php-return" },
      { id: "cp3-7", type: "qcm", prompt: "Pourquoi écrire une fonction ?", choices: ["Pour réutiliser un bout de code sans le recopier", "Pour ralentir le script", "Pour cacher les erreurs", "Parce que PHP l'exige"], answer: [0], explanation: "Une fonction évite de répéter le même code.", skill: "php-function" },
      { id: "cp3-8", type: "parsons", prompt: "Déclare une fonction puis appelle-la.", lines: ["function dire() {", "echo \"Hello\";", "}", "dire();"], distractors: ["dire;"], explanation: "On déclare la fonction, puis on l'appelle avec des parenthèses.", skill: "php-function" },
    ],
  },
};
