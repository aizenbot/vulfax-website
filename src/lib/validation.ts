import { z } from "zod";
import { CONTACT_LIMITS } from "./constants";

/**
 * Contact form schema shared by the client form and the API route.
 * Error messages are stable codes; the UI maps them to localized strings.
 */
export const contactErrorCodes = [
  "nameRequired",
  "emailInvalid",
  "messageShort",
  "messageLong",
] as const;

export type ContactErrorCode = (typeof contactErrorCodes)[number];

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "nameRequired" })
    .max(CONTACT_LIMITS.nameMax, { error: "nameRequired" }),
  email: z.string().trim().pipe(z.email({ error: "emailInvalid" })),
  company: z.string().trim().max(CONTACT_LIMITS.companyMax).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.messageMin, { error: "messageShort" })
    .max(CONTACT_LIMITS.messageMax, { error: "messageLong" }),
  /** Honeypot: real visitors never fill this hidden field. */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

export function isContactErrorCode(value: unknown): value is ContactErrorCode {
  return typeof value === "string" && (contactErrorCodes as readonly string[]).includes(value);
}

export function buildMailtoHref(to: string, data: ContactData, subjectPrefix: string): string {
  const subject = `${subjectPrefix} — ${data.name}${data.company ? ` (${data.company})` : ""}`;
  const body = `${data.message}\n\n— ${data.name}\n${data.email}${data.company ? `\n${data.company}` : ""}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
