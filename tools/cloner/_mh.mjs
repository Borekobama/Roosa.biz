import { chromium } from 'playwright';
const b = await chromium.launch();
const grab = async (base) => {
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2000);
  const out = await p.evaluate(() => {
    const h = document.querySelector('header') || document.body.firstElementChild;
    const g = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
      return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), bg: cs.backgroundColor, radius: cs.borderRadius }; };
    const imgs = [...h.querySelectorAll('img')].map(i => ({ ...g(i), fit: getComputedStyle(i).objectFit, nat: `${i.naturalWidth}x${i.naturalHeight}` }));
    const btns = [...h.querySelectorAll('button')].map(e => ({ ...g(e), label: e.getAttribute('aria-label') || '' }));
    // Hero CTA colours
    const ctas = [...document.querySelectorAll('a,button')].filter(e => /Buy Offer|Know more/.test(e.textContent||'')).slice(0,4)
      .map(e => ({ text: (e.textContent||'').trim().slice(0,12), ...g(e), color: getComputedStyle(e).color }));
    return { headerH: Math.round(h.getBoundingClientRect().height), imgs, btns, ctas };
  });
  await p.close();
  return out;
};
const s = await grab('https://solene.framer.ai');
const c = await grab('http://localhost:3111');
console.log('SOURCE', JSON.stringify(s, null, 1));
console.log('CLONE ', JSON.stringify(c, null, 1));
await b.close();
