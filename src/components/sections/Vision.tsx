import { ArrowUpRight } from "lucide-react";
import { Parallax } from "@/components/animations/Parallax";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { primaryCta } from "@/config/navigation";
import { sections } from "@/config/sections";
import type { SiteContent } from "@/types/content";

export function Vision({ content }: { content: SiteContent["vision"] }) {
  return (
    <section
      id={sections.vision.id}
      aria-labelledby="vision-title"
      className="relative isolate overflow-hidden py-32 sm:py-44"
    >
      {/* Layered parallax atmosphere */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <Parallax offset={160} className="absolute inset-0">
          <div className="absolute top-[5%] start-[2%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgb(101_117_255/0.22),transparent_65%)]" />
          <div className="absolute end-[2%] bottom-0 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgb(139_92_246/0.18),transparent_65%)]" />
        </Parallax>
        <Parallax offset={-120} className="absolute inset-0">
          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className="absolute top-1/2 left-1/2 aspect-square w-[min(60rem,140vw)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]" />
          <div className="absolute top-1/2 left-1/2 aspect-square w-[min(40rem,100vw)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" />
        </Parallax>
        <div className="bg-grid mask-radial absolute inset-0 opacity-40" />
      </div>

      <Container className="flex flex-col items-center gap-10 text-center">
        <Reveal>
          <Eyebrow>{content.eyebrow}</Eyebrow>
        </Reveal>
        <h2 id="vision-title" className="font-display text-display font-semibold">
          {content.lines.map((line, i) => (
            <Reveal key={line} as="span" delay={i * 0.12} className="block">
              <span className={i === content.lines.length - 1 ? "text-gradient" : "text-fg"}>{line}</span>
            </Reveal>
          ))}
        </h2>
        <Reveal delay={0.3}>
          <p className="max-w-2xl text-base text-muted sm:text-lg">{content.body}</p>
        </Reveal>
        <Reveal delay={0.4}>
          <Button href={primaryCta.href} variant="secondary" size="lg">
            {content.cta}
            <ArrowUpRight aria-hidden className="size-4 rtl:-scale-x-100" />
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
