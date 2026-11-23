/**
 * Les gardiens des îles : créatures originales dessinées en SVG.
 * La forme et la couleur dépendent de la position de l'île dans le parcours.
 */
type Kind = "parrot" | "kraken" | "serpent";

const CAST: { kind: Kind; body: string; belly: string }[] = [
  { kind: "parrot", body: "#e8503f", belly: "#ffcf6b" },
  { kind: "kraken", body: "#7c5cc4", belly: "#b9a3ef" },
  { kind: "serpent", body: "#1f9e86", belly: "#9fe6cf" },
  { kind: "kraken", body: "#c4467e", belly: "#f2a7c8" },
  { kind: "serpent", body: "#d0602a", belly: "#ffc48a" },
  { kind: "kraken", body: "#2b4c7e", belly: "#8fb2e6" },
];

export function CreatureArt({ position, className = "", mood = "idle" }: { position: number; className?: string; mood?: "idle" | "hurt" }) {
  const c = CAST[(position - 1) % CAST.length];
  const eyes = mood === "hurt" ? <HurtEyes /> : null;
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      {c.kind === "parrot" && (
        <g>
          <path d="M100 186c-34 0-54-24-54-64 0-44 26-82 62-82 30 0 46 24 46 52 0 18-6 30-6 30s20 6 20 26c0 24-30 38-68 38z" fill={c.body} />
          <path d="M84 120c0-22 14-36 30-36s22 18 22 36c0 26-14 46-28 46s-24-20-24-46z" fill={c.belly} />
          <path d="M120 60c22 0 34 10 34 22-12-4-22-4-34 2z" fill="#13324b" />
          <path d="M126 64c18 2 26 12 22 22-6-6-14-8-22-6z" fill="#ffcf6b" />
          <path d="M62 96c-30 8-44 34-40 64 12-20 30-30 48-32z" fill="#2ec4d6" />
          <path d="M90 34c-6-14 0-28 0-28s10 10 12 24M104 30c2-14 14-22 14-22s2 14-6 26" fill="#2f7d4a" />
          {eyes ?? (
            <g>
              <circle cx="108" cy="70" r="10" fill="#fff8ec" />
              <circle cx="111" cy="70" r="5" fill="#13324b" />
            </g>
          )}
        </g>
      )}
      {c.kind === "kraken" && (
        <g>
          {[30, 62, 94, 126, 158].map((x, i) => (
            <path
              key={x}
              d={`M${x + 6} 120c${i % 2 ? 10 : -10} 30 ${i % 2 ? -14 : 14} 50 ${i % 2 ? 6 : -6} 70`}
              stroke={c.body}
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
            />
          ))}
          <path d="M100 20c44 0 66 34 66 70 0 30-22 46-66 46S34 120 34 90c0-36 22-70 66-70z" fill={c.body} />
          <ellipse cx="100" cy="112" rx="44" ry="16" fill={c.belly} opacity="0.5" />
          <circle cx="64" cy="50" r="7" fill={c.belly} opacity="0.6" />
          <circle cx="140" cy="42" r="5" fill={c.belly} opacity="0.6" />
          {eyes ?? (
            <g>
              <ellipse cx="80" cy="82" rx="13" ry="15" fill="#fff8ec" />
              <ellipse cx="120" cy="82" rx="13" ry="15" fill="#fff8ec" />
              <circle cx="82" cy="86" r="6" fill="#13324b" />
              <circle cx="118" cy="86" r="6" fill="#13324b" />
              <path d="M66 64l24 8M134 64l-24 8" stroke="#13324b" strokeWidth="5" strokeLinecap="round" />
            </g>
          )}
        </g>
      )}
      {c.kind === "serpent" && (
        <g>
          <path d="M30 180c0-40 40-40 40-70s-30-30-30-60c0-28 26-44 56-44 34 0 58 22 58 50 0 22-16 34-34 34" stroke={c.body} strokeWidth="34" strokeLinecap="round" fill="none" />
          <path d="M30 180c0-40 40-40 40-70s-30-30-30-60" stroke={c.belly} strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.7" />
          <path d="M150 20l12-14 4 18M124 12l4-12 10 14" fill={c.belly} />
          {eyes ?? (
            <g>
              <ellipse cx="126" cy="50" rx="11" ry="12" fill="#fff8ec" />
              <ellipse cx="156" cy="54" rx="9" ry="10" fill="#fff8ec" />
              <rect x="124" y="42" width="5" height="16" rx="2.5" fill="#13324b" />
              <rect x="153" y="47" width="4" height="13" rx="2" fill="#13324b" />
            </g>
          )}
          <path d="M138 78c6 6 14 6 20 0" stroke="#13324b" strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>
      )}
    </svg>
  );
}

function HurtEyes() {
  return (
    <g stroke="#13324b" strokeWidth="5" strokeLinecap="round">
      <path d="M74 76l12 12M86 76l-12 12M114 76l12 12M126 76l-12 12" />
    </g>
  );
}
