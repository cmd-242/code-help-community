/**
 * Vagues qui défilent lentement (deux couches décalées).
 * Pur CSS + SVG : aucune image, aucun JavaScript, s'arrête si l'utilisateur réduit les animations.
 */
export function SeaWaves({ className = "", tone = "light" }: { className?: string; tone?: "light" | "deep" }) {
  const color = tone === "light" ? "#ffffff" : "#147a91";
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {[
        { top: "18%", opacity: 0.35, duration: "14s" },
        { top: "46%", opacity: 0.25, duration: "19s" },
        { top: "74%", opacity: 0.3, duration: "11s" },
      ].map((row, i) => (
        <div key={i} className="absolute left-0 flex w-[200%] animate-waves" style={{ top: row.top, animationDuration: row.duration }}>
          {[0, 1].map((k) => (
            <svg key={k} viewBox="0 0 400 20" preserveAspectRatio="none" className="h-5 w-1/2">
              <path
                d="M0 10 q12 -8 25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0"
                fill="none"
                stroke={color}
                strokeOpacity={row.opacity}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeDasharray="30 70"
              />
            </svg>
          ))}
        </div>
      ))}
    </div>
  );
}
