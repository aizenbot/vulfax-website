/**
 * Single source of truth for page sections.
 * Section components read their DOM id from here and the navigation is derived
 * from it, so a nav link can never point at an anchor that does not exist.
 * To add a section: add an id here, add its copy to src/content/*.ts,
 * create the component, and register it in src/app/[locale]/page.tsx.
 */
export const sectionIds = [
  "home",
  "about",
  "capabilities",
  "process",
  "why",
  "vision",
  "contact",
] as const;

export type SectionId = (typeof sectionIds)[number];

export const sections: Record<SectionId, { id: SectionId; inNav: boolean }> = {
  home: { id: "home", inNav: false },
  about: { id: "about", inNav: true },
  capabilities: { id: "capabilities", inNav: true },
  process: { id: "process", inNav: true },
  why: { id: "why", inNav: true },
  vision: { id: "vision", inNav: true },
  contact: { id: "contact", inNav: false }, // reached via the primary CTA
};
