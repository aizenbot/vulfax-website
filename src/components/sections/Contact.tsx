import { Mail } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/layout/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sections } from "@/config/sections";
import { isContactDeliveryEnabled, siteConfig } from "@/config/site";
import type { SiteContent } from "@/types/content";
import { ContactForm } from "./parts/ContactForm";

export function Contact({ content }: { content: SiteContent["contact"] }) {
  const contactEmail = siteConfig.contactEmail;
  return (
    <section
      id={sections.contact.id}
      aria-labelledby="contact-title"
      className="relative isolate overflow-hidden py-24 sm:py-32"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(ellipse_60%_60%_at_50%_100%,rgb(101_117_255/0.2),transparent_70%)]" />
        <div className="bg-grid mask-fade-b absolute inset-0 rotate-180 opacity-30" />
      </div>
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHeading
            id="contact-title"
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
          {contactEmail ? (
            <Reveal delay={0.1} className="flex flex-col gap-2">
              <span className="text-sm text-muted">{content.emailLabel}</span>
              <a
                href={`mailto:${contactEmail}`}
                dir="ltr"
                className="inline-flex w-fit items-center gap-2 font-display text-xl text-fg transition-colors hover:text-cyan"
              >
                <Mail aria-hidden className="size-5" />
                {contactEmail}
              </a>
            </Reveal>
          ) : null}
        </div>

        <Reveal delay={0.1}>
          <GlassCard className="p-6 sm:p-9">
            <ContactForm
              copy={content.form}
              deliveryEnabled={isContactDeliveryEnabled()}
              contactEmail={contactEmail}
              subjectPrefix={`${siteConfig.name} — ${content.eyebrow}`}
            />
          </GlassCard>
        </Reveal>
      </Container>
    </section>
  );
}
