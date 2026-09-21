import { chromium } from 'playwright';
/** Nutrient-style labels on the science page, to settle whether 16/26 or 16/22
 *  is the site-wide value for that label. */
const b = await chromium.launch();
for (const [base, label] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 1100 } })).newPage();
  await p.goto(base + '/science', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2200);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  await p.waitForTimeout(400);
  const rows = await p.evaluate(() => [...document.querySelectorAll('*')].filter(el => {
    const t = (el.textContent || '').trim();
    return [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && /vitamin|magnesium|zinc|iron|B\d/i.test(t) && t.length < 40;
  }).slice(0, 14).map(el => {
    const s = getComputedStyle(el); const r = el.getBoundingClientRect();
    return `"${(el.textContent || '').trim().slice(0, 24)}" ${s.fontSize}/${s.lineHeight} w=${s.fontWeight} ls=${s.letterSpacing} box=${Math.round(r.width)}x${Math.round(r.height)}`;
  }));
  console.log('=== ' + label + ' ==='); rows.forEach(r => console.log('  ' + r));
  await p.context().close();
}
await b.close();
