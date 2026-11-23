# 03 — Architecture technique (100 % Next.js)

## 1. Principe

**Une seule application Next.js** porte tout : pages, API, logique métier, authentification, tâches planifiées et exécution du code des étudiants (dans le navigateur). Pas de back-end séparé.

```
                       ┌──────────────────────────────────────────────┐
 Navigateur / PWA      │            Application Next.js 16            │
 ─────────────────     │                                              │
 React 19 (client)     │  App Router                                  │
 • moteurs de jeu      │  ├─ Server Components  → lecture des données │
 • éditeur de code     │  ├─ Server Actions     → mutations           │
 • Pyodide / Web       │  ├─ Route Handlers     → API, SSE, webhooks, │
 │ Worker / PGlite     │  │                        cron, exports       │
 • terminal simulé     │  ├─ proxy.ts           → garde des routes    │
 • mode hors-ligne     │  └─ src/server/*       → services métier     │
                       └───────────────┬──────────────────────────────┘
                                       │ Prisma
                       ┌───────────────▼──────┐   ┌─────────────────────┐
                       │ PostgreSQL           │   │ Stockage S3         │
                       └──────────────────────┘   │ (R2/MinIO) fichiers │
                                                  └─────────────────────┘
 Services optionnels : e-mail (Resend/SMTP), IA (AI SDK), exécuteur de code
 isolé pour langages compilés (Judge0 auto-hébergé), Redis (temps réel à l'échelle).
```

## 2. Pile technique retenue

| Besoin | Choix | Pourquoi |
|---|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) | Front + back dans un même projet |
| Langage | **TypeScript** strict | Sécurité du code, autocomplétion |
| UI | **React 19**, **Tailwind CSS v4**, **shadcn/ui** | Rapide, cohérent, léger |
| Animations jeu | **Motion** (ex-Framer Motion), **canvas-confetti** | Retours visuels gratifiants |
| Base de données | **PostgreSQL** + **Prisma 7** (configuration dans `prisma.config.ts`) | Relations complexes (classes, rôles, progression) |
| Authentification | **Better Auth** (e-mail + Google, rôles) — alternative : Auth.js v5 | Gestion de session côté serveur, plugins rôles/organisations |
| Validation | **Zod** | Mêmes schémas côté client et serveur |
| Formulaires | **React Hook Form** + Zod | |
| État client du jeu | **Zustand** | Simple pour l'état d'une partie |
| Éditeur de code | **CodeMirror 6** | Bien plus léger que Monaco (important sur mobile / réseau lent) |
| Terminal | **xterm.js** + interpréteur shell simulé | Exercices Linux |
| Schémas (réseau, cloud) | **React Flow** (`@xyflow/react`) | Glisser-déposer de topologies |
| Exécution Python | **Pyodide** (WebAssembly) dans un Web Worker | Aucun serveur nécessaire |
| Exécution JS/TS | **Web Worker** isolé avec délai maximal | |
| SQL | **PGlite** (Postgres en WASM) ou sql.js | Vraie base dans le navigateur |
| Git | **isomorphic-git** + système de fichiers en mémoire | Vraies commandes Git sans serveur |
| E-mails | **Resend** ou SMTP via Nodemailer, gabarits **React Email** | |
| IA | **AI SDK** (Vercel) | Indices, explications d'erreurs |
| Temps réel | **Server-Sent Events** (Route Handlers) ; Redis pub/sub si plusieurs instances | Notifications, tableau de bord en direct |
| Fichiers | Stockage compatible S3 (Cloudflare R2, MinIO) | |
| i18n | **next-intl** | Français par défaut |
| PWA / hors-ligne | Manifest Next.js + **Serwist** (service worker) | |
| Tests | **Vitest** (unitaires), **Playwright** (bout en bout) | |
| Qualité | ESLint, Prettier, Husky + lint-staged | |
| Déploiement | Docker (`output: "standalone"`) sur VPS, **ou** Vercel + Postgres managé (Neon/Supabase) | |

## 3. Organisation du code

