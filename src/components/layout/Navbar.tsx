"use client";

import { AnimatePresence, m } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/config/i18n";
import { navItems, primaryCta } from "@/config/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";
import { EASE_OUT_EXPO } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { SiteContent } from "@/types/content";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { Container } from "./Container";

interface NavbarProps {
  locale: Locale;
  nav: SiteContent["nav"];
  a11y: SiteContent["a11y"];
}

const observedIds = navItems.map((item) => item.id);

export function Navbar({ locale, nav, a11y }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(observedIds);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Glass background after the first bit of scroll (rAF-throttled, passive).
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // Mobile menu: lock scroll, close on Escape, trap focus, close on desktop resize.
  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(menuRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = [toggle, ...focusables()].filter((el): el is HTMLElement => Boolean(el));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    const mql = window.matchMedia("(min-width: 1024px)");
    const onResize = () => mql.matches && setOpen(false);

    document.addEventListener("keydown", onKey);
    mql.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      mql.removeEventListener("change", onResize);
      toggle?.focus();
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "border-b transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled || open ? "glass border-line" : "border-transparent bg-transparent",
        )}
        data-scrolled={scrolled}
        data-testid="navbar"
      >
        <Container className="flex h-18 items-center justify-between gap-6">
          <a href="#home" aria-label={a11y.home} className="rounded-lg" onClick={close}>
            <Logo />
          </a>

          <nav aria-label={a11y.mainNav} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative rounded-full px-4 py-2 text-sm transition-colors duration-300",
                        isActive ? "text-fg" : "text-muted hover:text-fg",
                      )}
                    >
                      {nav.labels[item.id]}
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-x-4 -bottom-0.5 h-px origin-center bg-gradient-to-r from-cyan via-primary to-violet transition-transform duration-500 ease-[var(--ease-out-expo)]",
                          isActive ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher locale={locale} label={a11y.switchLanguage} className="hidden sm:inline-flex" />
            <Button href={primaryCta.href} size="md" className="hidden lg:inline-flex">
              {nav.cta}
              <ArrowUpRight aria-hidden className="size-4 rtl:-scale-x-100" />
            </Button>
            <button
              ref={toggleRef}
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full border border-line text-fg transition-colors hover:border-line-strong lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? a11y.closeMenu : a11y.openMenu}
              onClick={() => setOpen((v) => !v)}
              data-testid="menu-toggle"
            >
              {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
            </button>
          </div>
        </Container>
      </div>

      <AnimatePresence>
        {open ? (
          <m.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label={a11y.mainNav}
            className="fixed inset-x-0 top-18 bottom-0 overflow-y-auto border-t border-line bg-bg/[0.97] lg:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
            data-testid="mobile-menu"
          >
            <Container className="flex min-h-full flex-col gap-10 py-10">
              <nav aria-label={a11y.mainNav}>
                <ul className="flex flex-col">
                  {navItems.map((item, i) => (
                    <m.li
                      key={item.id}
                      initial={{ opacity: 0, x: locale === "ar" ? 16 : -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45, ease: EASE_OUT_EXPO, delay: 0.05 + i * 0.05 }}
                    >
                      <a
                        href={item.href}
                        onClick={close}
                        aria-current={active === item.id ? "true" : undefined}
                        className="flex items-center justify-between border-b border-line py-5 font-display text-2xl text-fg"
                      >
                        {nav.labels[item.id]}
                        <ArrowUpRight aria-hidden className="size-5 text-muted rtl:-scale-x-100" />
                      </a>
                    </m.li>
                  ))}
                </ul>
              </nav>
              <div className="mt-auto flex flex-col gap-3">
                <Button href={primaryCta.href} size="lg" onClick={close}>
                  {nav.cta}
                </Button>
                <LanguageSwitcher
                  locale={locale}
                  label={a11y.switchLanguage}
                  className="h-12 justify-center"
                  onNavigate={close}
                />
              </div>
            </Container>
          </m.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
