import { chromium } from 'playwright';
/** Header anatomy: nav pill, its links, the Buy Offer pill, the cart button
 *  and the mark inside it. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2600);
  const out = await p.evaluate(() => {
    const rows = [];
    const hdr = document.querySelector('header') ?? document.body;
    for (const el of hdr.querySelectorAll('*')) {
      const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
      if (r.width < 8 || r.height < 8 || r.top > 120) continue;
      const owns = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      const painted = s.backgroundColor !== 'rgba(0, 0, 0, 0)';
      const mark = el.tagName === 'svg' || el.tagName === 'IMG';
      if (!owns && !painted && !mark) continue;
      rows.push(`${el.tagName.padEnd(6)} [${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.width)},${Math.round(r.height)}]${painted ? ` bg=${s.backgroundColor} rad=${s.borderRadius}` : ''}${owns ? ` ${s.fontSize}/${s.lineHeight} "${el.textContent.trim().slice(0, 16)}"` : ''}${mark ? ` MARK` : ''}`);
    }
    return rows;
  });
  console.log('=== ' + tag + ' ==='); [...new Set(out)].slice(0, 18).forEach(o => console.log('  ' + o));
  await p.context().close();
}
await b.close();
