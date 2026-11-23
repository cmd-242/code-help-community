import type { TrackInput } from "@/features/catalog/types";

type NotionInput = TrackInput["notions"][number];

export const phpNotion6: NotionInput = {
  slug: "php-base-de-donnees",
  position: 6,
  place: "L'Île du Coffre-fort",
  concept: "Base de données avec PDO",
  summary: "Enregistrer et relire des données avec PDO, et fermer la porte aux injections SQL.",
  guardian: {
    name: "Le Dragon des Requêtes",
    title: "Gardien du coffre",
    taunt: "Une apostrophe dans ton formulaire, et tout ton coffre est à moi.",
  },
  lessons: [
    {
      id: "l-p6-pdo",
      title: "Parler à la base de données",
      minutes: 7,
      blocks: [
        { kind: "p", text: "Une base de données garde les informations de ton site (comptes, messages…). PHP s'y connecte avec **PDO**, un outil qui fonctionne avec plusieurs bases (MySQL, PostgreSQL, SQLite)." },
        { kind: "code", code: "<?php\n$pdo = new PDO(\"sqlite:site.db\");\n$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n\n$rows = $pdo->query(\"SELECT nom FROM joueurs\")->fetchAll();\nforeach ($rows as $row) {\n  echo $row[\"nom\"];\n}", caption: "query exécute une requête, fetchAll rapporte les lignes." },
        { kind: "tip", text: "`ERRMODE_EXCEPTION` fait lever une erreur claire quand une requête est mauvaise, au lieu d'échouer en silence." },
      ],
    },
    {
      id: "l-p6-injection",
      title: "Les requêtes préparées",
      minutes: 7,
      blocks: [
        { kind: "warn", text: "Ne colle jamais une donnée du visiteur dans une requête avec le point. Un visiteur qui écrit `' OR '1'='1` peut lire toute la table : c'est une **injection SQL**." },
        { kind: "code", code: "<?php\n// DANGEREUX\n$pdo->query(\"SELECT * FROM users WHERE nom = '\" . $_POST[\"nom\"] . \"'\");\n\n// SÛR : requête préparée\n$stmt = $pdo->prepare(\"SELECT * FROM users WHERE nom = ?\");\n$stmt->execute([$_POST[\"nom\"]]);\n$user = $stmt->fetch();" },
        { kind: "p", text: "Avec `prepare`, la requête et les données voyagent séparément : la base ne peut jamais confondre une donnée avec une instruction." },
        { kind: "tip", text: "Les `?` sont des emplacements. On peut aussi les nommer : `:nom`, puis `execute([\"nom\" => $valeur])`." },
      ],
    },
  ],
  stages: [
    {
      id: "p6-1",
      title: "La serrure",
      description: "Connecte-toi et lis des données.",
      xp: 40,
      encounters: [
        { id: "p6-1-a", type: "qcm", prompt: "Quel outil PHP sert à se connecter à une base de données ?", choices: ["PDO", "PHPDB", "SQLPHP", "ECHO"], answer: [0], explanation: "PDO : PHP Data Objects.", skill: "php-pdo" },
        { id: "p6-1-b", type: "fill", prompt: "Récupère toutes les lignes de la requête.", template: "$rows = $pdo->query(\"SELECT * FROM joueurs\")->{{0}}();", answers: ["fetchAll"], bank: ["fetchAll", "getAll", "readAll", "pull"], explanation: "fetchAll renvoie toutes les lignes.", skill: "php-pdo" },
        { id: "p6-1-c", type: "qcm", prompt: "À quoi sert ERRMODE_EXCEPTION ?", choices: ["À signaler clairement les erreurs de requête", "À accélérer le site", "À chiffrer la base", "À supprimer les doublons"], answer: [0], explanation: "Une mauvaise requête lève une exception visible.", skill: "php-pdo" },
        { id: "p6-1-d", type: "qcm", prompt: "Quelle base peut-on utiliser avec PDO ?", choices: ["MySQL, PostgreSQL ou SQLite", "Seulement MySQL", "Aucune", "Seulement Excel"], answer: [0], explanation: "PDO sait parler à plusieurs bases.", skill: "php-pdo" },
      ],
    },
    {
      id: "p6-2",
      title: "L'apostrophe maudite",
      description: "Comprends l'injection SQL.",
      xp: 50,
      encounters: [
        { id: "p6-2-a", type: "qcm", prompt: "Comment s'appelle l'attaque qui glisse du SQL dans un champ de formulaire ?", choices: ["Injection SQL", "Phishing", "Déni de service", "Force brute"], answer: [0], explanation: "La donnée est interprétée comme une instruction.", skill: "php-injection" },
        { id: "p6-2-b", type: "qcm", prompt: "Quelle ligne est dangereuse ?", choices: ["$pdo->query(\"... WHERE nom = '\" . $_POST[\"nom\"] . \"'\");", "$stmt->execute([$_POST[\"nom\"]]);", "$stmt = $pdo->prepare(\"... WHERE nom = ?\");", "$user = $stmt->fetch();"], answer: [0], explanation: "La donnée est collée dans la requête.", skill: "php-injection" },
        { id: "p6-2-c", type: "qcm", prompt: "Qu'arrive-t-il avec ' OR '1'='1 collé dans une requête de connexion ?", choices: ["La condition devient toujours vraie", "La requête s'arrête", "Rien", "La base est chiffrée"], answer: [0], explanation: "'1'='1' est toujours vrai : l'attaquant passe.", skill: "php-injection" },
        { id: "p6-2-d", type: "qcm", prompt: "Cacher un champ avec JavaScript empêche-t-il l'injection ?", choices: ["Non, le visiteur envoie ce qu'il veut", "Oui", "Seulement en POST", "Seulement en GET"], answer: [0], explanation: "Seule la requête préparée protège côté serveur.", skill: "php-injection" },
      ],
    },
    {
      id: "p6-3",
      title: "Les requêtes préparées",
      description: "Pose la bonne protection.",
      xp: 60,
      encounters: [
        { id: "p6-3-a", type: "parsons", prompt: "Cherche un utilisateur en sécurité.", lines: ["$stmt = $pdo->prepare(\"SELECT * FROM users WHERE nom = ?\");", "$stmt->execute([$nom]);", "$user = $stmt->fetch();"], distractors: ["$pdo->query($nom);"], explanation: "On prépare, on exécute avec les données, puis on lit.", skill: "php-prepare" },
        { id: "p6-3-b", type: "fill", prompt: "Prépare la requête.", template: "$stmt = $pdo->{{0}}(\"SELECT * FROM users WHERE id = ?\");", answers: ["prepare"], bank: ["prepare", "query", "run", "send"], explanation: "prepare crée la requête avec ses emplacements.", skill: "php-prepare" },
        { id: "p6-3-c", type: "qcm", prompt: "À quoi servent les ? dans une requête préparée ?", choices: ["D'emplacements remplis séparément par les données", "À poser des questions au visiteur", "À commenter le SQL", "À trier"], answer: [0], explanation: "Les données ne sont jamais mélangées au SQL.", skill: "php-prepare" },
        { id: "p6-3-d", type: "qcm", prompt: "Quelle méthode envoie les données à une requête préparée ?", choices: ["execute", "prepare", "echo", "bind_all"], answer: [0], explanation: "$stmt->execute([...]).", skill: "php-prepare" },
      ],
    },
  ],
  challenge: {
    questionCount: 6,
    durationSeconds: 300,
    passingScore: 70,
    xp: 150,
    bank: [
      { id: "cp6-1", type: "qcm", prompt: "PDO signifie…", choices: ["PHP Data Objects", "Public Database Option", "PHP Draw Output", "Protected Data Object"], answer: [0], explanation: "PHP Data Objects.", skill: "php-pdo" },
      { id: "cp6-2", type: "qcm", prompt: "Quelle défense contre l'injection SQL est la bonne ?", choices: ["Les requêtes préparées", "Cacher le formulaire", "Passer en majuscules", "Utiliser GET"], answer: [0], explanation: "Elles séparent le SQL des données.", skill: "php-prepare" },
      { id: "cp6-3", type: "fill", prompt: "Envoie la donnée à la requête.", template: "$stmt->{{0}}([$nom]);", answers: ["execute"], bank: ["execute", "prepare", "fetch", "query"], explanation: "execute reçoit les valeurs des ?.", skill: "php-prepare" },
      { id: "cp6-4", type: "qcm", prompt: "Qu'est-ce qu'une injection SQL ?", choices: ["Du SQL glissé dans une donnée qui est exécuté", "Un bug d'affichage", "Une sauvegarde", "Un mot de passe faible"], answer: [0], explanation: "L'attaquant détourne la requête.", skill: "php-injection" },
      { id: "cp6-5", type: "qcm", prompt: "Quelle méthode lit une seule ligne de résultat ?", choices: ["fetch", "fetchAll", "execute", "prepare"], answer: [0], explanation: "fetch renvoie la ligne suivante.", skill: "php-pdo" },
      { id: "cp6-6", type: "qcm", prompt: "Pourquoi ne pas écrire \"... WHERE nom = '\" . $nom . \"'\" ?", choices: ["La donnée peut contenir du SQL", "C'est plus lent", "PHP l'interdit", "Ça ne marche pas en local"], answer: [0], explanation: "C'est la porte d'entrée de l'injection.", skill: "php-injection" },
      { id: "cp6-7", type: "parsons", prompt: "Insère un joueur en sécurité.", lines: ["$stmt = $pdo->prepare(\"INSERT INTO joueurs (nom) VALUES (?)\");", "$stmt->execute([$nom]);"], distractors: ["echo $nom;"], explanation: "Préparer puis exécuter.", skill: "php-prepare" },
      { id: "cp6-8", type: "qcm", prompt: "Que fait ERRMODE_EXCEPTION face à une requête erronée ?", choices: ["Il lève une exception", "Il l'ignore", "Il la corrige", "Il redémarre le serveur"], answer: [0], explanation: "L'erreur est visible tout de suite.", skill: "php-pdo" },
    ],
  },
};
