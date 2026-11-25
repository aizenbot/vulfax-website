import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glow?: boolean;
}

/** Subtle translucent surface. Use sparingly — the design leans on solid darks. */
export function GlassCard({ children, className, glow = false, ...rest }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-card border border-line bg-gradient-to-b from-white/[0.05] to-white/[0.015]",
        glow && "border-glow",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
