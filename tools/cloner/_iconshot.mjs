import { chromium } from 'playwright';
import fs from 'node:fs';
/** Walk the pinned track until a named panel is flush in the viewport, then
 *  capture its feature columns. Works on either side. */
const dir = 'docs/research/_compare/picons';
fs.mkdirSync(dir, { recursive: true });
const marker = process.argv[2] ?? 'Suitable for everyone';
const b = await chromium.launch();
for (const [base, label] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  let best = null;
  for (let y = 0; y < 14600; y += 60) {
    await p.evaluate(v => window.scrollTo(0, v), y);
    await p.waitForTimeout(40);
    const r = await p.evaluate((m) => {
      // the clone renders the panels twice — a display:none mobile copy comes
      // first in the DOM — so take the one that actually has a box
      const e = [...document.querySelectorAll('h5,h3,p,div,span')]
        .filter(x => x.children.length === 0 && (x.textContent || '').trim() === m)
        .find(x => x.getBoundingClientRect().width > 0);
      if (!e) return null;
      const b = e.getBoundingClientRect();
      return b.top > 0 && b.bottom < 900 ? { left: b.left, top: b.top } : null;
    }, marker);
    // the columns start at x=608 on the source; take the frame closest to that
    if (r && (best === null || Math.abs(r.left - 608) < Math.abs(best.left - 608))) best = { ...r, y };
  }
  if (!best) { console.log(label, 'marker never flush'); await p.context().close(); continue; }
  await p.evaluate(v => window.scrollTo(0, v), best.y);
  await p.waitForTimeout(400);
  console.log(`${label} scrollY=${best.y} markerLeft=${Math.round(best.left)} markerTop=${Math.round(best.top)}`);
  fs.writeFileSync(`${dir}/cols-${label}.png`,
    await p.screenshot({ clip: { x: 590, y: Math.max(0, best.top - 80), width: 830, height: 220 } }));
  await p.context().close();
}
await b.close();
console.log('wrote', dir);
