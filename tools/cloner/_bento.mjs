import { chromium } from 'playwright';
/** Benefits section internals on both sides: heading, lede, stat row and the
 *  bento cards, so the 47px this band runs long can be attributed. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 450) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  // Park on the section and let its reveals finish. Measuring from y=0 caught
  // every card at its pre-reveal scale of 0.9, which is a transform: it moves
  // getBoundingClientRect but not layout, so the boxes read as both the wrong
  // size and the wrong position.
  const hy0 = await p.evaluate(() => {
    const h = [...document.querySelectorAll('h1,h2,h3')].filter(x => (x.textContent || '').includes('Real clarity begins'))[0];
    return h ? Math.round(h.getBoundingClientRect().top + scrollY) : 0;
  });
  await p.evaluate(v => window.scrollTo(0, Math.max(0, v - 200)), hy0);
  await p.waitForTimeout(1400);
  await p.evaluate(v => window.scrollTo(0, Math.max(0, v + 600)), hy0);
  await p.waitForTimeout(1600);
  const out = await p.evaluate(() => {
    const head = [...document.querySelectorAll('h1,h2,h3')]
      .filter(x => (x.textContent || '').includes('Real clarity begins'))[0];
    if (!head) return ['heading not found'];
    const hy = head.getBoundingClientRect().top + scrollY;
    const rows = [];
    const hr = head.getBoundingClientRect();
    rows.push(`heading    [${Math.round(hr.left)},${Math.round(hy)},${Math.round(hr.width)},${Math.round(hr.height)}]`);
    // everything painted below the heading and above the foliage plate
    const plate = [...document.querySelectorAll('img')].map(i => i.getBoundingClientRect())
      .filter(r => Math.round(r.width) === 1440 && Math.abs(r.height - 931) < 4)[0];
    const limit = plate ? plate.top + scrollY : hy + 2000;
    const seen = new Set();
    for (const el of document.querySelectorAll('div,p,section,figure,li')) {
      const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
      const y = r.top + scrollY;
      if (y <= hy || y >= limit || r.width < 200 || r.height < 40) continue;
      const painted = s.backgroundColor !== 'rgba(0, 0, 0, 0)' && parseFloat(s.borderRadius) >= 8;
      const owns = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 20);
      if (!painted && !owns) continue;
      const key = `${Math.round(r.left)},${Math.round(y)},${Math.round(r.width)},${Math.round(r.height)}`;
      if (seen.has(key)) continue; seen.add(key);
      rows.push(`${painted ? 'card  ' : 'text  '} [${key}] +${Math.round(y - hy)} ${painted ? 'bg=' + s.backgroundColor : `"${el.textContent.trim().replace(/\s+/g, ' ').slice(0, 26)}"`}`);
    }
    rows.sort((a, c) => parseInt(a.split(',')[1]) - parseInt(c.split(',')[1]));
    rows.push(`plate top  ${Math.round(limit)}  (+${Math.round(limit - hy)} from heading)`);
    return rows;
  });
  console.log('=== ' + tag + ' ==='); out.forEach(o => console.log('  ' + o));
  await p.context().close();
}
await b.close();
