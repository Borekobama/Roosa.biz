import { chromium } from 'playwright';
/** Dump every text leaf and image inside the SOL-G7 panel on both sides, in
 *  panel-relative coordinates, so content geometry can be compared directly. */
const b = await chromium.launch();
for (const [base, label] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 1100 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  await p.waitForTimeout(500);
  const rows = await p.evaluate(() => {
    const e = [...document.querySelectorAll('*')].filter(x => x.children.length === 0 && /SOL-G7/.test(x.textContent || ''))[0];
    let panel = e; for (let i = 0; i < 9 && panel; i++) { const r = panel.getBoundingClientRect(); if (r.width > 1300 && r.height > 600) break; panel = panel.parentElement; }
    // climb past wrappers that share the panel's box, so siblings of the panel
    // (the clone keeps its callout list there) are inside the walked subtree
    while (panel.parentElement && panel.parentElement.getBoundingClientRect().width >= 1300 && panel.parentElement.getBoundingClientRect().width <= panel.getBoundingClientRect().width + 1) panel = panel.parentElement;
    const pr = panel.getBoundingClientRect();
    const out = [];
    const walk = (el) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const txt = (el.textContent || '').trim().replace(/\s+/g, ' ');
      const ownsText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      const isLeafText = ownsText && txt;
      if (isLeafText || el.tagName === 'IMG' || ['H2', 'A', 'LI'].includes(el.tagName)) {
        out.push(`${(el.tagName + '    ').slice(0, 4)} [${Math.round(r.left - pr.left)},${Math.round(r.top - pr.top)},${Math.round(r.width)},${Math.round(r.height)}] ${el.tagName === 'IMG' ? 'ofit=' + s.objectFit + ' ' + el.currentSrc.split('/').pop().slice(0, 28) : `${s.fontSize}/${s.lineHeight} ${s.color} "${txt.slice(0, 44)}"`}`);
      }
      for (const c of el.children) walk(c);
    };
    walk(panel);
    // the panel's own outer wrapper too
    return out;
  });
  console.log('=== ' + label + ' ===');
  rows.forEach(r => console.log('  ' + r));
  await p.context().close();
}
await b.close();
