"use client";

import { m, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { DURATION, EASE_OUT_EXPO } from "@/lib/constants";

type RevealTag = "div" | "li" | "p" | "span" | "header";

interface RevealProps {
  children: ReactNode;
  as?: RevealTag;
  className?: string;
  delay?: number;
  /** Vertical travel in px before the element settles. */
  y?: number;
  /** Fraction of the element that must be visible to trigger. */
  amount?: number;
  /** "view" reveals on first scroll into view; "mount" plays immediately (above the fold). */
  trigger?: "view" | "mount";
}

const tags = { div: m.div, li: m.li, p: m.p, span: m.span, header: m.header } as const;

/** Fades and lifts content into place once, the first time it scrolls into view. */
export function Reveal({
  children,
  as = "div",
  className,
  delay = 0,
  y = 28,
  amount = 0.25,
  trigger = "view",
}: RevealProps) {
  const Tag = tags[as];
  const target = { opacity: 1, y: 0 };
  return (
    <Tag
      className={className}
      data-reveal=""
      initial={{ opacity: 0, y }}
      {...(trigger === "mount"
        ? { animate: target }
        : { whileInView: target, viewport: { once: true, amount } })}
      transition={{ duration: DURATION.slow, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </Tag>
  );
}

const containerVariants: Variants = {
  hidden: {},
  visible: (stagger: number) => ({ transition: { staggerChildren: stagger } }),
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE_OUT_EXPO } },
};

interface StaggerProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
  stagger?: number;
  amount?: number;
}

const staggerTags = { div: m.div, ul: m.ul, ol: m.ol } as const;

/** Parent that reveals its <StaggerItem> children one after another. */
export function Stagger({ children, className, as = "div", stagger = 0.09, amount = 0.15 }: StaggerProps) {
  const Tag = staggerTags[as];
  return (
    <Tag
      className={className}
      variants={containerVariants}
      custom={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const Tag = as === "li" ? m.li : m.div;
  return (
    <Tag className={className} variants={staggerItemVariants} data-reveal="">
      {children}
    </Tag>
  );
}
