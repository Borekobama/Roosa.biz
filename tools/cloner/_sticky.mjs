import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('https://solene.framer.ai/', { waitUntil: 'networkidle', timeout: 90000 });
await p.evaluate(async () => {
  for (let y = 0; y < 3000; y += 450) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 200)); }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 600));
});
const out = await p.evaluate(() => {
  const sticky = [...document.querySelectorAll('body *')].filter(el => {
    const cs = getComputedStyle(el);
    return cs.position === 'sticky' || cs.position === 'fixed';
  }).map(el => {
    const r = el.getBoundingClientRect();
    return { tag: el.tagName, pos: getComputedStyle(el).position, top: Math.round(r.top + scrollY),
             h: Math.round(r.height), w: Math.round(r.width),
             text: (el.textContent || '').trim().slice(0, 50) };
  });
  // Tall containers that could host a pinned scroll sequence.
  const tall = [...document.querySelectorAll('body *')].filter(el => {
    const r = el.getBoundingClientRect();
    return r.height > 2000 && r.height < 9000 && r.width > 900;
  }).map(el => {
    const r = el.getBoundingClientRect();
    return { tag: el.tagName, top: Math.round(r.top + scrollY), h: Math.round(r.height),
             overflow: getComputedStyle(el).overflow, children: el.children.length,
             text: (el.textContent || '').trim().slice(0, 60) };
  }).sort((a,b) => a.top - b.top);
  return { sticky: sticky.slice(0, 12), tall: tall.slice(0, 12) };
});
console.log('=== STICKY/FIXED ==='); for (const s of out.sticky) console.log(JSON.stringify(s));
console.log('=== TALL CONTAINERS ==='); for (const t of out.tall) console.log(JSON.stringify(t));
await b.close();
