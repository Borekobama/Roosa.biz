import { chromium } from 'playwright';
/** Testimonial card geometry and paint on both sides, in section-relative
 *  coordinates. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  await p.waitForTimeout(700);
  const out = await p.evaluate(() => {
    // anchor on the tall foliage backdrop the review cards are scattered over
    const bg = [...document.querySelectorAll('img')].map(i => i.getBoundingClientRect())
      .filter(r => r.width > 1300 && r.height > 1200)[0];
    if (!bg) return ['no backdrop found'];
    const ox = bg.left, oy = bg.top + scrollY;
    // a review card is any painted rounded box whose centre lies on that image
    const cards = [...document.querySelectorAll('div,figure,article,li')].filter(el => {
      const s = getComputedStyle(el); const r = el.getBoundingClientRect();
      if (!(parseFloat(s.borderRadius) >= 8 && r.width > 150 && r.width < 620 && r.height > 80 && r.height < 460)) return false;
      if (s.backgroundColor === 'rgba(0, 0, 0, 0)' && s.backdropFilter === 'none') return false;
      const cx = r.left + r.width / 2, cy = r.top + scrollY + r.height / 2;
      return cx > bg.left && cx < bg.right && cy > oy && cy < oy + bg.height;
    });
    return cards.slice(0, 10).map(el => {
      const s = getComputedStyle(el); const r = el.getBoundingClientRect();
      const q = [...el.querySelectorAll('p,span,div')].filter(x => x.children.length === 0 && (x.textContent || '').trim().length > 40)[0];
      const qs = q ? getComputedStyle(q) : null;
      return `[${Math.round(r.left - ox)},${Math.round(r.top + scrollY - oy)},${Math.round(r.width)},${Math.round(r.height)}] bg=${s.backgroundColor} rad=${s.borderRadius} pad=${s.padding} bfilt=${s.backdropFilter}${qs ? ` quote=${qs.fontSize}/${qs.lineHeight} col=${qs.color}` : ''}`;
    });
  });
  console.log('=== ' + tag + ' ==='); out.forEach(o => console.log('  ' + o));
  await p.context().close();
}
await b.close();
