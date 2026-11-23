"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useProgress } from "./progress-store";

let hydration: Promise<void> | null = null;

/** Recharge la progression stockée une seule fois, puis enregistre la journée active. */
function ensureHydrated() {
  if (!hydration) {
    hydration = Promise.resolve(useProgress.persist.rehydrate()).then(() => useProgress.getState().touchToday());
  }
  return hydration;
}

/**
 * Indique si la progression stockée est chargée. Elle n'est lue qu'après le montage,
 * pour éviter tout écart entre le rendu serveur et le rendu client.
 */
export function useHydratedProgress() {
  const hydrated = useSyncExternalStore(
    (onChange) => useProgress.persist.onFinishHydration(onChange),
    () => useProgress.persist.hasHydrated(),
    () => false,
  );
  useEffect(() => {
    void ensureHydrated();
  }, []);
  return hydrated;
}
