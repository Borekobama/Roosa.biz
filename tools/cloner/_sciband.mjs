import { chromium } from 'playwright';
/** The /science frosted band at phone, both sides: the plate, the panel and
 *  every block inside it, positioned against the panel's own top. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: Number(process.env.VW ?? 390), height: 844 }, isMobile: true, hasTouch: true })).newPage();
  await p.goto(base + '/science', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < 12000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(700);
  const out = await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const panel = [...document.querySelectorAll('img')].find(i => Math.abs(i.offsetWidth - 358) < 3 && Math.abs(i.offsetHeight - 793) < 6);
    if (!panel) return { miss: true };
    const p0 = docTop(panel);
    const rows = [];
    for (const el of document.querySelectorAll('h1,h2,h3,h4,h5,p,li,a,button')) {
      const y = docTop(el), h = el.offsetHeight;
      if (y < p0 - 10 || y > p0 + 820 || h < 12) continue;
      const leaf = !el.children.length || ![...el.children].some(c => c.offsetHeight > 4);
      if (!leaf) continue;
      const s = getComputedStyle(el);
      rows.push(`  +${String(Math.round(y - p0)).padStart(4)} ${String(el.offsetWidth).padStart(3)}x${String(h).padStart(3)} ${el.tagName.padEnd(4)} ${parseFloat(s.fontSize)}px "${(el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 34)}"`);
    }
    return { p0, rows: rows.slice(0, 10) };
  });
  console.log(`=== ${tag} panel top ${out.p0} ===`);
  (out.rows || []).forEach(r => console.log(r));
  await p.context().close();
}
await b.close();
