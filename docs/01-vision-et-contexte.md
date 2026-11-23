# 01 — Vision et contexte

> Nom de travail : **Code Help Community** (CHC). Le nom définitif reste à choisir.

## 1. Le problème

Des étudiants en informatique **s'investissent peu** dans leurs cours : peu de motivation, pas de révision régulière entre deux séances, et l'enseignant ne sait pas qui décroche avant l'examen.

Les causes typiques :

- le cours est perçu comme passif (lire, écouter) ;
- l'effort n'a pas de récompense visible avant l'examen final ;
- il n'y a ni rythme ni échéance courte qui oblige à réviser chaque semaine ;
- l'enseignant n'a aucune visibilité sur le travail fait à la maison ;
- les étudiants bloqués restent seuls et abandonnent.

## 2. La réponse : apprendre en jouant, au rythme de la classe

Une plateforme web (mobile d'abord) où l'étudiant **apprend chez lui en jouant**, pendant que l'enseignant **pilote le rythme et suit la progression**.

### Le cycle hebdomadaire (cœur du produit)

```
Lundi            Pendant la semaine                         Fin de semaine
──────────────   ────────────────────────────────────────   ──────────────────────
L'enseignant     L'étudiant révise la notion :              GRAND CHALLENGE
débloque une  →  • Côté OUVERT : le jeu (étapes, niveaux) → (test chronométré)
ou plusieurs     • Côté FERMÉ : le cours, les instructions      │
notions          L'enseignant suit en direct qui avance         ├─ Réussi → notion VALIDÉE,
pour sa classe   et qui décroche                                │   la suite se débloque
                                                                └─ Échoué → rattrapage
                                                                    puis 2e tentative
```

### Deux faces pour chaque notion

| | Côté **ouvert** (jeu) | Côté **fermé** (cours) |
|---|---|---|
| But | Donner envie, pratiquer, répéter | Comprendre, structurer, être évalué |
| Accès | Libre dès que la notion est débloquée | Ouvert selon le planning de l'enseignant |
| Contenu | Mondes, étapes, mini-jeux, défis, quêtes | Leçons, instructions, exemples, exercices guidés |
| Fin | Étoiles, XP, badges | **Grand challenge** qui valide la notion |
| Erreur | Sans pénalité, on recommence | Comptée, tentatives limitées |

## 3. Les acteurs

| Rôle | Ce qu'il fait | Ce qu'il voit |
|---|---|---|
| **Étudiant** | Joue, suit les cours, passe les challenges, rejoint une équipe | Ses notions, sa progression, son équipe, le classement de sa classe |
| **Enseignant** | Crée/choisit les contenus, planifie les déblocages, suit et relance | **Uniquement** les étudiants de ses classes (une ou plusieurs classes, un ou plusieurs niveaux) |
| **Mentor** | Coache une ou plusieurs équipes, relit du code, anime des sessions | Les membres de ses équipes |
| **Responsable pédagogique** (admin d'établissement) | Gère niveaux, classes, enseignants, statistiques globales | Tout son établissement |
| **Super-admin** (plateforme) | Gère les établissements, les domaines et le catalogue commun | Tout |

Organisation : **Établissement → Niveau (ex. L1, L2, BTS1) → Classe → Étudiants**. Un enseignant peut être rattaché à plusieurs classes, y compris sur des niveaux différents. Les équipes (3 à 6 étudiants) existent à l'intérieur d'une classe ou entre classes d'un même niveau.

## 4. Les domaines couverts

La plateforme est **multi-domaines dès sa conception** (jamais de logique codée « en dur » pour un langage) :

- **Programmation** : algorithmique, Python, JavaScript/TypeScript, Java, C, C#, PHP, SQL, puis d'autres ;
- **Systèmes** : Linux (shell, fichiers, droits, processus, scripts bash) ;
- **Outils** : Git et GitHub, Docker ;
- **Réseaux** : modèle OSI/TCP-IP, adressage IP et sous-réseaux, routage, DNS, HTTP ;
- **Sécurité** : bonnes pratiques, OWASP, cryptographie de base, CTF d'initiation ;
- **Cloud** : AWS, Google Cloud (IAM, stockage, calcul, réseau virtuel, coûts) ;
- et tout autre domaine ajouté plus tard par simple contenu (pas de code nouveau sauf pour un nouveau type de mini-jeu).

## 5. Principes directeurs

1. **Le rythme est donné par l'enseignant**, la plateforme rend ce rythme agréable.
2. **Récompenser l'effort régulier**, pas seulement le talent : séries, progrès personnel, ligues de niveau équivalent.
3. **Ne jamais humilier** : classements anonymisables, pas de « dernier de la classe » affiché.
4. **Feedback immédiat** sur chaque action dans le jeu.
5. **Visibilité totale pour l'enseignant**, mais strictement limitée à ses classes.
6. **Pensé pour des connexions lentes et des smartphones** : pages légères, mode hors-ligne pour réviser, peu de données consommées.
7. **Tout dans une seule application Next.js** (front, back, API, tâches planifiées).

## 6. Indicateurs de réussite

- Taux d'étudiants actifs chaque semaine (objectif : > 80 %).
- Taux de réussite au grand challenge du premier coup.
- Temps moyen de révision hebdomadaire par étudiant.
- Nombre d'étudiants « à risque » détectés **avant** l'échec et relancés.
- Note moyenne aux examens officiels comparée aux années précédentes.

## 7. Questions ouvertes (à trancher par le porteur du projet)

- Un seul établissement au départ, ou plateforme ouverte à plusieurs établissements (SaaS) ?
- Nombre d'étudiants visé la première année (dimensionne l'hébergement).
- Les étudiants travaillent-ils surtout sur smartphone ou sur ordinateur ?
- Qualité de la connexion internet des étudiants à la maison.
- Hébergement : serveur propre (VPS) ou plateforme gérée (Vercel + base managée) ?
- Le grand challenge compte-t-il dans la note officielle ? (impact sur le niveau d'anti-triche exigé)
- Langue : français uniquement, ou français + anglais ?
