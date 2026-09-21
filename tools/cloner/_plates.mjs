import { chromium } from 'playwright';
/** The closing plate on every route that has one, both sides. */
const ROUTES = ['/science', '/merch', '/blog', '/privacy-policy', '/cookies-policy'];
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const rows = [];
  for (const r of ROUTES) {
    const p = await ctx.newPage();
    try {
      await p.goto(base + r, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await p.waitForTimeout(2000);
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
      await p.waitForTimeout(700);
      rows.push(`${r.padEnd(18)} ${await p.evaluate(() => {
        const hits = [...document.querySelectorAll('img')]
          .filter(i => i.offsetWidth > 1200 && i.offsetHeight > 600 && i.offsetHeight < 900)
          .map(i => `${i.offsetWidth}x${i.offsetHeight} x=${i.getBoundingClientRect().left + 0} ${decodeURIComponent(i.currentSrc).split('/').pop().replace(/[?&].*$/, '').slice(0, 24)}`);
        return hits.length ? hits.join(' | ') : 'none';
      })}`);
    } catch (e) { rows.push(`${r.padEnd(18)} error`); }
    await p.close();
  }
  console.log('=== ' + tag + ' ==='); rows.forEach(x => console.log('  ' + x));
  await ctx.close();
}
await b.close();
