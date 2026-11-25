"use client";

import { Languages } from "lucide-react";
import type { MouseEvent } from "react";
import { localeConfig, locales, type Locale } from "@/config/i18n";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  locale: Locale;
  label: string;
  className?: string;
  onNavigate?: () => void;
}

/**
 * Switches between /en and /ar. Uses a full document navigation so <html lang>,
 * dir and fonts are guaranteed to reset; keeps the current section hash.
 */
export function LanguageSwitcher({ locale, label, className, onNavigate }: LanguageSwitcherProps) {
  const target = locales.find((l) => l !== locale) ?? locale;
  const href = `/${target}`;

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    onNavigate?.();
    // Carry the current section over; the browser then follows the updated href.
    const hash = window.location.hash;
    if (hash) event.currentTarget.setAttribute("href", `${href}${hash}`);
  }

  return (
    <a
      href={href}
      hrefLang={localeConfig[target].htmlLang}
      lang={localeConfig[target].htmlLang}
      onClick={onClick}
      title={label}
      data-testid="language-switcher"
      className={cn(
        "inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-3.5 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg",
        className,
      )}
    >
      <Languages aria-hidden className="size-4" strokeWidth={1.6} />
      <span>{localeConfig[target].nativeName}</span>
    </a>
  );
}
