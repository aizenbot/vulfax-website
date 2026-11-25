/**
 * Brand-level configuration.
 * Values marked PLACEHOLDER must be replaced with approved business details
 * before launch. Nothing here is invented: unknown details are left empty and
 * the UI hides anything that is not configured.
 */
import type { LegalLink, SocialLink } from "@/types/site";

export const siteConfig = {
  name: "VULFAX",
  tagline: "Technology · Innovation · Future",
  /** Public URL used for canonical links, sitemap and Open Graph. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  /**
   * PLACEHOLDER — public contact email. Leave unset until a real inbox exists.
   * When set, the contact form falls back to opening the visitor's email app.
   */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
  /** PLACEHOLDER — add only real, owned accounts. Empty = hidden in the footer. */
  socials: [] as SocialLink[],
  /** PLACEHOLDER — add once approved legal pages exist. Empty = hidden. */
  legal: [] as LegalLink[],
} as const;

/** True when the server can deliver contact form submissions by email. */
export function isContactDeliveryEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);
}
