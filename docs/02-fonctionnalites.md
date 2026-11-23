# 02 — Fonctionnalités

Légende des priorités : **[MVP]** première version · **[V2]** deuxième phase · **[V3]** plus tard.
Les éléments marqués ✨ sont des idées ajoutées au-delà de la vision de départ.

**Principe** : tout fonctionne d'abord pour un **apprenant libre**, sans école ni enseignant. Les sections marquées *(option classe)* ajoutent le cadre scolaire par-dessus, sans rien retirer.

---

## A. Comptes et profil

- **[MVP]** Inscription / connexion par e-mail + mot de passe, et connexion Google. Aucune école requise.
- **[MVP]** Profil : pseudonyme (affiché dans les classements), avatar, langue, fuseau horaire.
- **[MVP]** Rôles cumulables : apprenant (tout le monde), mentor, enseignant, responsable d'établissement, super-admin.
- **[V2]** ✨ **Test de positionnement** à l'inscription : quelques questions pour proposer le bon parcours, le bon point de départ et le bon univers (Archipel ou Néo-Métro) (un développeur confirmé ne recommence pas à zéro).
- **[MVP]** Données personnelles : consentement, export et suppression du compte.

## B. Apprentissage libre (autodidactes) : le mode par défaut

- **[MVP]** Choisir librement ses royaumes et ses parcours, en suivre plusieurs en parallèle.
- **[MVP]** Progression **sans planning** : une notion s'ouvre dès que le gardien précédent est vaincu.
- **[MVP]** **Objectif hebdomadaire personnel** choisi par l'apprenant (tranquille, régulier, acharné) avec jauge de la semaine. *(fait en démo)*
- **[MVP]** Série de jours actifs, XP, niveaux, étoiles : la motivation ne dépend pas d'un enseignant.
- **[V2]** ✨ Rappels doux choisis par l'apprenant (« ton objectif est à 60 %, il reste 2 jours ») par notification ou e-mail, avec heures de silence.
- **[V2]** ✨ **Ligues publiques hebdomadaires** entre apprenants de niveau proche.
- **[V2]** ✨ **Guildes** : petites équipes ouvertes d'apprenants libres qui progressent ensemble, avec un objectif commun.
- **[V2]** ✨ **Mentors bénévoles** de la communauté qui accompagnent des guildes.
- **[V2]** ✨ Parcours « carrière » qui enchaînent plusieurs royaumes (ex. *Administrateur système junior* : Linux → Réseaux → Git → Sécurité).
- **[V3]** ✨ Projets libres guidés (construire un vrai script, un vrai serveur) pour le portfolio.
- **[V3]** Rejoindre une classe plus tard **sans perdre sa progression**.

## C. Catalogue pédagogique

Structure : **Domaine → Parcours → Notion → (Jeu + Cours + Grand challenge)**.

- **[MVP]** Domaines : Programmation, Linux, Git, Réseaux, Sécurité, Cloud (AWS, GCP)… extensibles sans code.
- **[MVP]** Parcours (ex. « Python débutant », « Linux administrateur junior »), ordonnés en notions.
- **[MVP]** Prérequis entre notions (graphe, pas seulement une liste).
- **[MVP]** Éditeur de contenu pour les auteurs (équipe, enseignants, contributeurs) (Markdown/MDX avec blocs interactifs : code exécutable, quiz, schéma).
- **[MVP]** Banque de questions par notion, réutilisable entre challenges.
- **[V2]** Versionnement du contenu : modifier une notion ne casse pas les tentatives déjà faites.
- **[V2]** Duplication et personnalisation d'un parcours existant par un enseignant.
- **[V3]** ✨ Bibliothèque partagée : enseignants et contributeurs publient, notent et réutilisent des parcours.
- **[V3]** ✨ Import de contenu depuis un dépôt Git (contenu « as code »).

## D. Côté ouvert — le jeu

