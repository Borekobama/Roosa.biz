#!/usr/bin/env node
/**
 * Side-by-side sweep: source vs clone.
 *
 * Captures every route at matched scroll positions and every interactive state
 * (menus, accordions, flavour pills, hovers, the pinned scroll sequence), then
 * composites each pair into one image for direct comparison.
 */
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SOURCE = 'https://solene.framer.ai';
const CLONE = process.env.CLONE_BASE ?? 'http://localhost:3111';
const OUT = join(process.cwd(), 'docs', 'research', '_sweep');
const PAIRS = join(OUT, 'pairs');
mkdirSync(PAIRS, { recursive: true });

/** source route -> clone route */
const ROUTES = [
  ['/', '/'],
  ['/science', '/science'],
  ['/merch', '/merch'],
  ['/blog', '/blog'],
  ['/merch/daily-multivitamin%E2%84%A2', '/merch/daily-multivitamin'],
  ['/merch/cap', '/merch/cap'],
  ['/blog/gummy-supplements', '/blog/reading-a-supplement-label'],
  ['/privacy-policy', '/privacy-policy'],
  ['/cookies-policy', '/cookies-policy'],
];

const SLICES = Number(process.env.SLICES ?? 6);
const ONLY_ROUTE = process.env.ONLY_ROUTE;
const ONLY_VP = process.env.ONLY_VP;

async function settle(page) {
  await page.evaluate(async () => {
    for (const i of document.querySelectorAll('img')) i.loading = 'eager';
    for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight * 0.5) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 200));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 800));
  });
  await page.waitForTimeout(700);
}

async function shots(browser, base, route, width, height, label) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await settle(page);
  const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const out = [];
  for (let i = 0; i < SLICES; i += 1) {
    const y = Math.round(((docHeight - height) / (SLICES - 1)) * i);
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(550);
    const buf = await page.screenshot();
    out.push({ i, y, buf });
  }
  await ctx.close();
  return { docHeight, out, label };
}

/** Composite two PNG buffers side by side by rendering them in a page. */
async function pair(browser, leftBuf, rightBuf, width, height, outPath, caption) {
  const ctx = await browser.newContext({
    viewport: { width: width * 2 + 36, height: height + 46 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  const l = leftBuf.toString('base64');
  const r = rightBuf.toString('base64');
  await page.setContent(`<!doctype html><html><body style="margin:0;background:#111;font:12px -apple-system,sans-serif;color:#fff">
    <div style="display:flex;gap:12px;padding:6px 12px"><div style="flex:1">SOURCE — ${caption}</div><div style="flex:1">CLONE — ${caption}</div></div>
    <div style="display:flex;gap:12px;padding:0 12px 12px">
      <img src="data:image/png;base64,${l}" style="width:${width}px;height:${height}px;display:block;outline:1px solid #0f0">
      <img src="data:image/png;base64,${r}" style="width:${width}px;height:${height}px;display:block;outline:1px solid #f60">
    </div></body></html>`);
  await page.waitForTimeout(280);
  await page.screenshot({ path: outPath, fullPage: true });
  await ctx.close();
}

const browser = await chromium.launch();

// Refuse to capture against a stale build: unstyled pages look plausible in a
// screenshot but compare nothing meaningful.
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(CLONE + '/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  const hrefs = await page.evaluate(() =>
    [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.getAttribute('href')),
  );
  if (hrefs.length === 0) {
    console.error('PREFLIGHT FAILED: clone references no stylesheet');
    process.exit(2);
  }
  for (const href of hrefs) {
    const res = await page.request.get(new URL(href, CLONE).href);
    if (res.status() !== 200) {
      console.error(`PREFLIGHT FAILED: ${href} returned ${res.status()} — rebuild and restart (tools/cloner/serve.sh)`);
      process.exit(2);
    }
  }
  await ctx.close();
  console.log('preflight ok');
}

const manifest = [];

for (const [sr, cr] of ROUTES.filter(([, c]) => !ONLY_ROUTE || c === ONLY_ROUTE)) {
  for (const [w, h, vp] of [[1440, 900, 'desktop'], [390, 844, 'mobile']].filter(([, , v]) => !ONLY_VP || v === ONLY_VP)) {
    const s = await shots(browser, SOURCE, sr, w, h, 'source');
    const c = await shots(browser, CLONE, cr, w, h, 'clone');
    const slug = (cr === '/' ? 'home' : cr.slice(1).replace(/\//g, '_')) + '-' + vp;
    for (let i = 0; i < SLICES; i += 1) {
      const file = join(PAIRS, `${slug}-${String(i).padStart(2, '0')}.png`);
      await pair(browser, s.out[i].buf, c.out[i].buf, w, h, file, `${cr} ${vp} ${i + 1}/${SLICES}`);
    }
    manifest.push({ route: cr, vp, sourceHeight: s.docHeight, cloneHeight: c.docHeight });
    console.log(`${cr} @ ${vp}: source ${s.docHeight}px clone ${c.docHeight}px`);
  }
}

writeFileSync(join(OUT, 'sweep.json'), JSON.stringify(manifest, null, 2));
await browser.close();
console.log(`\npairs written to docs/research/_sweep/pairs`);
