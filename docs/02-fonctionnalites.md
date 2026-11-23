# 02 — Fonctionnalités

Légende des priorités : **[MVP]** première version · **[V2]** deuxième phase · **[V3]** plus tard.
Les éléments marqués ✨ sont des idées ajoutées au-delà de la vision de départ.

---

## A. Comptes, organisation et accès

- **[MVP]** Inscription / connexion par e-mail + mot de passe, et connexion Google.
- **[MVP]** Rôles : étudiant, enseignant, mentor, responsable d'établissement, super-admin.
- **[MVP]** Établissement → niveaux → classes → étudiants. Un enseignant peut avoir plusieurs classes sur plusieurs niveaux.
- **[MVP]** Rejoindre une classe par **code d'invitation** ou lien (QR code affichable en salle). ✨
- **[MVP]** Import CSV d'une liste d'étudiants par l'enseignant ou le responsable.
- **[MVP]** Règle de visibilité stricte : un enseignant ne voit que les étudiants de ses classes ; un mentor que ses équipes.
- **[V2]** Co-enseignement : plusieurs enseignants sur une même classe, avec droits différents (titulaire / assistant).
- **[V2]** Années scolaires : archivage des classes en fin d'année, passage au niveau supérieur en un clic.
- **[V3]** Multi-établissements (SaaS) avec isolation complète des données.

## B. Catalogue pédagogique

Structure : **Domaine → Parcours → Notion → (Jeu + Cours + Grand challenge)**.

- **[MVP]** Domaines : Programmation, Linux, Git, Réseaux, Sécurité, Cloud (AWS, GCP)… extensibles sans code.
- **[MVP]** Parcours (ex. « Python débutant », « Linux administrateur junior »), ordonnés en notions.
- **[MVP]** Prérequis entre notions (graphe, pas seulement une liste).
- **[MVP]** Éditeur de contenu enseignant (Markdown/MDX avec blocs interactifs : code exécutable, quiz, schéma).
- **[MVP]** Banque de questions par notion, réutilisable entre challenges.
- **[V2]** Versionnement du contenu : modifier une notion ne casse pas les tentatives déjà faites.
- **[V2]** Duplication et personnalisation d'un parcours existant par un enseignant.
- **[V3]** ✨ Bibliothèque partagée entre enseignants (publier, noter, réutiliser les parcours des collègues).
- **[V3]** ✨ Import de contenu depuis un dépôt Git (contenu « as code »).

## C. Côté ouvert — le jeu

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
- **[V2]** ✨ Monnaie virtuelle (gemmes) pour personnaliser l'avatar, acheter des gels de série ou des indices. Aucune valeur réelle.
- **[V3]** ✨ Événements : « semaine Linux », double XP le week-end, défis inter-classes.

## D. Côté fermé — le cours

- **[MVP]** Leçons par notion : texte, exemples de code exécutables, images, vidéos courtes (lien externe ou fichier compressé).
- **[MVP]** **Instructions** de la semaine rédigées par l'enseignant (ce qu'il faut faire, pour quand).
- **[MVP]** Exercices guidés à la fin de chaque leçon.
- **[MVP]** Suivi de lecture (leçon ouverte, terminée, temps passé).
- **[V2]** ✨ Fiche-résumé téléchargeable (PDF) et **mode hors-ligne** pour réviser sans connexion.
- **[V2]** ✨ Prise de notes personnelles attachées à une leçon.
- **[V3]** ✨ Version audio des leçons (lecture automatique) pour réviser dans les transports.

## E. Planning hebdomadaire et déblocage

- **[MVP]** L'enseignant planifie, **par classe**, les notions de chaque semaine :
  - date d'ouverture du jeu ;
  - date d'ouverture du cours ;
  - fenêtre du grand challenge (ouverture, fermeture, durée max) ;
  - seuil de réussite (ex. 70 %) et nombre de tentatives.
