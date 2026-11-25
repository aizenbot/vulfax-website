import type { Page } from "@playwright/test";

/** Collects console errors and failed/4xx-5xx requests for the lifetime of a page. */
export function trackPageProblems(page: Page) {
  const problems: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") problems.push(`console: ${msg.text()}`);
  });
  page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
  page.on("requestfailed", (request) => {
    const failure = request.failure()?.errorText ?? "";
    // Navigations aborted by the test itself are not app failures.
    if (/aborted|cancelled|NS_BINDING_ABORTED/i.test(failure)) return;
    problems.push(`requestfailed: ${request.url()} ${failure}`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) problems.push(`http ${response.status()}: ${response.url()}`);
  });
  return problems;
}

/** Scrolls through the whole page so every whileInView reveal fires. */
export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 300));
  });
}

export const SECTION_IDS = ["home", "about", "capabilities", "process", "why", "vision", "contact"] as const;
