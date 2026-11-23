import { Fragment, type ReactNode } from "react";
import type { LessonBlock } from "@/features/catalog/types";

/** Mise en forme légère : `code` et **gras** dans le texte des leçons. */
function inline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`"))
      return (
        <code key={i} className="rounded bg-ink/10 px-1.5 py-0.5 font-mono text-[0.92em] text-[#6b2f0d]">
          {part.slice(1, -1)}
        </code>
      );
    if (part.startsWith("**") && part.endsWith("**"))
      return (
        <strong key={i} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function LessonBody({ blocks }: { blocks: LessonBlock[] }) {
  return (
    <div className="mt-6 space-y-5 text-[1.18rem] leading-[1.7]">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "h":
            return (
              <h2 key={i} className="pt-3 font-display text-3xl text-ink">
                {b.text}
              </h2>
            );
          case "p":
            return <p key={i}>{inline(b.text)}</p>;
          case "code":
            return (
              <figure key={i}>
                <pre className="overflow-x-auto rounded-lg bg-[#13232a] px-4 py-3 font-mono text-[0.95rem] leading-relaxed text-[#e9dcc0] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                  <code>{b.code}</code>
                </pre>
                {b.caption && <figcaption className="mt-1.5 text-base italic text-ink/70">{inline(b.caption)}</figcaption>}
              </figure>
            );
          case "tip":
            return (
              <aside key={i} className="rounded-lg border-l-4 border-[#3e8f7a] bg-[#3e8f7a]/12 px-4 py-3">
                {inline(b.text)}
              </aside>
            );
          case "warn":
            return (
              <aside key={i} role="note" className="rounded-lg border-l-4 border-ember bg-ember/12 px-4 py-3">
                {inline(b.text)}
              </aside>
            );
        }
      })}
    </div>
  );
}
