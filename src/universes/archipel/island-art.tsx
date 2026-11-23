/**
 * Une île dessinée. La forme varie selon `seed` ; l'état change le décor :
 * drapeau planté (conquise), brume (pas encore accessible).
 */
const SHAPES = [
  { sand: "M14 64c6-30 70-44 112-26c28 12 26 40-8 50c-38 11-108 8-104-24z", grass: "M28 62c6-20 56-30 86-17c20 9 14 28-10 33c-28 6-80 3-76-16z" },
  { sand: "M10 58c10-34 92-40 118-14c18 18-2 40-40 44c-44 5-84-4-78-30z", grass: "M24 56c8-22 66-28 86-10c13 13-2 28-30 30c-32 3-60-3-56-20z" },
  { sand: "M18 66c-2-26 40-46 84-38c32 6 40 34 14 46c-30 14-96 18-98-8z", grass: "M32 62c-1-17 30-30 62-25c23 4 28 22 9 30c-22 9-70 12-71-5z" },
];

export function IslandArt({
  seed,
  state,
  className = "",
}: {
  seed: number;
  state: "cleared" | "current" | "open" | "locked";
  className?: string;
}) {
  const shape = SHAPES[seed % SHAPES.length];
  const locked = state === "locked";
  return (
    <svg viewBox="0 0 140 96" className={className} aria-hidden>
      {/* écume autour de l'île */}
      <path d={shape.sand} fill="#ffffff" fillOpacity="0.45" transform="translate(70 52) scale(1.08) translate(-70 -52)" />
      <path d={shape.sand} fill={locked ? "#e6e1d3" : "#f7dda4"} />
      <path d={shape.grass} fill={locked ? "#b8c4bc" : "#6bcb77"} />
      {/* palmier */}
      <g transform="translate(64 20)" opacity={locked ? 0.4 : 1}>
        <path d="M6 38c-3-14 2-26 2-26" stroke="#8b5a2b" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <path d="M8 12c-12-4-18 4-18 4M8 12c10-8 18-2 18-2M8 12c-4-10-14-10-14-10M8 12c6-10 14-8 14-8" stroke="#2f7d4a" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
      {state === "cleared" && (
        <g transform="translate(96 22)">
          <path d="M2 0v30" stroke="#13324b" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M3 1h20l-5 6 5 6H3z" fill="#e8503f" />
        </g>
      )}
      {locked && (
        <g fill="#ffffff">
          <ellipse cx="50" cy="40" rx="46" ry="15" opacity="0.85" />
          <ellipse cx="96" cy="54" rx="40" ry="13" opacity="0.75" />
        </g>
      )}
    </svg>
  );
}
