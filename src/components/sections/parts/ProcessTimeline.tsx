"use client";

import { m, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { DURATION, EASE_OUT_EXPO } from "@/lib/constants";
import type { ProcessStep } from "@/types/content";

interface ProcessTimelineProps {
  steps: ProcessStep[];
  outcomeLabel: string;
}

/**
 * Vertical timeline whose progress line fills as the visitor scrolls.
 * scaleY on a single element = compositor-only; no layout thrash.
 */
export function ProcessTimeline({ steps, outcomeLabel }: ProcessTimelineProps) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <ol ref={ref} className="relative flex flex-col gap-6" data-testid="process-timeline">
      <span aria-hidden className="absolute start-[1.4rem] top-3 bottom-3 w-px bg-white/[0.08]" />
      <m.span
        aria-hidden
        className="absolute start-[1.4rem] top-3 bottom-3 w-px origin-top bg-gradient-to-b from-cyan via-primary to-violet"
        style={{ scaleY: progress }}
      />
      {steps.map((step, index) => (
        <m.li
          key={step.id}
          data-reveal=""
          className="relative grid grid-cols-[2.8rem_1fr] gap-5"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: DURATION.slow, ease: EASE_OUT_EXPO }}
        >
          <span
            className="relative z-10 flex size-11 items-center justify-center rounded-full border border-line-strong bg-bg font-mono text-xs text-fg shadow-[0_0_0_6px_var(--color-bg)]"
            dir="ltr"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="rounded-card border border-line bg-surface/70 p-6 transition-colors duration-500 hover:border-white/12 sm:p-7">
            <h3 className="font-display text-xl font-semibold text-fg">{step.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{step.description}</p>
            <p className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4 text-sm">
              <span className="text-xs tracking-[0.18em] text-cyan/90 uppercase rtl:tracking-normal">
                {outcomeLabel}
              </span>
              <span className="text-fg/90">{step.outcome}</span>
            </p>
          </div>
        </m.li>
      ))}
    </ol>
  );
}
