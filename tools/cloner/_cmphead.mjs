import { chromium } from 'playwright';
/** The comparison table's header band at phone, both sides: everything between
 *  the section heading and the first data row. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: Number(process.env.VW ?? 390), height: 844 }, isMobile: true, hasTouch: true })).newPage();
  await p.goto(base + '/science', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < 12000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(700);
  const out = await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const h2 = [...document.querySelectorAll('h2')].find(x => /outperforms other gummies/i.test(x.textContent || ''));
    const y0 = docTop(h2);
    const first = [...document.querySelectorAll('*')].find(x => (x.textContent || '').trim() === 'High potency botanical formulation' && x.offsetHeight > 10);
    const y1 = first ? docTop(first) : null;
    const rows = [];
    for (const el of document.querySelectorAll('*')) {
      const y = docTop(el);
      const r = el.getBoundingClientRect();
      const h = el.tagName === 'svg' ? Math.round(r.height) : el.offsetHeight;
      const w = el.tagName === 'svg' ? Math.round(r.width) : el.offsetWidth;
      if (y <= y0 + 60 || (y1 && y >= y1) || h < 12 || w < 12) continue;
      const txt = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 26);
      const leaf = !el.children.length || ![...el.children].some(c => c.getBoundingClientRect().height > 4);
      if (!leaf && el.tagName !== 'IMG' && el.tagName !== 'svg') continue;
      rows.push(`  +${String(Math.round(y - y0)).padStart(4)} ${String(w).padStart(4)}x${String(h).padStart(3)} ${el.tagName.padEnd(5)} "${txt}"`);
    }
    return { y0, y1, gap: y1 - y0, rows: rows.slice(0, 8) };
  });
  console.log(`=== ${tag}  heading ${out.y0} -> first row ${out.y1}  (gap ${out.gap}) ===`);
  out.rows.forEach(r => console.log(r));
  await p.context().close();
}
await b.close();
