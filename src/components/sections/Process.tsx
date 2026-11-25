import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sections } from "@/config/sections";
import type { SiteContent } from "@/types/content";
import { ProcessTimeline } from "./parts/ProcessTimeline";

export function Process({ content }: { content: SiteContent["process"] }) {
  return (
    <section
      id={sections.process.id}
      aria-labelledby="process-title"
      className="relative overflow-hidden bg-surface/40 py-24 sm:py-32"
    >
      <div aria-hidden className="bg-grid mask-fade-b absolute inset-0 opacity-40" />
      <Container className="relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            id="process-title"
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
        </div>
        <ProcessTimeline steps={content.steps} outcomeLabel={content.outcomeLabel} />
      </Container>
    </section>
  );
}
