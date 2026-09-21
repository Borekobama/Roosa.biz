import { chromium } from 'playwright';
const route = process.argv[2] ?? '/science';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('https://solene.framer.ai' + route, { waitUntil: 'networkidle', timeout: 90000 });
await p.evaluate(async () => {
  for (const i of document.querySelectorAll('img')) i.loading = 'eager';
  for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight * 0.5) {
    window.scrollTo(0, y); await new Promise(r => setTimeout(r, 200));
  }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 800));
});
const out = await p.evaluate(() => {
  const imgs = [...document.querySelectorAll('img')].map(i => {
    const r = i.getBoundingClientRect();
    return { top: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height),
      file: (() => { try { return new URL(i.currentSrc || i.src).pathname.split('/').pop().slice(0, 28); } catch { return '?' } })(),
      alt: (i.alt || '').slice(0, 40) };
  }).filter(i => i.w > 30).sort((a, b) => a.top - b.top);
  const heads = [...document.querySelectorAll('h1,h2,h3,h4')].map(h => {
    const r = h.getBoundingClientRect();
    return { top: Math.round(r.top + scrollY), tag: h.tagName, text: (h.textContent || '').trim().slice(0, 60),
      size: getComputedStyle(h).fontSize, align: getComputedStyle(h).textAlign, color: getComputedStyle(h).color };
  }).sort((a, b) => a.top - b.top);
  return { h: document.documentElement.scrollHeight, imgs, heads };
});
console.log(`ROUTE ${route}  height=${out.h}`);
console.log('=== IMAGES ===');
for (const i of out.imgs) console.log(`${String(i.top).padStart(6)} ${String(i.w).padStart(4)}x${String(i.h).padStart(4)} ${i.file.padEnd(30)} ${i.alt}`);
console.log('=== HEADINGS ===');
for (const h of out.heads) console.log(`${String(h.top).padStart(6)} ${h.tag} ${h.size.padStart(6)} ${h.align.padEnd(7)} ${h.color.padEnd(17)} ${h.text}`);
await b.close();
