import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Manrope, Sora } from "next/font/google";
import { notFound } from "next/navigation";
import { MotionProvider } from "@/components/animations/MotionProvider";
import { isLocale, localeConfig, locales } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { theme } from "@/config/theme";
import { getContent } from "@/lib/i18n";
import "../globals.css";

const heading = Sora({ subsets: ["latin"], variable: "--font-heading", display: "swap" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-arabic",
  display: "swap",
  // Preloaded on purpose: skipping it causes a visible font-swap layout shift on /ar.
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: theme.colors.bg,
  colorScheme: "dark",
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { meta } = getContent(locale);
  const languages = Object.fromEntries(locales.map((l) => [localeConfig[l].htmlLang, `/${l}`]));

  return {
    metadataBase: new URL(siteConfig.url),
    title: meta.title,
    description: meta.description,
    applicationName: siteConfig.name,
    alternates: {
      canonical: `/${locale}`,
      languages: { ...languages, "x-default": "/en" },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: meta.title,
      description: meta.description,
      url: `/${locale}`,
      locale: localeConfig[locale].ogLocale,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeConfig[l].ogLocale),
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { dir, htmlLang } = localeConfig[locale];
  const { a11y } = getContent(locale);

  return (
    <html
      lang={htmlLang}
      dir={dir}
      className={`${heading.variable} ${body.variable} ${arabic.variable} antialiased`}
    >
      <body className="min-h-dvh">
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[100] focus:rounded-full focus:bg-primary-fill focus:px-5 focus:py-3 focus:text-sm focus:text-white"
        >
          {a11y.skipToContent}
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
