import { Fragment, type ReactNode } from "react";
import type { LessonBlock } from "@/features/catalog/types";

/** Mise en forme légère : `code` et **gras** dans le texte des leçons. */
function inline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`"))
      return (
        <code key={i} className="rounded-md bg-ink/10 px-1.5 py-0.5 font-mono text-[0.92em] text-ink">
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
              <h2 key={i} className="pt-3 font-display text-3xl font-bold text-ink">
                {b.text}
              </h2>
            );
          case "p":
            return <p key={i}>{inline(b.text)}</p>;
          case "code":
            return (
              <figure key={i}>
                <pre className="overflow-x-auto rounded-2xl bg-ink px-4 py-3 font-mono text-[0.95rem] leading-relaxed text-[#e9f7f5]">
                  <code>{b.code}</code>
                </pre>
                {b.caption && <figcaption className="mt-1.5 text-base italic text-muted">{inline(b.caption)}</figcaption>}
              </figure>
            );
          case "tip":
            return (
              <aside key={i} className="rounded-2xl bg-success/25 px-4 py-3">
                {inline(b.text)}
              </aside>
            );
          case "warn":
            return (
              <aside key={i} role="note" className="rounded-2xl bg-primary/12 px-4 py-3 font-semibold">
                {inline(b.text)}
              </aside>
            );
        }
      })}
    </div>
  );
}
