import { chromium } from 'playwright';
/** Full review-card anatomy on the source: every card over the foliage
 *  backdrop, with its inner panel, type and avatar, in backdrop coordinates. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  await p.waitForTimeout(700);
  const out = await p.evaluate(() => {
    const bg = [...document.querySelectorAll('img')].map(i => i.getBoundingClientRect())
      .filter(r => r.width > 1300 && r.height > 1200)[0];
    if (!bg) return ['no backdrop'];
    const ox = bg.left, oy = bg.top + scrollY;
    const rel = (r) => [Math.round(r.left - ox), Math.round(r.top + scrollY - oy), Math.round(r.width), Math.round(r.height)];
    const cards = [...document.querySelectorAll('div,figure,article,li')].filter(el => {
      const s = getComputedStyle(el); const r = el.getBoundingClientRect();
      if (!(parseFloat(s.borderRadius) >= 16 && r.width > 250 && r.width < 420 && r.height > 150 && r.height < 320)) return false;
      if (s.backgroundColor === 'rgba(0, 0, 0, 0)' && s.backdropFilter === 'none') return false;
      const cx = r.left + r.width / 2, cy = r.top + scrollY + r.height / 2;
      if (!(cx > bg.left && cx < bg.right && cy > oy && cy < oy + bg.height)) return false;
      // keep only outermost: drop any card that has a card ancestor
      return !el.parentElement?.closest('[data-card]');
    });
    const lines = [`backdrop ${Math.round(bg.width)}x${Math.round(bg.height)}`];
    for (const el of cards) {
      const s = getComputedStyle(el);
      lines.push(`CARD ${rel(el.getBoundingClientRect())} bg=${s.backgroundColor} rad=${s.borderRadius} pad=${s.padding} bfilt=${s.backdropFilter}`);
      for (const c of el.querySelectorAll('*')) {
        const cs = getComputedStyle(c); const cr = c.getBoundingClientRect();
        const owns = [...c.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
        const painted = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || c.tagName === 'IMG' || c.tagName === 'svg';
        if (!owns && !painted) continue;
        lines.push(`   ${c.tagName} ${rel(cr)}${painted ? ` bg=${cs.backgroundColor} rad=${cs.borderRadius} pad=${cs.padding}` : ''}${owns ? ` ${cs.fontSize}/${cs.lineHeight} w=${cs.fontWeight} ${cs.color} "${c.textContent.trim().replace(/\s+/g, ' ').slice(0, 34)}"` : ''}`);
      }
    }
    return lines;
  });
  console.log('=== ' + tag + ' ==='); out.forEach(o => console.log('  ' + o));
  await p.context().close();
}
await b.close();
