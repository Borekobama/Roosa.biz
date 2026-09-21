import { chromium } from 'playwright';
/** The nutrient callout label and body type at three widths, both sides. */
const b = await chromium.launch();
for (const w of [390, 768, 1440]) {
  for (const [base, side] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
    const p = await (await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 720, hasTouch: w < 720 })).newPage();
    await p.goto(base + '/science', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await p.waitForTimeout(2400);
    await p.evaluate(async () => { for (let y = 0; y < 12000; y += 380) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 45)); } });
    await p.waitForTimeout(700);
    const out = await p.evaluate(() => {
      const d = (re) => {
        const el = [...document.querySelectorAll('p,span,h3,h4,h5')].find(x => re.test((x.textContent || '').trim()) && x.offsetHeight > 8);
        if (!el) return 'not found';
        const s = getComputedStyle(el), r = el.getBoundingClientRect();
        return `${String(parseFloat(s.fontSize)).padStart(4)}/${String(Math.round(parseFloat(s.lineHeight) * 10) / 10).padStart(5)} w=${s.fontWeight} ${Math.round(r.width)}x${Math.round(r.height)}`;
      };
      return { label: d(/^B VITAMINS$|^B Vitamins$/i), body: d(/^Support cellular energy/i) };
    });
    console.log(`${String(w).padStart(5)} ${side}  label ${out.label}   body ${out.body}`);
    await p.context().close();
  }
}
await b.close();
