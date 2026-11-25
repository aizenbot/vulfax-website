import { describe, expect, it } from "vitest";
import { buildMailtoHref, contactSchema } from "@/lib/validation";

const valid = {
  name: "Sara Ahmed",
  email: "sara@example.com",
  company: "",
  message: "We need a new customer portal for our logistics business.",
  website: "",
};

function codes(input: unknown): string[] {
  const result = contactSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((i) => i.message);
}

describe("contactSchema", () => {
  it("accepts a valid submission and trims whitespace", () => {
    const result = contactSchema.parse({ ...valid, name: "  Sara Ahmed  " });
    expect(result.name).toBe("Sara Ahmed");
  });

  it("rejects a missing name", () => {
    expect(codes({ ...valid, name: " " })).toContain("nameRequired");
  });

  it("rejects an invalid email", () => {
    expect(codes({ ...valid, email: "not-an-email" })).toContain("emailInvalid");
  });

  it("rejects a message that is too short or too long", () => {
    expect(codes({ ...valid, message: "Hi" })).toContain("messageShort");
    expect(codes({ ...valid, message: "x".repeat(2001) })).toContain("messageLong");
  });

  it("rejects a filled honeypot", () => {
    expect(contactSchema.safeParse({ ...valid, website: "http://spam" }).success).toBe(false);
  });

  it("accepts Arabic text", () => {
    expect(codes({ ...valid, name: "سارة أحمد", message: "نحتاج إلى بوابة عملاء جديدة لشركتنا." })).toEqual([]);
  });
});

describe("buildMailtoHref", () => {
  it("encodes subject and body", () => {
    const href = buildMailtoHref("hello@example.com", contactSchema.parse(valid), "VULFAX");
    expect(href.startsWith("mailto:hello@example.com?subject=")).toBe(true);
    expect(href).toContain(encodeURIComponent("Sara Ahmed"));
    expect(href).not.toContain(" ");
  });
});
