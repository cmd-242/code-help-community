"use client";

import dynamic from "next/dynamic";

/** CodeMirror est lourd : chargé à la demande, seulement sur les exercices qui l'utilisent (règle n°13). */
export const CodeEditor = dynamic(() => import("./code-editor"), {
  ssr: false,
  loading: () => <div className="min-h-40 animate-pulse rounded-2xl bg-surface-sunk" aria-hidden />,
});
