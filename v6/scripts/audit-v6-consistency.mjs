import { mkdir } from "node:fs/promises";

const { chromium } = await import(
  process.env.PLAYWRIGHT_PATH ?? "playwright"
);
const base = "http://127.0.0.1:3005";
const routes = ["/en", "/en/shop", "/en/product/pink-toilet-paper", "/en/cart", "/en/about", "/en/impact"];
const output = new URL("../output/consistency-audit/", import.meta.url);
await mkdir(output, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH,
});
try {
  for (const viewport of [
    { name: "desktop", width: 1440, height: 900 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    for (const route of routes) {
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(base + route, { waitUntil: "networkidle" });
      const data = await page.evaluate(() => {
        const simplify = (element) => {
          if (!element) return null;
          const style = getComputedStyle(element);
          const box = element.getBoundingClientRect();
          return {
            text: element.textContent?.trim().replace(/\s+/g, " ").slice(0, 60),
            className: element.className,
            tag: element.tagName,
            width: Math.round(box.width),
            height: Math.round(box.height),
            borderRadius: style.borderRadius,
            backgroundColor: style.backgroundColor,
            color: style.color,
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
            padding: style.padding,
            lineHeight: style.lineHeight,
          };
        };
        const buttons = [...document.querySelectorAll("a.btn, .roosa-hero-actions a, button")]
          .filter((element) => element.getBoundingClientRect().width > 0)
          .slice(0, 10)
          .map(simplify);
        const headings = [...document.querySelectorAll("h1, h2")]
          .filter((element) => element.getBoundingClientRect().width > 0)
          .slice(0, 4)
          .map(simplify);
        const nav = simplify(document.querySelector(".navbar_component"));
        return {
          path: location.pathname,
          title: document.title,
          bodyFont: getComputedStyle(document.body).fontFamily,
          bodyBackground: getComputedStyle(document.body).backgroundColor,
          horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
          buttons,
          headings,
          nav,
        };
      });
      await page.screenshot({ path: new URL(`${viewport.name}-${route.replaceAll("/", "_") || "root"}.png`, output).pathname, fullPage: false });
      console.log(JSON.stringify({ viewport: viewport.name, route, errors, data }));
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
}
