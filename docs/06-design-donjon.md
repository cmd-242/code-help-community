# 06 — Univers « Donjon » : design, son et animations

## Concept

La progression est une **descente dans un donjon**. Chaque notion est un **étage**. Le grand challenge est le **gardien** qui garde l'escalier vers l'étage suivant. Un apprenant libre descend à son rythme ; en classe, l'enseignant ouvre un étage par semaine.

| Concept pédagogique | Dans le jeu |
|---|---|
| Parcours | Un donjon (ex. *Les Catacombes du Shell*) |
| Notion | Un étage (*Étage −1 : La Salle des Échos*) |
| Côté ouvert (jeu) | Les salles du donjon, à conquérir avec 3 cœurs |
| Côté fermé (cours) | Le grimoire (pages de parchemin) |
| Grand challenge | Le combat contre le gardien (sablier, barre de vie) |
| Domaine | Un royaume (Linux, Python, Git, Réseaux…) |

## Palette

| Nom | Hex | Usage |
|---|---|---|
| Abîme | `#0e1a1f` | Fond (pierre de grotte bleu-vert, jamais noir pur) |
| Pierre | `#1f3138` | Cartes, salles, boutons secondaires |
| Torche | `#f2a541` | Action principale, XP, progression, lumière |
| Braise | `#e4572e` | Danger, erreurs, gardiens, cœurs |
| Mousse | `#7fe0c2` | Magie, réussite, étages validés |
| Parchemin | `#e9dcc0` | Texte |

Les jetons sont déclarés dans `src/app/globals.css` (`@theme`).

## Typographie

- **Grenze Gotisch** : titres et boutons (gothique, gravé dans la pierre).
- **Alegreya Sans** : texte courant, consignes, questions.
- **JetBrains Mono** : uniquement le code et les commandes.

Les polices sont dans `src/fonts/` (aucun appel réseau au build).

## Son

Tout est **synthétisé en direct** par `src/features/sound/sound-engine.ts` (Web Audio API) : aucun fichier audio, rien à télécharger, aucun problème de droits.

- Ambiance : bourdon grave, vent dans les galeries, gouttes d'eau, crépitements de torche, harpe lointaine en ré dorien.
- Effets : `hover`, `click`, `pick`, `drop`, `page`, `correct`, `wrong`, `xp`, `levelUp`, `unlock`, `door`, `torch`, `bossHit`, `bossRoar`, `victory`, `defeat`.
- Règles : le son ne démarre qu'au **premier geste** de l'utilisateur, se coupe quand l'onglet est caché, et le bouton de son est toujours visible. Le choix est mémorisé.
- Usage : `const { play } = useSound(); play("unlock");` ou la prop `sfx` des `RuneButton` / `RuneLink`.

## Animations

- Bibliothèque : **Motion** (`motion/react`).
- Les animations **répondent à une action** (porte qu'on pousse, gardien frappé, étoiles gagnées). Les animations permanentes se limitent aux braises, au scintillement des torches et au gardien qui flotte.
- `prefers-reduced-motion` est respecté partout (CSS global, braises, torche, confettis).

## Composants clés

| Composant | Rôle |
|---|---|
| `components/fx/torch-reveal.tsx` | Accueil : la torche (pointeur ou doigt) révèle les commandes gravées dans le mur |
| `components/fx/embers.tsx` | Braises qui montent (un seul canvas, léger) |
| `components/ui/rune-button.tsx` | Boutons gravés avec son (`torch`, `stone`, `ember`, `moss`) |
| `components/hud/player-hud.tsx` | Blason de niveau, jauge d'XP en or fondu, série, son |
| `components/hud/level-up-watcher.tsx` | Célébration de passage de niveau, où qu'il arrive |
| `features/map/descent-map.tsx` | Carte de descente des étages |
| `features/play/stage-player.tsx` | Salle : porte, cœurs, combo, victoire / défaite |
| `features/guardian/guardian-fight.tsx` | Combat contre le gardien |

## Règles pour la suite

1. Garder une seule « folie » par écran ; le reste reste calme et lisible.
2. Tout nouveau son passe par le moteur sonore (pas de fichier mp3).
3. Tester chaque écran à 360 px de large et avec le son coupé.
4. Ne jamais dessiner de personnage, logo ou mascotte existants : uniquement des créations originales.
