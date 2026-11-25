"use client";

import { m, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ParallaxProps {
  children?: ReactNode;
  className?: string;
  /** Total travel in px across the element's pass through the viewport. */
  offset?: number;
  "aria-hidden"?: boolean;
}

/**
 * Translates its content slightly slower/faster than the page scroll.
 * Uses Motion's scroll-linked values (no scroll listeners, no scroll hijacking)
 * and stays static for reduced-motion visitors.
 */
export function Parallax({ children, className, offset = 80, ...rest }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-offset / 2, offset / 2]);

  return (
    <m.div ref={ref} className={className} style={reduced ? undefined : { y }} {...rest}>
      {children}
    </m.div>
  );
}
