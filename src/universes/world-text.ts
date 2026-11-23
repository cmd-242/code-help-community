"use client";

import { useTranslations } from "next-intl";
import type { Universe } from "@/features/catalog/types";

/**
 * Traducteur « vocabulaire de l'univers ». Un écran commun à tous les univers (étape, gardien, cours)
 * demande ses textes ici : si la clé existe sous `metro.<clé>` et que l'univers est Néo-Métro,
 * on prend cette variante, sinon le texte de l'Archipel. Aucun mot d'un univers dans le code des écrans.
 */
export function useWorldT(namespace: string, universe: Universe) {
  const t = useTranslations(namespace as never) as unknown as ((key: string, values?: Record<string, unknown>) => string) & { has: (key: string) => boolean };
  return (key: string, values?: Record<string, unknown>) => (universe === "metro" && t.has(`metro.${key}`) ? t(`metro.${key}`, values) : t(key, values));
}
