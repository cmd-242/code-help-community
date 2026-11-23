import type { TrackInput } from "@/features/catalog/types";

type NotionInput = TrackInput["notions"][number];

export const phpNotion4: NotionInput = {
  slug: "php-formulaires",
  position: 4,
  place: "L'Île du Courrier",
  concept: "Formulaires, $_GET et $_POST",
  summary: "Recevoir les données d'un visiteur, les lire côté serveur et ne jamais leur faire confiance.",
  guardian: {
    name: "La Mouette Postière",
    title: "Gardienne de la boîte aux lettres",
    taunt: "Ce colis vient de l'extérieur. Tu l'ouvres sans regarder ?",
  },
  lessons: [
    {
      id: "l-p4-formulaires",
      title: "Le courrier du visiteur",
      minutes: 7,
      blocks: [
        { kind: "p", text: "Quand un visiteur remplit un formulaire, ses réponses arrivent sur le serveur. PHP les range dans des tableaux spéciaux : `$_GET` (données dans l'adresse) et `$_POST` (données envoyées en coulisses)." },
        { kind: "code", code: "<form method=\"post\" action=\"salut.php\">\n  <input name=\"prenom\">\n  <button>Envoyer</button>\n</form>\n\n<?php\n// salut.php\necho $_POST[\"prenom\"];", caption: "La clé du tableau est l'attribut name du champ." },
        { kind: "tip", text: "`$_GET` sert à lire ou chercher (une page de résultats). `$_POST` sert à envoyer ou modifier (un compte, un message)." },
        { kind: "h", text: "Vérifier avant de lire" },
        { kind: "code", code: "<?php\nif (isset($_POST[\"prenom\"])) {\n  echo \"Salut \" . $_POST[\"prenom\"];\n}", caption: "isset() vérifie que la clé existe." },
      ],
    },
    {
      id: "l-p4-securite",
      title: "Ne jamais faire confiance",
      minutes: 6,
      blocks: [
        { kind: "p", text: "Tout ce qui vient du visiteur peut être piégé. Si tu affiches son texte tel quel, il peut y glisser du code qui s'exécute chez les autres visiteurs : c'est une faille **XSS**." },
        { kind: "code", code: "<?php\n// à afficher dans une page HTML\necho htmlspecialchars($_POST[\"prenom\"]);", caption: "htmlspecialchars transforme < et > en texte inoffensif." },
        { kind: "warn", text: "Masquer un champ dans le formulaire ou le limiter en HTML ne protège de rien : le visiteur peut envoyer ce qu'il veut. Vérifie toujours côté serveur." },
        { kind: "p", text: "Pour vérifier une valeur, PHP propose `filter_var`, par exemple pour un e-mail." },
        { kind: "code", code: "<?php\nvar_dump(filter_var(\"aya@mail.com\", FILTER_VALIDATE_EMAIL)); // la valeur\nvar_dump(filter_var(\"pasunmail\", FILTER_VALIDATE_EMAIL));    // false" },
      ],
    },
  ],
  stages: [
    {
      id: "p4-1",
      title: "La boîte aux lettres",
      description: "Lis ce que le visiteur envoie.",
      xp: 40,
      encounters: [
        { id: "p4-1-a", type: "qcm", prompt: "Où PHP range-t-il les champs d'un formulaire envoyé en POST ?", choices: ["$_POST", "$_FORM", "$_SEND", "$post"], answer: [0], explanation: "$_POST est un tableau rempli par PHP.", skill: "php-post" },
        { id: "p4-1-b", type: "predict", prompt: "Le formulaire envoie prenom = Aya. Qu'affiche ce script ?", code: "<?php\necho $_POST[\"prenom\"];", accepted: ["Aya"], explanation: "La clé est le name du champ.", skill: "php-post" },
        { id: "p4-1-c", type: "qcm", prompt: "Quel attribut HTML donne sa clé à un champ ?", choices: ["name", "id", "class", "value"], answer: [0], explanation: "C'est name, pas id, qui devient la clé de $_POST.", skill: "php-post" },
        { id: "p4-1-d", type: "fill", prompt: "Vérifie que le champ existe.", template: "if ({{0}}($_POST[\"prenom\"])) {", answers: ["isset"], bank: ["isset", "exists", "has", "empty("], explanation: "isset vérifie qu'une clé existe.", skill: "php-post" },
      ],
    },
    {
      id: "p4-2",
      title: "GET ou POST ?",
      description: "Choisis la bonne méthode d'envoi.",
      xp: 50,
      encounters: [
        { id: "p4-2-a", type: "qcm", prompt: "Où voit-on les données envoyées en GET ?", choices: ["Dans l'adresse de la page", "Nulle part", "Dans un fichier caché", "Dans le cookie"], answer: [0], explanation: "En GET, les données sont dans l'URL : ?prenom=Aya.", skill: "php-get" },
        { id: "p4-2-b", type: "predict", prompt: "L'adresse est page.php?ville=Lagos. Qu'affiche ce script ?", code: "<?php\necho $_GET[\"ville\"];", accepted: ["Lagos"], explanation: "$_GET lit les paramètres de l'adresse.", skill: "php-get" },
        { id: "p4-2-c", type: "qcm", prompt: "Pour envoyer un mot de passe, quelle méthode choisir ?", choices: ["POST", "GET"], answer: [0], explanation: "GET écrit les données dans l'adresse, visibles de tous : à éviter pour ce qui est privé.", skill: "php-get" },
        { id: "p4-2-d", type: "qcm", prompt: "Pour une page de recherche qu'on veut pouvoir partager par lien, quelle méthode ?", choices: ["GET", "POST"], answer: [0], explanation: "L'adresse contient la recherche : on peut la copier.", skill: "php-get" },
      ],
    },
    {
      id: "p4-3",
      title: "Le colis piégé",
      description: "Protège-toi de ce que tu reçois.",
      xp: 60,
      encounters: [
        { id: "p4-3-a", type: "qcm", prompt: "Que doit-on faire d'une donnée envoyée par un visiteur ?", choices: ["La vérifier et l'échapper", "Lui faire confiance", "L'afficher telle quelle", "L'ignorer toujours"], answer: [0], explanation: "Toute donnée externe est suspecte jusqu'à preuve du contraire.", skill: "php-escape" },
        { id: "p4-3-b", type: "fill", prompt: "Affiche le prénom sans risque pour la page HTML.", template: "echo {{0}}($_POST[\"prenom\"]);", answers: ["htmlspecialchars"], bank: ["htmlspecialchars", "strtoupper", "trim", "json_encode"], explanation: "htmlspecialchars neutralise les balises HTML.", skill: "php-escape" },
        { id: "p4-3-c", type: "qcm", prompt: "Comment s'appelle la faille qui injecte du code dans une page affichée aux autres visiteurs ?", choices: ["XSS", "DNS", "CSS", "SSH"], answer: [0], explanation: "XSS : Cross-Site Scripting.", skill: "php-escape" },
        { id: "p4-3-d", type: "qcm", prompt: "Que renvoie filter_var(\"pasunmail\", FILTER_VALIDATE_EMAIL) ?", choices: ["false", "true", "\"pasunmail\"", "null"], answer: [0], explanation: "La valeur invalide donne false.", skill: "php-filter" },
      ],
    },
  ],
  challenge: {
    questionCount: 6,
    durationSeconds: 300,
    passingScore: 70,
    xp: 150,
    bank: [
      { id: "cp4-1", type: "qcm", prompt: "Quel tableau contient les données d'un formulaire en POST ?", choices: ["$_POST", "$_GET", "$_SERVER", "$_FILES"], answer: [0], explanation: "$_POST.", skill: "php-post" },
      { id: "cp4-2", type: "predict", prompt: "Formulaire : champ name=\"mail\" avec la valeur a@b.c. Qu'affiche ce script ?", code: "<?php\necho $_POST[\"mail\"];", accepted: ["a@b.c"], explanation: "La clé est le name du champ.", skill: "php-post" },
      { id: "cp4-3", type: "qcm", prompt: "Quelle méthode affiche les données dans l'adresse ?", choices: ["GET", "POST"], answer: [0], explanation: "GET met les données dans l'URL.", skill: "php-get" },
      { id: "cp4-4", type: "predict", prompt: "L'adresse est x.php?n=5. Qu'affiche ce script ?", code: "<?php\necho $_GET[\"n\"] + 1;", accepted: ["6"], explanation: "5 + 1 = 6 : PHP convertit le texte \"5\" en nombre.", skill: "php-get" },
      { id: "cp4-5", type: "fill", prompt: "Protège l'affichage.", template: "echo {{0}}($texte);", answers: ["htmlspecialchars"], bank: ["htmlspecialchars", "echo", "trim", "isset"], explanation: "On échappe avant d'afficher.", skill: "php-escape" },
      { id: "cp4-6", type: "qcm", prompt: "Pourquoi un champ limité en HTML doit-il être revérifié en PHP ?", choices: ["Le visiteur peut contourner le HTML", "PHP est plus rapide", "HTML ne fonctionne pas", "Pour gagner de la place"], answer: [0], explanation: "Le serveur est la seule barrière fiable.", skill: "php-filter" },
      { id: "cp4-7", type: "qcm", prompt: "Que fait isset($_POST[\"x\"]) ?", choices: ["Vérifie que la clé existe", "Affiche la clé", "Supprime la clé", "Crée la clé"], answer: [0], explanation: "isset teste l'existence.", skill: "php-post" },
      { id: "cp4-8", type: "qcm", prompt: "Que signifie XSS ?", choices: ["Cross-Site Scripting", "Extra Secure Server", "XML Style Sheet", "Xtreme Safe Script"], answer: [0], explanation: "Une faille d'injection de script dans une page.", skill: "php-escape" },
    ],
  },
};
