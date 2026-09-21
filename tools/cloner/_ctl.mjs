import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('https://solene.framer.ai/merch/daily-multivitamin%E2%84%A2', { waitUntil: 'domcontentloaded', timeout: 90000 });
await p.waitForTimeout(2500);
const out = await p.evaluate(() => {
  const ctl = [...document.querySelectorAll('button,[role="button"],select,input')].map(e => {
    const r = e.getBoundingClientRect();
    return { tag: e.tagName, x: Math.round(r.left), y: Math.round(r.top + scrollY),
      w: Math.round(r.width), h: Math.round(r.height),
      bg: getComputedStyle(e).backgroundColor,
      text: (e.textContent || e.value || e.getAttribute('aria-label') || '').trim().slice(0, 34) };
  }).filter(c => c.w > 10);
  return ctl;
});
for (const c of out) console.log(JSON.stringify(c));
await b.close();
