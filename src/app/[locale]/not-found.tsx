import { ArrowLeft } from "lucide-react";
import { locale as localeParam } from "next/root-params";
import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { defaultLocale, isLocale } from "@/config/i18n";
import { getContent } from "@/lib/i18n";
import { withBasePath } from "@/lib/utils";

/** Localized 404 for unknown paths under /en or /ar. */
export default async function NotFound() {
  const raw = await localeParam();
  const locale = isLocale(raw) ? raw : defaultLocale;
  const { notFound } = getContent(locale);

  return (
    <main id="main" className="relative isolate flex min-h-dvh items-center overflow-hidden py-24">
      <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-10 opacity-60" />
      <Container className="flex flex-col items-center gap-8 text-center">
        <Logo />
        <p aria-hidden className="font-display text-display font-semibold text-gradient" dir="ltr">
          404
        </p>
        <h1 className="font-display text-headline font-semibold text-fg">{notFound.title}</h1>
        <p className="max-w-md text-muted">{notFound.body}</p>
        <Button href={withBasePath(`/${locale}`)} variant="secondary" size="lg">
          <ArrowLeft aria-hidden className="size-4 rtl:-scale-x-100" />
          {notFound.back}
        </Button>
      </Container>
    </main>
  );
}