```
.
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.ts                  # domaines, un parcours de démo, comptes de test
├─ content/                    # contenus pédagogiques versionnés (MDX + JSON)
│  └─ <domaine>/<parcours>/<notion>/
│     ├─ cours/*.mdx
│     ├─ jeu/etapes.json
│     └─ challenge/banque.json
├─ public/
├─ src/
│  ├─ app/
│  │  ├─ (public)/             # accueil, à propos, vérification de certificat
│  │  ├─ (auth)/               # connexion, inscription, rejoindre une classe
│  │  ├─ (etudiant)/app/       # espace de l'apprenant : carte, notion/[slug] (etape, cours, gardien)
│  │  ├─ (enseignant)/prof/    # classes, planning, suivi, contenus
│  │  ├─ (mentor)/mentor/      # équipes, revues
│  │  ├─ (admin)/admin/        # établissement, utilisateurs
│  │  ├─ api/                  # Route Handlers : auth, sse, cron, exports, webhooks
│  │  ├─ layout.tsx
│  │  └─ manifest.ts
│  ├─ components/
│  │  ├─ ui/                   # shadcn/ui
│  │  └─ shared/
│  ├─ features/                # une fonctionnalité = un dossier
│  │  ├─ classes/
│  │  ├─ planning/
│  │  ├─ progression/
│  │  ├─ challenge/
│  │  ├─ gamification/
│  │  ├─ suivi/
│  │  └─ ...                   # chacun : components/, actions.ts, queries.ts, schemas.ts
│  ├─ universes/               # habillages de jeu : archipel/ (puis metro/)
│  ├─ games/                   # moteurs de mini-jeux
│  │  ├─ registry.ts           # type → { Composant, schéma Zod, correcteur }
│  │  ├─ qcm/
│  │  ├─ parsons/
│  │  ├─ code/
│  │  ├─ terminal/
│  │  └─ ...
│  ├─ runtimes/                # exécution du code dans le navigateur (workers)
│  ├─ server/
│  │  ├─ db.ts                 # client Prisma unique
│  │  ├─ auth.ts
│  │  ├─ permissions.ts        # QUI peut voir/modifier QUOI
│  │  └─ services/             # logique métier pure, testable
│  ├─ lib/                     # utilitaires génériques
│  └─ proxy.ts                 # redirections selon la session et le rôle
└─ tests/
   ├─ unit/
   └─ e2e/
```

## 4. Règles d'architecture

### 4.1 Lecture et écriture
- **Lecture** : dans les Server Components via les fonctions `queries.ts` de chaque feature. Pas d'appel `fetch` vers sa propre API.
- **Écriture** : via **Server Actions** (`actions.ts`), toujours :
  1. vérifier la session ;
  2. valider l'entrée avec Zod ;
  3. vérifier la permission (`src/server/permissions.ts`) ;
  4. appeler un service de `src/server/services` ;
  5. revalider le cache (`revalidatePath` / `revalidateTag`).
- **Route Handlers** uniquement pour ce qui n'est pas une action de formulaire : SSE, exports de fichiers, cron, webhooks, API publique éventuelle.

### 4.2 Permissions (point critique)
- La règle « un enseignant ne voit que ses classes » est appliquée **côté serveur, dans les requêtes**, jamais uniquement en masquant des éléments d'interface. Un enseignant ne voit un étudiant que sur les parcours assignés à sa classe, jamais sa progression libre ailleurs.
- Un apprenant libre n'est visible d'aucun enseignant ; seuls les membres et le mentor de sa guilde voient ce qu'il partage avec elle.
- Toute requête sur des étudiants passe par un filtre de portée, par exemple `studentScopeFor(user)` qui renvoie la clause Prisma `where` adaptée au rôle.
- `proxy.ts` ne fait que des redirections rapides (non connecté → connexion, mauvais espace → accueil) ; il n'est **pas** la seule barrière.

### 4.3 Déblocage des notions sans tâche planifiée
Le statut « débloqué » est **calculé à la lecture** (`src/features/progression/unlock.ts`) :
- **apprenant libre** (cas par défaut, aucun planning) : une notion est ouverte dès que ses prérequis sont validés (gardien précédent vaincu) ;
- **en classe** (option) : il faut en plus que `opensAt <= maintenant` dans le planning de la classe, sauf dérogation.

