import { PrismaPg } from "@prisma/adapter-pg";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { PrismaClient } from "@/generated/prisma/client";
import { weeklySchedule } from "@/features/classroom/rules";
import { ForbiddenError } from "@/server/permissions";
import { addClassroomTrack, createClassroom, getClassroomDashboard, getStudentClassroom, getStudentClassrooms, InviteNotFoundError, joinClassroom, saveSchedule, UnknownTrackError } from "@/server/services/classroom";
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
  classroom = await createClassroom(db, teacher, { name: "L1 A", schoolYear: "2026", trackSlugs: ["linux-debutant"] });
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

describe("classes à plusieurs parcours", () => {
  it("crée une classe avec plusieurs parcours et refuse un parcours inconnu", async () => {
    const c = await createClassroom(db, teacher, { name: "Web", schoolYear: "", trackSlugs: ["linux-debutant", "php-debutant"] });
    const dash = await getClassroomDashboard(db, teacher, c.id);
    expect(dash.classroom.trackSlugs.sort()).toEqual(["linux-debutant", "php-debutant"]);
    await expect(createClassroom(db, teacher, { name: "X", schoolYear: "", trackSlugs: ["inconnu"] })).rejects.toBeInstanceOf(UnknownTrackError);
  });

  it("ajoute un parcours à une classe et l'applique aux étudiants déjà inscrits", async () => {
    await joinClassroom(db, student, classroom.inviteCode);
    await addClassroomTrack(db, teacher, classroom.id, "php-debutant");
    const c = await getStudentClassrooms(db, student);
    expect(c?.notionSlugs).toContain("php-echo-variables");
    expect(c?.notionSlugs).toContain("se-reperer");
  });

  it("seul un enseignant de la classe peut ajouter un parcours", async () => {
    await expect(addClassroomTrack(db, other, classroom.id, "php-debutant")).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("un parcours que la classe ne suit pas reste libre pour l'étudiant", async () => {
    await joinClassroom(db, student, classroom.inviteCode);
    const c = await getStudentClassrooms(db, student);
    expect(c?.notionSlugs).not.toContain("php-echo-variables");
  });

  it("le planning n'accepte que les notions des parcours de la classe", async () => {
    await saveSchedule(db, teacher, classroom.id, weeklySchedule(["php-echo-variables"], new Date()));
    const dash = await getClassroomDashboard(db, teacher, classroom.id);
    expect(Object.keys(dash.releases)).toEqual([]);
  });
});
