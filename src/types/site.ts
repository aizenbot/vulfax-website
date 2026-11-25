export interface SocialLink {
  label: string;
  href: string;
}

export interface LegalLink {
  key: "privacy" | "terms";
  label: string;
  href: string;
}

export type ContactStatus = "idle" | "sent" | "mailto" | "unconfigured" | "failed";
