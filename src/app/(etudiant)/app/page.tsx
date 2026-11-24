import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getTrack, getTracks } from "@/features/catalog/queries";
import { DEFAULT_TRACK_SLUG, mapHref } from "@/features/catalog/paths";
import { ArchipelCamp } from "@/features/map/archipel-camp";
import { CatalogueLink } from "@/features/catalog/catalogue-link";
import { MetroPortal } from "@/features/map/metro-portal";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("camp");
  return { title: t("metaTitle") };
}

export default async function CampPage() {
  const track = getTrack(DEFAULT_TRACK_SLUG);
  if (!track) return null;

  return (
    <div className="mx-auto max-w-3xl px-3 pb-24 pt-5">
      <ArchipelCamp track={track} />
      <CatalogueLink />

      {getTracks()
        .filter((t) => t.universe === "metro")
        .map((t) => (
          <MetroPortal key={t.slug} href={mapHref(t)} trackTitle={t.title} stations={t.notions.length} />
        ))}
    </div>
  );
}
