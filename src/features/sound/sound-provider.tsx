"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { soundEngine, type SfxName } from "./sound-engine";

type SoundContextValue = {
  muted: boolean;
  started: boolean;
  toggleMuted: () => void;
  play: (name: SfxName) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);
const STORAGE_KEY = "chc:sound-muted";

const MUTED_EVENT = "chc:muted-change";
// Valeur de secours si le stockage du navigateur est indisponible
let memoryMuted = false;

function subscribeMuted(onChange: () => void) {
  window.addEventListener(MUTED_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(MUTED_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readMuted() {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === null ? memoryMuted : v === "1";
  } catch {
    return memoryMuted;
  }
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const muted = useSyncExternalStore(subscribeMuted, readMuted, () => false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Le son démarre au premier geste de l'utilisateur (exigence des navigateurs)
    const start = async () => {
      await soundEngine.unlock();
      soundEngine.setMuted(readMuted());
      soundEngine.startAmbient();
      setStarted(true);
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
    window.addEventListener("pointerdown", start);
    window.addEventListener("keydown", start);

    // Couper l'ambiance quand l'onglet est caché (économie de batterie)
    const onVisibility = () => {
      if (!soundEngine.ready) return;
      if (document.hidden) soundEngine.stopAmbient();
      else soundEngine.startAmbient();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const toggleMuted = useCallback(() => {
    const next = !readMuted();
    memoryMuted = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      // stockage indisponible : le son ne sera pas mémorisé
    }
    soundEngine.setMuted(next);
    window.dispatchEvent(new Event(MUTED_EVENT));
  }, []);

  const play = useCallback((name: SfxName) => soundEngine.play(name), []);

  const value = useMemo(() => ({ muted, started, toggleMuted, play }), [muted, started, toggleMuted, play]);
  return <SoundContext value={value}>{children}</SoundContext>;
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound doit être utilisé dans <SoundProvider>");
  return ctx;
}
