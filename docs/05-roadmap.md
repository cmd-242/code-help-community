# 05 — Feuille de route

Durées indicatives pour une petite équipe (1 à 2 développeurs). Chaque phase se termine par une version utilisable par une vraie classe.

## Phase 0 — Fondations (semaines 1-2)

- [x] Initialiser Next.js 16 (TypeScript, Tailwind v4, App Router, `src/`).
- [x] ESLint, Vitest.
- [ ] Prettier, Husky, Playwright.
- [x] Docker Compose local : PostgreSQL + MinIO.
- [x] Prisma 7 : schéma et `prisma.config.ts`.
- [ ] Première migration, script de seed, client `src/server/db.ts`.
- [ ] Authentification (e-mail + Google) et rôles.
- [ ] `proxy.ts`, `src/server/permissions.ts` et tests des règles de visibilité.
- [x] Univers Archipel (design, sons, animations) et structure multi-univers (voir `docs/06`).
- [ ] Univers Néo-Métro pour les parcours avancés, passage du port à la ville.
- [x] Collection de cartes : une compétence réussie = une carte, maîtrise 1 à 3, carte légendaire par gardien, coffre de la semaine (carte brillante). Stockée sur l'appareil en démo.
- [ ] Mise en page des espaces enseignant, mentor, admin.
- [ ] Intégration continue (GitHub Actions : lint, types, tests, build).

## Phase 1 — MVP « apprentissage libre » (semaines 3-10)

Objectif : n'importe qui peut créer un compte, choisir un parcours et progresser seul, sans école. Pilote : un parcours complet (*Linux débutant*) puis *Python débutant*.

- [ ] Comptes (e-mail + Google), profil, pseudonyme.
- [ ] Progression enregistrée en base (`TrackEnrollment`, `NotionProgress`, `StageAttempt`, `XpEvent`) à la place du stockage local de la démo.
- [x] Déblocage libre : une notion s'ouvre dès que le gardien précédent est vaincu.
- [x] Objectif hebdomadaire personnel, série de jours, XP, niveaux, étoiles (en démo).
- [ ] Badges.
- [x] Moteurs de jeu : QCM, Parsons, texte à trous, prédire la sortie.
- [ ] Moteurs : écrire du code (Python via Pyodide), terminal Linux simulé.
- [x] Grand challenge : tirage aléatoire et correction côté serveur, chronomètre, combat de gardien.
- [ ] Grand challenge : tentatives enregistrées, délai de recharge après une défaite, rattrapage ciblé.
- [ ] Catalogue : choisir parmi plusieurs royaumes et parcours.
- [ ] Contenu Linux débutant complet (îles 1 à 3 rédigées, 4 à 6 à écrire), puis Python débutant.
- [ ] Rappels choisis par l'apprenant (notifications, e-mail).

**Critère de sortie** : 40 % des nouveaux apprenants encore actifs après 4 semaines.

## Phase 2 — Classes, enseignants et communauté (semaines 11-20)

Objectif : une classe pilote utilise la plateforme 4 semaines ; les autodidactes trouvent de l'entraide.

- [ ] Classes (avec ou sans établissement), code d'invitation, import CSV, parcours assignés.
- [ ] Planning hebdomadaire par classe, dérogations individuelles. *(logique de déblocage déjà prête et testée)*
- [ ] Tableau de bord enseignant, fiche étudiant, alertes de décrochage, annonces.
- [ ] Permissions serveur (`src/server/permissions.ts`) et journal d'audit.
- [ ] Guildes ouvertes, équipes de classe, mentors (de classe ou bénévoles), revue de code.
- [ ] Ligues hebdomadaires publiques, quêtes, monnaie virtuelle, gel de série.
- [ ] Forum par notion avec réponses validées.
- [ ] Anti-triche pour les classes : événements d'intégrité, similarité de code.
- [ ] Assistant IA : indices progressifs, explication d'erreurs.
- [ ] Nouveaux moteurs : Git visuel, sous-réseaux, mini-CTF, SQL (PGlite), répétition espacée.
- [ ] PWA installable + révision hors-ligne. Attestations PDF avec QR code.

**Critère de sortie** : > 70 % des étudiants pilotes actifs chaque semaine pendant 4 semaines.

## Phase 3 — Échelle et nouveaux domaines (semaines 21+)

- [ ] Test de positionnement, parcours « carrière » multi-royaumes, projets guidés pour le portfolio.
- [ ] Simulateurs réseau (topologie) et cloud (console AWS/GCP simulée, diagrammes d'architecture).
- [ ] Langages compilés via exécuteur isolé (Judge0 auto-hébergé).
- [ ] Bibliothèque partagée de parcours (enseignants et contributeurs).
- [ ] Multi-établissements (SaaS), statistiques d'établissement, exports.
- [ ] Score de risque prédictif et rapports hebdomadaires automatiques.
- [ ] Programmation en binôme temps réel, projets d'équipe, événements.
- [ ] Portfolio public, Open Badges.
- [ ] Traduction anglaise.
