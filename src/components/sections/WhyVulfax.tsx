import { Stagger, StaggerItem } from "@/components/animations/Reveal";
import { Container } from "@/components/layout/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sections } from "@/config/sections";
import type { SiteContent } from "@/types/content";

export function WhyVulfax({ content }: { content: SiteContent["why"] }) {
  return (
    <section id={sections.why.id} aria-labelledby="why-title" className="relative isolate py-24 sm:py-32">
      <div
        aria-hidden
        className="absolute end-0 top-1/3 -z-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgb(0_212_255/0.08),transparent_65%)]"
      />
      <Container className="flex flex-col gap-14">
        <SectionHeading
          id="why-title"
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
          align="center"
        />
        <Stagger as="ul" className="grid gap-4 sm:grid-cols-2">
          {content.items.map((item) => (
            <StaggerItem as="li" key={item.id}>
              <GlassCard glow className="group flex h-full gap-5 p-7 sm:p-8">
                <span className="relative inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-violet/10 text-fg ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-105">
                  <Icon name={item.icon} className="size-5.5" />
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-lg font-semibold text-fg sm:text-xl">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted sm:text-base">{item.description}</p>
                </div>
              </GlassCard>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
