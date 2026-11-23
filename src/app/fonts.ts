import localFont from "next/font/local";

// Polices embarquées dans le dépôt (pas d'appel réseau au build).
export const grenze = localFont({
  variable: "--font-grenze",
  display: "swap",
  src: [
    { path: "../fonts/grenze-gotisch-latin-500-normal.woff2", weight: "500" },
    { path: "../fonts/grenze-gotisch-latin-700-normal.woff2", weight: "700" },
    { path: "../fonts/grenze-gotisch-latin-900-normal.woff2", weight: "900" },
  ],
});

export const alegreya = localFont({
  variable: "--font-alegreya",
  display: "swap",
  src: [
    { path: "../fonts/alegreya-sans-latin-400-normal.woff2", weight: "400" },
    { path: "../fonts/alegreya-sans-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/alegreya-sans-latin-500-normal.woff2", weight: "500" },
    { path: "../fonts/alegreya-sans-latin-700-normal.woff2", weight: "700" },
    { path: "../fonts/alegreya-sans-latin-800-normal.woff2", weight: "800" },
  ],
});

export const jetbrains = localFont({
  variable: "--font-jetbrains",
  display: "swap",
  src: [
    { path: "../fonts/jetbrains-mono-latin-400-normal.woff2", weight: "400" },
    { path: "../fonts/jetbrains-mono-latin-600-normal.woff2", weight: "600" },
  ],
});
