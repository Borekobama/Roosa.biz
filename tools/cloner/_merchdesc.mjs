import { chromium } from 'playwright';
/** The merch product description at three widths, both sides. */
const b = await chromium.launch();
for (const w of [390, 768, 1440]) {
  for (const [base, side] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
    const p = await (await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 720, hasTouch: w < 720 })).newPage();
    await p.goto(base + '/merch/ecobag', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await p.waitForTimeout(2300);
    const out = await p.evaluate(() => {
      const price = [...document.querySelectorAll('p,span,div')].find(x => /^\$\d/.test((x.textContent || '').trim()) && x.offsetHeight > 8);
      if (!price) return 'price not found';
      const pr = price.getBoundingClientRect();
      const cand = [...document.querySelectorAll('p')].filter(x => {
        const r = x.getBoundingClientRect();
        return x.offsetHeight > 20 && r.top > pr.bottom - 4 && r.top < pr.bottom + 120 && (x.textContent || '').trim().length > 40;
      })[0];
      if (!cand) return 'description not rendered';
      const s = getComputedStyle(cand), r = cand.getBoundingClientRect();
      return `${parseFloat(s.fontSize)}/${Math.round(parseFloat(s.lineHeight) * 10) / 10} ${Math.round(r.width)}x${Math.round(r.height)}  gap ${Math.round(r.top - pr.bottom)}  "${(cand.textContent || '').trim().slice(0, 34)}"`;
    });
    console.log(`${String(w).padStart(5)} ${side}  ${out}`);
    await p.context().close();
  }
}
await b.close();
