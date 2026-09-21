import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('https://solene.framer.ai/', { waitUntil: 'domcontentloaded', timeout: 90000 });
await p.evaluate(async () => {
  for (let y = 0; y < 6000; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 170)); }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 700));
});
const out = await p.evaluate(() => {
  const hits = [];
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    const bi = cs.backgroundImage;
    if (!bi || !bi.includes('data:image/svg')) continue;
    const r = el.getBoundingClientRect();
    const vb = (bi.match(/viewBox=%22([^%]*)%22/) || [])[1] || null;
    hits.push({
      viewBox: vb,
      top: Math.round(r.top + scrollY), left: Math.round(r.left),
      w: Math.round(r.width), h: Math.round(r.height),
      bgSize: cs.backgroundSize, bgPos: cs.backgroundPosition, bgRepeat: cs.backgroundRepeat,
      parentText: (el.parentElement?.textContent || '').trim().slice(0, 50),
    });
  }
  return hits;
});
for (const h of out) console.log(JSON.stringify(h));
await b.close();
