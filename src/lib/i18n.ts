import { ar } from "@/content/ar";
import { en } from "@/content/en";
import type { Locale } from "@/config/i18n";
import type { SiteContent } from "@/types/content";

const dictionaries: Record<Locale, SiteContent> = { en, ar };

export function getContent(locale: Locale): SiteContent {
  return dictionaries[locale];
}
