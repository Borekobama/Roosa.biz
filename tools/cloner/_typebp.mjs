import { chromium } from 'playwright';
/** Where the source's type steps. Framer's own breakpoints are not Tailwind's,
 *  so the exact widths have to be found rather than assumed. */
const WIDTHS = [701, 705, 709, 710, 711, 715, 719];
const b = await chromium.launch();
console.log('width | xl size/ls     l size/ls      m size/ls     (lh)');
for (const w of WIDTHS) {
  const p = await (await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 768, hasTouch: w < 768 })).newPage();
  await p.goto('https://solene.framer.ai/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2300);
  await p.evaluate(async () => { for (let y = 0; y < 16000; y += 450) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } });
  await p.waitForTimeout(700);
  const r = await p.evaluate(() => {
    const g = (frag) => {
      const el = [...document.querySelectorAll('h1,h2,h3')].find(x => (x.textContent || '').trim().startsWith(frag));
      if (!el) return '   —        ';
      const s = getComputedStyle(el);
      return `${String(parseFloat(s.fontSize)).padStart(3)}/${String(parseFloat(s.letterSpacing)).padStart(5)}/${String(Math.round(parseFloat(s.lineHeight) * 10) / 10).padStart(5)}`;
    };
    return `${g('Solene elevates your')}  ${g('Small habits')}  ${g('Real clarity begins')}`;
  });
  console.log(`${String(w).padStart(5)} | ${r}`);
  await p.context().close();
}
await b.close();
