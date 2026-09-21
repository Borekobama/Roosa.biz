import { chromium } from 'playwright';
/** Large blocks on the mobile home page, both sides, by layout position. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2600);
  for (let pass = 0; pass < 2; pass++) {
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
    await p.waitForTimeout(700);
  }
  const out = await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    return [...document.querySelectorAll('img')]
      .filter(i => i.offsetHeight > 250 && i.offsetWidth > 200)
      .map(i => ({ y: docTop(i), s: `${i.offsetWidth}x${i.offsetHeight}` }))
      .sort((a, c) => a.y - c.y)
      .map(o => `${String(Math.round(o.y)).padStart(6)}  ${o.s}`);
  });
  console.log(`=== ${tag} (${out.length} large images) ===`);
  out.slice(0, 14).forEach(o => console.log('  ' + o));
  await p.context().close();
}
await b.close();
