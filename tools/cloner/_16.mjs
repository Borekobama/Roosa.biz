import { chromium } from 'playwright';
const b = await chromium.launch();
const grab = async (base, label) => {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(base + '/science', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.evaluate(async () => {
    for (let y = 0; y < 9000; y += 450) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 130)); }
    window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 600));
  });
  const out = await p.evaluate(() =>
    [...document.querySelectorAll('*')].filter(e => {
      const own = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      const t = (e.textContent||'').trim();
      return own && t.length > 3 && Math.round(parseFloat(getComputedStyle(e).fontSize)) === 16
        && !/BUY LICEN|FRAMESHIP|remove this banner/i.test(t);
    }).map(e => {
      const r = e.getBoundingClientRect();
      return { y: Math.round(r.top + scrollY), text: (e.textContent||'').trim().slice(0, 50) };
    }).sort((a,b)=>a.y-b.y));
  await p.close();
  console.log(`${label} (${out.length})`);
  for (const o of out) console.log(`  ${String(o.y).padStart(5)} ${o.text}`);
};
await grab('https://solene.framer.ai', 'SOURCE');
await grab('http://localhost:3111', 'CLONE');
await b.close();
