# 06 — Univers de jeu : design, son et animations

## Deux univers, deux étapes du voyage

| | **L'Archipel** (débuts) | **Néo-Métro** (parcours avancés) |
|---|---|---|
| État | Construit | À venir |
| Pour qui | Débutants, personnes intimidées par l'informatique | Apprenants qui maîtrisent les bases |
| Carte | Des îles reliées par une route maritime | Un plan de métro : un domaine = une ligne |
| Notion | Une île | Une station |
| Épreuves (côté ouvert) | Les criques, 3 bouées par crique | Les rames |
| Cours (côté fermé) | Le journal de bord | Le manuel du réseau |
| Grand challenge | Le gardien de l'île (créature marine) | Le pare-feu à pirater |
| Ambiance | Plein jour, lagon, sable, bois | Ville de nuit, néons |

Le passage de l'Archipel à la ville est un **grand moment** (le bateau accoste au port de Néo-Métro). Un apprenant déjà avancé peut commencer directement en ville (test de positionnement, phase 3). Une **collection de cartes** fait le lien entre les deux univers : une compétence réussie = une carte, un gardien vaincu = une carte légendaire, le coffre de la semaine rend une carte brillante. Règles dans `src/features/collection/rules.ts`, cartes du parcours dans `content/<parcours>/cards.ts`.

## Comment c'est construit

- Le contenu choisit son univers : `Track.universe` (`"archipel"` | `"metro"`) et `Track.world` (nom de la carte).
- Les notions ont un nom de lieu neutre (`place`) et une position (`position`) : ni « étage », ni « île » dans le code.
- Les routes sont neutres : `/app/notion/[slug]`, `/etape/[id]`, `/cours/[id]`, `/gardien`.
- Les **jetons de rôle** (`page`, `surface`, `ink`, `muted`, `primary`, `accent`, `success`, `info`…) sont communs à tous les univers ; leurs valeurs sont définies dans `src/app/globals.css`. Un nouvel univers les redéfinira sous `[data-universe="metro"]`.
- Les illustrations propres à un univers vivent dans `src/universes/<univers>/` (Archipel : mer, îles, bateau, créatures, carte, accueil).
- Les noms d'effets sonores sont neutres (`enter`, `whoosh`, `bossHit`…) : chaque univers peut fournir sa version.

## Archipel : palette

| Rôle | Hex | Usage | Contraste |
|---|---|---|---|
| `page` | `#e9f7f5` | Fond (écume du lagon) | |
| `surface` | `#fff8ec` | Cartes « papier » | |
| `ink` | `#13324b` | Texte | 12,5:1 sur surface |
| `muted` | `#4a6577` | Texte secondaire | 5,8:1 sur surface |
| `primary` | `#e8503f` | Action principale (corail), texte blanc en gras ≥ 18 px | 3,7:1 |
| `accent` | `#ffcf6b` | XP, soleil, trous à remplir | 9:1 avec ink |
| `success` | `#6bcb77` / `#2f7d4a` | Réussite, île conquise | 4,8:1 (foncé sur surface) |
| `info` | `#2ec4d6` / `#147a91` | Mer, liens, progression | 4,7:1 (foncé sur surface) |
| `danger-text` | `#b5442f` | Erreurs, gardiens | 5,2:1 |
| décor | `sea`, `sand`, `wood` | Mer, sable, planches de bois | |

## Typographie

- **Fredoka** : titres et boutons (arrondie, chaleureuse, très lisible sur téléphone).
- **Nunito** : texte courant.
- **JetBrains Mono** : uniquement le code et les commandes.

Polices embarquées dans `src/fonts/` (aucun appel réseau au build).

## Son (Archipel)

Synthétisé en direct par `src/features/sound/sound-engine.ts` (Web Audio), aucun fichier audio.

- Ambiance : deux couches de vagues, mouettes au loin, cloche de bateau, craquements de la coque, notes de marimba (pentatonique majeure).
- Effets : `hover` (goutte), `click`/`pick`/`drop` (bois), `page`, `correct` (marimba), `wrong` (« bonk » + plouf), `xp` (pièce), `levelUp` (tambour d'acier + cloche), `unlock` (coffre + pièces), `enter` (cloche + voile), `whoosh` (éclaboussure), `bossHit`, `bossRoar` (grondement + bulles), `victory`, `defeat`.
- Règles : démarre au premier geste, se coupe quand l'onglet est caché, bouton de son toujours visible, choix mémorisé.

## Animations

- Bibliothèque : **Motion** (`motion/react`). Vagues et bateau qui flotte en CSS pur.
- Le moment fort de l'accueil : **toucher la mer fait naviguer le bateau**.
- Les animations répondent aux actions : bateau qui largue les amarres, coffre qui s'ouvre, gardien repoussé, bateau qui coule à la défaite.
- `prefers-reduced-motion` est respecté partout.

## Règles pour la suite

1. Une seule « folie » par écran ; le reste reste calme et lisible.
2. Utiliser les jetons de rôle, jamais une couleur en dur, sauf dans les illustrations de `src/universes/`.
3. Tout nouveau son passe par le moteur sonore (pas de fichier audio).
4. Tester chaque écran à 360 px de large et avec le son coupé.
5. Ne jamais dessiner de personnage, logo ou mascotte existants : uniquement des créations originales.
