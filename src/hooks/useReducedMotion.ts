"use client";

import { useReducedMotion as useMotionReducedMotion } from "motion/react";

/** True when the visitor asked the OS to minimise motion. */
export function useReducedMotion(): boolean {
  return useMotionReducedMotion() ?? false;
}
