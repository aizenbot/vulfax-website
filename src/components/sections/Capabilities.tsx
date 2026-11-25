import { Stagger, StaggerItem } from "@/components/animations/Reveal";
import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";
import { sections } from "@/config/sections";
import { cn } from "@/lib/utils";
import type { SiteContent } from "@/types/content";

/** Bento rhythm: first and fourth cards span wider on large screens. */
const spans = ["lg:col-span-2", "", "", "lg:col-span-2", "", ""];

export function Capabilities({ content }: { content: SiteContent["capabilities"] }) {
  return (
    <section id={sections.capabilities.id} aria-labelledby="capabilities-title" className="relative py-24 sm:py-32">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          id="capabilities-title"
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />

        <Stagger as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.items.map((item, index) => (
            <StaggerItem as="li" key={item.id} className={cn("min-h-64", spans[index % spans.length])}>
              <TiltCard className="flex h-full flex-col justify-between gap-10 p-7 sm:p-8">
                <div className="relative flex items-start justify-between">
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl border border-line bg-elevated text-primary shadow-[0_0_30px_-8px_rgb(101_117_255/0.6)] transition-colors duration-500 group-hover:text-cyan">
                    <Icon name={item.icon} className="size-5.5" />
                  </span>
                  <span aria-hidden className="font-mono text-xs text-muted" dir="ltr">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="relative flex flex-col gap-3">
                  <h3 className="font-display text-xl font-semibold text-fg">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{item.description}</p>
                  <ul className="mt-2 flex flex-wrap gap-2" aria-label={item.title}>
                    {item.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-line bg-white/[0.02] px-3 py-1 text-xs text-muted"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
