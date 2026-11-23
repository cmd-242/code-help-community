import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cardsOfNotion, getStage, getTrack } from "@/features/catalog/queries";
import { StagePlayer } from "@/features/play/stage-player";

export function generateStaticParams() {
  return getTrack()?.notions.flatMap((n) => n.stages.map((s) => ({ slug: n.slug, stageId: s.id }))) ?? [];
}

export async function generateMetadata({ params }: PageProps<"/app/notion/[slug]/etape/[stageId]">): Promise<Metadata> {
  const { slug, stageId } = await params;
  return { title: getStage(slug, stageId)?.stage.title };
}

/**
 * Épreuve d'entraînement (côté ouvert). Les rencontres sont envoyées complètes
 * pour une correction instantanée, même sur une connexion lente.
 * TODO(auth) : vérifier que la notion est ouverte pour cet apprenant.
 */
export default async function StagePage({ params }: PageProps<"/app/notion/[slug]/etape/[stageId]">) {
  const { slug, stageId } = await params;
  const found = getStage(slug, stageId);
  if (!found) notFound();
  const { track, notion, stage, index } = found;
  return (
    <StagePlayer
      notionSlug={notion.slug}
      place={notion.place}
      stage={stage}
      stageNumber={index + 1}
      nextStageId={notion.stages[index + 1]?.id ?? null}
      cards={cardsOfNotion(track, notion.slug)}
      position={notion.position}
    />
  );
}
