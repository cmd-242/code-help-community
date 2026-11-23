import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNotion, getTrack } from "@/features/catalog/queries";
import { GuardianFight } from "@/features/guardian/guardian-fight";

export function generateStaticParams() {
  return getTrack()?.notions.filter((n) => n.challenge).map((n) => ({ slug: n.slug })) ?? [];
}

export async function generateMetadata({ params }: PageProps<"/app/etage/[slug]/gardien">): Promise<Metadata> {
  const { slug } = await params;
  return { title: getNotion(slug)?.notion.guardian.name };
}

/** Le grand challenge. Les questions sont tirées et corrigées côté serveur (Server Actions). */
export default async function GuardianPage({ params }: PageProps<"/app/etage/[slug]/gardien">) {
  const { slug } = await params;
  const found = getNotion(slug);
  if (!found?.notion.challenge) notFound();
  const { track, notion } = found;
  const next = track.notions.find((n) => n.floor === notion.floor + 1);
  return (
    <GuardianFight
      floorSlug={notion.slug}
      floorNumber={notion.floor}
      guardian={notion.guardian}
      next={next ? { slug: next.slug, floor: next.floor, room: next.room } : null}
    />
  );
}
