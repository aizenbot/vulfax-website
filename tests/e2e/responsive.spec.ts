import { expect, test } from "@playwright/test";
import { scrollThrough } from "./helpers";

const widths = [360, 375, 390, 430, 768, 1024, 1280, 1440, 1920];

for (const locale of ["en", "ar"] as const) {
  test(`no horizontal overflow at any breakpoint (${locale})`, async ({ page }) => {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}`);
      await scrollThrough(page);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `overflow at ${width}px`).toBeLessThanOrEqual(0);

      // Headings must not be clipped by their own box.
      const clipped = await page.evaluate(() =>
        [...document.querySelectorAll("h1, h2, h3")]
          .filter((h) => h.scrollWidth > h.clientWidth + 1)
          .map((h) => h.textContent?.slice(0, 40)),
      );
      expect(clipped, `clipped headings at ${width}px`).toEqual([]);
    }
  });
}

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  for (const locale of [
    { code: "en", open: "Open menu", close: "Close menu", label: "Capabilities" },
    { code: "ar", open: "فتح القائمة", close: "إغلاق القائمة", label: "القدرات" },
  ] as const) {
    test(`opens, navigates and closes (${locale.code})`, async ({ page }) => {
      await page.goto(`/${locale.code}`);
      const toggle = page.getByRole("button", { name: locale.open });
      await expect(toggle).toBeVisible();
      const box = await toggle.boundingBox();
      expect(box!.width).toBeGreaterThanOrEqual(44);

      await toggle.click();
      const menu = page.getByTestId("mobile-menu");
      await expect(menu).toBeVisible();
      await menu.getByRole("link", { name: locale.label }).click();
      await expect(menu).toBeHidden();
      await expect(page).toHaveURL(/#capabilities$/);

      await page.getByRole("button", { name: locale.open }).click();
      await expect(page.getByTestId("mobile-menu")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByTestId("mobile-menu")).toBeHidden();
    });
  }
});
