import { notFound } from "next/navigation";
import { DEFAULT_TRACK_SLUG } from "@/features/catalog/paths";
import { getTrack, getTracks } from "@/features/catalog/queries";
import { UniverseMarker } from "@/features/sound/universe-marker";

export function generateStaticParams() {
  return getTracks().filter((t) => t.slug !== DEFAULT_TRACK_SLUG).map((t) => ({ trackSlug: t.slug }));
}

/** Pages d'un parcours hors port : applique son univers éventuel (thème et sons). */
export default async function TrackLayout({ children, params }: LayoutProps<"/app/parcours/[trackSlug]">) {
  const { trackSlug } = await params;
  const track = getTrack(trackSlug);
  if (!track || track.slug === DEFAULT_TRACK_SLUG) notFound();
  return (
    <>
      {track.universe !== "archipel" && <UniverseMarker universe={track.universe} />}
      {children}
    </>
  );
}
