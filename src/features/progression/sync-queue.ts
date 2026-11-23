import { syncProgress } from "./actions";
import type { ProgressOp } from "./sync-schema";

/**
 * File de synchronisation : quand l'apprenant est connecté, chaque action du jeu
 * est mise en file puis envoyée au serveur par lots (toutes les 800 ms au plus).
 * En invité, rien n'est envoyé : la progression reste sur l'appareil.
 */
let enabled = false;
let queue: ProgressOp[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;
let flushing = false;

export function setSyncEnabled(value: boolean) {
  enabled = value;
  if (!value) {
    queue = [];
    if (timer) clearTimeout(timer);
    timer = null;
  }
}

export function enqueue(op: ProgressOp) {
  if (!enabled) return;
  queue.push(op);
  schedule(800);
}

function schedule(delay: number) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => void flush(), delay);
}

export async function flush() {
  if (flushing || queue.length === 0 || !enabled) return;
  flushing = true;
  const batch = queue.splice(0, 200);
  try {
    await syncProgress(batch);
  } catch {
    // Réseau coupé : on remet le lot en tête de file et on réessaie plus tard
    queue = [...batch, ...queue];
    schedule(5000);
  } finally {
    flushing = false;
    if (queue.length) schedule(200);
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") void flush();
  });
}
