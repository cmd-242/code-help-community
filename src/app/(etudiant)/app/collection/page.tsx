import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getTrack } from "@/features/catalog/queries";
import { CollectionView } from "@/features/collection/collection-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("collection");
  return { title: t("metaTitle") };
}

export default async function CollectionPage() {
  const t = await getTranslations("collection");
  const track = getTrack();
  if (!track) return null;
  const groups = track.notions
    .map((n) => ({ slug: n.slug, place: n.place, position: n.position, cards: track.cards.filter((c) => c.notion === n.slug) }))
    .filter((g) => g.cards.length > 0);

  return (
    <div className="mx-auto max-w-3xl px-3 pb-24 pt-5">
      <h1 className="px-2 font-display text-4xl font-bold">{t("title")}</h1>
      <p className="px-2 text-muted">{t("lede")}</p>
      <CollectionView groups={groups} allCards={track.cards} />
    </div>
  );
}
