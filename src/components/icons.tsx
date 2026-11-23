/** Icônes dessinées (SVG en ligne, aucune dépendance). Neutres ou marines. */

type IconProps = { className?: string; title?: string };

const a11y = (title?: string) =>
  title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const };

export function StarIcon({ className = "size-6", filled = true, title }: IconProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...a11y(title)}>
      <path
        d="M12 2.6l2.8 6 6.5.7-4.9 4.4 1.4 6.4L12 16.8l-5.8 3.3 1.4-6.4-4.9-4.4 6.5-.7z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Bouée : les « vies » d'une épreuve */
export function LifebuoyIcon({ className = "size-7", filled = true, title }: IconProps & { filled?: boolean }) {
  if (!filled)
    return (
      <svg viewBox="0 0 30 30" className={className} {...a11y(title)}>
        <circle cx="15" cy="15" r="10.5" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="6.5" />
      </svg>
    );
  return (
    <svg viewBox="0 0 30 30" className={className} {...a11y(title)}>
      <circle cx="15" cy="15" r="10.5" fill="none" stroke="#e8503f" strokeWidth="6.5" />
      <circle cx="15" cy="15" r="10.5" fill="none" stroke="#fff8ec" strokeWidth="6.5" strokeDasharray="8.25 8.25" />
      <circle cx="15" cy="15" r="13.8" fill="none" stroke="#13324b" strokeOpacity="0.15" strokeWidth="1" />
    </svg>
  );
}

export function FlameIcon({ className = "size-6", title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...a11y(title)}>
      <path d="M12 2c4 4 6.5 7.3 6.5 11.2A6.5 6.5 0 0112 20a6.5 6.5 0 01-6.5-6.8c0-2.4 1.2-4.2 2.6-5.6.2 1.8.9 3 2 3.6C9.8 7.8 10.6 4.6 12 2z" fill="currentColor" />
      <path d="M12 11.5c1.8 1.8 2.8 3.2 2.8 4.8a2.8 2.8 0 01-5.6 0c0-1.3.9-2.5 2.8-4.8z" fill="#ffcf6b" />
    </svg>
  );
}

export function LockIcon({ className = "size-6", title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" {...a11y(title)}>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor" fillOpacity="0.15" />
      <path d="M8 10.5V8a4 4 0 018 0v2.5" />
    </svg>
  );
}

export function AnchorIcon({ className = "size-6", title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...a11y(title)}>
      <circle cx="12" cy="5" r="2.2" />
      <path d="M12 7.2V21M7.5 11h9M4 14c0 4 3.6 7 8 7s8-3 8-7" />
    </svg>
  );
}

export function ChestIcon({ className = "size-6", title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...a11y(title)}>
      <path d="M3 10h18v10H3z" fill="#a86d3a" />
      <path d="M3 10a9 5 0 0118 0z" fill="#c2834a" />
      <path d="M3 10h18v2H3z" fill="#7a4a24" />
      <rect x="10.5" y="11" width="3" height="4" rx="0.8" fill="#ffcf6b" />
    </svg>
  );
}

export function LogbookIcon({ className = "size-6", title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" {...a11y(title)}>
      <path d="M5 3.5h11.5a2 2 0 012 2V20.5H7a2 2 0 01-2-2z" fill="currentColor" fillOpacity="0.12" />
      <path d="M5 18.5a2 2 0 012-2h11.5" />
      <path d="M9 7.5h6M9 10.5h6" strokeLinecap="round" />
    </svg>
  );
}

export function SailIcon({ className = "size-6", title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...a11y(title)}>
      <path d="M3 17h18l-3 4H6z" fill="#a86d3a" />
      <path d="M12 2v15" stroke="currentColor" strokeWidth="1.8" />
      <path d="M13 3l7 12h-7z" fill="currentColor" fillOpacity="0.85" />
      <path d="M11 6l-6 9h6z" fill="currentColor" fillOpacity="0.55" />
    </svg>
  );
}

export function FlagIcon({ className = "size-6", title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...a11y(title)}>
      <path d="M6 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 4h12l-3 4 3 4H6z" fill="#e8503f" />
    </svg>
  );
}

export function CloseIcon({ className = "size-5", title }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} {...a11y(title)}>
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function WavesIcon({ className = "size-6", title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...a11y(title)}>
      <path d="M2 9c2.5-2 4.5-2 7 0s4.5 2 7 0 4.5-2 6 0M2 15c2.5-2 4.5-2 7 0s4.5 2 7 0 4.5-2 6 0" />
    </svg>
  );
}
