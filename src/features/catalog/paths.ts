import type { Track } from "./types";

/** Page « carte » d'un parcours : le camp de l'Archipel, ou le plan de Néo-Métro. */
export function mapHref(track: Pick<Track, "slug" | "universe">): string {
  return track.universe === "metro" ? `/app/parcours/${track.slug}` : "/app";
}
