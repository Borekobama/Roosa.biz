import { chromium } from 'playwright';
/** Same anchor element on both sides at the three verified widths, so each
 *  type role can be compared without relying on group counts lining up. */
const PICKS = [
  ['xl   ', 'Solene elevates your'],
  ['l    ', 'Daily well-being requires'],
  ['m    ', 'Real clarity begins'],
  ['s    ', 'Sustained energy and the nutri'],
  ['xs   ', 'Suitable for everyone'],
  ['prod ', 'Daily Multivitamin'],
  ['price', '$87'],
  ['stat ', '72%'],
  ['eyeb ', 'Benefits'],
  ['lede ', 'Real vitamins crafted to nouri'],
];
const WIDTHS = [390, 768, 1440];
const b = await chromium.launch();
const data = {};
for (const [base, side] of [['https://solene.framer.ai', 'src'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'clo']]) {
  for (const w of WIDTHS) {
    const p = await (await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 720, hasTouch: w < 720 })).newPage();
    await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await p.waitForTimeout(2400);
    await p.evaluate(async () => { for (let y = 0; y < 16000; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } });
    await p.waitForTimeout(700);
    data[side + w] = await p.evaluate((picks) => {
      const out = {};
      for (const [tok, frag] of picks) {
        const el = [...document.querySelectorAll('h1,h2,h3,h4,h5,p,span,li,blockquote')]
          .find(x => !x.children.length && (x.textContent || '').trim().startsWith(frag));
        if (!el) { out[tok] = '        —         '; continue; }
        const s = getComputedStyle(el);
        const ls = parseFloat(s.letterSpacing);
        out[tok] = `${String(parseFloat(s.fontSize)).padStart(4)}/${String(Math.round(parseFloat(s.lineHeight) * 10) / 10).padStart(5)} ${String(isNaN(ls) ? 0 : Math.round(ls * 100) / 100).padStart(6)} ${s.fontFamily.split(',')[0].replace(/"/g, '').slice(0, 9)}`;
      }
      return out;
    }, PICKS);
    await p.context().close();
  }
}
for (const [tok] of PICKS) {
  console.log(`--- ${tok.trim()}`);
  for (const w of WIDTHS) {
    const s = data['src' + w][tok], c = data['clo' + w][tok];
    console.log(`   ${String(w).padStart(4)}  src ${s}   clone ${c}  ${s === c ? '' : '  <-- differs'}`);
  }
}
await b.close();
