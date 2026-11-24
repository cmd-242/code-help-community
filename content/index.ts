import type { TrackInput } from "@/features/catalog/types";
import { awsTrack } from "./aws";
import { dockerTrack } from "./docker";
import { gcpTrack } from "./gcp";
import { phpAvanceTrack } from "./php-avance";
import { gitTrack } from "./git";
import { htmlCssTrack } from "./html-css";
import { javascriptTrack } from "./javascript";
import { linuxTrack } from "./linux";
import { phpTrack } from "./php";
import { reseauxTrack } from "./reseaux";
import { securiteTrack } from "./securite";
import { sqlTrack } from "./sql";
import { pythonTrack } from "./python";

/** Tous les parcours du catalogue, dans l'ordre d'affichage. */
export const allTracks: TrackInput[] = [linuxTrack, pythonTrack, htmlCssTrack, phpTrack, javascriptTrack, sqlTrack, reseauxTrack, securiteTrack, gitTrack, dockerTrack, awsTrack, gcpTrack, phpAvanceTrack];
