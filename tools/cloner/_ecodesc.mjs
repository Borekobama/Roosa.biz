import { chromium } from 'playwright';
/** Does the source show a standalone description on a plain merch product,
 *  as distinct from the supplement page which hides it in the accordion? */
const b = await chromium.launch();
for (const route of ['/merch/ecobag', '/merch/poster']) {
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
  await p.goto('https://solene.framer.ai' + route, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let y = 0; y < 5000; y += 320) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(600);
  const out = await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const price = [...document.querySelectorAll('p,span,div')].find(x => /^\$\d/.test((x.textContent || '').trim()) && x.offsetHeight > 8);
    const py = price ? docTop(price) : 0;
    const rows = [];
    for (const el of document.querySelectorAll('p,h1,h2,h3,h4,button,a')) {
      const y = docTop(el), h = el.offsetHeight;
      if (h < 12 || y < py - 60 || y > py + 340) continue;
      const leaf = !el.children.length || ![...el.children].some(c => c.offsetHeight > 4);
      if (!leaf) continue;
      const s = getComputedStyle(el);
      rows.push(`  ${String(Math.round(y)).padStart(4)} h=${String(h).padStart(3)} w=${String(el.offsetWidth).padStart(3)} ${parseFloat(s.fontSize)}px "${(el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40)}"`);
    }
    return rows.slice(0, 8);
  });
  console.log(`=== SOURCE ${route} ===`);
  out.forEach(r => console.log(r));
  await p.context().close();
}
await b.close();
