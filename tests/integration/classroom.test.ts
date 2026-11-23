import { PrismaPg } from "@prisma/adapter-pg";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { PrismaClient } from "@/generated/prisma/client";
import { weeklySchedule } from "@/features/classroom/rules";
import { ForbiddenError } from "@/server/permissions";
import { createClassroom, getClassroomDashboard, getStudentClassroom, InviteNotFoundError, joinClassroom, saveSchedule } from "@/server/services/classroom";
import { applyOps, getSnapshot } from "@/server/services/progress";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const DAY = 86_400_000;
const mk = (name: string) => db.user.create({ data: { name, email: `${name}-${Date.now()}-${Math.random()}@test.local` } });

let teacher = "";
let other = "";
let student = "";
let classroom: { id: string; inviteCode: string };

beforeEach(async () => {
  teacher = (await mk("prof")).id;
  other = (await mk("autre-prof")).id;
  student = (await mk("etu")).id;
  classroom = await createClassroom(db, teacher, { name: "L1 A", schoolYear: "2026", trackSlug: "linux-debutant" });
});

afterAll(async () => {
  await db.$disconnect();
});

describe("classes", () => {
  it("génère un code d'invitation et rejoint la classe", async () => {
    expect(classroom.inviteCode).toMatch(/^[A-Z2-9]{6}$/);
    const joined = await joinClassroom(db, student, classroom.inviteCode);
    expect(joined.name).toBe("L1 A");
    const snap = await getSnapshot(db, student);
    expect(snap.classroom?.name).toBe("L1 A");
  });

  it("refuse un code inconnu", async () => {
    await expect(joinClassroom(db, student, "ZZZZZZ")).rejects.toBeInstanceOf(InviteNotFoundError);
  });

  it("un enseignant ne voit pas la classe d'un autre", async () => {
    await expect(getClassroomDashboard(db, other, classroom.id)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(saveSchedule(db, other, classroom.id, {})).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("enregistre le planning et le renvoie à l'étudiant", async () => {
    await joinClassroom(db, student, classroom.inviteCode);
    await saveSchedule(db, teacher, classroom.id, weeklySchedule(["se-reperer"], new Date(Date.now() - DAY)));
    const c = await getStudentClassroom(db, student, "linux-debutant");
    expect(Object.keys(c?.releases ?? {})).toEqual(["se-reperer"]);
  });

  it("ignore le gardien tant que sa fenêtre est fermée en classe", async () => {
    await joinClassroom(db, student, classroom.inviteCode);
    await saveSchedule(db, teacher, classroom.id, weeklySchedule(["se-reperer"], new Date()));
    await applyOps(db, student, [{ type: "guardian", notionSlug: "se-reperer", score: 100 }]);
    const snap = await getSnapshot(db, student);
    expect(snap.cleared["se-reperer"]).toBeUndefined();
  });

  it("le tableau de bord signale un étudiant inactif", async () => {
    await joinClassroom(db, student, classroom.inviteCode);
    await db.activeDay.create({ data: { userId: student, day: new Date(Date.now() - 6 * DAY).toISOString().slice(0, 10) } });
    const dash = await getClassroomDashboard(db, teacher, classroom.id);
    expect(dash.students).toHaveLength(1);
    expect(dash.students[0].alerts).toContain("inactive");
  });
});
