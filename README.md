# Code Help Community

**Apprendre l'informatique en jouant, à son rythme. Seul, ou avec sa classe.**

Plateforme web ouverte où chacun apprend l'informatique en jouant, à son rythme, sans avoir besoin d'une école. Les enseignants et les mentors peuvent, en option, y amener leurs classes pour donner un rythme et suivre la progression.

## Le principe

1. L'apprenant choisit un **royaume** (Linux, Python, Git, réseaux, cloud…) : chaque notion est un étage du donjon.
2. Il progresse :
   - côté **jeu** : des étapes à réussir, des étoiles, des XP, des badges, des séries de jours ;
   - côté **cours** : le grimoire, avec les leçons et les consignes.
3. Il affronte le **gardien** (grand challenge) de la notion. Vaincu : l'étage suivant s'ouvre. Raté : il révise et retente.
4. Il se fixe son propre **objectif hebdomadaire** ; série de jours, XP et niveaux entretiennent la motivation.

**En option, avec une classe** : l'enseignant ouvre un étage par semaine, voit qui avance et qui décroche, et peut relancer. Des mentors coachent des équipes de classe ou des guildes d'autodidactes.

Domaines prévus : programmation (Python, JavaScript, Java, C, SQL…), Linux, Git, réseaux, sécurité, AWS, Google Cloud, et d'autres à venir.

## Technique

Une seule application **Next.js 16** (App Router) pour le front, le back et l'API · TypeScript · PostgreSQL + Prisma 7 · Tailwind CSS + système de design « Donjon » · exécution du code des apprenants directement dans le navigateur.

## Documentation

| Document | Contenu |
|---|---|
| [AGENTS.md](AGENTS.md) | Instructions et règles pour les développeurs et les assistants IA |
| [Vision et contexte](docs/01-vision-et-contexte.md) | Problème, cycle hebdomadaire, acteurs, principes |
| [Fonctionnalités](docs/02-fonctionnalites.md) | Catalogue complet, priorisé MVP / V2 / V3 |
| [Architecture Next.js](docs/03-architecture-nextjs.md) | Pile technique, organisation du code, règles |
| [Modèle de données](docs/04-modele-de-donnees.md) | Schéma Prisma de référence |
| [Feuille de route](docs/05-roadmap.md) | Phases et tâches |
| [Univers Donjon](docs/06-design-donjon.md) | Design, son, animations |

## Lancer le projet

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm test           # tests unitaires
```

La version actuelle fonctionne sans base de données : la progression est stockée dans le navigateur (mode démo).

## État

Phase 0 en cours : l'espace étudiant est jouable (accueil, carte du donjon, 3 étages Linux, mini-jeux, grimoire, combats de gardiens, son et animations). Prochaine étape : comptes, classes et base de données — voir la [feuille de route](docs/05-roadmap.md).
