import { chromium } from 'playwright';
const b = await chromium.launch();
const grab = async (base) => {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2200);
  const out = await p.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')].map(i => {
      const r = i.getBoundingClientRect();
      return { y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) };
    }).filter(i => i.w > 400 && i.y < 1200);
    const h1 = document.querySelector('h1');
    const hb = h1?.getBoundingClientRect();
    return { hero: imgs[0] ?? null, h1: hb ? { y: Math.round(hb.top + scrollY), size: getComputedStyle(h1).fontSize } : null };
  });
  await p.close();
  return out;
};
console.log('SOURCE', JSON.stringify(await grab('https://solene.framer.ai')));
console.log('CLONE ', JSON.stringify(await grab('http://localhost:3111')));
await b.close();
