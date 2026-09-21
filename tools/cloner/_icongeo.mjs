import { chromium } from 'playwright';
/** Icon and label geometry in the pinned panel's feature columns, both sides,
 *  expressed relative to the first column's label so the two tracks need not
 *  be at the same scroll phase. */
const labels = (process.argv[2] ?? 'Suitable for everyone,Mind steadiness,Disease prevention').split(',');
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2200);
  let hit = null;
  for (let y = 600; y < 8000 && !hit; y += 60) {
    await p.evaluate(v => window.scrollTo(0, v), y);
    await p.waitForTimeout(35);
    hit = await p.evaluate((labels) => {
      const find = (m) => [...document.querySelectorAll('*')]
        .filter(x => x.children.length === 0 && (x.textContent || '').trim() === m)
        .find(x => x.getBoundingClientRect().width > 0);
      const els = labels.map(find);
      if (els.some(e => !e)) return null;
      const r0 = els[0].getBoundingClientRect();
      if (!(r0.left > 40 && r0.left < 700 && r0.top > 0 && r0.top < 860)) return null;
      const out = [];
      for (const e of els) {
        const r = e.getBoundingClientRect();
        // the mark is the nearest preceding svg/img inside the same column
        const col = e.parentElement;
        const mark = col.querySelector('svg, img');
        const mr = mark ? mark.getBoundingClientRect() : null;
        out.push({
          label: e.textContent.trim(),
          lab: [Math.round(r.left - r0.left), Math.round(r.top - r0.top), Math.round(r.width), Math.round(r.height)],
          mark: mr ? [Math.round(mr.left - r0.left), Math.round(mr.top - r0.top), Math.round(mr.width), Math.round(mr.height)] : null,
          gap: mr ? Math.round(r.top - mr.bottom) : null,
        });
      }
      return out;
    }, labels);
  }
  console.log('=== ' + tag + ' ===');
  if (!hit) { console.log('  columns never flush'); await p.context().close(); continue; }
  hit.forEach(h => console.log(`  ${h.label.padEnd(22)} label[${h.lab.join(',')}] mark[${h.mark ? h.mark.join(',') : '-'}] gap=${h.gap}`));
  await p.context().close();
}
await b.close();
