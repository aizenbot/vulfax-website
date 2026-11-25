import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { scrollThrough } from "./helpers";

test.describe("contact form", () => {
  test("validates input and reports an honest status (en)", async ({ page }) => {
    await page.goto("/en#contact");
    const form = page.getByTestId("contact-form");
    await form.getByRole("button", { name: "Send message" }).click();
    await expect(form.getByText("Please enter your name.")).toBeVisible();
    await expect(form.getByText("Please enter a valid email address.")).toBeVisible();
    await expect(form.getByLabel("Name")).toHaveAttribute("aria-invalid", "true");

    await form.getByLabel("Name").fill("Sara Ahmed");
    await form.getByLabel("Work email").fill("sara@example.com");
    await form.getByLabel("Project details").fill("We need a customer portal for our logistics team.");
    await form.getByRole("button", { name: "Send message" }).click();

    const status = page.getByTestId("contact-status");
    await expect(status).toBeVisible();
    // No inbox or provider is configured in the test build — must not claim delivery.
    await expect(status).toHaveAttribute("data-status", "unconfigured");
  });

  test("shows Arabic validation messages (ar)", async ({ page }) => {
    await page.goto("/ar#contact");
    await page.getByTestId("contact-form").getByRole("button", { name: "أرسل الرسالة" }).click();
    await expect(page.getByText("يرجى إدخال اسمك.")).toBeVisible();
  });

  test("is fully keyboard operable", async ({ page, browserName }) => {
    test.skip(browserName === "webkit", "WebKit skips links on Tab unless the OS setting is enabled");
    await page.goto("/en#contact");
    await page.getByLabel("Name").focus();
    await page.keyboard.type("Sara Ahmed");
    await page.keyboard.press("Tab");
    await expect(page.getByLabel("Work email")).toBeFocused();
  });
});

test.describe("accessibility", () => {
  for (const locale of ["en", "ar"]) {
    test(`has no serious or critical axe violations (${locale})`, async ({ page, browserName }) => {
      test.skip(browserName !== "chromium", "axe audit runs once, on Chromium");
      await page.goto(`/${locale}`);
      await scrollThrough(page);
      await page.waitForTimeout(800);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(
        serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(", ")}`),
      ).toEqual([]);
    });
  }

  test("skip link moves focus to main content", async ({ page, browserName }) => {
    test.skip(browserName === "webkit", "WebKit skips links on Tab unless the OS setting is enabled");
    await page.goto("/en");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("all content is visible with reduced motion", async ({ page }) => {
    await page.goto("/en");
    await scrollThrough(page);
    await page.waitForTimeout(1200);
    for (const id of ["about-title", "capabilities-title", "process-title", "why-title", "vision-title", "contact-title"]) {
      const heading = page.locator(`#${id}`);
      await heading.scrollIntoViewIfNeeded();
      await expect(heading).toBeVisible();
      const opacity = await heading.evaluate((el) => {
        let node: Element | null = el;
        let value = 1;
        while (node) {
          value *= Number(getComputedStyle(node).opacity);
          node = node.parentElement;
        }
        return value;
      });
      expect(opacity, id).toBeGreaterThan(0.95);
    }
    const spin = await page.locator(".animate-spin-slow").first().evaluate((el) => getComputedStyle(el).animationName);
    expect(spin).toBe("none");
  });
});
