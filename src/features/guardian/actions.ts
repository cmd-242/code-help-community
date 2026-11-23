"use server";

import { z } from "zod";
import { drawGuardianQuestions, getNotion } from "@/features/catalog/queries";
import { guardianWindowOpen } from "@/features/classroom/rules";
import { check } from "@/games/public";
import { db } from "@/server/db";
import { getStudentClassroom } from "@/server/services/classroom";
import { getSession } from "@/server/session";

/**
 * Combat contre le gardien (grand challenge).
 * Les réponses restent sur le serveur : le navigateur ne reçoit que les questions
 * publiques et le verdict de chaque réponse.
 *
 * Ordre imposé par AGENTS.md : session → Zod → permission → service.
 * Sans compte, le combat est libre. En classe, il n'est possible que pendant
 * la fenêtre fixée par l'enseignant.
 */

const slugSchema = z.string().min(1).max(100);

export async function startGuardianFight(notionSlug: string) {
  const session = await getSession();
  const slug = slugSchema.parse(notionSlug);
  const found = getNotion(slug);
  if (!found?.notion.challenge) throw new Error("Ce gardien n'existe pas.");
  if (session) {
    const classroom = await getStudentClassroom(db, session.user.id, found.track.slug);
    if (classroom && !guardianWindowOpen(classroom.releases[slug], new Date())) throw new Error("GUARDIAN_CLOSED"); // un fichier "use server" n'exporte que des fonctions
  }
  const { challenge } = found.notion;
  return {
    questions: drawGuardianQuestions(found.notion),
    durationSeconds: challenge.durationSeconds,
    passingScore: challenge.passingScore,
    xp: challenge.xp,
  };
}

const answerSchema = z.object({
  notionSlug: slugSchema,
  questionId: z.string().min(1).max(100),
  response: z.union([z.array(z.number().int()).max(10), z.array(z.string().max(300)).max(12), z.string().max(2000)]),
});

export async function answerGuardian(input: z.input<typeof answerSchema>) {
  const { notionSlug, questionId, response } = answerSchema.parse(input);
  const question = getNotion(notionSlug)?.notion.challenge?.bank.find((q) => q.id === questionId);
  if (!question) throw new Error("Question introuvable.");
  return check(question, response);
}
