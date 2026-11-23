"use client";

import { useTranslations } from "next-intl";
import { useSound } from "./sound-provider";

export function SoundToggle() {
  const t = useTranslations("sound");
  const { muted, toggleMuted } = useSound();
  return (
    <button
      type="button"
      onClick={toggleMuted}
      aria-pressed={!muted}
      aria-label={muted ? t("unmute") : t("mute")}
      title={muted ? t("unmute") : t("mute")}
      className="grid size-10 place-items-center rounded-full border border-stone-edge/60 bg-abyss/70 text-torch transition hover:border-torch hover:text-torch-bright"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
        <path d="M4 9.5h3.5L12 5v14l-4.5-4.5H4z" fill="currentColor" fillOpacity="0.25" />
        {muted ? (
          <path d="M16 9l5 6M21 9l-5 6" />
        ) : (
          <>
            <path d="M15.5 9a4 4 0 010 6" />
            <path d="M18 6.5a7.5 7.5 0 010 11" />
          </>
        )}
      </svg>
    </button>
  );
}
