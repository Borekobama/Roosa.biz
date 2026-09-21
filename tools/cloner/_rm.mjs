import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.emulateMedia({ reducedMotion: 'reduce' });
await p.goto('http://localhost:3111/', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(1500);
const out = await p.evaluate(() =>
  [...document.querySelectorAll('main div[style*="opacity"]')]
    .filter((el) => Number(el.style.opacity) === 0)
    .map((el) => {
      const r = el.getBoundingClientRect();
      const parent = el.parentElement;
      return {
        offsetParentNull: el.offsetParent === null,
        display: getComputedStyle(el).display,
        parentDisplay: parent ? getComputedStyle(parent).display : null,
        w: Math.round(r.width), h: Math.round(r.height),
        y: Math.round(r.top + window.scrollY),
        text: (el.textContent || '').trim().slice(0, 44),
      };
    }),
);
console.log(JSON.stringify(out, null, 1));
await b.close();
