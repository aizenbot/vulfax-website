import { expect, test } from "@playwright/test";
import { SECTION_IDS, scrollThrough, trackPageProblems } from "./helpers";

const locales = [
  { code: "en", dir: "ltr", cta: "Start a project", menu: "Open menu" },
  { code: "ar", dir: "rtl", cta: "ابدأ مشروعك", menu: "فتح القائمة" },
] as const;

test.describe("routing", () => {
  test("root redirects to the default locale", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
  });

  test("root redirects Arabic browsers to /ar", async ({ browser }) => {
    const context = await browser.newContext({ locale: "ar-EG" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/ar$/);
    await context.close();
  });

  test("unknown paths render the 404 page", async ({ page }) => {
    const response = await page.goto("/en/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
  });

  test("serves sitemap and robots", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBe(true);
    expect(await sitemap.text()).toContain("/ar");
    const robots = await request.get("/robots.txt");
    expect(await robots.text()).toContain("Sitemap:");
  });

  test("contact API is safely disabled until configured", async ({ request }) => {
    const response = await request.post("/api/contact", { data: {} });
    expect(response.status()).toBe(501);
  });
});

for (const locale of locales) {
  test.describe(`landing page (${locale.code})`, () => {
    test("renders all nine sections with correct language metadata and no errors", async ({ page }) => {
      const problems = trackPageProblems(page);
      await page.goto(`/${locale.code}`);

      await expect(page.locator("html")).toHaveAttribute("lang", locale.code);
      await expect(page.locator("html")).toHaveAttribute("dir", locale.dir);
      await expect(page.getByTestId("navbar")).toBeVisible();
      for (const id of SECTION_IDS) {
        await expect(page.locator(`section#${id}`)).toHaveCount(1);
      }
      await expect(page.locator("footer")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveCount(1);

      // No duplicate ids anywhere in the document.
      const duplicates = await page.evaluate(() => {
        const ids = [...document.querySelectorAll("[id]")].map((el) => el.id);
        return ids.filter((id, i) => ids.indexOf(id) !== i);
      });
      expect(duplicates).toEqual([]);

      // Every in-page anchor points at an element that exists.
      const brokenAnchors = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]
          .map((a) => a.getAttribute("href")!.slice(1))
          .filter((id) => !document.getElementById(id)),
      );
      expect(brokenAnchors).toEqual([]);

      await scrollThrough(page);
      expect(problems).toEqual([]);
    });

    test("desktop navigation scrolls to each section and marks it active", async ({ page }) => {
      await page.goto(`/${locale.code}`);
      const nav = page.getByRole("navigation").first();
      for (const id of ["about", "capabilities", "process", "why", "vision"]) {
        await nav.locator(`a[href="#${id}"]`).click();
        await expect(page).toHaveURL(new RegExp(`#${id}$`));
        await expect
          .poll(async () => page.locator(`section#${id}`).evaluate((el) => Math.round(el.getBoundingClientRect().top)), {
            timeout: 5000,
          })
          .toBeLessThan(140);
        await expect(nav.locator(`a[href="#${id}"]`)).toHaveAttribute("aria-current", "true");
      }
    });

    test("primary CTA leads to the contact section", async ({ page }) => {
      await page.goto(`/${locale.code}`);
      await page.locator("#home").getByRole("link", { name: locale.cta }).click();
      await expect(page).toHaveURL(/#contact$/);
      await expect(page.locator("#contact form")).toBeInViewport();
    });

    test("navbar turns to glass after scrolling", async ({ page }) => {
      await page.goto(`/${locale.code}`);
      await expect(page.getByTestId("navbar")).toHaveAttribute("data-scrolled", "false");
      await page.mouse.wheel(0, 600);
      await expect(page.getByTestId("navbar")).toHaveAttribute("data-scrolled", "true");
    });
  });
}

test("language switcher swaps locale and keeps the current section", async ({ page }) => {
  await page.goto("/en#process");
  await page.getByTestId("language-switcher").first().click();
  await expect(page).toHaveURL(/\/ar#process$/);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await page.getByTestId("language-switcher").first().click();
  await expect(page).toHaveURL(/\/en#process$/);
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
});
