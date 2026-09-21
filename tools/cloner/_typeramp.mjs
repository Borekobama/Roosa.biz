import { chromium } from 'playwright';
/** The source's own size/tracking ramp for each display heading across widths,
 *  so the clamps can be set from measurement instead of from the 1440 end
 *  alone. Tracking is reported in px and in em: if the px column is flat the
 *  source holds a fixed value and an em token cannot follow it. */
const PICKS = [
  ['Solene elevates your', 'xl'],
  ['Daily well-being requires', 'l'],
  ['Small habits', 'l'],
  ['Real clarity begins', 'm'],
  ['One formula, one rhythm', 'm'],
  ['Intelligent nutrition', 'm'],
];
const WIDTHS = [390, 768, 1024, 1440];
const b = await chromium.launch();
const table = {};
for (const w of WIDTHS) {
  const p = await (await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 768, hasTouch: w < 768 })).newPage();
  await p.goto('https://solene.framer.ai/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < 16000; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 45)); } });
  await p.waitForTimeout(800);
  table[w] = await p.evaluate((picks) => {
    const res = {};
    for (const [frag] of picks) {
      const el = [...document.querySelectorAll('h1,h2,h3')].find(x => (x.textContent || '').trim().startsWith(frag));
      if (!el) { res[frag] = null; continue; }
      const s = getComputedStyle(el);
      res[frag] = { fs: parseFloat(s.fontSize), ls: parseFloat(s.letterSpacing), lh: s.lineHeight };
    }
    return res;
  }, PICKS);
  await p.context().close();
}
console.log('heading                    tok |' + WIDTHS.map(w => `  ${String(w).padStart(4)}px: size/ls`).join(''));
for (const [frag, tok] of PICKS) {
  const cells = WIDTHS.map(w => {
    const v = table[w][frag];
    return v ? `  ${String(v.fs).padStart(5)}/${String(v.ls).padStart(6)}` : '        —     ';
  }).join('');
  console.log(frag.padEnd(26) + ' ' + tok.padEnd(3) + ' |' + cells);
}
await b.close();
