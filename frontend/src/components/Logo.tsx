export default function Logo({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
      <rect width="40" height="40" rx="10" fill="url(#cp-logo)" />
      <path
        d="M20 8l2.93 5.97L29.5 15.5l-4.57 1.53L22 23l-2-6-2 6-2.93-5.97L10.5 15.5l6.57-1.53L20 8z"
        fill="white"
      />
      <defs>
        <linearGradient id="cp-logo" x1="0" y1="0" x2="40" y2="40">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#d946ef" />
        </linearGradient>
      </defs>
    </svg>
  );
}