- **[MVP]** Déblocage **automatique** à la date prévue (aucune action manuelle le jour J).
- **[MVP]** La notion suivante n'est accessible qu'après **validation** du challenge précédent (sauf dérogation de l'enseignant).
- **[MVP]** Dérogation individuelle : débloquer, prolonger ou rouvrir pour un étudiant (absence justifiée, handicap, etc.).
- **[V2]** Vue calendrier du semestre par classe ; copier un planning d'une classe à une autre.
- **[V2]** ✨ Rappels automatiques : « Le challenge ferme dans 24 h, il te reste 2 étapes ».

## F. Grand challenge (évaluation)

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
- **[V3]** Mode « examen surveillé en salle » : l'enseignant ouvre le challenge en direct avec un code temporaire.

## G. Suivi enseignant (surveillance bienveillante)

- **[MVP]** Tableau de bord par classe : qui a commencé, avancement par notion, temps passé, dernière connexion.
- **[MVP]** Fiche étudiant : historique, tentatives, réponses, points faibles.
- **[MVP]** **Alertes de décrochage** : inactif depuis X jours, retard sur le planning, échecs répétés.
- **[MVP]** Relance en un clic (message ou notification à un étudiant ou à un groupe filtré).
- **[V2]** ✨ **Carte de chaleur** des notions et questions difficiles pour la classe (où faut-il réexpliquer en cours ?).
- **[V2]** ✨ Statistiques par question (taux de réussite, pièges fréquents) pour améliorer les contenus.
- **[V2]** Export des résultats (CSV/Excel) pour le bulletin officiel.
- **[V2]** Vue multi-classes et comparaison entre classes d'un même niveau.
- **[V3]** ✨ **Score de risque** prédictif d'échec, calculé chaque semaine.
- **[V3]** ✨ Rapport hebdomadaire automatique envoyé par e-mail à l'enseignant (et optionnellement aux parents/tuteurs).

## H. Équipes et mentors

- **[V2]** Création d'équipes par l'enseignant (manuelle ou automatique par niveau équilibré).
- **[V2]** Assignation d'un ou plusieurs mentors par équipe.
- **[V2]** Espace d'équipe : objectifs communs, XP d'équipe, classement des équipes.
- **[V2]** Le mentor voit la progression de ses équipes, commente les tentatives, fait de la **revue de code**.
- **[V2]** ✨ Prise de rendez-vous avec le mentor (créneaux de permanence) et lien de visio.
- **[V3]** ✨ **Programmation en binôme** en temps réel (éditeur partagé).
- **[V3]** ✨ Projets d'équipe sur plusieurs semaines avec jalons (mini-hackathon).

## I. Communauté et entraide

- **[MVP]** Annonces de l'enseignant à sa classe.
- **[V2]** **Forum questions/réponses par notion** ; la réponse validée par l'enseignant rapporte des XP à son auteur ✨.
- **[V2]** Signalement et modération.
- **[V2]** Notifications : dans l'application, par e-mail, et notifications push (application installable).
- **[V3]** ✨ Profil public / **portfolio** de l'étudiant (badges, projets, certificats) partageable à un employeur.

## J. Assistant IA (tuteur)

- **[V2]** ✨ **Indices progressifs** dans le jeu (indice 1 : piste ; indice 2 : plus précis ; jamais la solution complète). Utiliser un indice retire une étoile.
- **[V2]** ✨ Explication d'un message d'erreur en langage simple.
- **[V2]** ✨ Aide à l'enseignant : proposer des questions et des variantes à partir d'une leçon (toujours relues et validées par l'enseignant avant publication).
- **[V2]** **Désactivé automatiquement pendant les grands challenges.**

## K. Certification et reconnaissance

- **[V2]** Attestation de validation d'un parcours (PDF) avec **QR code de vérification** ✨.
- **[V3]** Badges numériques ouverts (Open Badges) exportables.

## L. Administration

- **[MVP]** Gestion des utilisateurs, classes, niveaux, enseignants.
- **[MVP]** Journal d'activité (qui a fait quoi : dérogations, modifications de notes).
- **[V2]** Statistiques d'établissement.
- **[V2]** Paramètres de l'établissement : logo, couleurs, seuils par défaut.

## M. Qualités transverses

- **[MVP]** Mobile d'abord, responsive, utilisable sur petit écran et réseau lent.
- **[MVP]** Accessibilité (clavier, contrastes, lecteurs d'écran).
- **[MVP]** Français par défaut, prêt pour l'anglais (i18n).
- **[V2]** Application installable (PWA) avec révision hors-ligne et synchronisation au retour du réseau.
- **[MVP]** Protection des données personnelles : consentement, export et suppression des données d'un utilisateur, données de mineurs protégées.
- **[V2]** Mode sombre, mode « économie de données » (pas de vidéo automatique, images réduites).
