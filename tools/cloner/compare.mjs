#!/usr/bin/env node
/**
 * Side-by-side capture: walks the source and the clone down the same route in
 * viewport-sized slices, so each slice is legible when reviewed.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const SOURCE = 'https://solene.framer.ai';
const CLONE = process.env.CLONE_BASE ?? 'http://localhost:3111';
const OUT = process.argv[3] ?? join(process.cwd(), 'docs', 'research', '_compare');
const route = process.argv[2] ?? '/';
const SLICES = Number(process.env.SLICES ?? 8);

mkdirSync(OUT, { recursive: true });

async function capture(browser, base, label) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();
  await page.goto(base + route, { waitUntil: 'networkidle', timeout: 90000 });

  // Force every lazy image to load, then wait for all of them to decode.
  await page.evaluate(async () => {
    for (const img of document.querySelectorAll('img')) {
      img.loading = 'eager';
      if (img.dataset.src && !img.src) img.src = img.dataset.src;
    }
    for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight * 0.5) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 260));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 900));
    await Promise.all(
      [...document.querySelectorAll('img')].map((i) => (i.decode ? i.decode().catch(() => {}) : null)),
    );
  });
  await page.waitForTimeout(1200);

  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const slug = route === '/' ? 'home' : route.slice(1).replace(/\//g, '_');

  for (let i = 0; i < SLICES; i += 1) {
    const y = Math.round((height / SLICES) * i);
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(650);
    await page.screenshot({ path: join(OUT, `${slug}-${label}-${String(i).padStart(2, '0')}.png`) });
  }

  await context.close();
  return height;
}

const browser = await chromium.launch();
const sh = await capture(browser, SOURCE, 'source');
const ch = await capture(browser, CLONE, 'clone');
await browser.close();
console.log(`route ${route}: source ${sh}px, clone ${ch}px, delta ${ch - sh}px -> ${OUT}`);
