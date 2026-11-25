# VULFAX — Official Website (Phase 1: Landing Page)

A premium, dark, futuristic single-page site for **VULFAX**, built to grow into a full corporate site and platform without a rebuild.

- **Bilingual:** `/en` (LTR) and `/ar` (full RTL) with a working language switcher. `/` redirects by browser language.
- **Nine sections:** Navigation · Hero · Brand Statement · Capabilities · How We Work · Why VULFAX · Future Vision · Contact (final CTA) · Footer.
- **Config-driven:** all copy, navigation, sections, brand details and design tokens live outside the UI components.

> **Placeholder content.** All headlines, capabilities, process steps and differentiators are draft copy written for layout and tone. There are deliberately **no** statistics, clients, testimonials, social accounts, addresses or contact details. Replace the copy in `src/content/*.ts` with approved messaging, and only add facts that can be verified.

---

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Cache Components, Turbopack), React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 — tokens in `@theme` (`src/app/globals.css`) |
| Animation | Motion for React (`LazyMotion` + `domAnimation`), CSS keyframes |
| Icons | Lucide React |
| Forms | React Hook Form + Zod (one schema shared by client and API) |
| Fonts | `next/font/google`, self-hosted at build: Sora (display), Manrope (body), IBM Plex Sans Arabic |
| Tests | Vitest + React Testing Library, Playwright (Chromium, Firefox, WebKit) + axe-core |
| Hosting | Vercel (recommended) |

**Deliberately not used:**
- **GSAP:** every scroll effect (timeline progress, parallax, reveals) is covered by Motion's scroll-linked values, so the extra library would add weight for nothing.
- **Three.js / WebGL:** the hero "3D" orb is layered CSS gradients and SVG, so it costs no 3D runtime.
- **i18n libraries:** typed dictionaries plus a `[locale]` route segment are enough.

## Getting started

Requires Node.js 20.9+ (developed on Node 26).

```bash
npm install
cp .env.example .env.local   # optional, every variable has a safe default
npm run dev                  # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run typecheck` | Generate route types and run `tsc --noEmit` |
| `npm run lint` | ESLint (Next core-web-vitals + TypeScript rules) |
| `npm test` | Vitest unit and component tests |
| `npm run test:e2e` | Playwright end-to-end tests against the production build (run `npm run build` first; first run: `npx playwright install`) |
| `npm run check` | Full acceptance gate: typecheck, lint, unit tests, build, e2e |

## Environment variables

See [`.env.example`](.env.example). Summary:

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | public | Canonical URL for metadata, hreflang, sitemap and Open Graph |
| `NEXT_PUBLIC_CONTACT_EMAIL` | public | Public inbox. Shown on the page; enables the `mailto:` fallback |
| `RESEND_API_KEY` | server | Enables real email delivery through `POST /api/contact` |
| `CONTACT_TO_EMAIL` | server | Where form submissions are delivered |
| `CONTACT_FROM_EMAIL` | server | Optional verified sender |

### How the contact form behaves

1. If `RESEND_API_KEY` **and** `CONTACT_TO_EMAIL` are set, it posts to `/api/contact`. It shows "sent" only after the server confirms delivery.
2. Otherwise, if `NEXT_PUBLIC_CONTACT_EMAIL` is set, it opens the visitor's email app with the message pre-filled.
3. Otherwise it validates the input and tells the visitor that the contact channel is not set up yet. It never pretends a message was sent.

There is also a hidden honeypot field for basic bot filtering. Secrets are read only on the server.

## Project structure

```
src/
  app/
    [locale]/            layout (html lang/dir, fonts, metadata), page, not-found, error,
                         opengraph-image, [...rest] catch-all → localized 404
    api/contact/         env-gated email endpoint (501 until configured)
    globals.css          design tokens (@theme), base styles, RTL typography
    sitemap.ts robots.ts icon.svg
  proxy.ts               locale redirect (Accept-Language → /en or /ar)
  components/
    layout/              Navbar, Footer, Container, Logo, LanguageSwitcher, CurrentYear
    sections/            Hero, BrandStatement, Capabilities, Process, WhyVulfax, Vision, Contact
      parts/             ContactForm, ProcessTimeline, AnimatedDivider (client islands)
    ui/                  Button, MagneticButton, SectionHeading, GlassCard, TiltCard, AnimatedText, Icon
    animations/          MotionProvider, Reveal/Stagger, Parallax, PageTransition, HeroOrb
  config/                site.ts, navigation.ts, sections.ts, theme.ts, i18n.ts
  content/               en.ts, ar.ts (typed by SiteContent)
  hooks/                 useMediaQuery, useReducedMotion, useActiveSection
  lib/                   utils, constants, validation (Zod), i18n
  types/                 content.ts, site.ts
  styles/animations.css  keyframes + reduced-motion safety net
public/{images,videos,icons,fonts,models}/
tests/components/        Vitest + RTL
tests/e2e/               Playwright
```

