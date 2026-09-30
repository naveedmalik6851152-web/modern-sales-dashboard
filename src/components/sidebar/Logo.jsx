export function Logo({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="9" fill="rgb(var(--accent))" />
      <path
        d="M9 22V11.5l7 6.5 7-6.5V22"
        fill="none"
        stroke="rgb(var(--accent-fg))"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
