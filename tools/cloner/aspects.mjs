#!/usr/bin/env node
/**
 * Compare every rendered image's aspect ratio, source vs clone, at one width.
 *
 * The source switches several images between portrait on mobile and landscape
 * on desktop. Finding those one page at a time is slow; this lists every
 * mismatch across all routes in one pass.
 */
import { chromium } from 'playwright';

const SOURCE = 'https://solene.framer.ai';
const CLONE = process.env.CLONE_BASE ?? 'http://localhost:3111';
const WIDTH = Number(process.env.WIDTH ?? 390);
const HEIGHT = WIDTH < 768 ? 844 : 900;

const ROUTES = [
  ['/', '/'],
  ['/science', '/science'],
  ['/merch', '/merch'],
  ['/blog', '/blog'],
  ['/merch/daily-multivitamin%E2%84%A2', '/merch/daily-multivitamin'],
  ['/merch/cap', '/merch/cap'],
  ['/blog/gummy-supplements', '/blog/reading-a-supplement-label'],
];

const browser = await chromium.launch();

async function shots(base, route) {
  const ctx = await browser.newContext({ viewport: { width: WIDTH, height: HEIGHT } });
  const page = await ctx.newPage();
  try {
    await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.evaluate(async () => {
      for (const i of document.querySelectorAll('img')) i.loading = 'eager';
      for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight * 0.5) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 150));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 700));
    });
    return await page.evaluate(() =>
      [...document.querySelectorAll('img')]
        // The cart panel carries the product as its empty-state backdrop and
        // sits in the document on every route; it is not page imagery.
        .filter((i) => !i.closest('aside[aria-label="Your cart"]'))
        .map((i) => {
          const r = i.getBoundingClientRect();
          // Both sides serve the same filenames, so the stem is a stable key.
          // Next rewrites srcs through /_next/image?url=..., so unwrap that.
          let file = '?';
          try {
            const raw = i.currentSrc || i.src;
            const u = new URL(raw, location.href);
            const inner = u.searchParams.get('url');
            const path = inner ? decodeURIComponent(inner) : u.pathname;
            file = (path.split('/').pop() || '').replace(/\.[a-z0-9]+$/i, '');
          } catch {
            /* keep '?' */
          }
          return {
            file,
            y: Math.round(r.top + window.scrollY),
            w: Math.round(r.width),
            h: Math.round(r.height),
            ratio: r.height ? +(r.width / r.height).toFixed(2) : null,
          };
        })
        .filter((i) => i.w > 150 && i.h > 60)
        .sort((a, b) => a.y - b.y),
    );
  } catch {
    return [];
  } finally {
    await ctx.close();
  }
}

console.log(`Image aspect comparison at ${WIDTH}px (source vs clone)\n`);
for (const [sr, cr] of ROUTES) {
  const s = await shots(SOURCE, sr);
  const c = await shots(CLONE, cr);
  // Match on the asset stem, not document position: once both sides render a
  // similar count, index comparison reports ordering as mismatch.
  const key = (f) => f.replace(/-[0-9a-f]{8}$/i, '');
  const byKey = (list) => {
    const m = new Map();
    for (const item of list) {
      const k = key(item.file);
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(item);
    }
    return m;
  };
  const sm = byKey(s);
  const cm = byKey(c);
  const rows = [];
  for (const [k, sItems] of sm) {
    const cItems = cm.get(k);
    if (!cItems) {
      rows.push(`  ${k.slice(0, 26).padEnd(28)} source ${sItems[0].w}x${sItems[0].h}   clone NOT RENDERED`);
      continue;
    }
    const a = sItems[0];
    const b = cItems[0];
    const bad = a.ratio && b.ratio && Math.abs(a.ratio - b.ratio) / a.ratio > 0.15;
    const countOff = sItems.length !== cItems.length;
    if (bad || countOff) {
      rows.push(
        `  ${k.slice(0, 26).padEnd(28)} source ${a.w}x${a.h} r=${a.ratio} x${sItems.length}   clone ${b.w}x${b.h} r=${b.ratio} x${cItems.length}${bad ? '  <-- aspect' : ''}${countOff ? '  <-- count' : ''}`,
      );
    }
  }
  for (const [k, cItems] of cm) {
    if (!sm.has(k)) {
      rows.push(`  ${k.slice(0, 26).padEnd(28)} source NOT RENDERED   clone ${cItems[0].w}x${cItems[0].h}`);
    }
  }
  console.log(`### ${cr}  (${s.length} source imgs / ${c.length} clone imgs)`);
  console.log(rows.length ? rows.slice(0, 8).join('\n') : '  all aspects within 15%');
  console.log('');
}
await browser.close();
