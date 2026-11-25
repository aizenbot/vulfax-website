import { cn } from "@/lib/utils";

/** Wordmark + geometric mark. Always LTR, even inside Arabic layouts. */
export function Logo({ className, id = "vx-logo" }: { className?: string; id?: string }) {
  const gradientId = `${id}-gradient`;
  return (
    <span dir="ltr" className={cn("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 32 32" aria-hidden className="size-8 shrink-0">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#00D4FF" />
            <stop offset="0.5" stopColor="#6575FF" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="30" height="30" rx="9" fill="#10131B" stroke={`url(#${gradientId})`} strokeOpacity="0.6" />
        <path d="M8 9.5 16 23l8-13.5" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="16" cy="9.5" r="1.8" fill="#F4F6FC" />
      </svg>
      <span className="font-display text-[1.05rem] font-semibold tracking-[0.18em] text-fg">VULFAX</span>
    </span>
  );
}
