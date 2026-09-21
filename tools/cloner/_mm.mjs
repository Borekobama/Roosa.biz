import { chromium } from 'playwright';
const b = await chromium.launch();
const grab = async (base, route) => {
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.evaluate(async () => {
    for (const i of document.querySelectorAll('img')) i.loading = 'eager';
    for (let y = 0; y < 5000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); }
    window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 600));
  });
  const out = await p.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')].map(i => {
      const r = i.getBoundingClientRect();
      return { x: Math.round(r.left), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height),
               ratio: r.height ? +(r.width/r.height).toFixed(3) : null };
    }).filter(i => i.w > 200 && i.y > 200 && i.y < 3000);
    const h1 = document.querySelector('h1');
    const hb = h1?.getBoundingClientRect();
    return { imgs: imgs.slice(0, 4),
             h1: hb ? { w: Math.round(hb.width), h: Math.round(hb.height), size: getComputedStyle(h1).fontSize } : null };
  });
  await p.close();
  return out;
};
const s = await grab('https://solene.framer.ai', '/merch');
const c = await grab('http://localhost:3111', '/merch');
console.log('SOURCE h1', JSON.stringify(s.h1)); for (const i of s.imgs) console.log('  S', JSON.stringify(i));
console.log('CLONE  h1', JSON.stringify(c.h1)); for (const i of c.imgs) console.log('  C', JSON.stringify(i));
await b.close();
