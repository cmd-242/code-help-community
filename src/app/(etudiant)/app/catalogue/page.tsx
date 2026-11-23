import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { mapHref } from "@/features/catalog/paths";
import { getTracks } from "@/features/catalog/queries";
import type { Track } from "@/features/catalog/types";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("catalogue");
  return { title: t("metaTitle") };
}

/** Groupe les parcours par domaine, dans l'ordre d'apparition du catalogue. */
function groupByDomain(tracks: Track[]) {
  const groups = new Map<string, Track[]>();
  for (const track of tracks) groups.set(track.domain, [...(groups.get(track.domain) ?? []), track]);
  return [...groups.entries()];
}

/** Le catalogue : tout apprenant choisit librement ce qu'il veut apprendre. */
export default async function CataloguePage() {
  const t = await getTranslations("catalogue");
  const groups = groupByDomain(getTracks());

  return (
    <div className="mx-auto max-w-3xl px-3 pb-24 pt-5">
      <header className="px-2">
        <h1 className="font-display text-5xl font-bold leading-none">{t("title")}</h1>
        <p className="mt-3 max-w-xl text-lg text-muted">{t("lede")}</p>
      </header>

      <div className="mt-8 space-y-10">
        {groups.map(([domain, tracks]) => (
          <section key={domain} aria-labelledby={`domain-${domain}`}>
            <h2 id={`domain-${domain}`} className="px-2 font-display text-3xl font-bold">
              {t.has(`domains.${domain}`) ? t(`domains.${domain}`) : domain}
            </h2>
            <ul className="mt-3 grid gap-4 sm:grid-cols-2">
              {tracks.map((track) => (
                <li key={track.slug}>
                  <Link
                    href={mapHref(track)}
                    className={`${track.universe === "metro" ? "city text-white" : "paper"} group flex h-full flex-col rounded-[1.75rem] p-5 transition-transform duration-100 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4`}
                  >
                    <span className="text-sm font-bold opacity-80">{t(`universe.${track.universe}`)}</span>
                    <span className="mt-1 font-display text-2xl font-bold leading-tight">{track.world}</span>
                    <span className="mt-1 font-semibold">{track.title}</span>
                    <span className="mt-2 grow opacity-85">{track.tagline}</span>
                    <span className="mt-4 flex items-center justify-between gap-3 font-bold">
                      <span>{t("places", { count: track.notions.length })}</span>
                      <span className="rounded-full bg-primary px-4 py-1.5 text-on-primary">{t("start")}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-10 px-2 text-muted">{t("more")}</p>
    </div>
  );
}
