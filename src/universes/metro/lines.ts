/**
 * Identité visuelle des lignes du Néo-Métro : une lettre et une couleur par parcours.
 * (Les couleurs vivent ici, dans le dossier de l'univers, comme l'exige la règle 18 bis.)
 * Un parcours inconnu reçoit la lettre de son domaine et la couleur suivante de la palette.
 */
const PALETTE = ["#2f6bff", "#ff8a1f", "#16a679", "#d6409f", "#8a5cf6", "#0ea5c6", "#e5484d", "#a3a312"] as const;

const KNOWN: Record<string, { letter: string; color: string }> = {
  "git-metro": { letter: "G", color: PALETTE[0] },
  "docker-metro": { letter: "D", color: PALETTE[1] },
  "aws-metro": { letter: "A", color: PALETTE[2] },
  "gcp-metro": { letter: "C", color: PALETTE[3] },
  "php-metro": { letter: "P", color: PALETTE[4] },
};

export function lineStyle(slug: string, index: number): { letter: string; color: string } {
  return KNOWN[slug] ?? { letter: slug.charAt(0).toUpperCase(), color: PALETTE[index % PALETTE.length] };
}
