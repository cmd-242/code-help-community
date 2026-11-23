import { notFound } from "next/navigation";
import { getTrack, getTracks } from "@/features/catalog/queries";
import { UniverseMarker } from "@/features/sound/universe-marker";

export function generateStaticParams() {
  return getTracks().filter((t) => t.universe !== "archipel").map((t) => ({ trackSlug: t.slug }));
}

/** Pages d'un parcours hors Archipel : applique son univers (thème et sons). */
export default async function TrackLayout({ children, params }: LayoutProps<"/app/parcours/[trackSlug]">) {
  const { trackSlug } = await params;
  const track = getTrack(trackSlug);
  if (!track || track.universe === "archipel") notFound();
  return (
    <>
      <UniverseMarker universe={track.universe} />
      {children}
    </>
  );
}
