import { chromium } from 'playwright';
/** The phone region either side of the deck: the statement above it and the
 *  closing statement below it, with every box that occupies vertical space,
 *  measured at scroll 0 so nothing sticky reports a shifted position. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < 16000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 45)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(900);
  const out = await p.evaluate(() => {
    const at = (el) => Math.round(el.getBoundingClientRect().top + window.scrollY);
    const st = [...document.querySelectorAll('*')].filter(e => getComputedStyle(e).position === 'sticky' && e.offsetHeight > 700 && e.offsetWidth > 250);
    const col = st.length ? st[0].parentElement : null;
    const colTop = col ? at(col) : 0, colBot = col ? at(col) + col.offsetHeight : 0;
    const stmt = [...document.querySelectorAll('h1,h2,h3')].find(x => (x.textContent || '').includes('One formula'));
    const rows = [];
    for (const el of document.querySelectorAll('h1,h2,h3,h4,p,section,div')) {
      const y = at(el), h = el.offsetHeight;
      if (h < 8) continue;
      if (y < colBot - 40 || y > colBot + 420) continue;
      const txt = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30);
      if (!txt) continue;
      rows.push(`   ${String(y).padStart(5)} h=${String(h).padStart(4)} ${el.tagName.padEnd(7)} "${txt}"`);
    }
    return {
      stmt: stmt ? { y: at(stmt), h: stmt.offsetHeight } : null,
      colTop, colBot, colH: col ? col.offsetHeight : 0,
      rows: rows.slice(0, 12),
    };
  });
  console.log(`=== ${tag} ===`);
  console.log(`  statement H2 y=${out.stmt.y} h=${out.stmt.h} bottom=${out.stmt.y + out.stmt.h}`);
  console.log(`  deck column ${out.colTop}..${out.colBot} (h ${out.colH})   statement bottom -> column top = ${out.colTop - (out.stmt.y + out.stmt.h)}`);
  console.log('  after the column:');
  out.rows.forEach(r => console.log(r));
  await p.context().close();
}
await b.close();
