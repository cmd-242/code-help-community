import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { floorSummaries, getTrack } from "@/features/catalog/queries";
import { DescentMap } from "@/features/map/descent-map";
import { RhythmPanel } from "@/features/map/rhythm-panel";
import { WeekQuest } from "@/features/map/week-quest";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("camp");
  return { title: t("metaTitle") };
}

export default async function CampPage() {
  const t = await getTranslations("camp");
  const track = getTrack();
  if (!track) return null;
  const floors = floorSummaries(track);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-8">
      <WeekQuest floors={floors} />
      <RhythmPanel />

      <section className="mt-16" aria-labelledby="map-title">
        <div className="text-center">
          <p className="text-torch">{track.title}</p>
          <h2 id="map-title" className="carved torchlight text-5xl text-torch-bright sm:text-6xl">
            {track.dungeon}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-parchment-dim">{track.tagline}</p>
        </div>
        <div className="mt-14">
          <DescentMap floors={floors} />
        </div>
        <p className="mx-auto max-w-md text-center text-sm text-parchment-dim">{t("demoNotice")}</p>
      </section>
    </div>
  );
}
