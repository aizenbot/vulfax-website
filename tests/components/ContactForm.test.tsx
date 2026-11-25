import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MotionProvider } from "@/components/animations/MotionProvider";
import { ContactForm } from "@/components/sections/parts/ContactForm";
import { en } from "@/content/en";

const openExternalUrl = vi.fn();
vi.mock("@/lib/utils", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/utils")>()),
  openExternalUrl: (url: string) => openExternalUrl(url),
}));

const copy = en.contact.form;

function renderForm(props: Partial<Parameters<typeof ContactForm>[0]> = {}) {
  return render(
    <MotionProvider>
      <ContactForm copy={copy} deliveryEnabled={false} contactEmail={null} subjectPrefix="VULFAX" {...props} />
    </MotionProvider>,
  );
}

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(copy.nameLabel), "Sara Ahmed");
  await user.type(screen.getByLabelText(copy.emailLabel), "sara@example.com");
  await user.type(screen.getByLabelText(copy.messageLabel), "We need a customer portal for our logistics team.");
}

afterEach(() => {
  vi.restoreAllMocks();
  openExternalUrl.mockReset();
});

describe("ContactForm", () => {
  it("shows localized validation errors for an empty submission", async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByRole("button", { name: copy.submit }));
    expect(await screen.findByText(copy.errors.nameRequired)).toBeInTheDocument();
    expect(screen.getByText(copy.errors.emailInvalid)).toBeInTheDocument();
    expect(screen.getByText(copy.errors.messageShort)).toBeInTheDocument();
    expect(screen.getByLabelText(copy.nameLabel)).toHaveAttribute("aria-invalid", "true");
  });

  it("is honest when no delivery channel is configured", async () => {
    const user = userEvent.setup();
    renderForm();
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: copy.submit }));
    const status = await screen.findByTestId("contact-status");
    expect(status).toHaveAttribute("data-status", "unconfigured");
    expect(status).toHaveTextContent(copy.status.unconfigured);
    expect(openExternalUrl).not.toHaveBeenCalled();
  });

  it("opens the email app when only a public inbox is configured", async () => {
    const user = userEvent.setup();
    renderForm({ contactEmail: "hello@example.com" });
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: copy.submit }));
    await waitFor(() => expect(openExternalUrl).toHaveBeenCalledTimes(1));
    expect(openExternalUrl.mock.calls[0][0]).toMatch(/^mailto:hello@example\.com\?subject=/);
    expect(await screen.findByTestId("contact-status")).toHaveAttribute("data-status", "mailto");
  });

  it("reports success only after the API confirms delivery", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ ok: true })));
    const user = userEvent.setup();
    renderForm({ deliveryEnabled: true });
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: copy.submit }));
    expect(await screen.findByTestId("contact-status")).toHaveAttribute("data-status", "sent");
    expect(fetchMock).toHaveBeenCalledWith("/api/contact", expect.objectContaining({ method: "POST" }));
  });

  it("shows an error when the API fails and no fallback exists", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 502 }));
    const user = userEvent.setup();
    renderForm({ deliveryEnabled: true });
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: copy.submit }));
    expect(await screen.findByTestId("contact-status")).toHaveAttribute("data-status", "failed");
  });
});
