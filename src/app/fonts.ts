import localFont from "next/font/local";

// Polices embarquées dans le dépôt (pas d'appel réseau au build).

/** Titres et boutons : arrondie, chaleureuse, lisible sur petit écran */
export const fredoka = localFont({
  variable: "--font-fredoka",
  display: "swap",
  src: [
    { path: "../fonts/fredoka-latin-500-normal.woff2", weight: "500" },
    { path: "../fonts/fredoka-latin-600-normal.woff2", weight: "600" },
    { path: "../fonts/fredoka-latin-700-normal.woff2", weight: "700" },
  ],
});

/** Texte courant */
export const nunito = localFont({
  variable: "--font-nunito",
  display: "swap",
  src: [
    { path: "../fonts/nunito-latin-400-normal.woff2", weight: "400" },
    { path: "../fonts/nunito-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/nunito-latin-600-normal.woff2", weight: "600" },
    { path: "../fonts/nunito-latin-700-normal.woff2", weight: "700" },
    { path: "../fonts/nunito-latin-800-normal.woff2", weight: "800" },
  ],
});

/** Code et commandes uniquement */
export const jetbrains = localFont({
  variable: "--font-jetbrains",
  display: "swap",
  src: [
    { path: "../fonts/jetbrains-mono-latin-400-normal.woff2", weight: "400" },
    { path: "../fonts/jetbrains-mono-latin-600-normal.woff2", weight: "600" },
  ],
});

/** Néo-Métro : lettres de panneaux de station, condensées et très lisibles */
export const signal = localFont({
  variable: "--font-signal",
  display: "swap",
  src: [
    { path: "../fonts/barlow-semi-condensed-latin-600-normal.woff2", weight: "600" },
    { path: "../fonts/barlow-semi-condensed-latin-700-normal.woff2", weight: "700" },
  ],
});
