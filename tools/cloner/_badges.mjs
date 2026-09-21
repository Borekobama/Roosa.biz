import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('https://solene.framer.ai/', { waitUntil: 'domcontentloaded', timeout: 90000 });
await p.evaluate(async () => {
  for (const i of document.querySelectorAll('img')) i.loading = 'eager';
  for (let y = 0; y < 9000; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 170)); }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 700));
});
const out = await p.evaluate(() => {
  const imgs = [...document.querySelectorAll('img')].map(i => {
    const r = i.getBoundingClientRect();
    return { top: Math.round(r.top + scrollY), left: Math.round(r.left),
      w: Math.round(r.width), h: Math.round(r.height),
      file: (() => { try { return new URL(i.currentSrc||i.src).pathname.split('/').pop().slice(0,12); } catch { return '?' } })() };
  }).filter(i => i.top > 6800 && i.top < 8400 && i.w > 40);
  // Text labels in the same band.
  const labels = [...document.querySelectorAll('p,span,h1,h2,h3,h4')].map(e => {
    const r = e.getBoundingClientRect();
    return { top: Math.round(r.top + scrollY), left: Math.round(r.left),
      size: getComputedStyle(e).fontSize, color: getComputedStyle(e).color,
      text: (e.textContent||'').trim().slice(0, 44) };
  }).filter(l => l.top > 6900 && l.top < 8400 && l.text && l.text.length > 2);
  const seen = new Set();
  const uniq = labels.filter(l => { const k = l.text + l.top; if (seen.has(k)) return false; seen.add(k); return true; });
  return { imgs, labels: uniq.slice(0, 22) };
});
console.log('=== BADGES (top,left,size) ===');
for (const i of out.imgs) console.log(`top=${i.top} left=${i.left} ${i.w}x${i.h} ${i.file}`);
console.log('=== LABELS ===');
for (const l of out.labels) console.log(`top=${l.top} left=${l.left} ${l.size} ${l.text}`);
await b.close();
