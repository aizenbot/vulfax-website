"use client";

import { RotateCcw } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

const copy = {
  en: {
    title: "Something went wrong",
    body: "Please try again. If the problem continues, reload the page.",
    retry: "Try again",
  },
  ar: {
    title: "حدث خطأ غير متوقع",
    body: "يرجى المحاولة مرة أخرى، وإذا استمرت المشكلة أعد تحميل الصفحة.",
    retry: "إعادة المحاولة",
  },
} as const;

/** Route-level error boundary. Keeps the shell usable and offers a retry. */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ locale?: string }>();
  const t = params.locale === "ar" ? copy.ar : copy.en;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh items-center py-24">
      <Container className="flex flex-col items-center gap-6 text-center">
        <h1 className="font-display text-headline font-semibold text-fg">{t.title}</h1>
        <p className="max-w-md text-muted">{t.body}</p>
        <Button onClick={reset} variant="secondary" size="lg">
          <RotateCcw aria-hidden className="size-4" />
          {t.retry}
        </Button>
      </Container>
    </main>
  );
}
