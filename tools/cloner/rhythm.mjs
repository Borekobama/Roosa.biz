#!/usr/bin/env node
/**
 * Section rhythm comparison, source vs clone.
 *
 * Type and image geometry can match while the gaps between sections drift.
 * This anchors on headings — the one landmark both sides share — and compares
 * the distance from each heading to the next, which is what vertical rhythm
 * actually looks like to a reader.
 */
import { chromium } from 'playwright';

const SOURCE = 'https://solene.framer.ai';
const CLONE = process.env.CLONE_BASE ?? 'http://localhost:3111';
const WIDTH = Number(process.env.WIDTH ?? 1440);
const HEIGHT = WIDTH < 768 ? 844 : 900;
const TOLERANCE = Number(process.env.TOLERANCE ?? 0.2);

const ROUTES = [
  ['/', '/'],
  ['/science', '/science'],
  ['/merch', '/merch'],
  ['/blog', '/blog'],
  ['/merch/daily-multivitamin%E2%84%A2', '/merch/daily-multivitamin'],
];

function landmarks() {
  const out = [];
  for (const el of document.querySelectorAll('h1,h2,h3,h4,h5')) {
    const text = (el.textContent || '').trim();
    if (!text) continue;
    if (/BUY LICEN|remove this banner|FRAMESHIP|Made in Framer/i.test(text)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 20 || r.height < 8) continue;
    out.push({
      y: Math.round(r.top + window.scrollY),
      size: Math.round(parseFloat(getComputedStyle(el).fontSize)),
      text: text.slice(0, 40),
    });
  }
  // Collapse headings that share a line (columns) to one landmark.
  const merged = [];
  for (const h of out.sort((a, b) => a.y - b.y)) {
    const prev = merged[merged.length - 1];
    if (prev && Math.abs(prev.y - h.y) < 12) continue;
    merged.push(h);
  }
  return merged;
}

const browser = await chromium.launch();
async function grab(base, route) {
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
    return await page.evaluate(landmarks);
  } catch {
    return [];
  } finally {
    await ctx.close();
  }
}

console.log(`Section rhythm at ${WIDTH}px (gap from each landmark to the next)\n`);
for (const [sr, cr] of ROUTES) {
  const s = await grab(SOURCE, sr);
  const c = await grab(CLONE, cr);
  const n = Math.min(s.length, c.length);
  const rows = [];
  for (let i = 0; i < n - 1; i += 1) {
    const sGap = s[i + 1].y - s[i].y;
    const cGap = c[i + 1].y - c[i].y;
    if (sGap < 40) continue;
    const drift = Math.abs(sGap - cGap) / sGap;
    if (drift > TOLERANCE) {
      rows.push(
        `  ${String(sGap).padStart(5)} -> ${String(cGap).padStart(5)}  (${(drift * 100).toFixed(0)}% off)  after "${s[i].text.slice(0, 32)}"`,
      );
    }
  }
  console.log(`### ${cr}  (${s.length} source landmarks / ${c.length} clone)`);
  console.log(rows.length ? rows.slice(0, 8).join('\n') : `  all gaps within ${TOLERANCE * 100}%`);
  console.log('');
}
await browser.close();
