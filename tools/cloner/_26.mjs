import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3111/science', { waitUntil: 'domcontentloaded', timeout: 90000 });
await p.evaluate(async () => {
  for (let y = 0; y < 9000; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 140)); }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 600));
});
const out = await p.evaluate(() => {
  return [...document.querySelectorAll('*')].filter(e => {
    const cs = getComputedStyle(e);
    const own = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    return own && Math.round(parseFloat(cs.fontSize)) === 26;
  }).map(e => {
    const r = e.getBoundingClientRect();
    return { y: Math.round(r.top + scrollY), x: Math.round(r.left), tag: e.tagName,
             text: (e.textContent||'').trim().slice(0, 38) };
  }).sort((a,b)=>a.y-b.y);
});
for (const i of out) console.log(`${String(i.y).padStart(5)} x=${String(i.x).padStart(4)} ${i.tag.padEnd(5)} ${i.text}`);
await b.close();
