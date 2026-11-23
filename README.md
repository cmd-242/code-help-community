# Code Help Community

**Apprendre l'informatique en jouant, au rythme de sa classe.**

Plateforme web où les étudiants révisent chez eux en jouant, pendant que l'enseignant pilote le rythme et suit la progression de chacun.

## Le principe

1. Chaque semaine, l'enseignant **débloque une ou plusieurs notions** pour sa classe.
2. L'étudiant révise :
   - côté **jeu** : des étapes à réussir, des étoiles, des XP, des badges, des séries de jours ;
   - côté **cours** : les leçons et les consignes de la semaine.
3. En fin de semaine, il passe le **grand challenge** de la notion. Validé : la notion suivante s'ouvre. Raté : un rattrapage ciblé, puis une nouvelle tentative.
4. L'enseignant voit en direct qui avance, qui bloque et qui décroche, et peut relancer.

Enseignants (une ou plusieurs classes), étudiants, mentors qui coachent des équipes et responsables d'établissement se retrouvent sur la même plateforme.

Domaines prévus : programmation (Python, JavaScript, Java, C, SQL…), Linux, Git, réseaux, sécurité, AWS, Google Cloud, et d'autres à venir.

## Technique

Une seule application **Next.js 16** (App Router) pour le front, le back et l'API · TypeScript · PostgreSQL + Prisma 7 · Tailwind CSS + shadcn/ui · exécution du code des étudiants directement dans le navigateur.

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
