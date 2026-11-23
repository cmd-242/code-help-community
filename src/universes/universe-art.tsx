import type { Universe } from "@/features/catalog/types";
import { BoatArt } from "./archipel/boat-art";
import { CreatureArt } from "./archipel/creature-art";
import { SeaWaves } from "./archipel/sea-waves";
import { CityScene } from "./metro/city-scene";
import { GuardianArt } from "./metro/guardian-art";
import { TrainArt } from "./metro/train-art";

/**
 * Habillage visuel d'un univers. Les écrans de jeu (étapes, gardien, notion, cartes)
 * ne connaissent pas l'Archipel ni Néo-Métro : ils demandent « le décor », « le gardien »
 * et « le véhicule » de l'univers du parcours (règle 18 bis : code neutre).
 */

/** Classe CSS du fond de scène (dégradé du ciel ou de la mer). */
export const sceneClass = (universe: Universe) => (universe === "metro" ? "city" : "sea");

export function Backdrop({ universe, tone }: { universe: Universe; tone?: "light" | "deep" }) {
  return universe === "metro" ? <CityScene /> : <SeaWaves tone={tone} />;
}

export function GuardianPortrait({ universe, position, mood, className }: { universe: Universe; position: number; mood?: "idle" | "hurt"; className?: string }) {
  return universe === "metro" ? (
    <GuardianArt position={position} mood={mood} className={className} />
  ) : (
    <CreatureArt position={position} mood={mood} className={className} />
  );
}

export function Vehicle({ universe, className, bobbing, title }: { universe: Universe; className?: string; bobbing?: boolean; title?: string }) {
  return universe === "metro" ? (
    <TrainArt className={className} bobbing={bobbing} title={title} />
  ) : (
    <BoatArt className={className} bobbing={bobbing} title={title} />
  );
}
