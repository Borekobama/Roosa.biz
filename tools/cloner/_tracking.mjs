import { chromium } from 'playwright';
/** Letter-spacing of every major heading at phone width, both sides. The
 *  display tokens express tracking in em on a fluid size, so if the source
 *  holds a fixed px value the two only agree at 1440. */
const PICKS = [
  'Real clarity begins', 'Daily well-being requires', 'Solene elevates your',
  'One formula, one rhythm', 'Small habits', 'Well-being that', 'Intelligent nutrition',
  'What goes into', 'Frequently asked', 'Loved by', 'Latest from',
];
const b = await chromium.launch();
const rows = {};
for (const [base, side] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE']]) {
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < 16000; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 45)); } });
  await p.waitForTimeout(800);
  const out = await p.evaluate((picks) => {
    const res = {};
    for (const frag of picks) {
      const el = [...document.querySelectorAll('h1,h2,h3')].find(x => (x.textContent || '').trim().startsWith(frag));
      if (!el) { res[frag] = '—'; continue; }
      const s = getComputedStyle(el);
      res[frag] = `${s.fontSize.padStart(5)} / ls ${s.letterSpacing.padStart(8)} = ${(parseFloat(s.letterSpacing) / parseFloat(s.fontSize)).toFixed(4)}em`;
    }
    return res;
  }, PICKS);
  rows[side] = out;
  await p.context().close();
}
for (const frag of PICKS) {
  console.log(`${frag.padEnd(26)} src ${(rows.SOURCE[frag] || '—').padEnd(34)} clone ${rows.CLONE[frag] || '—'}`);
}
await b.close();
