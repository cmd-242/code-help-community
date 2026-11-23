# 04 — Modèle de données

Base **PostgreSQL**, accès via **Prisma 7**. Le schéma ci-dessous est la référence de départ : il a été validé avec le validateur officiel de Prisma et sera copié tel quel dans `prisma/schema.prisma` lors de l'initialisation du projet.

## Vue d'ensemble

L'apprenant libre est le cas de base : un `User` sans établissement, inscrit à des parcours (`TrackEnrollment`, mode `FREE`). Tout le bloc « établissement / classe » est optionnel.

```
User ── TrackEnrollment (mode FREE ou CLASSROOM) ── Track
     └─ Team (GUILD : guilde ouverte, ou CLASS_TEAM : équipe de classe)

Option classe :
Institution ─┬─ Level ── Classroom ─┬─ Enrollment ── User (étudiant)
             │                      ├─ ClassroomTeacher ── User (enseignant)
             │                      ├─ Team ─┬─ TeamMember ── User
             │                      │        └─ TeamMentor ── User (mentor)
             │                      ├─ NotionRelease  (planning : quand chaque notion s'ouvre)
             │                      └─ Announcement
             └─ Track (parcours propres à l'établissement)

Domain ── Track ── Notion ─┬─ Lesson        (côté fermé : cours)
                           ├─ Stage         (côté ouvert : étapes du jeu)
                           ├─ Question      (banque du grand challenge)
                           ├─ Challenge     (paramètres du test final)
                           └─ NotionPrerequisite (graphe des prérequis)

Progression : NotionProgress, StageAttempt, LessonView, ChallengeAttempt, IntegrityEvent
Gamification : XpEvent, Badge, UserBadge, Streak
Communication : Announcement, ForumThread, ForumPost, Notification
Traçabilité : StudentOverride, AuditLog
```

## Points de conception

- **Apprentissage libre d'abord** : `User.institutionId`, `Classroom.levelId` et `Team.classroomId` sont optionnels. Un apprenant n'a besoin que d'un compte et d'une `TrackEnrollment`.
- **Mode par parcours** : `TrackEnrollment.mode` dit si le planning d'une classe s'applique à ce parcours. Sans planning (`FREE`), une notion s'ouvre dès que le gardien précédent est vaincu.
- **Progression indépendante de la classe** : `NotionProgress`, `StageAttempt`, `XpEvent` sont rattachés à l'apprenant. Quitter ou rejoindre une classe ne fait rien perdre.
- **Objectif hebdomadaire** : `User.weeklyGoalXp`, comparé aux `XpEvent` de la semaine.
- **Collection de cartes** : `UserCard` (carte possédée, brillante ou non), `SkillHit` (bonnes réponses par compétence, pour la maîtrise), `BoosterOpening` (un coffre par semaine). Ajoutés avec les comptes.

- **Salles à plusieurs épreuves** : une étape (`Stage`) contient une liste de rencontres, chacune avec son propre type de mini-jeu ; `Stage.config` stocke donc `{ encounters: [...] }` et `Stage.gameType` vaut `"encounters"`.
- **Exercices génériques** : `Stage.config` et `Question.config` sont du JSON dont la forme dépend de `gameType`. Chaque moteur de jeu fournit son schéma Zod pour valider ce JSON.
- **Tests cachés** : `Question.config` peut contenir les réponses et tests cachés. Il ne doit **jamais** être envoyé tel quel au navigateur ; une fonction `toPublicQuestion()` retire ces champs.
- **Tirage figé** : `ChallengeAttempt.questionIds` mémorise les questions tirées pour une tentative, afin que recharger la page ne change pas le sujet.
- **XP par événements** : on ne stocke pas un total modifiable, on additionne les `XpEvent` (avec un cache si besoin). Permet les classements hebdomadaires et l'audit.
- **Statut de notion calculé** : l'ouverture dépend de `NotionRelease` + prérequis + `StudentOverride`. `NotionProgress` mémorise ce que l'étudiant a fait, pas la date d'ouverture.
- **Rattrapage ciblé** : `Question.skill` et `ChallengeAttempt.skillScores` permettent de proposer des exercices sur les compétences ratées.
- **Versionnement** : `Notion.version` (le contenu complet sera versionné en V2).

