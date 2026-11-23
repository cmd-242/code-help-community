/** Icônes dessinées pour l'univers du donjon (SVG en ligne, aucune dépendance). */

type IconProps = { className?: string; title?: string };

const svg = (title?: string) =>
  title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const };

export function TorchIcon({ className = "size-6", title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...svg(title)}>
      <path d="M12 2c2.6 2.4 3.4 4.7 2.4 6.7-.6 1.3-1.6 2-2.4 2.3-.8-.3-1.8-1-2.4-2.3C8.6 6.7 9.4 4.4 12 2z" fill="currentColor" />
      <path d="M12 5.5c1 1.1 1.3 2.1.8 3-.2.5-.5.8-.8.9-.3-.1-.6-.4-.8-.9-.5-.9-.2-1.9.8-3z" fill="#fff6d8" />
      <path d="M8.5 11h7l-1.2 2.2H9.7z" fill="#8a5a2b" />
      <path d="M10.2 13.2h3.6L12.9 22h-1.8z" fill="#6b4423" />
    </svg>
  );
}

export function FlameIcon({ className = "size-6", title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...svg(title)}>
      <path d="M12 2c4 4 6.5 7.3 6.5 11.2A6.5 6.5 0 0112 20a6.5 6.5 0 01-6.5-6.8c0-2.4 1.2-4.2 2.6-5.6.2 1.8.9 3 2 3.6C9.8 7.8 10.6 4.6 12 2z" fill="currentColor" />
      <path d="M12 11.5c1.8 1.8 2.8 3.2 2.8 4.8a2.8 2.8 0 01-5.6 0c0-1.3.9-2.5 2.8-4.8z" fill="#fff1c1" />
    </svg>
  );
}

export function StarIcon({ className = "size-6", filled = true, title }: IconProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...svg(title)}>
      <path
        d="M12 2.8l2.7 6 6.5.6-4.9 4.3 1.5 6.4L12 16.8l-5.8 3.3 1.5-6.4-4.9-4.3 6.5-.6z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeartIcon({ className = "size-6", filled = true, title }: IconProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...svg(title)}>
      <path
        d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.6a4.3 4.3 0 017.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function LockIcon({ className = "size-6", title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" {...svg(title)}>
      <rect x="5" y="10.5" width="14" height="10" rx="2" fill="currentColor" fillOpacity="0.15" />
      <path d="M8 10.5V8a4 4 0 018 0v2.5" />
      <path d="M12 14.5v2.5" strokeLinecap="round" />
    </svg>
  );
}

export function ChainIcon({ className = "size-6", title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" {...svg(title)}>
      <rect x="2.5" y="8" width="9" height="8" rx="4" transform="rotate(-35 7 12)" />
      <rect x="12.5" y="8" width="9" height="8" rx="4" transform="rotate(-35 17 12)" />
    </svg>
  );
}

export function SkullIcon({ className = "size-6", title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...svg(title)}>
      <path d="M12 2.5c-4.7 0-8 3.2-8 7.6 0 2.6 1.2 4.4 3 5.5v3.4h2.2v-2h1.6v2h2.4v-2h1.6v2H17v-3.4c1.8-1.1 3-2.9 3-5.5 0-4.4-3.3-7.6-8-7.6z" fill="currentColor" />
      <circle cx="9" cy="11" r="2" fill="#0e1a1f" />
      <circle cx="15" cy="11" r="2" fill="#0e1a1f" />
      <path d="M11.2 14.6L12 13l.8 1.6z" fill="#0e1a1f" />
    </svg>
  );
}

export function ScrollIcon({ className = "size-6", title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" {...svg(title)}>
      <path d="M6 4h11a2 2 0 012 2v12.5a1.5 1.5 0 01-3 0V17H6z" fill="currentColor" fillOpacity="0.12" />
      <path d="M6 4a2 2 0 00-2 2v1.5h2M16 17H4.5a1.5 1.5 0 001.5 3h11.5" />
      <path d="M9 8.5h6M9 11.5h6M9 14.5h3.5" strokeLinecap="round" />
    </svg>
  );
}

export function DoorIcon({ className = "size-6", title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" {...svg(title)}>
      <path d="M5 21V10a7 7 0 0114 0v11z" fill="currentColor" fillOpacity="0.15" />
      <path d="M12 3v18M5 14h14" />
      <circle cx="10" cy="16.5" r="0.9" fill="currentColor" />
      <circle cx="14" cy="16.5" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function StairsIcon({ className = "size-6", title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" {...svg(title)}>
      <path d="M3 5h5v5h5v5h5v5h3" />
      <path d="M3 9v12h18" strokeOpacity="0.4" />
    </svg>
  );
}

export function SwordIcon({ className = "size-6", title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" {...svg(title)}>
      <path d="M20 4l-9.5 9.5M20 4h-4M20 4v4" />
      <path d="M7 14l3 3M5.5 15.5l3 3M8.5 15.5l-5 5" />
    </svg>
  );
}

export function KeyIcon({ className = "size-6", title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" {...svg(title)}>
      <circle cx="7.5" cy="12" r="3.8" fill="currentColor" fillOpacity="0.15" />
      <path d="M11.3 12H21M17.5 12v3M20 12v2.2" />
    </svg>
  );
}

export function GemIcon({ className = "size-6", title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...svg(title)}>
      <path d="M7 4h10l4 5-9 11L3 9z" fill="currentColor" />
      <path d="M3 9h18M8.5 9L12 20l3.5-11M7 4l1.5 5M17 4l-1.5 5" stroke="#0e1a1f" strokeOpacity="0.35" strokeWidth="1" fill="none" />
    </svg>
  );
}
