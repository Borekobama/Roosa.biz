import { chromium } from 'playwright';
/** The legal page header at phone, both sides: everything above the first
 *  section heading, positioned absolutely down the page. */
const ROUTE = process.env.ROUTE ?? '/privacy-policy';
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: Number(process.env.VW ?? 390), height: 844 }, isMobile: true, hasTouch: true })).newPage();
  await p.goto(base + ROUTE, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let y = 0; y < 6000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(600);
  const out = await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const rows = [];
    for (const el of document.querySelectorAll('h1,h2,h3,p,time,span,div')) {
      const y = docTop(el), h = el.offsetHeight;
      if (y > 420 || h < 12 || el.offsetWidth < 20) continue;
      const leaf = !el.children.length || ![...el.children].some(c => c.offsetHeight > 4);
      if (!leaf) continue;
      const s = getComputedStyle(el);
      const txt = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
      if (!txt) continue;
      rows.push(`  ${String(Math.round(y)).padStart(4)} h=${String(h).padStart(3)} ${el.tagName.padEnd(5)} ${parseFloat(s.fontSize)}px "${txt}"`);
    }
    return rows.slice(0, 8);
  });
  console.log(`=== ${tag} ===`);
  out.forEach(r => console.log(r));
  await p.context().close();
}
await b.close();
