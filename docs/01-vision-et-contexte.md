# 01 — Vision et contexte

> Nom de travail : **Code Help Community** (CHC). Le nom définitif reste à choisir.

## 1. L'objectif : l'apprentissage ouvert

Code Help Community est d'abord une plateforme **ouverte à tous** pour apprendre l'informatique en jouant : un autodidacte sans école, un étudiant qui veut aller plus loin, une personne en reconversion. **On peut tout apprendre et progresser sans enseignant.**

Les écoles, les enseignants et les mentors sont une **option** qui s'ajoute par-dessus : ils apportent un rythme, un suivi et de l'accompagnement, mais ne sont jamais nécessaires pour avancer.

## 2. Les problèmes qu'on résout

**Pour l'autodidacte**
- il ne sait pas par où commencer ni dans quel ordre apprendre ;
- il se démotive vite sans rythme, sans échéance, sans personne pour voir ses progrès ;
- les cours en ligne classiques sont passifs (vidéos, lecture) ;
- il n'a aucune preuve concrète de ce qu'il sait faire.

**Pour l'étudiant en école** (et son enseignant)
- l'étudiant s'investit peu entre deux séances et ne révise pas régulièrement ;
- l'effort n'a pas de récompense visible avant l'examen ;
- l'enseignant ne sait pas qui décroche avant qu'il soit trop tard ;
- les étudiants bloqués restent seuls et abandonnent.

## 3. La réponse : un donjon à conquérir, seul ou en classe

Chaque domaine est un **donjon** ; chaque **notion** est un étage. Pour chaque étage :

| | Côté **ouvert** : le jeu | Côté **fermé** : le cours |
|---|---|---|
| But | Donner envie, pratiquer, répéter | Comprendre, structurer, être évalué |
| Contenu | Salles à conquérir, mini-jeux, défis, quêtes | Grimoire : leçons, consignes, exemples |
| Fin | Étoiles, XP, badges | **Grand challenge** (le gardien) qui valide la notion |
| Erreur | Sans pénalité, on recommence | Comptée, tentatives limitées en classe |

### Deux façons d'avancer

| | **Libre** (par défaut) | **En classe** (option) |
|---|---|---|
| Qui | Tout le monde, sans école | Étudiant inscrit dans une classe |
| Choix du parcours | L'apprenant choisit ses royaumes et parcours | L'enseignant assigne des parcours à la classe (l'étudiant peut aussi en suivre d'autres librement) |
| Ouverture d'un étage | Dès que le gardien précédent est vaincu | À la date prévue par l'enseignant **et** après le gardien précédent |
| Gardien | Disponible dès que l'étage est exploré | Disponible pendant la fenêtre fixée par l'enseignant |
| Rythme | **Objectif hebdomadaire choisi par l'apprenant** (XP / semaine), série de jours, rappels | Planning hebdomadaire de l'enseignant |
| Suivi | Tableau de bord personnel, mentors de la communauté | Enseignant et mentors de la classe |
| Entraide | Forum, guildes (équipes ouvertes), ligues publiques | Équipes de classe, classement de classe |

Une même personne peut être les deux : un étudiant suit les parcours de sa classe au rythme de l'enseignant, et explore d'autres royaumes librement.

### Le cycle en classe (option)

```
Lundi            Pendant la semaine                         Fin de semaine
──────────────   ────────────────────────────────────────   ──────────────────────
L'enseignant     L'étudiant explore l'étage :               LE GARDIEN
ouvre un      →  • les salles du donjon (jeu)            →  (grand challenge)
étage pour       • le grimoire (cours, consignes)               ├─ vaincu → étage validé,
sa classe        L'enseignant voit qui avance                   │   l'escalier s'ouvre
                 et qui décroche                                └─ raté → rattrapage, 2e essai
```

## 4. Les acteurs

