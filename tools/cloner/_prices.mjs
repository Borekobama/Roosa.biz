import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('https://solene.framer.ai/merch', { waitUntil: 'domcontentloaded', timeout: 90000 });
await p.evaluate(async () => {
  for (const i of document.querySelectorAll('img')) i.loading = 'eager';
  for (let y = 0; y < 4200; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 160)); }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 600));
});
const out = await p.evaluate(() => {
  const nodes = [...document.querySelectorAll('*')].filter(e => e.children.length === 0);
  const items = nodes.map(e => {
    const r = e.getBoundingClientRect();
    return { y: Math.round(r.top + scrollY), x: Math.round(r.left),
             size: getComputedStyle(e).fontSize, text: (e.textContent||'').trim() };
  }).filter(i => i.text && i.y > 400 && i.y < 2300 && i.text.length < 40);
  const sub = [...document.querySelectorAll('p')].map(e => {
    const r = e.getBoundingClientRect();
    return { y: Math.round(r.top+scrollY), size: getComputedStyle(e).fontSize, text:(e.textContent||'').trim().slice(0,90) };
  }).filter(t => t.y > 150 && t.y < 400);
  return { items: items.slice(0, 40), sub };
});
console.log('=== SUBTITLE ==='); for (const s of out.sub) console.log(JSON.stringify(s));
console.log('=== CARD TEXT (y,x,size,text) ===');
for (const i of out.items) console.log(`${i.y} ${i.x} ${i.size} ${i.text}`);
await b.close();
