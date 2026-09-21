import { chromium } from 'playwright';
const b = await chromium.launch();
const grab = async (base, label) => {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(base + '/merch', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.evaluate(async () => {
    for (let y = 0; y < 3000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); }
    window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 500));
  });
  const out = await p.evaluate(() =>
    [...document.querySelectorAll('button')].map(e => {
      const r = e.getBoundingClientRect();
      const cs = getComputedStyle(e);
      return { w: Math.round(r.width), h: Math.round(r.height), bg: cs.backgroundColor,
               color: cs.color, size: cs.fontSize, radius: cs.borderRadius,
               text: (e.textContent||'').trim().slice(0, 14) };
    }).filter(e => e.w > 20).slice(0, 5));
  await p.close();
  console.log(label); for (const o of out) console.log('  ', JSON.stringify(o));
};
await grab('https://solene.framer.ai', 'SOURCE');
await grab('http://localhost:3111', 'CLONE');
await b.close();
