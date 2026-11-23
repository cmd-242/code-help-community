"use client";

import { useTranslations } from "next-intl";
import { useSound } from "./sound-provider";

export function SoundToggle({ className = "" }: { className?: string }) {
  const t = useTranslations("sound");
  const { muted, toggleMuted } = useSound();
  return (
    <button
      type="button"
      onClick={toggleMuted}
      aria-pressed={!muted}
      aria-label={muted ? t("unmute") : t("mute")}
      title={muted ? t("unmute") : t("mute")}
      className={`grid size-11 shrink-0 place-items-center rounded-full bg-surface text-ink shadow-[0_0_0_2px_var(--color-line),0_4px_0_var(--color-line)] transition active:translate-y-[3px] active:shadow-[0_0_0_2px_var(--color-line),0_1px_0_var(--color-line)] ${className}`}
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <path d="M4 9.5h3.5L12 5v14l-4.5-4.5H4z" fill="currentColor" fillOpacity="0.2" />
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
