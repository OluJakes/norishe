export function LeafMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M24 4C14 4 6 12 6 22c0 4 1.5 7 1.5 7S16 26 21 20c3.7-4.4 5-11 5-11s-1 0-2 0z"
        fill="url(#leafGradA)"
      />
      <path
        d="M34 2C24 2 17 10 17 20c0 5 2 9 2 9s10-3 15-10c4.2-6 4-15 4-15s-2-2-4-2z"
        fill="url(#leafGradB)"
      />
      <path d="M0 26c8 6 18 8 27 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <defs>
        <linearGradient id="leafGradA" x1="6" y1="4" x2="26" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E0C179" />
          <stop offset="1" stopColor="#A9822F" />
        </linearGradient>
        <linearGradient id="leafGradB" x1="17" y1="2" x2="38" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F0D48F" />
          <stop offset="1" stopColor="#C9A24B" />
        </linearGradient>
      </defs>
    </svg>
  );
}