## Schéma Prisma

```prisma
// Prisma 7 : l'URL de connexion se trouve dans prisma.config.ts, pas ici.
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

// ─────────────── Organisation ───────────────

// Un compte est toujours un apprenant ; les autres rôles s'ajoutent (option).
enum Role {
  STUDENT
  TEACHER
  MENTOR
  SCHOOL_ADMIN
  SUPER_ADMIN
}

model Institution {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  logoUrl   String?
  createdAt DateTime @default(now())

  users      User[]
  levels     Level[]
  tracks     Track[]
  auditLogs  AuditLog[]
}

model User {
  id            String    @id @default(cuid())
  institutionId String?
  email         String    @unique
  name          String
  pseudonym     String?   // affiché dans les classements si l'étudiant le souhaite
  avatarUrl     String?
  role          Role      @default(STUDENT)
  weeklyGoalXp  Int       @default(250) // objectif hebdomadaire choisi par l'apprenant libre
  timeZone      String    @default("Africa/Lagos")
  createdAt     DateTime  @default(now())
  lastActiveAt  DateTime?

  institution     Institution?       @relation(fields: [institutionId], references: [id])
  trackEnrollments TrackEnrollment[]
  enrollments     Enrollment[]
  teaching        ClassroomTeacher[]
  teamMemberships TeamMember[]
  mentoring       TeamMentor[]
  notionProgress  NotionProgress[]
  stageAttempts   StageAttempt[]
  challengeAttempts ChallengeAttempt[]
  lessonViews     LessonView[]
  xpEvents        XpEvent[]
  badges          UserBadge[]
  streak          Streak?
  notifications   Notification[]
  overrides       StudentOverride[]  @relation("OverrideStudent")
  grantedOverrides StudentOverride[] @relation("OverrideGrantedBy")
  posts           ForumPost[]
  authoredNotions Notion[]           @relation("NotionAuthor")
}

model Level {
  id            String @id @default(cuid())
  institutionId String
  name          String // ex. "L1", "BTS 1"
  order         Int

  institution Institution @relation(fields: [institutionId], references: [id])
  classrooms  Classroom[]

  @@unique([institutionId, name])
}

// Une classe est optionnelle. Elle peut exister sans établissement
// (formateur indépendant, club, association) : levelId est alors vide.
model Classroom {
  id           String   @id @default(cuid())
  levelId      String?
  name         String   // ex. "L1 - Groupe A"
  schoolYear   String   // ex. "2026-2027"
  inviteCode   String   @unique
  archivedAt   DateTime?
  createdAt    DateTime @default(now())

  level         Level?             @relation(fields: [levelId], references: [id])
  teachers      ClassroomTeacher[]
  enrollments   Enrollment[]
  teams         Team[]
  releases      NotionRelease[]
  announcements Announcement[]
  trackEnrollments TrackEnrollment[]
  assignedTracks   ClassroomTrack[]
}

// Parcours assignés à une classe par l'enseignant
model ClassroomTrack {
  classroomId String
  trackId     String

  classroom Classroom @relation(fields: [classroomId], references: [id])
  track     Track     @relation(fields: [trackId], references: [id])

  @@id([classroomId, trackId])
}

enum TeacherRole {
  OWNER
  ASSISTANT
}

model ClassroomTeacher {
  classroomId String
  userId      String
  role        TeacherRole @default(OWNER)

  classroom Classroom @relation(fields: [classroomId], references: [id])
  user      User      @relation(fields: [userId], references: [id])

  @@id([classroomId, userId])
}

model Enrollment {
  classroomId String
  userId      String
  joinedAt    DateTime @default(now())

  classroom Classroom @relation(fields: [classroomId], references: [id])
  user      User      @relation(fields: [userId], references: [id])

  @@id([classroomId, userId])
}

enum TeamKind {
  CLASS_TEAM // équipe créée par un enseignant dans une classe
  GUILD // guilde ouverte d'apprenants libres
}

model Team {
  id          String   @id @default(cuid())
  kind        TeamKind @default(GUILD)
  classroomId String? // vide pour une guilde
  name        String
  isOpen      Boolean  @default(true) // une guilde ouverte accepte de nouveaux membres

  classroom Classroom?   @relation(fields: [classroomId], references: [id])
  members   TeamMember[]
  mentors   TeamMentor[]
}

model TeamMember {
  teamId String
  userId String

  team Team @relation(fields: [teamId], references: [id])
  user User @relation(fields: [userId], references: [id])

  @@id([teamId, userId])
}

model TeamMentor {
  teamId String
  userId String

  team Team @relation(fields: [teamId], references: [id])
  user User @relation(fields: [userId], references: [id])

  @@id([teamId, userId])
}

// ─────────────── Catalogue pédagogique ───────────────

model Domain {
  id     String  @id @default(cuid())
  slug   String  @unique // "python", "linux", "git", "reseau", "securite", "aws", "gcp"
  name   String
  icon   String?
  color  String?
  tracks Track[]
}

model Track {
  id            String  @id @default(cuid())
  domainId      String
  institutionId String? // null = catalogue commun de la plateforme
  slug          String
  title         String
  description   String?
  published     Boolean @default(false)

  domain      Domain       @relation(fields: [domainId], references: [id])
  institution Institution? @relation(fields: [institutionId], references: [id])
  notions     Notion[]
  enrollments TrackEnrollment[]
  classrooms  ClassroomTrack[]

  @@unique([domainId, slug])
}

model Notion {
  id          String  @id @default(cuid())
  trackId     String
  authorId    String?
  slug        String
  title       String
  summary     String?
  order       Int
  version     Int     @default(1)

  track         Track            @relation(fields: [trackId], references: [id])
  author        User?            @relation("NotionAuthor", fields: [authorId], references: [id])
  prerequisites NotionPrerequisite[] @relation("NotionRequires")
  requiredBy    NotionPrerequisite[] @relation("NotionRequiredBy")
  lessons       Lesson[]
  stages        Stage[]
  questions     Question[]
  challenge     Challenge?
  releases      NotionRelease[]
  progress      NotionProgress[]
  forumThreads  ForumThread[]

  @@unique([trackId, slug])
}

model NotionPrerequisite {
  notionId       String
  requiresId     String

  notion   Notion @relation("NotionRequires", fields: [notionId], references: [id])
  requires Notion @relation("NotionRequiredBy", fields: [requiresId], references: [id])

  @@id([notionId, requiresId])
}

// Côté fermé : cours
model Lesson {
  id       String @id @default(cuid())
  notionId String
  title    String
  order    Int
  body     String // MDX
  minutes  Int?   // durée estimée

  notion Notion       @relation(fields: [notionId], references: [id])
  views  LessonView[]
}

model LessonView {
  lessonId    String
  userId      String
  completedAt DateTime?
  secondsSpent Int     @default(0)

  lesson Lesson @relation(fields: [lessonId], references: [id])
  user   User   @relation(fields: [userId], references: [id])

  @@id([lessonId, userId])
}

// Côté ouvert : jeu
model Stage {
  id       String  @id @default(cuid())
  notionId String
  title    String
  order    Int
  isBonus  Boolean @default(false)
  isBoss   Boolean @default(false)
  gameType String  // clé du registre des moteurs : "qcm", "parsons", "code", "terminal"...
  config   Json    // validé par le schéma Zod du moteur
  xp       Int     @default(10)

  notion   Notion         @relation(fields: [notionId], references: [id])
  attempts StageAttempt[]
}

model StageAttempt {
  id         String   @id @default(cuid())
  stageId    String
  userId     String
  success    Boolean
  stars      Int      @default(0)
  hintsUsed  Int      @default(0)
  durationMs Int
  answer     Json?
  createdAt  DateTime @default(now())

  stage Stage @relation(fields: [stageId], references: [id])
  user  User  @relation(fields: [userId], references: [id])

  @@index([userId, stageId])
}

// Banque de questions pour les grands challenges
model Question {
  id         String @id @default(cuid())
  notionId   String
  skill      String // compétence évaluée, pour le rattrapage ciblé
  difficulty Int    @default(1)
  gameType   String
  config     Json   // contient aussi les tests cachés : ne jamais envoyer tel quel au client
  points     Int    @default(1)

  notion Notion @relation(fields: [notionId], references: [id])
}

model Challenge {
  id              String @id @default(cuid())
  notionId        String @unique
  questionCount   Int    @default(10)
  durationMinutes Int    @default(30)

  notion   Notion             @relation(fields: [notionId], references: [id])
  attempts ChallengeAttempt[]
}

// ─────────────── Inscription à un parcours ───────────────

enum LearningMode {
  FREE // autodidacte : progression sans planning (par défaut)
  CLASSROOM // le planning de la classe s'applique à ce parcours
}

// Un apprenant suit un parcours, librement ou via une classe.
// Passer d'une classe au mode libre (ou l'inverse) ne fait rien perdre :
// la progression est rattachée à l'apprenant, pas à la classe.
model TrackEnrollment {
  userId      String
  trackId     String
  mode        LearningMode @default(FREE)
  classroomId String? // renseigné si mode = CLASSROOM
  startedAt   DateTime     @default(now())

  user      User       @relation(fields: [userId], references: [id])
  track     Track      @relation(fields: [trackId], references: [id])
  classroom Classroom? @relation(fields: [classroomId], references: [id])

  @@id([userId, trackId])
}

// ─────────────── Planning hebdomadaire (option classe) ───────────────

model NotionRelease {
  id                String   @id @default(cuid())
  classroomId       String
  notionId          String
  week              Int?
  gameOpensAt       DateTime
  courseOpensAt     DateTime
  challengeOpensAt  DateTime
  challengeClosesAt DateTime
  passingScore      Int      @default(70) // en %
  maxAttempts       Int      @default(2)
  instructions      String?  // consignes de la semaine (MDX)

  classroom Classroom @relation(fields: [classroomId], references: [id])
  notion    Notion    @relation(fields: [notionId], references: [id])

  @@unique([classroomId, notionId])
}

model StudentOverride {
  id           String   @id @default(cuid())
  studentId    String
  notionId     String
  grantedById  String
  reason       String
  unlock       Boolean  @default(false)
  extraAttempts Int     @default(0)
  newClosesAt  DateTime?
  createdAt    DateTime @default(now())

  student   User @relation("OverrideStudent", fields: [studentId], references: [id])
  grantedBy User @relation("OverrideGrantedBy", fields: [grantedById], references: [id])
}

// ─────────────── Progression et évaluation ───────────────

enum NotionStatus {
  LOCKED
  AVAILABLE
  IN_PROGRESS
  READY_FOR_CHALLENGE
  PASSED
  FAILED
  REMEDIATION
}

model NotionProgress {
  userId    String
  notionId  String
  status    NotionStatus @default(LOCKED)
  bestScore Int?
  passedAt  DateTime?
  updatedAt DateTime     @updatedAt

  user   User   @relation(fields: [userId], references: [id])
  notion Notion @relation(fields: [notionId], references: [id])

  @@id([userId, notionId])
}

enum AttemptStatus {
  IN_PROGRESS
  SUBMITTED
  GRADED
  EXPIRED
}

model ChallengeAttempt {
  id          String        @id @default(cuid())
  challengeId String
  userId      String
  status      AttemptStatus @default(IN_PROGRESS)
  questionIds String[]      // tirage aléatoire figé pour cette tentative
  answers     Json          @default("{}")
  score       Int?
  passed      Boolean?
  skillScores Json?         // { "boucles": 80, "conditions": 40 }
  startedAt   DateTime      @default(now())
  submittedAt DateTime?

  challenge       Challenge        @relation(fields: [challengeId], references: [id])
  user            User             @relation(fields: [userId], references: [id])
  integrityEvents IntegrityEvent[]

  @@index([userId, challengeId])
}

model IntegrityEvent {
  id        String   @id @default(cuid())
  attemptId String
  type      String   // "TAB_HIDDEN", "FULLSCREEN_EXIT", "PASTE_BLOCKED", "SIMILARITY"
  details   Json?
  at        DateTime @default(now())

  attempt ChallengeAttempt @relation(fields: [attemptId], references: [id])
}

// ─────────────── Gamification ───────────────

model XpEvent {
  id        String   @id @default(cuid())
  userId    String
  amount    Int
  reason    String   // "STAGE_COMPLETED", "CHALLENGE_PASSED", "FORUM_ANSWER_ACCEPTED"...
  refId     String?
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id])

  @@index([userId, createdAt])
}

model Badge {
  id          String      @id @default(cuid())
  slug        String      @unique
  name        String
  description String
  icon        String
  users       UserBadge[]
}

model UserBadge {
  userId    String
  badgeId   String
  awardedAt DateTime @default(now())

  user  User  @relation(fields: [userId], references: [id])
  badge Badge @relation(fields: [badgeId], references: [id])

  @@id([userId, badgeId])
}

model Streak {
  userId         String    @id
  current        Int       @default(0)
  longest        Int       @default(0)
  freezes        Int       @default(0)
  lastActiveDate DateTime?

  user User @relation(fields: [userId], references: [id])
}

// ─────────────── Communication ───────────────

model Announcement {
  id          String   @id @default(cuid())
  classroomId String
  authorId    String
  title       String
  body        String
  createdAt   DateTime @default(now())

  classroom Classroom @relation(fields: [classroomId], references: [id])
}

model ForumThread {
  id        String      @id @default(cuid())
  notionId  String
  title     String
  createdAt DateTime    @default(now())

  notion Notion      @relation(fields: [notionId], references: [id])
  posts  ForumPost[]
}

model ForumPost {
  id        String   @id @default(cuid())
  threadId  String
  authorId  String
  body      String
  accepted  Boolean  @default(false)
  createdAt DateTime @default(now())

  thread ForumThread @relation(fields: [threadId], references: [id])
  author User        @relation(fields: [authorId], references: [id])
}

model Notification {
  id        String    @id @default(cuid())
  userId    String
  type      String
  title     String
  body      String?
  link      String?
  readAt    DateTime?
  createdAt DateTime  @default(now())

  user User @relation(fields: [userId], references: [id])

  @@index([userId, readAt])
}

model AuditLog {
  id            String   @id @default(cuid())
  institutionId String?
  actorId       String
  action        String   // "OVERRIDE_GRANTED", "SCORE_CHANGED", "ROLE_CHANGED"...
  targetType    String
  targetId      String
  details       Json?
  createdAt     DateTime @default(now())

  institution Institution? @relation(fields: [institutionId], references: [id])
}
```

Fichier `prisma.config.ts` associé (Prisma 7) :

```ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations", seed: "tsx prisma/seed.ts" },
  datasource: { url: env("DATABASE_URL") },
});
```

Le client est instancié une seule fois dans `src/server/db.ts` avec l'adaptateur PostgreSQL (`@prisma/adapter-pg`).
