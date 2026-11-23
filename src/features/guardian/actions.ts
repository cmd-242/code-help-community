"use server";

import { z } from "zod";
import { drawGuardianQuestions, getNotion } from "@/features/catalog/queries";
import { check } from "@/games/public";

/**
 * Combat contre le gardien (grand challenge).
 * Les réponses restent sur le serveur : le navigateur ne reçoit que les questions
 * publiques et le verdict de chaque réponse.
 *
 * Ordre imposé par AGENTS.md : session → Zod → permission → service.
 * TODO(auth) : vérifier la session et que la notion est ouverte pour la classe
 * de l'étudiant dès que l'authentification sera branchée.
 */

const slugSchema = z.string().min(1).max(100);

export async function startGuardianFight(notionSlug: string) {
  const slug = slugSchema.parse(notionSlug);
  const found = getNotion(slug);
  if (!found?.notion.challenge) throw new Error("Ce gardien n'existe pas.");
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
