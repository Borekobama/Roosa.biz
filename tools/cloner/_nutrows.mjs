import { chromium } from 'playwright';
/** The nutrition facts rows at phone, both sides: each row's value and label
 *  box and the pitch between rows, without a leaf filter. */
const b = await chromium.launch();
const NAMES = ['Calories', 'Carbohydrates', 'Fiber', 'Natural Sugar', 'Protein', 'Prebiotics', 'Daily Phytonutrients'];
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: Number(process.env.VW ?? 390), height: 844 }, isMobile: true, hasTouch: true })).newPage();
  await p.goto(base + '/science', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let y = 0; y < 12000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(600);
  const out = await p.evaluate((names) => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const rows = [];
    for (const n of names) {
      const el = [...document.querySelectorAll('p,span,h1,h2,h3,h4,h5,dt,dd,div')]
        .filter(x => (x.textContent || '').trim() === n && x.offsetHeight > 8)
        .sort((a, c) => a.offsetHeight - c.offsetHeight)[0];
      if (!el) continue;
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      // The row is the nearest ancestor spanning most of the column.
      let row = el, guard = 0;
      while (row && guard++ < 4 && row.offsetWidth < 300) row = row.parentElement;
      rows.push({ n, y: Math.round(docTop(el)), h: el.offsetHeight, fs: parseFloat(s.fontSize), lh: Math.round(parseFloat(s.lineHeight) * 10) / 10, w: Math.round(r.width), x: Math.round(r.left), rw: row ? row.offsetWidth : null, rh: row ? row.offsetHeight : null });
    }
    const head = [...document.querySelectorAll('h2')].find(x => /Inside each solene gummy/i.test(x.textContent || ''));
    return { head: head ? Math.round(docTop(head)) : null, headH: head ? head.offsetHeight : null, rows };
  }, NAMES);
  console.log(`=== ${tag} heading ${out.head} h=${out.headH} ===`);
  let prev = null;
  for (const r of out.rows) {
    console.log(`  ${r.n.padEnd(20)} y=${String(r.y).padStart(5)} x=${String(r.x).padStart(3)} ${String(r.w).padStart(3)}x${String(r.h).padStart(3)}  row ${String(r.rw).padStart(3)}x${String(r.rh).padStart(3)}${prev !== null ? `  pitch ${r.y - prev}` : `  from heading ${r.y - out.head - out.headH}`}`);
    prev = r.y;
  }
  await p.context().close();
}
await b.close();
