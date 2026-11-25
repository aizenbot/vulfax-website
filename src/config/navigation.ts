import { sectionIds, sections, type SectionId } from "./sections";

export interface NavItem {
  id: SectionId;
  href: `#${SectionId}`;
}

export const navItems: NavItem[] = sectionIds
  .filter((id) => sections[id].inNav)
  .map((id) => ({ id, href: `#${id}` as const }));

/** Primary conversion action used by every CTA on the page. */
export const primaryCta = { target: "contact", href: "#contact" } as const satisfies {
  target: SectionId;
  href: `#${SectionId}`;
};
