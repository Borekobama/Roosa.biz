#!/usr/bin/env node
/**
 * Typography and section-rhythm comparison, source vs clone.
 *
 * Aspect ratios say nothing about type size, weight, tracking or the gaps
 * between sections. This buckets every visible text run by role and reports
 * where the two sides disagree.
 */
import { chromium } from 'playwright';

const SOURCE = 'https://solene.framer.ai';
const CLONE = process.env.CLONE_BASE ?? 'http://localhost:3111';
const WIDTH = Number(process.env.WIDTH ?? 1440);
const HEIGHT = WIDTH < 768 ? 844 : 900;

const ROUTES = [
  ['/', '/'],
  ['/science', '/science'],
  ['/merch', '/merch'],
  ['/blog', '/blog'],
];

function collect() {
  const out = [];
  for (const el of document.querySelectorAll(
    'h1,h2,h3,h4,h5,h6,p,a,button,li,span,dt,dd,th,td,strong,em,blockquote,figcaption,legend,label',
  )) {
    if (el.closest('script, style, noscript')) continue;
    const text = (el.textContent || '').trim();
    if (!text || text.length < 3 || text.length > 90) continue;
    // Framer injects a licence banner and a "Made in Framer" badge over the
    // preview; neither belongs to the template.
    if (/BUY LICEN|remove this banner|FRAMESHIP|Made in Framer/i.test(text)) continue;
    if (el.closest('[class*="frameship" i], [id*="frameship" i]')) continue;
    // Only leaf-ish nodes, so a wrapper does not double-count its child.
    const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!ownText) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 6) continue;
    const cs = getComputedStyle(el);
    out.push({
      tag: el.tagName,
      size: Math.round(parseFloat(cs.fontSize)),
      weight: cs.fontWeight,
      lh: Math.round(parseFloat(cs.lineHeight) || 0),
      ls: cs.letterSpacing === 'normal' ? 0 : +parseFloat(cs.letterSpacing).toFixed(2),
      color: cs.color,
      y: Math.round(r.top + window.scrollY),
      text: text.slice(0, 38),
    });
  }
  return out.sort((a, b) => a.y - b.y);
}

const browser = await chromium.launch();
async function grab(base, route) {
  const ctx = await browser.newContext({ viewport: { width: WIDTH, height: HEIGHT } });
  const page = await ctx.newPage();
  try {
    await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight * 0.6) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 130));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 600));
    });
    return await page.evaluate(collect);
  } catch {
    return [];
  } finally {
    await ctx.close();
  }
}

/**
 * Roles keyed on size+weight, not tag: a heading rendered as h3 rather than h5
 * looks identical, so tag differences are reported separately.
 */
function roles(list) {
  const m = new Map();
  for (const t of list) {
    const k = `${t.size}px w${t.weight}`;
    if (!m.has(k)) m.set(k, { k, n: 0, lh: t.lh, ls: t.ls, sample: t.text, tags: new Set() });
    const r = m.get(k);
    r.n += 1;
    r.tags.add(t.tag);
  }
  return m;
}

console.log(`Typography comparison at ${WIDTH}px\n`);
for (const [sr, cr] of ROUTES) {
  const s = await grab(SOURCE, sr);
  const c = await grab(CLONE, cr);
  const sm = roles(s);
  const cm = roles(c);
  const rows = [];
  for (const [k, v] of [...sm.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, 12)) {
    const cv = cm.get(k);
    const st = [...v.tags].sort().join('/');
    if (!cv) {
      rows.push(`  ${k.padEnd(14)} source x${String(v.n).padEnd(3)} ${st} lh=${v.lh} ls=${v.ls}   clone ABSENT   "${v.sample}"`);
      continue;
    }
    const ct = [...cv.tags].sort().join('/');
    if (Math.abs(cv.lh - v.lh) > 3 || Math.abs(cv.ls - v.ls) > 0.5) {
      rows.push(`  ${k.padEnd(14)} source ${st} lh=${v.lh} ls=${v.ls}   clone ${ct} lh=${cv.lh} ls=${cv.ls}  <-- metrics`);
    } else if (v.n >= 4 && cv.n * 2 < v.n) {
      rows.push(`  ${k.padEnd(14)} source x${v.n} ${st}   clone x${cv.n} ${ct}  <-- count   "${v.sample}"`);
    }
  }
  console.log(`### ${cr}`);
  console.log(rows.length ? rows.join('\n') : '  top roles present with matching metrics');
  console.log('');
}
await browser.close();
