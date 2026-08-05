import { mkdir } from "node:fs/promises";

const { chromium } = await import(
  process.env.PLAYWRIGHT_PATH ?? "playwright"
);
const outputDirectory = new URL("../output/comparison/", import.meta.url);
await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch({ headless: true });
try {
  for (const width of [1440, 390]) {
    const height = width === 1440 ? 900 : 844;
    for (const version of (process.env.CAPTURE_VERSIONS ?? "v5,v6").split(",")) {
      const port = version === "v5" ? 3004 : 3005;
      const page = await browser.newPage({ viewport: { width, height } });
      await page.goto(`http://127.0.0.1:${port}/en`, {
        waitUntil: "networkidle",
      });
      await page.screenshot({
        path: new URL(`${version}-${width}.png`, outputDirectory).pathname,
        fullPage: false,
      });
      if (version === "v6") {
        const team = page.locator("#team");
        await team.scrollIntoViewIfNeeded();
        await page.waitForTimeout(250);
        await team.screenshot({
          path: new URL(`v6-team-${width}.png`, outputDirectory).pathname,
        });
      }
      await page.close();
    }
  }
} finally {
  await browser.close();
}
