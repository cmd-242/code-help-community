import type { Track } from "./types";

/** Parcours dont la carte est le « port » (/app) : le premier que découvre un nouvel apprenant. */
export const DEFAULT_TRACK_SLUG = "linux-debutant";

/** Page « carte » d'un parcours : le port, le camp d'un archipel, ou le plan de Néo-Métro. */
export function mapHref(track: Pick<Track, "slug">): string {
  return track.slug === DEFAULT_TRACK_SLUG ? "/app" : `/app/parcours/${track.slug}`;
}
