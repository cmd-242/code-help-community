"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Vrai seulement dans le navigateur, après hydratation (dates et fuseau horaire locaux). */
export function useMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
