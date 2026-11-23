/**
 * Les gardiens des stations : machines originales dessinées en SVG.
 * La forme dépend de la position de la station, la couleur aussi.
 */
type Kind = "controller" | "drone" | "signal";

const CAST: { kind: Kind; body: string; glow: string }[] = [
  { kind: "controller", body: "#2f6bff", glow: "#ffd23f" },
  { kind: "drone", body: "#7c4dc4", glow: "#67d4ff" },
  { kind: "signal", body: "#e0452d", glow: "#ffd23f" },
  { kind: "drone", body: "#1f9e86", glow: "#fff2a8" },
  { kind: "controller", body: "#c4467e", glow: "#67d4ff" },
  { kind: "signal", body: "#ff8a1f", glow: "#ffffff" },
];

export function GuardianArt({ position, className = "", mood = "idle" }: { position: number; className?: string; mood?: "idle" | "hurt" }) {
  const c = CAST[(position - 1) % CAST.length];
  const hurt = mood === "hurt";
  const eye = (cx: number, cy: number, r: number) =>
    hurt ? (
      <path d={`M${cx - r} ${cy - r}l${2 * r} ${2 * r}M${cx + r} ${cy - r}l${-2 * r} ${2 * r}`} stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    ) : (
      <>
        <circle cx={cx} cy={cy} r={r + 2} fill="#0a0f1f" />
        <circle cx={cx} cy={cy} r={r} fill={c.glow} />
      </>
    );

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      {c.kind === "controller" && (
        <g>
          <rect x="38" y="96" width="124" height="86" rx="20" fill={c.body} />
          <rect x="58" y="116" width="84" height="46" rx="10" fill="#0a0f1f" opacity="0.35" />
          <rect x="30" y="112" width="18" height="52" rx="9" fill={c.body} />
          <rect x="152" y="112" width="18" height="52" rx="9" fill={c.body} />
          <path d="M86 182v12h28v-12" fill="#0a0f1f" />
          <rect x="50" y="34" width="100" height="70" rx="18" fill="#e8eeff" />
          <path d="M44 42c0-22 24-32 56-32s56 10 56 32z" fill="#141b36" />
          <rect x="40" y="38" width="120" height="9" rx="4.5" fill="#0a0f1f" />
          <circle cx="100" cy="24" r="6" fill={c.glow} />
          <rect x="62" y="56" width="76" height="34" rx="12" fill="#0a0f1f" />
          {eye(82, 73, 8)}
          {eye(118, 73, 8)}
          <rect x="78" y="124" width="44" height="26" rx="4" fill={c.glow} opacity="0.9" />
          <path d="M84 136h32" stroke="#0a0f1f" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
      {c.kind === "drone" && (
        <g>
          <ellipse cx="46" cy="52" rx="34" ry="8" fill="#e8eeff" opacity="0.7" className="animate-twinkle" />
          <ellipse cx="154" cy="52" rx="34" ry="8" fill="#e8eeff" opacity="0.7" className="animate-twinkle" />
          <rect x="44" y="52" width="6" height="30" fill="#141b36" />
          <rect x="150" y="52" width="6" height="30" fill="#141b36" />
          <circle cx="100" cy="112" r="66" fill={c.body} />
          <circle cx="100" cy="112" r="48" fill="#141b36" />
          <circle cx="100" cy="112" r="34" fill="#0a0f1f" />
          {hurt ? eye(100, 112, 14) : <circle cx="100" cy="112" r="20" fill={c.glow} />}
          {!hurt && <circle cx="108" cy="104" r="7" fill="#0a0f1f" />}
          <path d="M58 168l-14 22M142 168l14 22M100 178v16" stroke={c.body} strokeWidth="8" strokeLinecap="round" />
        </g>
      )}
      {c.kind === "signal" && (
        <g>
          <rect x="90" y="150" width="20" height="40" fill="#141b36" />
          <rect x="62" y="186" width="76" height="10" rx="5" fill="#141b36" />
          <rect x="56" y="16" width="88" height="140" rx="22" fill={c.body} />
          <rect x="68" y="28" width="64" height="116" rx="14" fill="#0a0f1f" />
          {hurt ? (
            <>
              {eye(100, 54, 10)}
              {eye(100, 100, 10)}
            </>
          ) : (
            <>
              <circle cx="100" cy="52" r="15" fill={c.glow} />
              <circle cx="100" cy="86" r="15" fill="#2a3560" />
              <circle cx="100" cy="120" r="15" fill="#2a3560" />
              <circle cx="95" cy="48" r="4" fill="#0a0f1f" />
              <circle cx="107" cy="48" r="4" fill="#0a0f1f" />
            </>
          )}
          <rect x="18" y="64" width="38" height="12" rx="6" fill={c.body} />
          <rect x="144" y="82" width="38" height="12" rx="6" fill={c.body} />
          <rect x="12" y="58" width="16" height="24" rx="4" fill={c.glow} />
          <rect x="172" y="76" width="16" height="24" rx="4" fill={c.glow} />
        </g>
      )}
    </svg>
  );
}
