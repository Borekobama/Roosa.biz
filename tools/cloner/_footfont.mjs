import { chromium } from 'playwright';
/** Type of the footer's left-hand paragraph, both sides. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  await p.waitForTimeout(700);
  console.log('=== ' + tag + ' ===', await p.evaluate(() => {
    const f = document.querySelector('footer');
    if (!f) return 'no footer';
    const fr = f.getBoundingClientRect();
    const ps = [...f.querySelectorAll('p,div,span')]
      .filter(x => [...x.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 40))
      .map(x => {
        const s = getComputedStyle(x); const r = x.getBoundingClientRect();
        return `\n  [${Math.round(r.left)},${Math.round(r.top - fr.top)},${Math.round(r.width)}] ${s.fontSize}/${s.lineHeight} w=${s.fontWeight} style=${s.fontStyle} fam=${s.fontFamily.split(',')[0]} "${x.textContent.trim().slice(0, 44)}"`;
      });
    return ps.slice(0, 3).join('');
  }));
  await p.context().close();
}
await b.close();
