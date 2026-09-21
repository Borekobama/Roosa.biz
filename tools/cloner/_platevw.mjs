import { chromium } from 'playwright';
/** Closing plate width at two viewports, to see whether the source caps it the
 *  way it caps the footer panel. */
const b = await chromium.launch();
for (const [w, h] of [[1440, 900], [1680, 1050]]) {
  for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
    await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await p.waitForTimeout(2400);
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
    await p.waitForTimeout(800);
    console.log(`${w}x${h} ${tag}`, await p.evaluate(() => {
      const big = [...document.querySelectorAll('img')]
        .map(i => ({ i, r: i.getBoundingClientRect() }))
        .filter(o => o.r.width > 900 && o.r.height > 400)
        .map(o => `${Math.round(o.r.width)}x${Math.round(o.r.height)}`);
      return [...new Set(big)].join(' | ');
    }));
    await p.context().close();
  }
}
await b.close();
