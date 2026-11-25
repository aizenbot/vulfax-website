import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { sections } from "@/config/sections";
import type { SiteContent } from "@/types/content";
import { AnimatedDivider } from "./parts/AnimatedDivider";

export function BrandStatement({ content }: { content: SiteContent["brand"] }) {
  return (
    <section
      id={sections.about.id}
      aria-labelledby="about-title"
      className="relative isolate overflow-hidden py-28 sm:py-36"
    >
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -z-10 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(101_117_255/0.12),transparent_65%)]"
      />
      <Container className="flex flex-col gap-12">
        <Reveal>
          <Eyebrow>{content.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal amount={0.3}>
          <h2 id="about-title" className="max-w-5xl font-display text-statement font-medium text-fg">
            {content.statement}
          </h2>
        </Reveal>
        <AnimatedDivider />
        <Reveal delay={0.1} className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
          <span aria-hidden className="hidden md:block" />
          <p className="max-w-xl text-base text-muted sm:text-lg">{content.body}</p>
        </Reveal>
      </Container>
    </section>
  );
}
