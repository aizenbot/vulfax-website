import type { MetadataRoute } from "next";
import { localeConfig, locales } from "@/config/i18n";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    locales.map((l) => [localeConfig[l].htmlLang, `${siteConfig.url}/${l}`]),
  );
  return locales.map((locale) => ({
    url: `${siteConfig.url}/${locale}`,
    changeFrequency: "monthly",
    priority: locale === "en" ? 1 : 0.9,
    alternates: { languages },
  }));
}
