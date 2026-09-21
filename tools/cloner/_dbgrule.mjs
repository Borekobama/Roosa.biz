import { chromium } from 'playwright';
/** Is the stat divider span in the DOM, and what box does it have? */
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto((process.env.CLONE_BASE ?? 'http://localhost:3111') + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
await p.waitForTimeout(2200);
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 70)); } });
await p.waitForTimeout(800);
console.log(await p.evaluate(() => {
  const hits = [...document.querySelectorAll('span[aria-hidden="true"]')]
    .filter(e => e.className && String(e.className).includes('ebebeb'));
  if (!hits.length) return 'no span with ebebeb class found';
  return hits.map(e => {
    const r = e.getBoundingClientRect(); const s = getComputedStyle(e);
    return `[${Math.round(r.left)},${Math.round(r.top + scrollY)},${r.width},${r.height}] display=${s.display} bg=${s.backgroundColor} cls="${String(e.className).slice(0, 90)}"`;
  }).join('\n');
}));
await b.close();
