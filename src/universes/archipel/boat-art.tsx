/** Le bateau de l'apprenant : il flotte doucement (animation CSS « bob »). */
export function BoatArt({ className = "", bobbing = true, title }: { className?: string; bobbing?: boolean; title?: string }) {
  return (
    <svg
      viewBox="0 0 60 52"
      className={`${bobbing ? "animate-bob" : ""} ${className}`}
      {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}
    >
      <path d="M2 34h56l-10 14H12z" fill="#a86d3a" />
      <path d="M2 34h56l-2 3H4z" fill="#7a4a24" />
      <circle cx="20" cy="41" r="2" fill="#ffcf6b" />
      <circle cx="30" cy="41" r="2" fill="#ffcf6b" />
      <circle cx="40" cy="41" r="2" fill="#ffcf6b" />
      <path d="M30 4v30" stroke="#13324b" strokeWidth="2.6" />
      <path d="M32 6c10 6 16 16 16 24H32z" fill="#fff8ec" stroke="#e6d6b8" strokeWidth="1" />
      <path d="M28 10c-8 6-12 14-12 20h12z" fill="#fff8ec" stroke="#e6d6b8" strokeWidth="1" />
      <path d="M30 2l11 4-11 4z" fill="#e8503f" />
    </svg>
  );
}
