"use client";

import { m } from "motion/react";
import { EASE_OUT_EXPO } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  lines: string[];
  className?: string;
  /** Apply the brand gradient to the final line. */
  highlightLast?: boolean;
  delay?: number;
}

/**
 * Word-by-word entrance for headings. Splits on whitespace only (never on
 * letters) so Arabic glyph shaping stays intact. Runs on mount.
 */
export function AnimatedText({ lines, className, highlightLast = false, delay = 0 }: AnimatedTextProps) {
  let wordIndex = 0;
  return (
    <span className={cn("block", className)}>
      {lines.map((line, li) => (
        <span key={li} className={cn("block", highlightLast && li === lines.length - 1 && "text-gradient")}>
          {line.split(/\s+/).map((word, wi, arr) => {
            const i = wordIndex++;
            return (
              <span key={wi} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                <m.span
                  className="inline-block"
                  data-reveal=""
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: delay + i * 0.07 }}
                >
                  {word}
                </m.span>
                {wi < arr.length - 1 ? " " : null}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
