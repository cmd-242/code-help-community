import type { TrackInput } from "@/features/catalog/types";

type NotionInput = TrackInput["notions"][number];

export const phpNotion5: NotionInput = {
  slug: "php-fonctions-natives",
  position: 5,
  place: "L'Île de la Boîte à outils",
  concept: "Les fonctions natives de PHP",
  summary: "Manipuler des textes et des tableaux avec les outils fournis par PHP, sans réinventer la roue.",
  guardian: {
    name: "Le Crabe Forgeron",
    title: "Gardien de l'atelier",
    taunt: "Tu recrées chaque outil à la main ? Pauvre pince…",
  },
  lessons: [
    {
      id: "l-p5-textes",
      title: "Travailler les textes",
      minutes: 6,
      blocks: [
        { kind: "p", text: "PHP embarque des centaines de fonctions toutes prêtes. Avant d'écrire la tienne, cherche si elle existe déjà." },
        { kind: "code", code: "<?php\necho strlen(\"Bonjour\");              // 7\necho strtoupper(\"aya\");               // AYA\necho str_replace(\"a\", \"o\", \"chat\");   // chot\necho trim(\"  salut  \");               // salut\necho substr(\"Bonjour\", 0, 3);          // Bon" },
        { kind: "tip", text: "Dans `str_replace`, l'ordre est : ce qu'on cherche, ce qu'on met à la place, le texte de départ." },
        { kind: "warn", text: "Ces fonctions renvoient un nouveau texte : elles ne modifient pas la variable. Écris `$nom = trim($nom);` pour garder le résultat." },
      ],
    },
    {
      id: "l-p5-tableaux",
      title: "Travailler les tableaux",
      minutes: 7,
      blocks: [
        { kind: "code", code: "<?php\n$n = [3, 1, 2];\necho count($n);              // 3\nsort($n);                    // $n devient [1, 2, 3]\nvar_dump(in_array(2, $n));   // true\necho implode(\"-\", $n);       // 1-2-3\nprint_r(explode(\",\", \"a,b\")); // [\"a\", \"b\"]\narray_push($n, 9);           // ajoute 9" },
        { kind: "p", text: "`implode` colle les éléments d'un tableau en un texte, `explode` fait l'inverse en coupant un texte." },
        { kind: "tip", text: "`sort` modifie directement le tableau, alors que `strtoupper` renvoie un nouveau texte. Vérifie dans la documentation de chaque fonction." },
      ],
    },
  ],
  stages: [
    {
      id: "p5-1",
      title: "L'atelier des mots",
      description: "Manipule du texte avec les outils de PHP.",
      xp: 40,
      encounters: [
        { id: "p5-1-a", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\necho strlen(\"Bonjour\");", accepted: ["7"], explanation: "strlen compte les caractères.", skill: "php-strings" },
        { id: "p5-1-b", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\necho strtoupper(\"aya\");", accepted: ["AYA"], explanation: "strtoupper met en majuscules.", skill: "php-strings" },
        { id: "p5-1-c", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\necho str_replace(\"a\", \"o\", \"chat\");", accepted: ["chot"], explanation: "Le a est remplacé par un o.", skill: "php-strings" },
        { id: "p5-1-d", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\necho substr(\"Bonjour\", 0, 3);", accepted: ["Bon"], explanation: "substr(texte, départ, longueur) : 3 caractères à partir de 0.", skill: "php-strings" },
      ],
    },
    {
      id: "p5-2",
      title: "Le rayon des tableaux",
      description: "Trie, cherche et assemble des tableaux.",
      xp: 50,
      encounters: [
        { id: "p5-2-a", type: "qcm", prompt: "Quelle fonction vérifie qu'une valeur est dans un tableau ?", choices: ["in_array", "has_value", "array_find", "contains"], answer: [0], explanation: "in_array(valeur, tableau).", skill: "php-arrays-fn" },
        { id: "p5-2-b", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\necho implode(\"-\", [1, 2, 3]);", accepted: ["1-2-3"], explanation: "implode colle avec le séparateur.", skill: "php-arrays-fn" },
        { id: "p5-2-c", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\n$n = [3, 1, 2];\nsort($n);\necho $n[0];", accepted: ["1"], explanation: "Après le tri, la plus petite valeur est en case 0.", skill: "php-arrays-fn" },
        { id: "p5-2-d", type: "qcm", prompt: "Quelle fonction coupe un texte en tableau ?", choices: ["explode", "implode", "split_all", "cut"], answer: [0], explanation: "explode(séparateur, texte).", skill: "php-arrays-fn" },
      ],
    },
    {
      id: "p5-3",
      title: "La documentation, ton alliée",
      description: "Choisis le bon outil avant d'en fabriquer un.",
      xp: 60,
      encounters: [
        { id: "p5-3-a", type: "qcm", prompt: "Tu veux retirer les espaces autour d'un texte. Que choisis-tu ?", choices: ["trim", "strlen", "sort", "explode"], answer: [0], explanation: "trim retire les espaces au début et à la fin.", skill: "php-strings" },
        { id: "p5-3-b", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\n$nom = \"  Aya \";\ntrim($nom);\necho strlen($nom);", accepted: ["6"], explanation: "trim renvoie un nouveau texte mais $nom n'a pas changé : 6 caractères.", skill: "php-strings" },
        { id: "p5-3-c", type: "qcm", prompt: "Où trouver la liste et l'usage de chaque fonction PHP ?", choices: ["Dans la documentation officielle php.net", "Dans le navigateur", "Dans le fichier .env", "Nulle part"], answer: [0], explanation: "php.net documente chaque fonction avec des exemples.", skill: "php-arrays-fn" },
        { id: "p5-3-d", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\n$t = explode(\",\", \"a,b,c\");\necho count($t);", accepted: ["3"], explanation: "Le texte est coupé en 3 morceaux.", skill: "php-arrays-fn" },
      ],
    },
  ],
  challenge: {
    questionCount: 6,
    durationSeconds: 300,
    passingScore: 70,
    xp: 150,
    bank: [
      { id: "cp5-1", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\necho strlen(\"php\");", accepted: ["3"], explanation: "3 caractères.", skill: "php-strings" },
      { id: "cp5-2", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\necho str_replace(\"l\", \"L\", \"hello\");", accepted: ["heLLo"], explanation: "Tous les l sont remplacés.", skill: "php-strings" },
      { id: "cp5-3", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\necho strtoupper(substr(\"salut\", 0, 1));", accepted: ["S"], explanation: "On prend la première lettre puis on la met en majuscule.", skill: "php-strings" },
      { id: "cp5-4", type: "qcm", prompt: "Que renvoie in_array(5, [1, 2, 3]) ?", choices: ["false", "true", "5", "null"], answer: [0], explanation: "5 n'est pas dans le tableau.", skill: "php-arrays-fn" },
      { id: "cp5-5", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\n$n = [9, 4];\nsort($n);\necho $n[0];", accepted: ["4"], explanation: "Le tri met 4 avant 9.", skill: "php-arrays-fn" },
      { id: "cp5-6", type: "fill", prompt: "Assemble le tableau en texte.", template: "echo {{0}}(\", \", $fruits);", answers: ["implode"], bank: ["implode", "explode", "count", "sort"], explanation: "implode(séparateur, tableau).", skill: "php-arrays-fn" },
      { id: "cp5-7", type: "qcm", prompt: "Pourquoi trim($nom); seul ne change-t-il pas $nom ?", choices: ["Il renvoie un nouveau texte qu'il faut ranger", "trim est cassée", "Il faut l'écrire en majuscules", "Il ne marche qu'avec echo"], answer: [0], explanation: "Il faut écrire $nom = trim($nom);", skill: "php-strings" },
      { id: "cp5-8", type: "qcm", prompt: "Avant d'écrire sa propre fonction, que faire ?", choices: ["Chercher si PHP la propose déjà", "Copier un site au hasard", "Changer de langage", "Rien"], answer: [0], explanation: "La bibliothèque standard est très riche.", skill: "php-arrays-fn" },
    ],
  },
};
