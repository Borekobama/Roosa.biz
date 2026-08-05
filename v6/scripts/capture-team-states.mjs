import { mkdir } from "node:fs/promises";

const { chromium } = await import(
  process.env.PLAYWRIGHT_PATH ?? "playwright"
);
const output = new URL("../output/team-states/", import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH,
});

try {
  for (const [name, viewport] of [
    ["desktop", { width: 1440, height: 900 }],
    ["mobile", { width: 390, height: 844 }],
  ]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:3005/en", { waitUntil: "networkidle" });
    const team = page.locator("#team");
    await team.scrollIntoViewIfNeeded();
    await page.waitForFunction(
      () => document.querySelector("[data-v6-team-sequence]")?.dataset.ready === "true",
    );
    for (const progress of [0, 0.5, 1]) {
      await team.evaluate((element, nextProgress) => {
        const box = element.getBoundingClientRect();
        const travel = Math.max(1, box.height + window.innerHeight * 0.6);
        const targetTop = window.innerHeight * 0.8 - travel * nextProgress;
        window.scrollTo({ top: box.top + window.scrollY - targetTop, behavior: "instant" });
      }, progress);
      await page.waitForTimeout(300);
      await page.screenshot({
        path: new URL(`${name}-${progress}.png`, output).pathname,
        fullPage: false,
      });
    }
    await context.close();
  }
} finally {
  await browser.close();
}
