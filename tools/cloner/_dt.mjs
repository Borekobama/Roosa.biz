import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3111/science', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(1500);
const out = await p.evaluate(() => {
  const g = (sel) => [...document.querySelectorAll(sel)].slice(0,3).map(e => ({
    tag: e.tagName, size: getComputedStyle(e).fontSize, cls: (e.className||'').slice(0,40),
    text: (e.textContent||'').trim().slice(0,24) }));
  return { dt: g('dl dt'), th: g('table th[scope="row"]'), faq: g('[id^="faq-trigger"] span') };
});
console.log(JSON.stringify(out, null, 1));
await b.close();