| Rôle | Obligatoire ? | Ce qu'il fait | Ce qu'il voit |
|---|---|---|---|
| **Apprenant** | Oui (c'est tout le monde) | Choisit ses parcours, joue, lit le grimoire, affronte les gardiens, rejoint des guildes | Sa progression, ses guildes, les ligues publiques, et sa classe s'il en a une |
| **Mentor** | Non | Coache des équipes ou des guildes (dans une classe ou bénévole dans la communauté), relit du code | Les membres de ses équipes |
| **Enseignant** | Non | Crée des classes, choisit les parcours, planifie les ouvertures, suit et relance | **Uniquement** les étudiants de ses classes |
| **Responsable d'établissement** | Non | Gère niveaux, classes, enseignants, statistiques | Tout son établissement |
| **Super-admin** | Plateforme | Gère le catalogue commun, les établissements, la modération | Tout |

Organisation **optionnelle** des écoles : Établissement → Niveau (L1, BTS1…) → Classe → Étudiants. Un enseignant peut avoir plusieurs classes sur plusieurs niveaux. Un apprenant libre n'appartient à aucun établissement.

## 5. Les domaines couverts

La plateforme est **multi-domaines dès sa conception** (jamais de logique codée « en dur » pour un langage) :

- **Programmation** : algorithmique, Python, JavaScript/TypeScript, Java, C, C#, PHP, SQL, puis d'autres ;
- **Systèmes** : Linux (shell, fichiers, droits, processus, scripts bash) ;
- **Outils** : Git et GitHub, Docker ;
- **Réseaux** : modèle OSI/TCP-IP, adressage IP et sous-réseaux, routage, DNS, HTTP ;
- **Sécurité** : bonnes pratiques, OWASP, cryptographie de base, CTF d'initiation ;
- **Cloud** : AWS, Google Cloud (IAM, stockage, calcul, réseau virtuel, coûts) ;
- et tout autre domaine ajouté plus tard par simple contenu (pas de code nouveau sauf pour un nouveau type de mini-jeu).

## 6. Principes directeurs

1. **Apprendre sans permission** : tout le catalogue est accessible sans école ni enseignant. Les classes ajoutent un cadre, elles n'enlèvent rien.
2. **Un rythme pour chacun** : l'apprenant libre se fixe son objectif ; en classe, l'enseignant donne le rythme. Dans les deux cas, la plateforme rend ce rythme agréable.
3. **Récompenser l'effort régulier**, pas seulement le talent : séries, progrès personnel, ligues de niveau équivalent.
4. **Ne jamais humilier** : classements anonymisables, pas de « dernier de la classe » affiché.
5. **Feedback immédiat** sur chaque action dans le jeu.
6. **Visibilité pour l'enseignant**, strictement limitée à ses classes ; un apprenant libre n'est visible de personne sans son accord.
7. **Pensé pour des connexions lentes et des smartphones** : pages légères, mode hors-ligne pour réviser, peu de données consommées.
8. **Tout dans une seule application Next.js** (front, back, API, tâches planifiées).

## 7. Indicateurs de réussite

- Apprenants libres actifs chaque semaine et taux de rétention à 4 semaines.
- Part des apprenants qui atteignent leur objectif hebdomadaire.
- Taux d'étudiants actifs chaque semaine dans les classes (objectif : > 80 %).
- Taux de réussite au grand challenge du premier coup.
- Temps moyen de révision hebdomadaire par étudiant.
- Nombre d'étudiants « à risque » détectés **avant** l'échec et relancés.
- Note moyenne aux examens officiels comparée aux années précédentes.

## 8. Questions ouvertes (à trancher par le porteur du projet)

- Modèle économique : gratuit pour les apprenants libres ? Offre payante pour les établissements ?
- Un seul établissement au départ, ou plateforme ouverte à plusieurs établissements (SaaS) ?
- Nombre d'étudiants visé la première année (dimensionne l'hébergement).
- Les étudiants travaillent-ils surtout sur smartphone ou sur ordinateur ?
- Qualité de la connexion internet des étudiants à la maison.
- Hébergement : serveur propre (VPS) ou plateforme gérée (Vercel + base managée) ?
- En classe, le grand challenge compte-t-il dans la note officielle ? (impact sur le niveau d'anti-triche exigé)
- Les attestations des apprenants libres doivent-elles avoir une valeur (examen surveillé, partenariats) ?
- Langue : français uniquement, ou français + anglais ?
