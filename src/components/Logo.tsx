interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = '', size = 40 }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      fill="none"
      aria-hidden="true"
    >
      {/* Rays */}
      <g stroke="currentColor" strokeLinecap="round">
        <line x1="32" y1="24" x2="32" y2="10" strokeWidth="2.2" opacity="0.9" />
        <line x1="32" y1="24" x2="32" y2="10" strokeWidth="2.2" opacity="0.9" transform="rotate(-30 32 36)" />
        <line x1="32" y1="24" x2="32" y2="10" strokeWidth="2.2" opacity="0.9" transform="rotate(30 32 36)" />
        <line x1="32" y1="24" x2="32" y2="12" strokeWidth="2.2" opacity="0.8" transform="rotate(-60 32 36)" />
        <line x1="32" y1="24" x2="32" y2="12" strokeWidth="2.2" opacity="0.8" transform="rotate(60 32 36)" />
        <line x1="32" y1="24" x2="32" y2="14" strokeWidth="1.5" opacity="0.5" transform="rotate(-15 32 36)" />
        <line x1="32" y1="24" x2="32" y2="14" strokeWidth="1.5" opacity="0.5" transform="rotate(15 32 36)" />
        <line x1="32" y1="24" x2="32" y2="14" strokeWidth="1.5" opacity="0.5" transform="rotate(-45 32 36)" />
        <line x1="32" y1="24" x2="32" y2="14" strokeWidth="1.5" opacity="0.5" transform="rotate(45 32 36)" />
      </g>
      {/* Half sun */}
      <path
        d="M 16 36 A 16 16 0 0 1 48 36"
        fill="currentColor"
        opacity="0.85"
      />
      {/* Horizon / wave line */}
      <path
        d="M 8 36 Q 20 42 32 36 Q 44 30 56 36"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
        fill="none"
      />
      {/* Second wave */}
      <path
        d="M 12 42 Q 22 47 32 42 Q 42 37 52 42"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.3"
        fill="none"
      />
    </svg>
  );
}
