import { chromium } from 'playwright';
/** The testimonial heading's own type at three widths, both sides. */
const b = await chromium.launch();
for (const w of [390, 768, 1440]) {
  for (const [base, side] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
    const p = await (await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 720, hasTouch: w < 720 })).newPage();
    await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await p.waitForTimeout(2400);
    await p.evaluate(async () => { for (let y = 0; y < 16000; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 45)); } });
    await p.waitForTimeout(700);
    const out = await p.evaluate(() => {
      const h = [...document.querySelectorAll('h1,h2,h3')].find(x => /listen just from us/i.test(x.textContent || ''));
      if (!h) return null;
      const s = getComputedStyle(h), r = h.getBoundingClientRect();
      return `${parseFloat(s.fontSize)}/${Math.round(parseFloat(s.lineHeight) * 10) / 10} ls=${parseFloat(s.letterSpacing)} box ${Math.round(r.width)}x${Math.round(r.height)} maxw=${s.maxWidth}`;
    });
    console.log(`${String(w).padStart(5)} ${side}  ${out ?? 'not found'}`);
    await p.context().close();
  }
}
await b.close();
