import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getTrack, getTracks, notionSummaries } from "@/features/catalog/queries";
import { mapHref } from "@/features/catalog/paths";
import { GuestBanner } from "@/features/account/guest-banner";
import { CollectionTeaser } from "@/features/collection/collection-teaser";
import { MetroPortal } from "@/features/map/metro-portal";
import { NextStop } from "@/features/map/next-stop";
import { RhythmPanel } from "@/features/map/rhythm-panel";
import { ArchipelagoMap } from "@/universes/archipel/archipelago-map";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("camp");
  return { title: t("metaTitle") };
}

export default async function CampPage() {
  const track = getTrack();
  if (!track) return null;
  const notions = notionSummaries(track);

  return (
    <div className="mx-auto max-w-3xl px-3 pb-24 pt-5">
      <NextStop notions={notions} />
      <GuestBanner />
      <RhythmPanel />
      <CollectionTeaser cards={track.cards} positions={Object.fromEntries(track.notions.map((n) => [n.slug, n.position]))} />

      <section className="mt-10" aria-labelledby="map-title">
        <div className="px-2">
          <p className="font-bold text-info-deep">{track.title}</p>
          <h2 id="map-title" className="font-display text-4xl font-bold leading-tight sm:text-5xl">
            {track.world}
          </h2>
          <p className="mt-1 text-muted">{track.tagline}</p>
        </div>
        <div className="mt-5">
          <ArchipelagoMap notions={notions} />
        </div>
      </section>

      {getTracks()
        .filter((t) => t.universe === "metro")
        .map((t) => (
          <MetroPortal key={t.slug} href={mapHref(t)} trackTitle={t.title} stations={t.notions.length} />
        ))}
    </div>
  );
}
