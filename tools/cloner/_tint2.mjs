import { chromium } from 'playwright';

/** Widen the search: walk up 3 more levels from the SOL-G7 panel and dump the
 *  whole subtree, so siblings that carry the foliage plate are visible too. */
const base = process.env.BASE ?? 'https://solene.framer.ai';
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
await p.waitForTimeout(2500);
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
await p.waitForTimeout(600);

const out = await p.evaluate(() => {
  const leaf = [...document.querySelectorAll('*')].filter(x => x.children.length === 0 && /SOL-G7/.test(x.textContent || ''))[0];
  let panel = leaf;
  for (let i = 0; i < 9 && panel; i++) { const r = panel.getBoundingClientRect(); if (r.width > 1300 && r.height > 600) break; panel = panel.parentElement; }
  let root = panel; for (let i = 0; i < 3; i++) root = root.parentElement ?? root;
  const pr = panel.getBoundingClientRect();
  const rows = [];
  const desc = (el, depth) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const show = (s.backgroundColor !== 'rgba(0, 0, 0, 0)') || s.backgroundImage !== 'none' ||
      s.filter !== 'none' || s.backdropFilter !== 'none' || s.mixBlendMode !== 'normal' ||
      (+s.opacity < 0.999) || el.tagName === 'IMG' || s.overflow !== 'visible' || s.borderRadius !== '0px';
    if (show) rows.push(`${'  '.repeat(depth)}${el.tagName}${el === panel ? '  <<PANEL' : ''} [${Math.round(r.left - pr.left)},${Math.round(r.top - pr.top)},${Math.round(r.width)},${Math.round(r.height)}] bg=${s.backgroundColor} op=${s.opacity} blend=${s.mixBlendMode} filt=${s.filter} bfilt=${s.backdropFilter} rad=${s.borderRadius} ovf=${s.overflow} pos=${s.position} z=${s.zIndex}${s.backgroundImage !== 'none' ? '\n' + '  '.repeat(depth) + '   BGI=' + s.backgroundImage.slice(0, 160) : ''}${el.tagName === 'IMG' ? '\n' + '  '.repeat(depth) + '   SRC=' + el.currentSrc.slice(-140) + ' ofit=' + s.objectFit + ' opos=' + s.objectPosition + ' nat=' + el.naturalWidth + 'x' + el.naturalHeight : ''}`);
    for (const c of el.children) desc(c, depth + 1);
  };
  desc(root, 0);
  return rows;
});
out.forEach(x => console.log(x));
await b.close();
