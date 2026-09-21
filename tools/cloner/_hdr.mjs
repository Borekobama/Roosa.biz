import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('https://solene.framer.ai/', { waitUntil: 'domcontentloaded', timeout: 90000 });
await p.waitForTimeout(2200);
const top = await p.evaluate(() => {
  const h = document.querySelector('header') || document.body.firstElementChild;
  return [...h.querySelectorAll('a,button,div')].map(e => {
    const r = e.getBoundingClientRect();
    const cs = getComputedStyle(e);
    return { x: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height),
             bg: cs.backgroundColor, color: cs.color, radius: cs.borderRadius,
             text: (e.textContent||'').trim().slice(0,16) };
  }).filter(e => e.w > 20 && e.h > 20 && e.bg !== 'rgba(0, 0, 0, 0)');
});
console.log('AT TOP:'); for (const t of top) console.log(' ', JSON.stringify(t));
await p.evaluate(() => window.scrollTo(0, 1800));
await p.waitForTimeout(1200);
const scrolled = await p.evaluate(() => {
  const h = document.querySelector('header') || document.body.firstElementChild;
  return [...h.querySelectorAll('a,button,div')].map(e => {
    const r = e.getBoundingClientRect();
    const cs = getComputedStyle(e);
    return { x: Math.round(r.left), w: Math.round(r.width), bg: cs.backgroundColor,
             color: cs.color, text: (e.textContent||'').trim().slice(0,16) };
  }).filter(e => e.w > 20 && e.bg !== 'rgba(0, 0, 0, 0)');
});
console.log('SCROLLED:'); for (const t of scrolled) console.log(' ', JSON.stringify(t));
await b.close();
