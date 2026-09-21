import { chromium } from 'playwright';
/** FAQ heading box and the closing block's jar, both sides. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  await p.waitForTimeout(700);
  const out = await p.evaluate(() => {
    const lines = [];
    const heading = [...document.querySelectorAll('h1,h2,h3')]
      .find(h => /frequently/i.test(h.textContent || ''));
    if (heading) {
      const s = getComputedStyle(heading); const r = heading.getBoundingClientRect();
      // where the text actually breaks
      const range = document.createRange(); range.selectNodeContents(heading);
      const rects = [...range.getClientRects()].map(x => Math.round(x.width));
      lines.push(`FAQ h [${Math.round(r.left)},${Math.round(r.top + scrollY)},${Math.round(r.width)},${Math.round(r.height)}] ${s.fontSize}/${s.lineHeight} maxw=${s.maxWidth} rows=${rects.join('|')} "${heading.textContent.trim()}"`);
    } else lines.push('FAQ h not found');
    // the closing block: the last large product image on the page
    const imgs = [...document.querySelectorAll('img')].map(i => ({ el: i, r: i.getBoundingClientRect() }))
      .filter(o => o.r.width > 40 && o.r.top + scrollY > document.body.scrollHeight - 2000);
    for (const o of imgs) {
      const s = getComputedStyle(o.el);
      lines.push(`closing IMG [${Math.round(o.r.left)},${Math.round(o.r.top + scrollY)},${Math.round(o.r.width)},${Math.round(o.r.height)}] ofit=${s.objectFit} src=${(o.el.currentSrc || '').split('/').pop().slice(0, 34)}`);
    }
    lines.push(`docHeight ${document.body.scrollHeight}`);
    return lines;
  });
  console.log('=== ' + tag + ' ==='); out.forEach(o => console.log('  ' + o));
  await p.context().close();
}
await b.close();
