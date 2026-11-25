import type { SectionId } from "@/config/sections";

export type IconName =
  | "code"
  | "globe"
  | "smartphone"
  | "cloud"
  | "sparkles"
  | "palette"
  | "layers"
  | "shield"
  | "gauge"
  | "users"
  | "compass"
  | "cpu";

export interface FeatureItem {
  id: string;
  icon: IconName;
  title: string;
  description: string;
}

export interface CapabilityItem extends FeatureItem {
  tags: string[];
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  outcome: string;
}

export interface SectionIntro {
  eyebrow: string;
  title: string;
  description: string;
}

export interface ContactFormCopy {
  nameLabel: string;
  emailLabel: string;
  companyLabel: string;
  messageLabel: string;
  optional: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  companyPlaceholder: string;
  messagePlaceholder: string;
  submit: string;
  sending: string;
  errors: {
    nameRequired: string;
    emailInvalid: string;
    messageShort: string;
    messageLong: string;
  };
  status: {
    sent: string;
    mailto: string;
    unconfigured: string;
    failed: string;
  };
}

export interface SiteContent {
  meta: { title: string; description: string };
  a11y: {
    skipToContent: string;
    mainNav: string;
    openMenu: string;
    closeMenu: string;
    switchLanguage: string;
    home: string;
  };
  nav: { labels: Record<SectionId, string>; cta: string };
  hero: {
    eyebrow: string;
    titleLines: string[];
    description: string;
    primaryCta: string;
    secondaryCta: string;
    scrollHint: string;
  };
  brand: { eyebrow: string; statement: string; body: string };
  capabilities: SectionIntro & { items: CapabilityItem[] };
  process: SectionIntro & { outcomeLabel: string; steps: ProcessStep[] };
  why: SectionIntro & { items: FeatureItem[] };
  vision: { eyebrow: string; lines: string[]; body: string; cta: string };
  contact: SectionIntro & { form: ContactFormCopy; emailLabel: string };
  footer: {
    tagline: string;
    navTitle: string;
    contactTitle: string;
    contactCta: string;
    rights: string;
    backToTop: string;
  };
  notFound: { title: string; body: string; back: string };
}
