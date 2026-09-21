import { chromium } from 'playwright';
const b = await chromium.launch();
const grab = async (base, route) => {
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.evaluate(async () => {
    for (const i of document.querySelectorAll('img')) i.loading = 'eager';
    for (let y = 0; y < 4000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); }
    window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 600));
  });
  const out = await p.evaluate(() => {
    const imgs = [...document.querySelectorAll('main img, img')].map(i => {
      const r = i.getBoundingClientRect();
      return { x: Math.round(r.left), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height),
               ratio: r.height ? +(r.width/r.height).toFixed(2) : null };
    }).filter(i => i.w > 200 && i.y > 200 && i.y < 3000);
    const logo = (() => {
      const h = document.querySelector('header');
      const a = h?.querySelector('a');
      if (!a) return null;
      const r = a.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) };
    })();
    return { imgs: imgs.slice(0, 5), logo };
  });
  await p.close();
  return out;
};
const s = await grab('https://solene.framer.ai', '/blog');
const c = await grab('http://localhost:3111', '/blog');
console.log('SOURCE logo', JSON.stringify(s.logo), 'cards:'); for (const i of s.imgs) console.log(' ', JSON.stringify(i));
console.log('CLONE  logo', JSON.stringify(c.logo), 'cards:'); for (const i of c.imgs) console.log(' ', JSON.stringify(i));
await b.close();
