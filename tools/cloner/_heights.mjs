import { chromium } from 'playwright';
const routes = [['/','/'],['/science','/science'],['/merch','/merch'],['/blog','/blog'],
  ['/merch/cap','/merch/cap'],['/blog/gummy-supplements','/blog/reading-a-supplement-label'],
  ['/privacy-policy','/privacy-policy'],['/cookies-policy','/cookies-policy']];
const b = await chromium.launch();
const measure = async (base, route) => {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await p.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await p.evaluate(async () => {
      for (const i of document.querySelectorAll('img')) i.loading = 'eager';
      for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
        window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120));
      }
      window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 500));
    });
    return await p.evaluate(() => document.documentElement.scrollHeight);
  } catch { return null; } finally { await p.close(); }
};
console.log('route'.padEnd(34), 'source'.padStart(8), 'clone'.padStart(8), 'ratio');
let sum = 0, n = 0;
for (const [sr, cr] of routes) {
  const sh = await measure('https://solene.framer.ai', sr);
  const ch = await measure('http://localhost:3111', cr);
  if (sh && ch) {
    const ratio = Math.min(sh, ch) / Math.max(sh, ch);
    sum += ratio; n += 1;
    console.log(cr.padEnd(34), String(sh).padStart(8), String(ch).padStart(8), `${(ratio*100).toFixed(1)}%`);
  }
}
console.log(`\nmean height ratio: ${(sum/n*100).toFixed(1)}% across ${n} routes`);
await b.close();
