"use client";

import { useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { importGuest, loadProgress } from "./actions";
import { snapshotOf, useProgress } from "./progress-store";
import { setSyncEnabled } from "./sync-queue";
import { isEmptySnapshot } from "./sync-schema";
import { ensureHydrated } from "./use-hydrated-progress";

const OWNER_KEY = "chc:progress-owner";

/**
 * Relie la progression du navigateur au compte :
 * - à la connexion, la progression jouée en invité est reprise (si le compte est vide),
 *   puis l'état du serveur remplace celui de l'appareil et la synchronisation démarre ;
 * - à la déconnexion, l'appareil repart d'une progression d'invité vierge.
 */
export function ProgressSync() {
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user.id ?? null;
  const done = useRef<string | null>(null);

  useEffect(() => {
    if (isPending) return;
    let cancelled = false;

    const run = async () => {
      await ensureHydrated();
      let owner: string | null = null;
      try {
        owner = window.localStorage.getItem(OWNER_KEY);
      } catch {
        owner = null;
      }

      if (!userId) {
        setSyncEnabled(false);
        if (owner) {
          // On quitte un compte : l'appareil redevient celui d'un invité
          useProgress.getState().reset();
          try {
            window.localStorage.removeItem(OWNER_KEY);
          } catch {}
        }
        done.current = null;
        return;
      }
      if (done.current === userId) return;

      setSyncEnabled(false);
      const local = snapshotOf(useProgress.getState());
      // Progression jouée en invité sur cet appareil : on la confie au compte
      if (!owner && !isEmptySnapshot(local)) await importGuest(local);
      const server = await loadProgress();
      if (cancelled || !server) return;
      useProgress.setState(server);
      try {
        window.localStorage.setItem(OWNER_KEY, userId);
      } catch {}
      done.current = userId;
      setSyncEnabled(true);
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [userId, isPending]);

  return null;
}
