"use client";

import { useEffect } from "react";
import type { Universe } from "@/features/catalog/types";
import { soundEngine } from "./sound-engine";

/**
 * Marque la page comme appartenant à un univers :
 * - le thème s'applique à toute la page par CSS (:root:has([data-universe-marker]))
 *   dès le rendu serveur, sans éclair de l'autre univers ;
 * - le moteur sonore bascule sur les sons de cet univers, et revient à l'Archipel en quittant.
 */
export function UniverseMarker({ universe }: { universe: Universe }) {
  useEffect(() => {
    soundEngine.setUniverse(universe);
    return () => soundEngine.setUniverse("archipel");
  }, [universe]);
  return <span hidden data-universe-marker={universe} />;
}
