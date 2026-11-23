import { getTranslations } from "next-intl/server";
import type { Universe } from "@/features/catalog/types";

/** Version serveur de useWorldT (voir world-text.ts). */
export async function getWorldT(namespace: string, universe: Universe) {
  const t = (await getTranslations(namespace as never)) as unknown as ((key: string, values?: Record<string, unknown>) => string) & { has: (key: string) => boolean };
  return (key: string, values?: Record<string, unknown>) => (universe === "metro" && t.has(`metro.${key}`) ? t(`metro.${key}`, values) : t(key, values));
}
