import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { GameLink } from "@/components/ui/game-button";
import { getTracks, notionSummaries } from "@/features/catalog/queries";
import { NetworkMap } from "@/universes/metro/network-map";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metroNetwork");
  return { title: t("metaTitle") };
}

/** « Mon réseau » : toutes les lignes du Néo-Métro, leurs stations, leurs correspondances. */
export default async function NetworkPage() {
  const t = await getTranslations("metroNetwork");
  const lines = getTracks()
    .filter((track) => track.universe === "metro")
    .map((track) => ({ slug: track.slug, title: track.title, notions: notionSummaries(track) }));

  return (
    <div className="mx-auto max-w-3xl px-3 pb-24 pt-5">
      <h1 className="font-display text-5xl font-bold leading-none text-ink">{t("title")}</h1>
      <p className="mt-2 max-w-xl text-lg text-muted">{t("lede")}</p>
      <div className="mt-5">
        <NetworkMap lines={lines} />
      </div>
      <div className="mt-8">
        <GameLink href="/app/catalogue" variant="secondary">
          {(await getTranslations("metroMap"))("backToArchipel")}
        </GameLink>
      </div>
    </div>
  );
}
