import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MotionProvider } from "@/components/animations/MotionProvider";
import { Navbar } from "@/components/layout/Navbar";
import { navItems } from "@/config/navigation";
import { ar } from "@/content/ar";
import { en } from "@/content/en";

function renderNavbar(locale: "en" | "ar" = "en") {
  const content = locale === "en" ? en : ar;
  return render(
    <MotionProvider>
      <Navbar locale={locale} nav={content.nav} a11y={content.a11y} />
    </MotionProvider>,
  );
}

describe("Navbar", () => {
  it("renders every section link with a valid anchor", () => {
    renderNavbar();
    const nav = screen.getByRole("navigation", { name: en.a11y.mainNav });
    for (const item of navItems) {
      expect(within(nav).getByRole("link", { name: en.nav.labels[item.id] })).toHaveAttribute("href", item.href);
    }
  });

  it("opens and closes the mobile menu with the toggle and Escape", async () => {
    const user = userEvent.setup();
    renderNavbar();
    const toggle = screen.getByTestId("menu-toggle");
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(document.body.style.overflow).toBe("");
  });

  it("closes the mobile menu when a link is chosen", async () => {
    const user = userEvent.setup();
    renderNavbar();
    await user.click(screen.getByTestId("menu-toggle"));
    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByRole("link", { name: en.nav.labels.capabilities }));
    expect(screen.getByTestId("menu-toggle")).toHaveAttribute("aria-expanded", "false");
  });

  it("links to the other language", () => {
    renderNavbar("ar");
    const switchers = screen.getAllByTestId("language-switcher");
    expect(switchers[0]).toHaveAttribute("href", "/en");
    expect(switchers[0]).toHaveAttribute("hreflang", "en");
  });
});
