import { chromium } from 'playwright';
/** What next/image actually requests for the testimonial backdrop. */
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto((process.env.CLONE_BASE ?? 'http://localhost:3111') + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
await p.waitForTimeout(2000);
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 450) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
await p.waitForTimeout(600);
console.log(await p.evaluate(() => {
  const i = [...document.querySelectorAll('img')].find(x => (x.src || '').includes('IxYJ'));
  if (!i) return 'not found';
  const r = i.getBoundingClientRect();
  return `rendered ${Math.round(r.width)}x${Math.round(r.height)}  natural ${i.naturalWidth}x${i.naturalHeight}\nsizes=${i.sizes}\ncurrentSrc=${decodeURIComponent(i.currentSrc).slice(-90)}\nsrcset=${decodeURIComponent(i.srcset || '').split(',').map(s => s.trim().split(' ').pop()).join(' ')}`;
}));
await b.close();
