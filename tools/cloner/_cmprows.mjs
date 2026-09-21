import { chromium } from 'playwright';
/** The comparison table at phone, both sides: the table box, each column's
 *  width, and every row's label box, to see why the source's labels wrap to
 *  three lines where these take two. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: Number(process.env.VW ?? 390), height: 844 }, isMobile: true, hasTouch: true })).newPage();
  await p.goto(base + '/science', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < 12000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(700);
  const out = await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const label = [...document.querySelectorAll('*')].find(x => (x.textContent || '').trim() === 'High potency botanical formulation' && x.offsetHeight > 10);
    if (!label) return { miss: true };
    const s = getComputedStyle(label);
    const r = label.getBoundingClientRect();
    // Walk up to the row, then the table.
    let row = label, guard = 0;
    while (row && guard++ < 5 && row.offsetWidth < 250) row = row.parentElement;
    const rr = row ? row.getBoundingClientRect() : null;
    // Sibling cells of the row.
    const cells = row ? [...row.children].map(c => `${c.tagName} ${Math.round(c.getBoundingClientRect().width)}x${Math.round(c.getBoundingClientRect().height)}`) : [];
    return {
      label: { x: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height), fs: parseFloat(s.fontSize), lh: Math.round(parseFloat(s.lineHeight) * 10) / 10, pad: s.padding, tag: label.tagName },
      row: rr ? { x: Math.round(rr.left), w: Math.round(rr.width), h: Math.round(rr.height), tag: row.tagName } : null,
      cells,
      y: Math.round(docTop(label)),
    };
  });
  console.log(`=== ${tag} ===`);
  if (out.miss) { console.log('  label not found'); continue; }
  console.log(`  label ${out.label.tag} x=${out.label.x} ${out.label.w}x${out.label.h} ${out.label.fs}/${out.label.lh} pad=${out.label.pad}`);
  console.log(`  row   ${out.row ? `${out.row.tag} x=${out.row.x} ${out.row.w}x${out.row.h}` : '-'}   cells: ${out.cells.join(' | ')}`);
  await p.context().close();
}
await b.close();
