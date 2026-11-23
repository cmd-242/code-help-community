import { getTracks, universeOfNotion } from "@/features/catalog/queries";
import { UniverseMarker } from "@/features/sound/universe-marker";

export function generateStaticParams() {
  return getTracks().flatMap((t) => t.notions.map((n) => ({ slug: n.slug })));
}

/** Applique l'univers (thème et sons) de la notion à toutes ses pages : notion, étapes, cours, gardien. */
export default async function NotionLayout({ children, params }: LayoutProps<"/app/notion/[slug]">) {
  const { slug } = await params;
  const universe = universeOfNotion(slug);
  return (
    <>
      {universe !== "archipel" && <UniverseMarker universe={universe} />}
      {children}
    </>
  );
}
