/**
 * La ville de nuit : deux rangées d'immeubles, des fenêtres allumées,
 * un viaduc sur lequel passe de temps en temps un train lumineux.
 * Pur SVG + CSS : aucune image, aucun JavaScript. Les immeubles viennent d'un tirage
 * déterministe (graine fixe), donc identiques au rendu serveur et chez l'utilisateur.
 */

function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Building = { x: number; w: number; h: number; antenna: boolean; windows: { x: number; y: number; lit: "warm" | "cool" | null }[] };

function skyline(seed: number, minH: number, maxH: number, withWindows: boolean): Building[] {
  const r = rng(seed);
  const out: Building[] = [];
  let x = -10;
  while (x < 810) {
    const w = 34 + Math.floor(r() * 46);
    const h = minH + Math.floor(r() * (maxH - minH));
    const windows: Building["windows"] = [];
    if (withWindows) {
      for (let wy = 12; wy < h - 8; wy += 14)
        for (let wx = 7; wx < w - 9; wx += 11) {
          const roll = r();
          windows.push({ x: wx, y: wy, lit: roll < 0.28 ? "warm" : roll < 0.4 ? "cool" : null });
        }
    }
    out.push({ x, w, h, antenna: r() > 0.8, windows });
    x += w + Math.floor(r() * 6);
  }
  return out;
}

const FAR = skyline(7, 60, 120, false);
const NEAR = skyline(23, 80, 170, true);

export function CitySkyline({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 200" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden>
      <g fill="#1a2250">
        {FAR.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={200 - b.h} width={b.w} height={b.h} />
            {b.antenna && <rect x={b.x + b.w / 2 - 1} y={200 - b.h - 16} width="2" height="16" />}
          </g>
        ))}
      </g>
      <g>
        {NEAR.map((b, i) => (
          <g key={i} transform={`translate(${b.x} ${200 - b.h})`}>
            <rect width={b.w} height={b.h} fill="#0d1233" />
            {b.antenna && <rect x={b.w / 2 - 1} y="-18" width="2" height="18" fill="#0d1233" />}
            {b.antenna && <circle cx={b.w / 2} cy="-18" r="2" fill="#ff4d5e" className="animate-twinkle" />}
            {b.windows.map((w, k) =>
              w.lit ? (
                <rect key={k} x={w.x} y={w.y} width="6" height="8" rx="1" fill={w.lit === "warm" ? "#ffd23f" : "#67d4ff"} opacity={0.85} />
              ) : (
                <rect key={k} x={w.x} y={w.y} width="6" height="8" rx="1" fill="#1a2250" />
              ),
            )}
          </g>
        ))}
      </g>
      {/* viaduc */}
      <rect x="0" y="176" width="800" height="5" fill="#2a3560" />
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} x={30 + i * 60} y="181" width="5" height="19" fill="#2a3560" />
      ))}
    </svg>
  );
}

/** Fond animé d'un en-tête : ciel, étoiles qui scintillent, ville, train qui traverse. */
export function CityScene({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute size-[3px] animate-twinkle rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${s.d}s` }}
        />
      ))}
      <CitySkyline className="absolute inset-x-0 bottom-0 h-3/4 w-full" />
      <div className="absolute bottom-[1.5%] h-[3%] min-h-1.5 w-24 animate-[cross_22s_linear_infinite] rounded-full bg-gradient-to-r from-transparent via-info to-white opacity-90 shadow-[0_0_14px_3px_rgba(103,212,255,0.7)]" />
    </div>
  );
}

const STARS = (() => {
  const r = rng(99);
  return Array.from({ length: 22 }, () => ({ x: Math.round(r() * 100), y: Math.round(r() * 45), d: Math.round(r() * 30) / 10 }));
})();
