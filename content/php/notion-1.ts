import type { TrackInput } from "@/features/catalog/types";

type NotionInput = TrackInput["notions"][number];

export const phpNotion1: NotionInput = {
  slug: "php-echo-variables",
  position: 1,
  place: "L'Île du Serveur",
  concept: "Écrire du PHP : echo et variables",
  summary: "Afficher du texte, ranger des valeurs dans des variables et assembler des phrases.",
  guardian: {
    name: "Le Toucan Muet",
    title: "Gardien de la première île",
    taunt: "Pas un mot ? Ton script n'a rien à dire !",
  },
  lessons: [
    {
      id: "l-p1-premiers-pas",
      title: "Ton premier script",
      minutes: 5,
      blocks: [
        { kind: "p", text: "PHP est un langage qui s'exécute **sur le serveur** : ton navigateur ne voit jamais le code, seulement le résultat. Un script PHP commence par la balise `<?php`." },
        { kind: "code", code: "<?php\necho \"Bonjour\";", caption: "echo affiche du texte. Le point-virgule termine l'instruction." },
        { kind: "tip", text: "Chaque instruction PHP se termine par un point-virgule `;`. L'oublier est l'erreur la plus fréquente des débutants." },
        { kind: "p", text: "Les commentaires servent à t'expliquer ton propre code : `// ceci est ignoré` sur une ligne." },
        { kind: "code", code: "<?php\n// affiche un message\necho \"Hello\";" },
      ],
    },
    {
      id: "l-p1-variables",
      title: "Des coffres pour tes valeurs",
      minutes: 7,
      blocks: [
        { kind: "p", text: "Une **variable** est un coffre qui garde une valeur. En PHP, son nom commence toujours par `$`." },
        { kind: "code", code: "<?php\n$prix = 12;\n$prix = $prix + 3;\necho $prix;   // 15" },
        { kind: "warn", text: "`$1client` ou `$nom-client` ne sont pas des noms valides : pas de chiffre au début, pas de tiret. Utilise `$nom_client`." },
        { kind: "h", text: "Assembler du texte" },
        { kind: "p", text: "L'opérateur `.` colle deux textes. Entre guillemets doubles, PHP remplace aussi les variables par leur valeur ; entre apostrophes, rien n'est remplacé." },
        { kind: "code", code: "<?php\n$nom = \"Aya\";\necho \"Salut \" . $nom;   // Salut Aya\necho \"Salut $nom\";      // Salut Aya\necho 'Salut $nom';      // Salut $nom" },
      ],
    },
  ],
  stages: [
    {
      id: "p1-1",
      title: "Le premier écho",
      description: "Fais parler ton premier script.",
      xp: 40,
      encounters: [
        { id: "p1-1-a", type: "qcm", prompt: "Quelle balise ouvre un bloc de code PHP ?", choices: ["<?php", "<php>", "<script php>", "{php}"], answer: [0], explanation: "Un script PHP commence par <?php.", skill: "php-echo" },
        { id: "p1-1-b", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\necho \"Bonjour\";", accepted: ["Bonjour"], placeholder: "Écris la sortie exacte", explanation: "echo affiche le texte, sans les guillemets.", skill: "php-echo" },
        { id: "p1-1-c", type: "qcm", prompt: "Que met-on à la fin d'une instruction PHP ?", choices: [";", ".", ":", "Rien du tout"], answer: [0], explanation: "Le point-virgule termine l'instruction.", skill: "php-echo" },
        { id: "p1-1-d", type: "fill", prompt: "Affiche le mot Salut.", template: "echo {{0}};", answers: ["\"Salut\""], bank: ["\"Salut\"", "Salut", "print Salut", "(Salut"], explanation: "Un texte s'écrit entre guillemets.", skill: "php-echo" },
      ],
    },
    {
      id: "p1-2",
      title: "Les coffres de variables",
      description: "Range des valeurs et fais des calculs.",
      xp: 50,
      encounters: [
        { id: "p1-2-a", type: "qcm", prompt: "Par quel caractère commence le nom d'une variable PHP ?", choices: ["$", "@", "#", "var "], answer: [0], explanation: "Toutes les variables PHP commencent par $.", skill: "php-variables" },
        { id: "p1-2-b", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\n$prix = 12;\n$prix = $prix + 3;\necho $prix;", accepted: ["15"], explanation: "12 + 3 = 15, rangé de nouveau dans $prix.", skill: "php-variables" },
        { id: "p1-2-c", type: "qcm", prompt: "Quel nom de variable est valide ?", choices: ["$nom_client", "$1client", "$nom-client", "nom"], answer: [0], explanation: "Pas de chiffre au début ni de tiret ; le $ est obligatoire.", skill: "php-variables" },
        { id: "p1-2-d", type: "qcm", prompt: "Que fait $age = 17; ?", choices: ["Range 17 dans la variable $age", "Compare $age à 17", "Affiche 17", "Supprime $age"], answer: [0], explanation: "= est l'affectation : il range une valeur.", skill: "php-variables" },
      ],
    },
    {
      id: "p1-3",
      title: "La chaîne de mots",
      description: "Assemble des phrases avec des variables.",
      xp: 60,
      encounters: [
        { id: "p1-3-a", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\n$prenom = \"Aya\";\necho \"Salut \" . $prenom;", accepted: ["Salut Aya"], explanation: "Le point colle les deux textes.", skill: "php-concat" },
        { id: "p1-3-b", type: "qcm", prompt: "Quel opérateur colle deux textes en PHP ?", choices: [".", "+", "&", "||"], answer: [0], explanation: "En PHP, le + sert aux nombres : le point sert aux textes.", skill: "php-concat" },
        { id: "p1-3-c", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\n$nom = \"Aya\";\necho \"Salut $nom\";", accepted: ["Salut Aya"], explanation: "Entre guillemets doubles, $nom est remplacé par sa valeur.", skill: "php-concat" },
        { id: "p1-3-d", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\n$nom = \"Aya\";\necho 'Salut $nom';", accepted: ["Salut $nom"], explanation: "Entre apostrophes, PHP n'interprète rien : $nom s'affiche tel quel.", skill: "php-concat" },
      ],
    },
  ],
  challenge: {
    questionCount: 6,
    durationSeconds: 300,
    passingScore: 70,
    xp: 150,
    bank: [
      { id: "cp1-1", type: "qcm", prompt: "Quelle instruction affiche du texte ?", choices: ["echo", "show", "write", "display"], answer: [0], explanation: "echo affiche du texte.", skill: "php-echo" },
      { id: "cp1-2", type: "qcm", prompt: "Où s'exécute un script PHP ?", choices: ["Sur le serveur", "Dans le navigateur du visiteur", "Dans le terminal du visiteur", "Nulle part"], answer: [0], explanation: "Le navigateur ne reçoit que le résultat.", skill: "php-echo" },
      { id: "cp1-3", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\n$a = 4;\n$b = 6;\necho $a + $b;", accepted: ["10"], explanation: "4 + 6 = 10.", skill: "php-variables" },
      { id: "cp1-4", type: "qcm", prompt: "Quel nom de variable est invalide ?", choices: ["$score", "$mon_score", "$2score", "$scoreFinal"], answer: [2], explanation: "Un nom de variable ne commence pas par un chiffre.", skill: "php-variables" },
      { id: "cp1-5", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\n$x = \"PH\";\necho $x . \"P\";", accepted: ["PHP"], explanation: "Le point colle PH et P.", skill: "php-concat" },
      { id: "cp1-6", type: "predict", prompt: "Qu'affiche ce script ?", code: "<?php\n$v = 7;\necho 'Valeur : $v';", accepted: ["Valeur : $v"], explanation: "Les apostrophes n'interprètent pas les variables.", skill: "php-concat" },
      { id: "cp1-7", type: "fill", prompt: "Colle les deux textes.", template: "echo \"Bon\" {{0}} \"jour\";", answers: ["."], bank: [".", "+", "&", ","], explanation: "Le point est l'opérateur de concaténation.", skill: "php-concat" },
      { id: "cp1-8", type: "qcm", prompt: "Pourquoi un script affiche-t-il « syntax error » si on oublie le ; ?", choices: ["PHP ne sait plus où l'instruction se termine", "Le serveur est éteint", "La variable est vide", "echo ne fonctionne plus"], answer: [0], explanation: "Le point-virgule marque la fin de l'instruction.", skill: "php-echo" },
    ],
  },
};
