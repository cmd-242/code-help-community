import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { MetroIcon } from "@/components/icons";
import { GameLink } from "@/components/ui/game-button";
import { DEFAULT_TRACK_SLUG } from "@/features/catalog/paths";
import { getTrack, getTracks, notionSummaries } from "@/features/catalog/queries";
import { ArchipelCamp } from "@/features/map/archipel-camp";
import { CatalogueLink } from "@/features/catalog/catalogue-link";
import { CityScene } from "@/universes/metro/city-scene";
import { MetroMap } from "@/universes/metro/metro-map";

export function generateStaticParams() {
  return getTracks().filter((t) => t.slug !== DEFAULT_TRACK_SLUG).map((t) => ({ trackSlug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/app/parcours/[trackSlug]">): Promise<Metadata> {
  const { trackSlug } = await params;
  return { title: getTrack(trackSlug)?.world };
}

/** Le plan de Néo-Métro : l'entrée de la station, puis les lignes du parcours. */
export default async function TrackPage({ params }: PageProps<"/app/parcours/[trackSlug]">) {
  const { trackSlug } = await params;
  const track = getTrack(trackSlug);
  if (!track || track.slug === DEFAULT_TRACK_SLUG) notFound();
  if (track.universe === "archipel") {
    return (
      <div className="mx-auto max-w-3xl px-3 pb-24 pt-5">
        <ArchipelCamp track={track} />
        <CatalogueLink />
      </div>
    );
  }
  const t = await getTranslations("metroMap");
  const notions = notionSummaries(track);
  const hasBranch = notions.some((n) => n.lane === 1);

  return (
    <div className="mx-auto max-w-3xl px-3 pb-24 pt-5">
      <header className="city relative overflow-hidden rounded-[2rem] px-6 pb-28 pt-7 text-white">
        <CityScene />
        <div className="relative">
          <p className="inline-flex items-center gap-2 rounded-full bg-surface/90 py-1 pl-1.5 pr-3 text-sm font-bold text-info-deep">
            <MetroIcon className="size-6" />
            {t("entrance")}
          </p>
          <h1 className="mt-4 font-display text-6xl font-bold leading-none">{track.world}</h1>
          <p className="mt-3 text-xl font-semibold">{track.title}</p>
          <p className="mt-1 max-w-md text-lg text-white/85">{track.tagline}</p>
        </div>
      </header>

      <section className="mt-6" aria-labelledby="plan-title">
        <div className="flex flex-wrap items-end justify-between gap-3 px-2">
          <h2 id="plan-title" className="font-display text-3xl font-bold">
            {t("planTitle")}
          </h2>
          <ul className="flex flex-wrap gap-3 text-sm font-bold" aria-label={t("planTitle")}>
            <li className="flex items-center gap-1.5">
              <span className="h-2 w-6 rounded-full" style={{ background: "var(--color-line-main)" }} />
              {t("laneMain")}
            </li>
            {hasBranch && (
              <li className="flex items-center gap-1.5">
                <span className="h-2 w-6 rounded-full" style={{ background: "var(--color-line-branch)" }} />
                {t("laneBranch")}
              </li>
            )}
          </ul>
        </div>
        <p className="mt-1 px-2 text-muted">{t("legend")}</p>
        <div className="mt-4 rounded-[2rem] bg-surface-sunk px-3 py-4 shadow-[inset_0_0_0_2px_var(--color-line)]">
          <MetroMap notions={notions} name={track.title} />
        </div>
      </section>

      <div className="mt-8">
        <GameLink href="/app/catalogue" variant="secondary">
          {t("backToArchipel")}
        </GameLink>
      </div>
    </div>
  );
}
