<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Instructions pour le projet Code Help Community

Ce fichier s'adresse aux développeurs **et** aux assistants IA (Claude, Copilot, Cursor…) qui travaillent sur ce dépôt. Lis-le avant toute modification.

## Contexte en 30 secondes

Plateforme **ouverte** d'apprentissage de l'informatique en jouant. **L'utilisateur de base est un apprenant libre (autodidacte), sans école ni enseignant** : il choisit ses parcours et progresse à son rythme. Les écoles, enseignants et mentors sont une **option** qui ajoute un rythme et un suivi, jamais une condition pour apprendre.

Chaque notion (une île de l'Archipel, plus tard une station de Néo-Métro) a :
- un **côté ouvert** : un jeu en étapes (XP, étoiles, badges, séries) ;
- un **côté fermé** : le cours (le journal de bord) et les consignes ;
- un **grand challenge** (le gardien) qui valide la notion et ouvre la suivante.

Déblocage : **libre** par défaut (gardien précédent vaincu) ; **en classe** (option), le planning de l'enseignant s'ajoute.

Rôles : apprenant (tout le monde), mentor, enseignant (plusieurs classes possibles, il ne voit **que** ses classes), responsable d'établissement, super-admin.
Domaines : programmation (plusieurs langages), Linux, Git, réseaux, sécurité, AWS, Google Cloud… extensibles par contenu.

Documentation détaillée dans `docs/` :
1. `docs/01-vision-et-contexte.md` — problème, cycle hebdomadaire, acteurs, principes
2. `docs/02-fonctionnalites.md` — catalogue complet des fonctionnalités et priorités (MVP / V2 / V3)
3. `docs/03-architecture-nextjs.md` — pile technique et règles d'architecture
4. `docs/04-modele-de-donnees.md` — schéma Prisma de référence
5. `docs/05-roadmap.md` — phases et cases à cocher
6. `docs/06-univers.md` — univers de jeu (Archipel, Néo-Métro), design, son, animations

## Pile technique (ne pas en changer sans décision écrite)

- **Next.js 16** App Router, **tout** se fait dans cette application (pas de back-end séparé).
- TypeScript **strict**, React 19, Tailwind CSS v4, **univers de jeu maison** (Archipel, puis Néo-Métro : `docs/06-univers.md`), Motion pour les animations. shadcn/ui seulement pour les futurs écrans d'administration.
- PostgreSQL + **Prisma 7** (`prisma.config.ts`, client généré dans `src/generated/prisma`).
- Better Auth (e-mail + Google), Zod, React Hook Form, Zustand (état du jeu), next-intl.
- Exécution du code étudiant **dans le navigateur** (Web Worker, Pyodide, PGlite, isomorphic-git, shell simulé).
- Tests : Vitest + Playwright. Gestionnaire de paquets : **pnpm**.

Avant d'utiliser une API de Next.js, vérifie la documentation correspondant à la version installée (`node_modules/next/dist/docs` si présente, sinon nextjs.org/docs). Ne te fie pas à des habitudes de Next 13/14/15 : en Next 16, `middleware.ts` s'appelle `proxy.ts`, et `params`/`searchParams`/`cookies()`/`headers()` sont asynchrones.

## Commandes

```bash
pnpm install
cp .env.example .env          # puis renseigner BETTER_AUTH_SECRET
docker compose up -d          # Postgres + MinIO en local
pnpm db:generate              # génère le client Prisma (src/generated/prisma)
pnpm db:migrate               # crée / applique les migrations
pnpm dev                      # http://localhost:3000
pnpm lint && pnpm typecheck && pnpm test   # à lancer avant chaque commit
pnpm test:integration         # tests sur une vraie base (DATABASE_URL)
```

La CI GitHub (`.github/workflows/ci.yml`) lance tout cela sur une base PostgreSQL, plus un essai d'inscription. À venir : `pnpm db:seed` et `pnpm test:e2e` (Playwright). Le contenu pédagogique vit dans `content/` et est validé par `tests/unit/content.test.ts`.

## Règles obligatoires

### Données et sécurité
1. **Permissions côté serveur** : toute lecture/écriture concernant des étudiants passe par `src/server/permissions.ts`. Un enseignant ne voit que ses classes, un mentor que ses équipes. Masquer un bouton n'est **jamais** une protection.
2. Chaque Server Action suit l'ordre : session → validation Zod → permission → service → revalidation.
3. Ne jamais envoyer au client les réponses ou tests cachés (`Question.config`) : passer par `toPublicQuestion()`.
4. Le code des étudiants ne s'exécute **jamais** dans le processus Node de Next.js.
5. Toute action sensible (dérogation, note modifiée, rôle changé) écrit dans `AuditLog`.
6. Pas de secret dans le code ; variables d'environnement validées dans `src/env.ts`.

### Architecture
7. **Server Components par défaut**. `"use client"` seulement pour l'interactivité, le plus bas possible dans l'arbre.
8. Lecture des données dans `features/<x>/queries.ts`, écriture dans `features/<x>/actions.ts`, logique métier dans `src/server/services/`. Pas de `fetch` vers sa propre API depuis un Server Component.
9. Route Handlers (`app/api/`) uniquement pour SSE, cron, exports, webhooks.
10. Le déblocage d'une notion est **calculé à la lecture** (`features/progression/unlock.ts`) : prérequis, plus dates du planning et dérogations **seulement en classe**. Ne pas créer de cron pour débloquer.
10 bis. **Toute fonctionnalité doit marcher pour un apprenant libre** (sans établissement, sans classe, sans enseignant). Le cadre scolaire s'ajoute par-dessus et ne doit jamais devenir un prérequis.
11. Les XP sont des **événements** (`XpEvent`), jamais un compteur qu'on incrémente. **Le serveur recalcule toujours les XP** (`src/server/services/progress.ts`) : le navigateur envoie des actions (`ProgressOp`), jamais des montants.
11 bis. Sans compte, on peut tout jouer (progression sur l'appareil). Avec un compte, la progression est synchronisée et le serveur fait foi. La progression référence le contenu par identifiant (slug, id d'étape, de leçon, de carte), sans clé étrangère.
12. Nouveau type d'exercice = nouveau moteur dans `src/games/<type>/` déclaré dans `src/games/registry.ts` (schéma Zod + composant + correcteur pur). Nouveau domaine = **contenu uniquement**.
13. Charger les modules lourds (Pyodide, xterm, React Flow, CodeMirror) avec `next/dynamic`.

### Code
14. Noms de code (variables, fonctions, tables) **en anglais** ; textes visibles par l'utilisateur **en français**, via next-intl (pas de texte en dur dans les composants).
15. Fichiers en `kebab-case`, composants en `PascalCase`, un composant par fichier.
16. Pas de `any`. Les types viennent de Prisma et de Zod (`z.infer`).
17. Toute règle métier (déblocage, calcul de score, attribution de badge, série) a des **tests unitaires**.
18. Mobile d'abord : tester chaque écran à 360 px de large. Accessibilité : navigation clavier, `aria-*`, contrastes.
18 bis. Couleurs via les jetons de rôle (`bg-surface`, `text-ink`, `bg-primary`…), jamais en dur hors de `src/universes/`. Code neutre : pas de « île » ni « étage » dans les noms de code (`place`, `position`). Sons via `useSound()` uniquement (synthèse Web Audio, jamais de fichier audio) ; toujours respecter `prefers-reduced-motion`.
18 ter. Avec `cacheComponents`, ne jamais lire l'heure (`new Date()`) ni `Math.random()` pendant le rendu : le faire après hydratation, dans un gestionnaire d'événement ou dans une Server Action.

### Git
19. Branches : `feat/…`, `fix/…`, `docs/…`, `chore/…`. Pas de commit direct sur `main`.
20. Messages de commit au format Conventional Commits (`feat(planning): …`).
21. Une Pull Request = une fonctionnalité, avec captures d'écran si l'interface change.
22. Quand une fonctionnalité de `docs/05-roadmap.md` est terminée, coche-la dans la même PR.

## Vocabulaire du domaine

| Terme (UI, français) | Modèle (code) | Définition |
|---|---|---|
| Apprenant | `User` | Toute personne qui apprend, avec ou sans école |
| Inscription à un parcours | `TrackEnrollment` | Parcours suivi, en mode libre (`FREE`) ou en classe (`CLASSROOM`) |
| Guilde | `Team` (`GUILD`) | Équipe ouverte d'apprenants libres |
| Établissement | `Institution` | École ou université (optionnel) |
| Niveau | `Level` | L1, L2, BTS1… |
| Classe | `Classroom` | Groupe d'étudiants suivi par un ou plusieurs enseignants (optionnel) |
| Domaine | `Domain` | Python, Linux, Git, Réseau, Sécurité, AWS… |
| Parcours | `Track` | Suite ordonnée de notions dans un domaine |
| Notion | `Notion` | Unité : jeu + cours + grand challenge (une île dans l'Archipel) |
| Étape | `Stage` | Une série d'épreuves du jeu (une crique dans l'Archipel) |
| Leçon | `Lesson` | Une page de cours (le journal de bord dans l'Archipel) |
| Univers | `Track.universe` | Habillage d'un parcours : `archipel` (débuts) ou `metro` (avancé) |
| Grand challenge | `Challenge` | Test final qui valide la notion (le gardien) |
| Déblocage | `NotionRelease` | Planning d'une notion pour une classe |
| Dérogation | `StudentOverride` | Exception individuelle accordée par l'enseignant |
| Équipe | `Team` (`CLASS_TEAM`) | 3 à 6 étudiants d'une classe, coachés par un mentor |
