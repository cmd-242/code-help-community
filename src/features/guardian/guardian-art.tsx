"use client";

import { motion } from "motion/react";

/**
 * Silhouette du gardien : une créature encapuchonnée faite de pierre et d'ombre.
 * La couleur des yeux et des runes change d'un étage à l'autre.
 */
const HUES = ["#e4572e", "#7fe0c2", "#c792ea", "#f2a541", "#ff6b9a", "#6fb7ff"];

export function GuardianArt({ floor, className = "" }: { floor: number; className?: string }) {
  const eye = HUES[(floor - 1) % HUES.length];
  return (
    <div className={className}>
      <motion.svg
        viewBox="0 0 200 220"
        className="h-full w-full overflow-visible"
        aria-hidden
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <radialGradient id={`aura-${floor}`} cx="50%" cy="45%" r="55%">
            <stop offset="0" stopColor={eye} stopOpacity="0.45" />
            <stop offset="1" stopColor={eye} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`robe-${floor}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2c4650" />
            <stop offset="1" stopColor="#081115" />
          </linearGradient>
          <filter id={`glow-${floor}`}>
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <ellipse cx="100" cy="100" rx="98" ry="104" fill={`url(#aura-${floor})`} />
        {/* cornes de pierre */}
        <path d="M58 58 C40 40 34 18 44 6 C48 26 60 38 74 46z" fill="#3d5e69" />
        <path d="M142 58 C160 40 166 18 156 6 C152 26 140 38 126 46z" fill="#3d5e69" />
        {/* robe / corps */}
        <path
          d="M100 30 C138 30 156 64 158 104 C160 140 176 170 190 214 L10 214 C24 170 40 140 42 104 C44 64 62 30 100 30z"
          fill={`url(#robe-${floor})`}
          stroke="#3d5e69"
          strokeWidth="2"
        />
        {/* capuche : vide intérieur */}
        <path d="M100 52 C126 52 138 76 136 102 C134 124 118 136 100 136 C82 136 66 124 64 102 C62 76 74 52 100 52z" fill="#050b0d" />
        {/* yeux */}
        <motion.g
          filter={`url(#glow-${floor})`}
          animate={{ opacity: [1, 0.55, 1, 1, 0.8, 1] }}
          transition={{ duration: 3.2, repeat: Infinity }}
        >
          <path d="M78 96 L94 100 L80 106z" fill={eye} />
          <path d="M122 96 L106 100 L120 106z" fill={eye} />
        </motion.g>
        {/* runes gravées sur la robe */}
        <g stroke={eye} strokeOpacity="0.7" strokeWidth="2.2" fill="none" strokeLinecap="round" filter={`url(#glow-${floor})`}>
          <path d="M90 160 l10 -14 l10 14 M100 146 v26" />
          <path d="M62 186 l8 -8 l8 8" />
          <path d="M122 186 l8 -8 l8 8" />
        </g>
        {/* mains griffues */}
        <path d="M34 150 c-10 6 -14 18 -10 28 l6 -8 l2 10 l6 -9 l4 8 l2 -12 c2 -8 -2 -14 -10 -17z" fill="#1f3138" stroke="#3d5e69" />
        <path d="M166 150 c10 6 14 18 10 28 l-6 -8 l-2 10 l-6 -9 l-4 8 l-2 -12 c-2 -8 2 -14 10 -17z" fill="#1f3138" stroke="#3d5e69" />
      </motion.svg>
    </div>
  );
}