### Structure du jeu
- **[MVP]** Chaque notion est un **monde** composé d'**étapes** (niveaux) à difficulté croissante.
- **[MVP]** 1 à 3 **étoiles** par étape (réussite, rapidité, zéro indice).
- **[MVP]** Étapes bonus déblocables avec les étoiles.
- **[V2]** ✨ **Carte du parcours** visuelle (style carte d'aventure) montrant les mondes débloqués, en cours, verrouillés.
- **[V2]** ✨ **Boss de monde** : une étape finale plus difficile qui prépare au grand challenge.

### Types de mini-jeux (moteurs réutilisables)
Chaque moteur est générique ; le contenu (JSON) dit quoi afficher et comment corriger.

| Moteur | Exemple | Domaines | Phase |
|---|---|---|---|
| QCM / vrai-faux / choix multiples | « Quelle commande liste les fichiers cachés ? » | Tous | MVP |
| **Puzzle de code (Parsons)** — remettre des lignes dans l'ordre | Reconstituer une boucle `for` | Code, Bash | MVP |
| **Texte à trous** dans du code | Compléter `git ___ -m "msg"` | Tous | MVP |
| **Écrire du code** validé par tests automatiques | Écrire `est_pair(n)` | Code | MVP |
| **Trouve le bug** | Corriger une fonction qui plante | Code | MVP |
| **Terminal Linux simulé** | Créer une arborescence, changer des droits | Linux | MVP |
| **Prédire la sortie** | « Qu'affiche ce programme ? » | Code | MVP |
| Glisser-déposer / association | Associer protocole ↔ couche OSI | Réseau, Cloud | V2 |
| **Git visuel** (graphe des commits animé) | Créer une branche, fusionner, résoudre un conflit | Git | V2 |
| **Calculateur de sous-réseaux** chronométré | Trouver le masque, la plage d'adresses | Réseau | V2 |
| **Construire une topologie** (schéma) | Relier routeur, switch, PC, configurer IP | Réseau | V3 |
| **Mini-CTF** (trouver un « flag ») | Analyser un log, repérer une injection SQL | Sécurité | V2 |
| **Console cloud simulée** | Écrire une politique IAM, rendre un bucket privé | AWS, GCP | V3 |
| **Diagramme d'architecture** | Placer load balancer, VM, base de données | Cloud | V3 |
| Cartes mémoire à **répétition espacée** ✨ | Commandes et définitions à revoir au bon moment | Tous | V2 |
| SQL sur base réelle dans le navigateur | Écrire une requête sur une base de test | SQL | V2 |

### Récompenses et motivation
- **[MVP]** **XP** gagnés par étape, cours terminé, challenge réussi.
- **[MVP]** **Niveaux** de joueur et **badges** (premier challenge, 7 jours d'affilée, zéro indice…).
- **[MVP]** **Série** (« streak ») de jours actifs, avec ✨ **gel de série** gagnable (1 jour de repos sans tout perdre).
- **[V2]** **Quêtes quotidiennes et hebdomadaires** (« Termine 3 étapes », « Aide un camarade sur le forum »).
- **[V2]** ✨ **Ligues hebdomadaires** : groupes de 15 à 20 étudiants de niveau proche ; on monte ou descend chaque semaine. Évite que les plus faibles se comparent toujours aux meilleurs.
- **[V2]** Classement de classe avec option **pseudonyme** et affichage du **progrès personnel** (« +40 % cette semaine »).
- **[MVP]** ✨ **Collection de cartes** : chaque compétence réussie devient une carte (commune, rare, épique), qui monte en maîtrise (1 à 3) quand on la réussit encore ; chaque gardien vaincu donne sa carte légendaire ; le **coffre de la semaine** s'ouvre quand l'objectif hebdomadaire est atteint et rend une carte brillante. *(fait en démo)*
- **[V2]** ✨ Duels de cartes entre apprenants et deck à composer.
- **[V2]** ✨ Monnaie virtuelle (gemmes) pour personnaliser l'avatar, acheter des gels de série ou des indices. Aucune valeur réelle.
- **[V3]** ✨ Événements : « semaine Linux », double XP le week-end, défis inter-classes.

## E. Côté fermé — le cours

- **[MVP]** Leçons par notion : texte, exemples de code exécutables, images, vidéos courtes (lien externe ou fichier compressé).
- **[MVP]** Consignes de la notion ; en classe, l'enseignant peut ajouter ses propres instructions de la semaine.
- **[MVP]** Exercices guidés à la fin de chaque leçon.
- **[MVP]** Suivi de lecture (leçon ouverte, terminée, temps passé).
- **[V2]** ✨ Fiche-résumé téléchargeable (PDF) et **mode hors-ligne** pour réviser sans connexion.
- **[V2]** ✨ Prise de notes personnelles attachées à une leçon.
- **[V3]** ✨ Version audio des leçons (lecture automatique) pour réviser dans les transports.

## F. Classes et établissements (option classe)

Une classe ajoute un rythme et un suivi. Un étudiant en classe reste aussi un apprenant libre pour les autres parcours.

- **[V2]** Établissement → niveaux → classes → étudiants. Un enseignant peut avoir plusieurs classes sur plusieurs niveaux. Un enseignant peut aussi créer une classe **sans établissement** (formateur indépendant, club, association) ✨.
- **[V2]** Rejoindre une classe par **code d'invitation** ou lien (QR code affichable en salle) ✨.
- **[V2]** Import CSV d'une liste d'étudiants.
- **[V2]** Règle de visibilité stricte : un enseignant ne voit que les étudiants de ses classes, et uniquement sur les parcours assignés à la classe.
- **[V2]** L'enseignant assigne des parcours à la classe et planifie, **par classe**, chaque notion :
  - date d'ouverture du jeu et du cours ;
  - fenêtre du grand challenge (ouverture, fermeture, durée max) ;
  - seuil de réussite (ex. 70 %) et nombre de tentatives.
- **[V2]** Ouverture **automatique** à la date prévue, calculée à la lecture (aucune tâche planifiée).
- **[V2]** Dérogation individuelle : débloquer, prolonger ou rouvrir pour un étudiant.
- **[V2]** Annonces et consignes de la semaine à la classe.
- **[V3]** Co-enseignement (titulaire / assistant), années scolaires et archivage, vue calendrier du semestre, copie de planning entre classes.
- **[V3]** Multi-établissements (SaaS) avec isolation complète des données.

## G. Grand challenge (évaluation)

- **[MVP]** Test final par notion : mélange de questions (QCM, code, terminal, prédire la sortie…).
- **[MVP]** Tirage **aléatoire** des questions dans la banque et ordre mélangé : deux étudiants n'ont pas le même sujet.
- **[MVP]** Chronomètre, sauvegarde automatique des réponses (coupure réseau sans perte).
- **[MVP]** Correction automatique ; correction manuelle possible pour les questions ouvertes.
- **[MVP]** Résultat : validé / non validé, détail par compétence.
- **[MVP]** En cas d'échec : **parcours de rattrapage** ciblé sur les compétences ratées, puis nouvelle tentative.
- **[V2]** Intégrité (anti-triche) :
  - détection des changements d'onglet et sorties du plein écran (enregistrés, pas bloquants) ;
  - copier-coller désactivé dans l'éditeur pendant le test ;
  - **détection de similarité** entre les codes rendus ✨ ;
  - correction finale des exercices de code **côté serveur** avec tests cachés ;
  - rapport d'intégrité par tentative pour l'enseignant.
- **[V2]** ✨ **Challenge d'équipe** : un défi collectif où chaque membre doit contribuer.
- **[MVP]** ✨ En mode libre : tentatives illimitées, avec un **délai de recharge** entre deux combats perdus (le gardien « reprend des forces ») pour pousser à réviser plutôt qu'à deviner.
- **[V3]** Mode « examen surveillé en salle » : l'enseignant ouvre le challenge en direct avec un code temporaire.

## H. Suivi enseignant (option classe)

- **[V2]** Tableau de bord par classe : qui a commencé, avancement par notion, temps passé, dernière connexion.
- **[V2]** Fiche étudiant : historique, tentatives, réponses, points faibles.
- **[V2]** **Alertes de décrochage** : inactif depuis X jours, retard sur le planning, échecs répétés.
- **[V2]** Relance en un clic (message ou notification à un étudiant ou à un groupe filtré).
- **[V3]** ✨ **Carte de chaleur** des notions et questions difficiles pour la classe (où faut-il réexpliquer en cours ?).
- **[V3]** ✨ Statistiques par question (taux de réussite, pièges fréquents) pour améliorer les contenus.
- **[V3]** Export des résultats (CSV/Excel) pour le bulletin officiel.
- **[V3]** Vue multi-classes et comparaison entre classes d'un même niveau.
- **[V3]** ✨ **Score de risque** prédictif d'échec, calculé chaque semaine.
- **[V3]** ✨ Rapport hebdomadaire automatique envoyé par e-mail à l'enseignant (et optionnellement aux parents/tuteurs).

## I. Équipes, guildes et mentors

- **[V2]** Guildes ouvertes pour les apprenants libres (voir B) et équipes de classe.
- **[V2]** Création d'équipes par l'enseignant (manuelle ou automatique par niveau équilibré).
- **[V2]** Assignation d'un ou plusieurs mentors par équipe ou guilde (mentors de classe ou bénévoles).
- **[V2]** Espace d'équipe : objectifs communs, XP d'équipe, classement des équipes.
- **[V2]** Le mentor voit la progression de ses équipes, commente les tentatives, fait de la **revue de code**.
- **[V2]** ✨ Prise de rendez-vous avec le mentor (créneaux de permanence) et lien de visio.
- **[V3]** ✨ **Programmation en binôme** en temps réel (éditeur partagé).
- **[V3]** ✨ Projets d'équipe sur plusieurs semaines avec jalons (mini-hackathon).

## J. Communauté et entraide

- **[V2]** **Forum questions/réponses par notion** ; la réponse validée (par un mentor, un enseignant ou les votes de la communauté) rapporte des XP à son auteur ✨.
- **[V2]** Signalement et modération.
- **[V2]** Notifications : dans l'application, par e-mail, et notifications push (application installable).
- **[V3]** ✨ Profil public / **portfolio** de l'apprenant (badges, projets, certificats) partageable à un employeur.

## K. Assistant IA (tuteur)

- **[V2]** ✨ **Indices progressifs** dans le jeu (indice 1 : piste ; indice 2 : plus précis ; jamais la solution complète). Utiliser un indice retire une étoile.
- **[V2]** ✨ Explication d'un message d'erreur en langage simple.
- **[V2]** ✨ Aide à l'enseignant : proposer des questions et des variantes à partir d'une leçon (toujours relues et validées par l'enseignant avant publication).
- **[V2]** **Désactivé automatiquement pendant les grands challenges.**

## L. Certification et reconnaissance

- **[V2]** Attestation de validation d'un parcours (PDF), pour les apprenants libres comme pour les classes, avec **QR code de vérification** ✨.
- **[V3]** Badges numériques ouverts (Open Badges) exportables.

## M. Administration

- **[MVP]** Gestion des utilisateurs, classes, niveaux, enseignants.
- **[MVP]** Journal d'activité (qui a fait quoi : dérogations, modifications de notes).
- **[V2]** Statistiques d'établissement.
- **[V2]** Paramètres de l'établissement : logo, couleurs, seuils par défaut.

## N. Qualités transverses

- **[MVP]** Mobile d'abord, responsive, utilisable sur petit écran et réseau lent.
- **[MVP]** Accessibilité (clavier, contrastes, lecteurs d'écran).
- **[MVP]** Français par défaut, prêt pour l'anglais (i18n).
- **[V2]** Application installable (PWA) avec révision hors-ligne et synchronisation au retour du réseau.
- **[MVP]** Protection des données personnelles : consentement, export et suppression des données d'un utilisateur, données de mineurs protégées.
- **[V2]** Mode sombre, mode « économie de données » (pas de vidéo automatique, images réduites).

## Espace enseignant (livré, première version)

- Création de classes ; code d'invitation à 6 caractères et lien `/rejoindre/<code>`.
- Un étudiant rejoint avec son compte : il garde sa progression et sa collection ; la classe ajoute le planning par-dessus (règle 10 bis).
- Planning hebdomadaire : ouverture de l'île, réveil et fin du gardien ; une île non programmée reste fermée en classe. Le serveur ignore un combat de gardien hors fenêtre.
- Tableau de bord : étudiants triés par alertes, avec XP, criques réussies et état de chaque île.
- Permissions vérifiées côté serveur (`src/server/permissions.ts`) : un enseignant ne voit que ses classes.
- Données de démonstration : `pnpm db:seed` (prof@demo.test).
