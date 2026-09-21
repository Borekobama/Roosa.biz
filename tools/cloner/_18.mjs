import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('https://solene.framer.ai/', { waitUntil: 'domcontentloaded', timeout: 90000 });
await p.evaluate(async () => {
  for (let y = 0; y < 15000; y += 450) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 600));
});
const out = await p.evaluate(() =>
  [...document.querySelectorAll('*')].filter(e => {
    const own = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    return own && Math.round(parseFloat(getComputedStyle(e).fontSize)) === 18;
  }).map(e => {
    const r = e.getBoundingClientRect();
    return { y: Math.round(r.top + scrollY), tag: e.tagName, w: Math.round(r.width),
             text: (e.textContent||'').trim().slice(0, 44) };
  }).sort((a,b)=>a.y-b.y));
for (const i of out) console.log(`${String(i.y).padStart(6)} ${i.tag.padEnd(5)} w=${String(i.w).padStart(4)} ${i.text}`);
await b.close();
