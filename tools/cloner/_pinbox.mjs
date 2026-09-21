import { chromium } from 'playwright';
/** The pinned track's sticky element and its scroll container, both sides. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 450) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(800);
  const out = await p.evaluate(() => {
    const sticky = [...document.querySelectorAll('*')].filter(el => {
      const s = getComputedStyle(el);
      return (s.position === 'sticky' || s.position === '-webkit-sticky') && el.getBoundingClientRect().height > 400;
    });
    return sticky.map(el => {
      const s = getComputedStyle(el); const r = el.getBoundingClientRect();
      const par = el.parentElement; const ps = getComputedStyle(par); const pr = par.getBoundingClientRect();
      return `sticky [${Math.round(r.left)},${Math.round(r.top + scrollY)},${Math.round(r.width)},${Math.round(r.height)}] top=${s.top} ovf=${s.overflow}\n  parent <${par.tagName}> [${Math.round(pr.left)},${Math.round(pr.top + scrollY)},${Math.round(pr.width)},${Math.round(pr.height)}] mt=${ps.marginTop} mb=${ps.marginBottom} pos=${ps.position}`;
    });
  });
  console.log('=== ' + tag + ' ==='); out.forEach(o => console.log('  ' + o));
  await p.context().close();
}
await b.close();
