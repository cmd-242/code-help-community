/**
 * Données de démonstration : un enseignant, une classe et quatre étudiants
 * à des stades de progression variés (dont un inactif et un en difficulté).
 * Usage : pnpm db:seed (base vide ou déjà alimentée par ce script).
 * Compte enseignant : prof@demo.test / demo-password-123
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";
import { PrismaClient } from "../src/generated/prisma/client";
import { weeklySchedule } from "../src/features/classroom/rules";
import { applyOps } from "../src/server/services/progress";
import { createClassroom, joinClassroom, saveSchedule } from "../src/server/services/classroom";
import type { ProgressOp } from "../src/features/progression/sync-schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL manquant");
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

const PASSWORD = "demo-password-123";
const DAY = 86_400_000;
const daysAgo = (n: number) => new Date(Date.now() - n * DAY);
const dayKey = (d: Date) => d.toISOString().slice(0, 10);

async function user(email: string, name: string) {
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return existing;
  const created = await db.user.create({ data: { email, name, emailVerified: true } });
  await db.account.create({
    data: { userId: created.id, accountId: created.id, providerId: "credential", password: await hashPassword(PASSWORD) },
  });
  return created;
}

async function main() {
  const teacher = await user("prof@demo.test", "Mme Diallo");
  const existing = await db.classroom.findFirst({ where: { teachers: { some: { userId: teacher.id } } } });
  if (existing) {
    console.log(`Déjà alimentée. Code de classe : ${existing.inviteCode}`);
    return;
  }

  const classroom = await createClassroom(db, teacher.id, { name: "L1 Informatique — groupe A", schoolYear: "2026-2027", trackSlug: "linux-debutant" });
  const start = daysAgo(8);
  await saveSchedule(db, teacher.id, classroom.id, weeklySchedule(["se-reperer", "fichiers-et-dossiers", "lire-les-fichiers"], start));

  const students: { email: string; name: string; ops: (now: Date) => ProgressOp[] }[] = [
    {
      email: "awa@demo.test",
      name: "Awa",
      ops: () => [
        { type: "day", day: dayKey(daysAgo(0)) },
        { type: "lesson", lessonId: "l1-terminal" },
        { type: "stage", stageId: "s1-1", stars: 3 },
        { type: "stage", stageId: "s1-2", stars: 2 },
        { type: "guardian", notionSlug: "se-reperer", score: 90 },
      ],
    },
    {
      email: "karim@demo.test",
      name: "Karim",
      ops: () => [
        { type: "day", day: dayKey(daysAgo(1)) },
        { type: "stage", stageId: "s1-1", stars: 2 },
      ],
    },
    {
      email: "lea@demo.test",
      name: "Léa",
      ops: () => [
        { type: "day", day: dayKey(daysAgo(6)) },
        { type: "stage", stageId: "s1-1", stars: 1 },
      ],
    },
    {
      email: "tom@demo.test",
      name: "Tom",
      ops: () => [
        { type: "day", day: dayKey(daysAgo(0)) },
        { type: "stage", stageId: "s1-1", stars: 3 },
        { type: "guardian", notionSlug: "se-reperer", score: 20 },
        { type: "guardian", notionSlug: "se-reperer", score: 30 },
      ],
    },
  ];

  for (const s of students) {
    const u = await user(s.email, s.name);
    await joinClassroom(db, u.id, classroom.inviteCode);
    await applyOps(db, u.id, s.ops(new Date()));
  }
  console.log(`Seed terminé. Enseignant : prof@demo.test / ${PASSWORD}. Code de classe : ${classroom.inviteCode}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
