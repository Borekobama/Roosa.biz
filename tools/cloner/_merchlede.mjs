import { chromium } from 'playwright';
/** The merch hero lede at three widths, both sides. */
const b = await chromium.launch();
for (const w of [390, 768, 1440]) {
  for (const [base, side] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
    const p = await (await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 720, hasTouch: w < 720 })).newPage();
    await p.goto(base + '/merch', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await p.waitForTimeout(2300);
    const out = await p.evaluate(() => {
      const el = [...document.querySelectorAll('p')].find(x => /^Spread your passion/i.test((x.textContent || '').trim()));
      if (!el) return 'not found';
      const s = getComputedStyle(el), r = el.getBoundingClientRect();
      return `${String(parseFloat(s.fontSize)).padStart(4)}/${String(Math.round(parseFloat(s.lineHeight) * 10) / 10).padStart(5)} box ${Math.round(r.width)}x${Math.round(r.height)} maxw=${s.maxWidth}`;
    });
    console.log(`${String(w).padStart(5)} ${side}  ${out}`);
    await p.context().close();
  }
}
await b.close();
