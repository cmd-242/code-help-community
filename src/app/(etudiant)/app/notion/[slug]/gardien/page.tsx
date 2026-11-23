import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cardsOfNotion, getNotion, getTrack } from "@/features/catalog/queries";
import { guardianCardId } from "@/features/collection/rules";
import { GuardianFight } from "@/features/guardian/guardian-fight";

export function generateStaticParams() {
  return getTrack()?.notions.filter((n) => n.challenge).map((n) => ({ slug: n.slug })) ?? [];
}

export async function generateMetadata({ params }: PageProps<"/app/notion/[slug]/gardien">): Promise<Metadata> {
  const { slug } = await params;
  return { title: getNotion(slug)?.notion.guardian.name };
}

/** Le grand challenge. Les questions sont tirées et corrigées côté serveur (Server Actions). */
export default async function GuardianPage({ params }: PageProps<"/app/notion/[slug]/gardien">) {
  const { slug } = await params;
  const found = getNotion(slug);
  if (!found?.notion.challenge) notFound();
  const { track, notion } = found;
  const next = track.notions.find((n) => n.position === notion.position + 1);
  return (
    <GuardianFight
      notionSlug={notion.slug}
      position={notion.position}
      guardian={notion.guardian}
      next={next ? { slug: next.slug, place: next.place } : null}
      guardianCard={cardsOfNotion(track, notion.slug).find((c) => c.id === guardianCardId(notion.slug)) ?? null}
    />
  );
}
