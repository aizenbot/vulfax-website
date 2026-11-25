import { ArrowUp, ArrowUpRight, Mail } from "lucide-react";
import { navItems, primaryCta } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import type { SiteContent } from "@/types/content";
import { Container } from "./Container";
import { CurrentYear } from "./CurrentYear";
import { Logo } from "./Logo";

interface FooterProps {
  content: SiteContent;
}

export function Footer({ content }: FooterProps) {
  const { footer, nav } = content;
  return (
    <footer className="relative border-t border-line bg-bg">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex max-w-sm flex-col gap-5">
          <Logo id="vx-footer-logo" />
          <p className="text-sm text-muted">{footer.tagline}</p>
        </div>

        <nav aria-labelledby="footer-nav-title">
          <h2 id="footer-nav-title" className="mb-5 text-xs font-medium tracking-[0.2em] text-fg/80 uppercase rtl:tracking-normal">
            {footer.navTitle}
          </h2>
          <ul className="flex flex-col gap-3">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={item.href} className="text-sm text-muted transition-colors hover:text-fg">
                  {nav.labels[item.id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-5 text-xs font-medium tracking-[0.2em] text-fg/80 uppercase rtl:tracking-normal">
            {footer.contactTitle}
          </h2>
          <ul className="flex flex-col gap-3">
            <li>
              <a
                href={primaryCta.href}
                className="inline-flex items-center gap-1.5 text-sm text-fg transition-colors hover:text-cyan"
              >
                {footer.contactCta}
                <ArrowUpRight aria-hidden className="size-4 rtl:-scale-x-100" />
              </a>
            </li>
            {siteConfig.contactEmail ? (
              <li>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  dir="ltr"
                  className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
                >
                  <Mail aria-hidden className="size-4" />
                  {siteConfig.contactEmail}
                </a>
              </li>
            ) : null}
            {siteConfig.socials.map((social) => (
              <li key={social.href}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted transition-colors hover:text-fg"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container className="flex flex-col-reverse items-start justify-between gap-4 border-t border-line py-6 text-xs text-muted sm:flex-row sm:items-center">
        <p>
          © <CurrentYear /> {siteConfig.name}. {footer.rights}
        </p>
        <div className="flex items-center gap-5">
          {siteConfig.legal.map((link) => (
            <a key={link.key} href={link.href} className="transition-colors hover:text-fg">
              {link.label}
            </a>
          ))}
          <a href="#home" className="inline-flex items-center gap-1.5 transition-colors hover:text-fg">
            {footer.backToTop}
            <ArrowUp aria-hidden className="size-3.5" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
