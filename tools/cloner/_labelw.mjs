import { chromium } from 'playwright';
/** Measure the rendered text width of the home panel's callout labels with a
 *  Range, so tracking can be compared rather than assumed. */
const b = await chromium.launch();
for (const [base, label] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 1100 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  await p.waitForTimeout(400);
  const rows = await p.evaluate(() => [...document.querySelectorAll('*')].filter(el =>
    [...el.childNodes].some(n => n.nodeType === 3 && /^(B VITAMINS|MAGNESIUM|VITAMIN D)$/i.test(n.textContent.trim()))
  ).map(el => {
    const s = getComputedStyle(el);
    const r = document.createRange(); r.selectNodeContents(el);
    const w = r.getBoundingClientRect().width;
    return `"${el.textContent.trim()}" text=${w.toFixed(1)}px ls=${s.letterSpacing} fs=${s.fontSize} fw=${s.fontWeight} lh=${s.lineHeight} align=${s.textAlign}`;
  }));
  console.log('=== ' + label + ' ==='); [...new Set(rows)].forEach(r => console.log('  ' + r));
  await p.context().close();
}
await b.close();
