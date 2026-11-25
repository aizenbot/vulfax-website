import { notFound } from "next/navigation";

/**
 * Catch-all for unknown paths under a locale (e.g. /en/anything) so they render
 * the branded, localized [locale]/not-found.tsx instead of the framework default.
 */
export default function CatchAll() {
  notFound();
}
