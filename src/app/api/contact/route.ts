import { NextResponse } from "next/server";
import { isContactDeliveryEnabled, siteConfig } from "@/config/site";
import { contactSchema } from "@/lib/validation";

/**
 * Contact form endpoint.
 * Disabled (501) until RESEND_API_KEY and CONTACT_TO_EMAIL are configured.
 * Secrets are read server-side only and never exposed to the client.
 */
export async function POST(request: Request) {
  if (!isContactDeliveryEnabled()) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 501 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 422 },
    );
  }

  const data = parsed.data;
  if (data.website) {
    // Honeypot: pretend success so bots learn nothing.
    return NextResponse.json({ ok: true });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || `${siteConfig.name} <onboarding@resend.dev>`,
        to: [process.env.CONTACT_TO_EMAIL],
        reply_to: data.email,
        subject: `${siteConfig.name} website — ${data.name}${data.company ? ` (${data.company})` : ""}`,
        text: `${data.message}\n\n— ${data.name}\n${data.email}${data.company ? `\n${data.company}` : ""}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }
}
