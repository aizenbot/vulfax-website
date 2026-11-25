/** Shared easing curves and durations so motion feels like one system. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const DURATION = {
  fast: 0.25,
  base: 0.6,
  slow: 0.9,
} as const;

/** Media queries for enabling pointer-driven effects only where they make sense. */
export const MQ_FINE_POINTER = "(hover: hover) and (pointer: fine) and (min-width: 768px)";

export const CONTACT_LIMITS = {
  nameMax: 100,
  companyMax: 120,
  messageMin: 20,
  messageMax: 2000,
} as const;
