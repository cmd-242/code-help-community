# 05 — Feuille de route

Durées indicatives pour une petite équipe (1 à 2 développeurs). Chaque phase se termine par une version utilisable par une vraie classe.

## Phase 0 — Fondations (semaines 1-2)

- [ ] Initialiser Next.js 16 (TypeScript, Tailwind v4, App Router, `src/`).
- [ ] ESLint, Prettier, Husky, Vitest, Playwright.
- [ ] Docker Compose local : PostgreSQL + MinIO.
- [ ] Prisma 7 : schéma (`docs/04`), première migration, script de seed.
- [ ] Authentification (e-mail + Google) et rôles.
- [ ] `proxy.ts`, `src/server/permissions.ts` et tests des règles de visibilité.
- [ ] shadcn/ui, thème, mise en page des 4 espaces (étudiant, enseignant, mentor, admin).
- [ ] Intégration continue (GitHub Actions : lint, types, tests, build).

## Phase 1 — MVP « une classe pilote » (semaines 3-10)

Objectif : une classe réelle utilise la plateforme pendant 4 semaines sur **un parcours** (proposé : *Linux débutant* ou *Python débutant*).

- [ ] Organisation : établissement, niveaux, classes, code d'invitation, import CSV.
- [ ] Catalogue : domaines, parcours, notions, leçons MDX.
- [ ] Moteurs de jeu : QCM, Parsons, texte à trous, prédire la sortie, écrire du code (Python via Pyodide), terminal Linux simulé.
- [ ] Carte de progression, étoiles, XP, niveaux, badges de base, série quotidienne.
- [ ] Planning hebdomadaire par classe et déblocage automatique.
- [ ] Grand challenge : tirage aléatoire, chronomètre, sauvegarde auto, correction, rattrapage.
- [ ] Dérogations individuelles.
- [ ] Tableau de bord enseignant + fiche étudiant + alertes de décrochage.
- [ ] Annonces de classe.
- [ ] Contenu d'un parcours complet (6 à 8 notions) rédigé.

**Critère de sortie** : > 70 % des étudiants pilotes actifs chaque semaine pendant 4 semaines.

## Phase 2 — Engagement et collaboration (semaines 11-20)

- [ ] Équipes, mentors, revue de code, prise de rendez-vous.
- [ ] Quêtes, ligues hebdomadaires, monnaie virtuelle, gel de série.
- [ ] Forum par notion avec réponses validées.
- [ ] Notifications (in-app, e-mail, push) et rappels automatiques.
- [ ] Anti-triche : événements d'intégrité, correction serveur, similarité de code.
- [ ] Assistant IA : indices progressifs, explication d'erreurs, aide à la création de questions.
- [ ] Nouveaux moteurs : Git visuel, sous-réseaux, mini-CTF, SQL (PGlite), cartes à répétition espacée.
- [ ] PWA installable + révision hors-ligne.
- [ ] Exports CSV/Excel, carte de chaleur des difficultés, statistiques par question.
- [ ] Attestations PDF avec QR code.

## Phase 3 — Échelle et nouveaux domaines (semaines 21+)

- [ ] Simulateurs réseau (topologie) et cloud (console AWS/GCP simulée, diagrammes d'architecture).
- [ ] Langages compilés via exécuteur isolé (Judge0 auto-hébergé).
- [ ] Bibliothèque partagée de parcours entre enseignants.
- [ ] Multi-établissements (SaaS).
- [ ] Score de risque prédictif et rapports hebdomadaires automatiques.
- [ ] Programmation en binôme temps réel, projets d'équipe, événements.
- [ ] Portfolio public de l'étudiant, Open Badges.
- [ ] Traduction anglaise.
