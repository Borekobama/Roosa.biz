import { chromium } from 'playwright';
/** The FAQ accordion's question rows on a route, both sides: each trigger's
 *  box and the pitch, plus the eyebrow above the heading for alignment. */
const ROUTE = process.env.ROUTE ?? '/science';
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: Number(process.env.VW ?? 1440), height: 900 } })).newPage();
  await p.goto(base + ROUTE, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let y = 0; y < 14000; y += 380) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(600);
  const out = await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const qs = ['How should I take Solene daily', 'When will I start noticing', 'Does Solene replace', 'Is it safe to use', 'Can I combine Solene', 'Are the ingredients natural'];
    const rows = [];
    for (const q of qs) {
      const el = [...document.querySelectorAll('h3,h4,h5,button,span,p,div')]
        .filter(x => (x.textContent || '').trim().startsWith(q) && x.offsetHeight > 10)
        .sort((a, c) => a.offsetHeight - c.offsetHeight)[0];
      if (!el) continue;
      rows.push({ q: q.slice(0, 22), y: Math.round(docTop(el)), h: el.offsetHeight, w: el.offsetWidth });
    }
    const eye = [...document.querySelectorAll('p,div,span')].filter(x => (x.textContent || '').trim() === 'FAQ' && x.offsetHeight > 8).map(x => Math.round(docTop(x)))[0];
    const head = [...document.querySelectorAll('h2')].find(x => /Frequently/i.test(x.textContent || ''));
    return { eye, head: head ? Math.round(docTop(head)) : null, rows };
  });
  console.log(`=== ${tag}  eyebrow ${out.eye}  heading ${out.head} ===`);
  let prev = null;
  for (const r of out.rows) {
    console.log(`  ${r.q.padEnd(24)} y=${String(r.y).padStart(5)} ${String(r.w).padStart(4)}x${String(r.h).padStart(3)}${prev !== null ? `  pitch ${r.y - prev}` : `  vs eyebrow ${r.y - out.eye}`}`);
    prev = r.y;
  }
  await p.context().close();
}
await b.close();