**Server Components by default.** `"use client"` appears only where interaction requires it: navbar, language switcher, contact form, animation wrappers, tilt/magnetic effects, hero orb and timeline.

## Common edits

| Task | Where |
| --- | --- |
| Change any text | `src/content/en.ts` and `src/content/ar.ts`. The types keep both locales in sync, and a unit test fails if their structures differ. |
| Add a capability, step or benefit | Add an item to the relevant array in both content files. Icons are chosen by name from `src/components/ui/Icon.tsx`. |
| Change colors | `@theme` in `src/app/globals.css` (and mirror it in `src/config/theme.ts`) |
| Add or reorder nav items | `src/config/sections.ts` (`inNav`). Links are derived from it, so they can't point at missing anchors. |
| Add a section | Add an id in `config/sections.ts`, add copy to the content files, create a component in `components/sections/`, and render it in `app/[locale]/page.tsx`. |
| Add socials or legal links | `src/config/site.ts`. Empty arrays are hidden. |
| Add a language | Add it to `config/i18n.ts` and create `content/<code>.ts`. |

## Motion and accessibility

- Animations use transform and opacity only. Each element is driven by a single animation system, with no scroll hijacking.
- `MotionConfig reducedMotion="user"` honours the OS setting. With reduced motion, ambient CSS loops stop, and a CSS safety net (`[data-reveal]`) keeps all content visible even if an observer never fires. The same applies without JavaScript, via `<noscript>`.
- Pointer effects (tilt, magnetic CTA, orb parallax) run only on fine-pointer desktops. The heavier ring rotations are switched off below 768px.
- Accessibility: skip link, one `h1`, labelled landmarks, visible focus rings, an accessible mobile menu (focus trap, Escape, scroll lock), labelled form fields with `aria-invalid` and `aria-describedby`, and a live status region. Button contrast meets AA (CTA fill `#4F5BE8` with white text). The brand accent `#6575FF` is used for highlights.

## SEO

Each locale has its own title and description, Open Graph and Twitter cards, canonical and `hreflang` alternates (including `x-default`), a generated OG image, `sitemap.xml` and `robots.txt`. No Organization structured data is added until real business details exist.

## Deployment (Vercel)

1. Push the repository to GitHub, GitLab or Bitbucket and import it in Vercel. The framework is detected automatically.
2. Set `NEXT_PUBLIC_SITE_URL` to the production domain, plus the optional contact variables.
3. Deploy. `/en` and `/ar` are prerendered as static HTML, and the proxy handles the `/` redirect.

Any Node.js host also works: run `npm run build && npm start` (Cache Components needs the Node.js runtime, not edge).

## Future phases

The architecture is ready for these, and none of them are built yet:
- **Corporate pages** (About, Services, Industries, Careers, Blog): add routes under `app/[locale]/…`, reuse the section and UI components, and add the links to `config/navigation.ts`.
- **Client platform** (auth, dashboard, subscriptions, payments): add route groups such as `app/[locale]/(app)/…` with their own layout, and extend `app/api/`.
- **More markets and languages:** extend `config/i18n.ts` and `content/`.

## Known limitations

- All copy is placeholder pending approved brand messaging. Contact email, socials and legal pages are intentionally empty.
- Email delivery needs a Resend account and a verified domain. Without one, the form uses the honest fallbacks described above.
- Lighthouse Performance scores measured on the local Windows machine varied widely between identical runs, with a phantom ~10s "unattributable" task under simulated throttling. Direct CDP measurement showed no idle work after load. Treat PageSpeed Insights on the deployed Vercel URL as the source of truth.
- The 404 for completely unknown top-level paths goes through the locale redirect first (for example `/foo` → `/en/foo` → localized 404).
