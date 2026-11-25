"use client";

import { m } from "motion/react";
import { EASE_OUT_EXPO } from "@/lib/constants";

/** Gradient rule that draws itself (scaleX) when scrolled into view. */
export function AnimatedDivider() {
  return (
    <div aria-hidden className="relative h-px w-full overflow-hidden bg-white/[0.06]">
      <m.div
        className="absolute inset-0 origin-[0%_50%] bg-gradient-to-r from-cyan via-primary to-violet rtl:origin-[100%_50%] rtl:bg-gradient-to-l"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 1.6, ease: EASE_OUT_EXPO }}
      />
    </div>
  );
}