Aucune tâche cron n'est nécessaire pour ouvrir une notion, donc rien ne peut « oublier » de la débloquer.

Les tâches planifiées (Route Handler `/api/cron/*`, appelé par Vercel Cron ou par le cron du serveur) servent seulement aux **rappels**, **alertes de décrochage** et **rapports hebdomadaires**.

### 4.4 Moteurs de jeu
- Chaque type d'exercice est un **plugin** déclaré dans `src/games/registry.ts` :
  - un **schéma Zod** de sa configuration (stockée en JSON en base) ;
  - un **composant React** qui affiche l'exercice ;
  - une fonction de **correction** pure (exécutable côté serveur pour les challenges).
- Ajouter un domaine = ajouter du **contenu**. Ajouter un **type d'exercice** = ajouter un moteur.

### 4.5 Exécution du code des étudiants
| Langage / outil | Côté jeu (entraînement) | Côté challenge (noté) |
|---|---|---|
| Python | Pyodide dans un Web Worker | Tests cachés relancés côté serveur (phase 2) |
| JavaScript / TS | Web Worker isolé, délai max | Idem |
| SQL | PGlite dans le navigateur | Requête rejouée côté serveur sur une base de test |
| Linux | Shell simulé (système de fichiers virtuel en JS) | Vérification de l'état final côté serveur |
| Git | isomorphic-git en mémoire | Vérification de l'état final du dépôt |
| C, Java, C#… | Exécuteur isolé auto-hébergé (Judge0) via un Route Handler | Idem |

Toutes les exécutions passent par une interface commune `CodeRunner` (`run(langage, code, entrées) → résultat`) pour pouvoir changer d'implémentation sans toucher aux jeux.

Au MVP, les challenges de code peuvent être corrigés dans le navigateur avec des tests révélés seulement à la soumission ; la correction serveur arrive en phase 2 avec l'anti-triche.

### 4.6 Gamification
- Les XP sont enregistrés comme des **événements** (`XpEvent` : qui, combien, pourquoi, quand) et jamais comme un simple compteur modifié : on peut recalculer, auditer, et construire les classements hebdomadaires.
- Les règles de badges sont du code déclaratif dans `features/gamification/badges.ts`, évaluées après chaque événement.

### 4.7 Temps réel
- MVP : rafraîchissement à la navigation + `router.refresh()` après les actions.
- V2 : flux SSE (`/api/sse`) pour les notifications et le tableau de bord enseignant « en direct ». Avec plusieurs instances, diffusion via Redis pub/sub ou `LISTEN/NOTIFY` de Postgres.

### 4.8 Performance et réseau lent
- Server Components par défaut ; `"use client"` uniquement sur les éléments interactifs.
- Chargement **à la demande** des moteurs lourds (Pyodide, xterm, React Flow) avec `next/dynamic` : un étudiant qui fait un QCM ne télécharge pas Python.
- Images via `next/image`, polices via `next/font`.
- Objectif : page d'accueil étudiant < 150 Ko de JavaScript transféré.

### 4.9 Sécurité
- Mots de passe hachés par la librairie d'authentification ; sessions en cookies `httpOnly`.
- Limitation de débit sur la connexion, l'inscription et les soumissions de challenge.
- Le code étudiant ne s'exécute **jamais** dans le processus Node de Next.js.
- Variables d'environnement validées au démarrage (Zod, `src/env.ts`).
- Journal d'audit pour toute action sensible (dérogation, modification de note, changement de rôle).

## 5. Environnements et variables

```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
RESEND_API_KEY=...            # ou SMTP_*
S3_ENDPOINT= / S3_BUCKET= / S3_ACCESS_KEY= / S3_SECRET_KEY=
AI_API_KEY=...                # optionnel (V2)
CRON_SECRET=...               # protège /api/cron/*
JUDGE0_URL=...                # optionnel
```

Environnements : `local` (Docker Compose : Postgres + MinIO), `staging`, `production`.
