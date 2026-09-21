import { chromium } from 'playwright';
/** Footer internals on both sides, relative to the footer's own top. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const VW = Number(process.env.VW ?? 1440);
  const VH = Number(process.env.VH ?? 900);
  const p = await (await b.newContext({ viewport: { width: VW, height: VH }, isMobile: VW < 700, hasTouch: VW < 700 })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 450) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  await p.waitForTimeout(700);
  const out = await p.evaluate(() => {
    const f = document.querySelector('footer');
    if (!f) return ['no footer'];
    const fr = f.getBoundingClientRect(); const fs = getComputedStyle(f);
    const rows = [`footer ${Math.round(fr.width)}x${Math.round(fr.height)} pad=${fs.paddingTop}/${fs.paddingBottom} mt=${fs.marginTop}`];
    const seen = new Set();
    for (const el of f.querySelectorAll('*')) {
      const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
      if (r.height < 12 || r.width < 20) continue;
      const owns = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      const painted = s.backgroundColor !== 'rgba(0, 0, 0, 0)' || el.tagName === 'IMG';
      if (!owns && !painted) continue;
      const key = `${Math.round(r.left)},${Math.round(r.top - fr.top)},${Math.round(r.width)},${Math.round(r.height)}`;
      if (seen.has(key)) continue; seen.add(key);
      rows.push(`  ${el.tagName.padEnd(4)} [${key}]${painted ? ' bg=' + s.backgroundColor : ''}${owns ? ` ${s.fontSize}/${s.lineHeight} "${el.textContent.trim().replace(/\s+/g, ' ').slice(0, 22)}"` : ''}`);
    }
    return rows;
  });
  console.log('=== ' + tag + ' ==='); out.slice(0, 22).forEach(o => console.log(o));
  await p.context().close();
}
await b.close();
