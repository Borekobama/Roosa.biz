import { chromium } from 'playwright';
/** Can the offer panel's detail rows stand open together? */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 450) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  await p.waitForTimeout(500);
  const openCount = () => p.evaluate(() =>
    [...document.querySelectorAll('[aria-expanded="true"]')].map(e => e.textContent.trim().slice(0, 18)));
  const click = (label) => p.evaluate((l) => {
    const el = [...document.querySelectorAll('button,[role="button"],summary')]
      .find(e => e.textContent.trim().startsWith(l));
    if (!el) return false; el.click(); return true;
  }, label);
  console.log('=== ' + tag + ' ===');
  await click('Benefits'); await p.waitForTimeout(500);
  console.log('  after Benefits:   ', await openCount());
  await click('Ingredients'); await p.waitForTimeout(500);
  console.log('  after Ingredients:', await openCount());
  await p.context().close();
}
await b.close();
