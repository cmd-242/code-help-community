"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { useSound } from "@/features/sound/sound-provider";
import type { SfxName } from "@/features/sound/sound-engine";

type Variant = "primary" | "secondary" | "success" | "wood";

/** Boutons « jouets » : épais, arrondis, avec une ombre franche qui s'enfonce au clic. */
const styles: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary shadow-[0_6px_0_var(--color-primary-deep)] hover:brightness-105 active:translate-y-[4px] active:shadow-[0_2px_0_var(--color-primary-deep)]",
  secondary:
    "bg-surface text-ink shadow-[0_0_0_2px_var(--color-line),0_6px_0_var(--color-line)] hover:bg-surface-hover active:translate-y-[4px] active:shadow-[0_0_0_2px_var(--color-line),0_2px_0_var(--color-line)]",
  success:
    "bg-success text-on-success shadow-[0_6px_0_var(--color-success-deep)] hover:brightness-105 active:translate-y-[4px] active:shadow-[0_2px_0_var(--color-success-deep)]",
  wood: "bg-wood text-white shadow-[0_6px_0_var(--color-wood-deep)] hover:brightness-105 active:translate-y-[4px] active:shadow-[0_2px_0_var(--color-wood-deep)]",
};

const base =
  "relative inline-flex min-h-13 select-none items-center justify-center gap-2 rounded-2xl px-6 py-3 font-display text-xl font-semibold transition-[transform,filter,box-shadow,background-color] duration-100 disabled:pointer-events-none disabled:opacity-45";

type Common = { variant?: Variant; children: ReactNode; className?: string; sfx?: SfxName };

export function GameButton({
  variant = "primary",
  className = "",
  sfx = "click",
  children,
  onClick,
  ...rest
}: Common & ComponentProps<"button">) {
  const { play } = useSound();
  return (
    <button
      type="button"
      {...rest}
      onPointerEnter={() => play("hover")}
      onClick={(e) => {
        play(sfx);
        onClick?.(e);
      }}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function GameLink({
  variant = "primary",
  className = "",
  sfx = "click",
  children,
  href,
  ...rest
}: Common & ComponentProps<typeof Link>) {
  const { play } = useSound();
  return (
    <Link
      href={href}
      {...rest}
      onPointerEnter={() => play("hover")}
      onClick={() => play(sfx)}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
