import { chromium } from 'playwright';
/** The source's whole type system on the home page, grouped by computed style,
 *  at the three verified widths. Measuring every role at once rather than one
 *  token at a time: a fluid ramp fitted to the 1440 end alone can be wrong at
 *  every other width without any single check noticing. */
const WIDTHS = [390, 768, 1440];
const b = await chromium.launch();
const seen = {};
for (const w of WIDTHS) {
  const p = await (await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 720, hasTouch: w < 720 })).newPage();
  await p.goto('https://solene.framer.ai/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < 16000; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } });
  await p.waitForTimeout(800);
  seen[w] = await p.evaluate(() => {
    const out = {};
    for (const el of document.querySelectorAll('h1,h2,h3,h4,h5,p,li,blockquote')) {
      const t = (el.textContent || '').trim().replace(/\s+/g, ' ');
      if (!t || el.children.length) continue;
      const s = getComputedStyle(el);
      const key = `${el.tagName} ${parseFloat(s.fontSize)}/${Math.round(parseFloat(s.lineHeight) * 10) / 10} ls=${parseFloat(s.letterSpacing)} w=${s.fontWeight} ${s.fontFamily.split(',')[0].replace(/"/g, '')}`;
      if (!out[key]) out[key] = { n: 0, ex: t.slice(0, 30) };
      out[key].n++;
    }
    return out;
  });
  await p.context().close();
}
const keys = [...new Set(WIDTHS.flatMap(w => Object.keys(seen[w])))].sort();
for (const k of keys) {
  const where = WIDTHS.filter(w => seen[w][k]).map(w => `${w}(${seen[w][k].n})`).join(' ');
  const ex = WIDTHS.map(w => seen[w][k]?.ex).find(Boolean);
  console.log(`${k.padEnd(52)} @ ${where.padEnd(24)} "${ex}"`);
}
await b.close();
