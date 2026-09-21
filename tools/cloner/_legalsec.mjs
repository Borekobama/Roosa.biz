import { chromium } from 'playwright';
/** Every text block in a legal page section, both sides, without the leaf
 *  filter that hides a paragraph containing a link. */
const ROUTE = process.env.ROUTE ?? '/cookies-policy';
const FROM = process.env.FROM ?? 'What are your privacy rights';
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: Number(process.env.VW ?? 390), height: 844 }, isMobile: true, hasTouch: true })).newPage();
  await p.goto(base + ROUTE, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let y = 0; y < 9000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(600);
  const out = await p.evaluate((frag) => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const head = [...document.querySelectorAll('h1,h2,h3,h4')].find(x => (x.textContent || '').trim().startsWith(frag));
    if (!head) return { miss: true };
    const y0 = docTop(head);
    const rows = [];
    for (const el of document.querySelectorAll('p,li,h1,h2,h3,h4,ul,ol,a')) {
      const y = docTop(el), h = el.offsetHeight;
      if (y < y0 || y > y0 + 520 || h < 10) continue;
      const s = getComputedStyle(el);
      const txt = (el.textContent || '').trim().replace(/\s+/g, ' ');
      rows.push(`  ${String(Math.round(y - y0)).padStart(4)} h=${String(h).padStart(3)} ${el.tagName.padEnd(3)} ${parseFloat(s.fontSize)}/${Math.round(parseFloat(s.lineHeight) * 10) / 10} "${txt.slice(0, 62)}"`);
    }
    return { y0, rows: rows.slice(0, 14) };
  }, FROM);
  console.log(`=== ${tag} (heading at ${out.y0}) ===`);
  (out.rows || []).forEach(r => console.log(r));
  await p.context().close();
}
await b.close();
