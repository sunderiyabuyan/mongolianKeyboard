type LogoProps = {
  size?: number;
  className?: string;
};

/**
 * The "Бичээч" mascot: a friendly keycap character with stick arms and legs,
 * tying the brand mark directly to the on-screen keyboard the app is built
 * around.
 */
export function Logo({ size = 32, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 100 130"
      className={className}
      role="img"
      aria-label="Бичээч"
    >
      <line x1="40" y1="86" x2="32" y2="112" stroke="#201e1d" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="60" y1="86" x2="68" y2="112" stroke="#201e1d" strokeWidth="4.5" strokeLinecap="round" />
      <ellipse cx="30" cy="116" rx="9" ry="4.5" fill="#c67139" stroke="#201e1d" strokeWidth="4.5" />
      <ellipse cx="70" cy="116" rx="9" ry="4.5" fill="#c67139" stroke="#201e1d" strokeWidth="4.5" />
      <line x1="24" y1="56" x2="8" y2="40" stroke="#201e1d" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="76" y1="56" x2="92" y2="40" stroke="#201e1d" strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="8" cy="40" r="6.5" fill="#c67139" stroke="#201e1d" strokeWidth="4.5" />
      <circle cx="92" cy="40" r="6.5" fill="#c67139" stroke="#201e1d" strokeWidth="4.5" />
      <rect x="14" y="16" width="72" height="70" rx="10" fill="#c67139" stroke="#201e1d" strokeWidth="4.5" />
      <rect
        x="20"
        y="22"
        width="60"
        height="58"
        rx="7"
        fill="none"
        stroke="#8c491a"
        strokeWidth="2.5"
        opacity="0.55"
      />
      <ellipse cx="38" cy="48" rx="6.5" ry="8.5" fill="#201e1d" />
      <ellipse cx="62" cy="48" rx="6.5" ry="8.5" fill="#201e1d" />
      <circle cx="40.5" cy="44" r="2.1" fill="#fff" />
      <circle cx="64.5" cy="44" r="2.1" fill="#fff" />
      <path d="M37 62 Q50 71 63 62" stroke="#201e1d" strokeWidth="4.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
