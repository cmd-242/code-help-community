/** Le train de l'apprenant dans Néo-Métro (équivalent du bateau de l'Archipel). */
export function TrainArt({ className = "", bobbing = true, title }: { className?: string; bobbing?: boolean; title?: string }) {
  return (
    <svg
      viewBox="0 0 80 40"
      className={`${bobbing ? "animate-bob" : ""} ${className}`}
      {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}
    >
      <rect x="2" y="6" width="68" height="26" rx="9" fill="#e8eeff" />
      <path d="M70 6c6 4 8 12 8 26H70z" fill="#c9d4f5" />
      <rect x="2" y="22" width="76" height="5" fill="#2f6bff" />
      {[8, 22, 36, 50].map((x) => (
        <rect key={x} x={x} y="11" width="10" height="9" rx="2.5" fill="#141b36" />
      ))}
      <rect x="63" y="11" width="9" height="9" rx="2.5" fill="#67d4ff" />
      <circle cx="77" cy="26" r="2.2" fill="#ffd23f" />
      <rect x="10" y="32" width="12" height="4" rx="2" fill="#141b36" />
      <rect x="52" y="32" width="12" height="4" rx="2" fill="#141b36" />
    </svg>
  );
}
