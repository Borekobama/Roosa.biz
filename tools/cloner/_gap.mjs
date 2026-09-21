import { chromium } from 'playwright';
const b = await chromium.launch();
const grab = async (base, route) => {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.evaluate(async () => {
    for (const i of document.querySelectorAll('img')) i.loading = 'eager';
    for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
      window.scrollTo(0, y); await new Promise(r => setTimeout(r, 130));
    }
    window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 600));
  });
  const out = await p.evaluate(() =>
    [...document.querySelectorAll('h1,h2,h3,h4,h5')].map(h => {
      const r = h.getBoundingClientRect();
      return { y: Math.round(r.top + scrollY), size: Math.round(parseFloat(getComputedStyle(h).fontSize)),
               text: (h.textContent||'').trim().slice(0, 46) };
    }).filter(h => h.text && !/BUY LICEN|FRAMESHIP/i.test(h.text))
      .sort((a,b)=>a.y-b.y));
  await p.close();
  return out;
};
const route = process.argv[2] ?? '/';
const s = await grab('https://solene.framer.ai', route);
const c = await grab('http://localhost:3111', route);
console.log('SOURCE'.padEnd(60), 'CLONE');
const n = Math.max(s.length, c.length);
for (let i = 0; i < n; i++) {
  const L = s[i] ? `${String(s[i].y).padStart(6)} ${String(s[i].size).padStart(3)}px ${s[i].text}` : '';
  const R = c[i] ? `${String(c[i].y).padStart(6)} ${String(c[i].size).padStart(3)}px ${c[i].text}` : '';
  console.log(L.padEnd(60), R);
}
await b.close();
