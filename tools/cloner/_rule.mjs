import { chromium } from 'playwright';
/** Second method on the stats rule: instead of walking ancestors for a border,
 *  list every thin horizontal element in the band, however it is built -- a
 *  border, a 1px box, or a background. Run at both widths so the method can be
 *  seen to find the rule where one is known to exist. */
const b = await chromium.launch();
for (const [w, lo, hi] of [[390, 6100, 6400], [1440, 5950, 6200]]) {
  for (const [base, side] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
    const p = await (await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 720, hasTouch: w < 720 })).newPage();
    await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await p.waitForTimeout(2400);
    await p.evaluate(async () => { for (let y = 0; y < 16000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } });
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(700);
    const out = await p.evaluate(([lo, hi]) => {
      const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
      const hits = [];
      for (const el of document.querySelectorAll('div,span,hr,p')) {
        const y = docTop(el), h = el.offsetHeight, wd = el.offsetWidth;
        const s = getComputedStyle(el);
        const bt = parseFloat(s.borderTopWidth) || 0;
        const thin = (h <= 3 && wd > 150) || (bt > 0 && wd > 150);
        if (!thin || y < lo || y > hi) continue;
        hits.push(`  y=${Math.round(y)} ${wd}x${h} border-top=${s.borderTopWidth} ${s.borderTopColor} bg=${s.backgroundColor}`);
      }
      return hits;
    }, [lo, hi]);
    console.log(`=== ${w} ${side} (band ${lo}-${hi}) ===`);
    out.length ? out.slice(0, 5).forEach(r => console.log(r)) : console.log('  no horizontal rule in the band');
    await p.context().close();
  }
}
await b.close();
