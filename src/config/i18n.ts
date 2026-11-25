export const locales = ["en", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeConfig: Record<
  Locale,
  { label: string; nativeName: string; dir: "ltr" | "rtl"; htmlLang: string; ogLocale: string }
> = {
  en: { label: "EN", nativeName: "English", dir: "ltr", htmlLang: "en", ogLocale: "en_US" },
  ar: { label: "ع", nativeName: "العربية", dir: "rtl", htmlLang: "ar", ogLocale: "ar_AR" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
