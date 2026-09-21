import { chromium } from 'playwright';
/** The benefits eyebrow and the stats row: structure, rules and marks. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 70)); } });
  await p.waitForTimeout(900);
  const out = await p.evaluate(() => {
    const head = [...document.querySelectorAll('h1,h2,h3')].find(x => (x.textContent || '').includes('Real clarity begins'));
    if (!head) return ['heading not found'];
    const hy = head.getBoundingClientRect().top + scrollY;
    const rows = [];
    // anything painted or texted in the 200px above the heading
    for (const el of document.querySelectorAll('*')) {
      const r = el.getBoundingClientRect(); const y = r.top + scrollY;
      if (y < hy - 200 || y >= hy || r.width < 4) continue;
      const owns = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      const s = getComputedStyle(el);
      const painted = s.backgroundColor !== 'rgba(0, 0, 0, 0)';
      if (!owns && !painted) continue;
      rows.push(`  EYEBROW ${el.tagName} [${Math.round(r.left)},${Math.round(y)},${Math.round(r.width)},${Math.round(r.height)}] ${owns ? `"${el.textContent.trim().slice(0, 18)}" ${s.fontSize}/${s.lineHeight} ${s.color}` : `bg=${s.backgroundColor} rad=${s.borderRadius}`}`);
    }
    // the stats row: find the block containing a percentage
    const pct = [...document.querySelectorAll('*')]
      .filter(x => x.children.length === 0 && /^\d+%$/.test((x.textContent || '').trim()))
      .sort((a, c) => a.getBoundingClientRect().top - c.getBoundingClientRect().top)[0];
    if (pct) {
      const py = pct.getBoundingClientRect().top + scrollY;
      rows.push(`  --- stats row at y=${Math.round(py)} ---`);
      for (const el of document.querySelectorAll('*')) {
        const r = el.getBoundingClientRect(); const y = r.top + scrollY;
        // a 1px rule is still a rule: the earlier width floor of 3 hid every
        // divider thinner than the source's own 3px svg box
        if (y < py - 80 || y > py + 220 || (r.width < 3 && r.height < 20)) continue;
        const s = getComputedStyle(el);
        const owns = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
        const isRule = (r.width <= 3 && r.height > 20) || (r.height <= 3 && r.width > 20);
        const mark = el.tagName === 'svg' || el.tagName === 'IMG';
        if (!owns && !isRule && !mark) continue;
        rows.push(`  ${isRule ? 'RULE ' : mark ? 'MARK ' : 'TEXT '} ${el.tagName} [${Math.round(r.left)},${Math.round(y)},${Math.round(r.width)},${Math.round(r.height)}]${owns ? ` ${s.fontSize} "${el.textContent.trim().replace(/\s+/g, ' ').slice(0, 24)}"` : ''}${isRule ? ` bg=${s.backgroundColor}` : ''}`);
      }
    }
    return rows;
  });
  console.log('=== ' + tag + ' ==='); [...new Set(out)].slice(0, 26).forEach(o => console.log(o));
  await p.context().close();
}
await b.close();
