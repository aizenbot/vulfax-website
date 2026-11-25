import { ArrowUpRight } from "lucide-react";
import { HeroOrb } from "@/components/animations/HeroOrb";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/layout/Container";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { primaryCta } from "@/config/navigation";
import { sections } from "@/config/sections";
import type { SiteContent } from "@/types/content";

export function Hero({ content }: { content: SiteContent["hero"] }) {
  return (
    <section
      id={sections.home.id}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20 lg:pt-24"
    >
      {/* Ambient background */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="bg-grid mask-radial absolute inset-0 opacity-70" />
        <div className="animate-drift absolute -top-[20%] start-[-10%] h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle,rgb(101_117_255/0.22),transparent_60%)]" />
        <div className="animate-drift-alt absolute end-[-15%] bottom-[-25%] h-[55vmax] w-[55vmax] rounded-full bg-[radial-gradient(circle,rgb(139_92_246/0.16),transparent_60%)]" />
        <div className="noise absolute inset-0 opacity-[0.025]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
      </div>

      <Container className="grid items-center gap-14 lg:grid-cols-[1.25fr_0.9fr] lg:gap-6">
        <div className="relative z-10 flex flex-col items-start gap-7">
          <Reveal y={12} trigger="mount">
            <Eyebrow>{content.eyebrow}</Eyebrow>
          </Reveal>

          <h1 id="hero-title" className="font-display text-hero font-semibold text-fg">
            <AnimatedText
              lines={content.titleLines}
              delay={0.15}
              highlightLast
            />
          </h1>

          <Reveal delay={0.55} y={16} trigger="mount">
            <p className="max-w-xl text-base text-muted sm:text-lg">{content.description}</p>
          </Reveal>

          <Reveal delay={0.7} y={16} trigger="mount" className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <MagneticButton className="w-full sm:w-auto">
              <Button href={primaryCta.href} size="lg" className="w-full sm:w-auto">
                {content.primaryCta}
                <ArrowUpRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" />
              </Button>
            </MagneticButton>
            <Button href={`#${sections.capabilities.id}`} variant="secondary" size="lg" className="w-full sm:w-auto">
              {content.secondaryCta}
            </Button>
          </Reveal>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <HeroOrb />
        </div>
      </Container>

      <a
        href={`#${sections.about.id}`}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[0.7rem] tracking-[0.3em] text-muted uppercase transition-colors hover:text-fg md:flex rtl:tracking-normal"
      >
        {content.scrollHint}
        <span aria-hidden className="relative h-10 w-px overflow-hidden bg-white/10">
          <span className="animate-scroll-cue absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent to-cyan" />
        </span>
      </a>
    </section>
  );
}
