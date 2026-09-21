import { chromium } from 'playwright';
/** Pill height and type at three widths, both sides. The Button component
 *  encodes a flat 45px from a desktop measurement; the SOL-G7 panel's pill
 *  measures 42 on a phone, so this checks whether the pill steps like the
 *  type does. */
const LABELS = ['Buy Offer', 'Know more', 'Open Blog', 'Shop now'];
const b = await chromium.launch();
for (const [w, tag] of [[390, 'PHONE  '], [768, 'TABLET '], [1440, 'DESKTOP']]) {
  for (const [base, side] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
    const p = await (await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 720, hasTouch: w < 720 })).newPage();
    await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await p.waitForTimeout(2400);
    await p.evaluate(async () => { for (let y = 0; y < 16000; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 45)); } });
    await p.waitForTimeout(700);
    const out = await p.evaluate((labels) => {
      const res = [];
      for (const l of labels) {
        const e = [...document.querySelectorAll('a,button')].find(x => (x.textContent || '').trim() === l && x.offsetHeight > 10);
        if (!e) continue;
        const s = getComputedStyle(e);
        res.push(`${l} ${e.offsetWidth}x${e.offsetHeight} ${parseFloat(s.fontSize)}/${Math.round(parseFloat(s.lineHeight) * 10) / 10} pad=${s.paddingLeft}/${s.paddingTop} r=${s.borderRadius.split(' ')[0]}`);
      }
      return res;
    }, LABELS);
    console.log(`${tag} ${side}  ${out.join(' | ') || 'none found'}`);
    await p.context().close();
  }
}
await b.close();
