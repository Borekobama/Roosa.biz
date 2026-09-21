import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('https://solene.framer.ai/science', { waitUntil: 'domcontentloaded', timeout: 90000 });
await p.evaluate(async () => {
  for (const i of document.querySelectorAll('img')) i.loading = 'eager';
  for (let y = 0; y < 4000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 160)); }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 600));
});
const out = await p.evaluate(() => {
  const tiles = [...document.querySelectorAll('img')].map(i => {
    const r = i.getBoundingClientRect();
    return { x: Math.round(r.left), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height),
             radius: getComputedStyle(i).borderRadius,
             alt: (i.alt||'').slice(0,28) };
  }).filter(t => t.y > 1900 && t.y < 2500);
  // Is the strip animated?
  const strip = tiles.length ? document.elementFromPoint(720, 0) : null;
  const anim = [...document.querySelectorAll('*')].filter(e => {
    const cs = getComputedStyle(e);
    return cs.animationName !== 'none' && cs.animationDuration !== '0s';
  }).slice(0, 5).map(e => ({ name: getComputedStyle(e).animationName, dur: getComputedStyle(e).animationDuration,
                             w: Math.round(e.getBoundingClientRect().width) }));
  return { tiles: tiles.sort((a,b)=>a.x-b.x), anim };
});
console.log('=== TILES ==='); for (const t of out.tiles) console.log(JSON.stringify(t));
console.log('=== ANIMATED ==='); for (const a of out.anim) console.log(JSON.stringify(a));
await b.close();
