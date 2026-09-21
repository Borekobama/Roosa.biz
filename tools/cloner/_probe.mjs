import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('https://solene.framer.ai/', { waitUntil: 'networkidle', timeout: 90000 });
await p.evaluate(async () => {
  for (const i of document.querySelectorAll('img')) i.loading = 'eager';
  for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight * 0.5) {
    window.scrollTo(0, y); await new Promise(r => setTimeout(r, 220));
  }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 800));
});
const out = await p.evaluate(() => {
  const imgs = [...document.querySelectorAll('img')].map(i => {
    const r = i.getBoundingClientRect();
    return {
      top: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height),
      file: (() => { try { return new URL(i.currentSrc || i.src).pathname.split('/').pop().slice(0, 30); } catch { return '?' } })(),
      alt: (i.alt || '').slice(0, 44),
    };
  }).filter(i => i.w > 30).sort((a, b) => a.top - b.top);
  const heads = [...document.querySelectorAll('h1,h2,h3')].map(h => {
    const r = h.getBoundingClientRect();
    return { top: Math.round(r.top + scrollY), tag: h.tagName, text: (h.textContent || '').trim().slice(0, 58),
             size: getComputedStyle(h).fontSize, color: getComputedStyle(h).color,
             align: getComputedStyle(h).textAlign };
  }).sort((a, b) => a.top - b.top);
  return { imgs, heads };
});
console.log('=== IMAGES (doc order) ===');
for (const i of out.imgs) console.log(`${String(i.top).padStart(6)}  ${String(i.w).padStart(4)}x${String(i.h).padStart(4)}  ${i.file.padEnd(32)} ${i.alt}`);
console.log('\n=== HEADINGS ===');
for (const h of out.heads) console.log(`${String(h.top).padStart(6)}  ${h.tag} ${h.size.padStart(6)} ${h.align.padEnd(7)} ${h.color.padEnd(18)} ${h.text}`);
await b.close();
