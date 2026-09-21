import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3111/', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(1200);
const out = await p.evaluate(() => {
  const ing = document.querySelector('.t-ingredient');
  const sec = document.querySelector('section[aria-label="How Solene fits your day"]');
  const sticky = sec?.querySelector('.sticky');
  // Any ancestor with a clipping overflow breaks position:sticky.
  const clipping = [];
  let n = sticky?.parentElement;
  while (n && n !== document.documentElement) {
    const cs = getComputedStyle(n);
    if (['hidden', 'clip', 'auto', 'scroll'].includes(cs.overflow) ||
        ['hidden', 'clip', 'auto', 'scroll'].includes(cs.overflowY)) {
      clipping.push(`${n.tagName}.${(typeof n.className === 'string' ? n.className : '').slice(0, 40)} overflow=${cs.overflow}/${cs.overflowY}`);
    }
    n = n.parentElement;
  }
  return {
    ingredient: ing ? { tag: ing.tagName, font: getComputedStyle(ing).fontSize, cls: ing.className } : null,
    sectionHeight: sec ? Math.round(sec.getBoundingClientRect().height) : null,
    stickyPos: sticky ? getComputedStyle(sticky).position : null,
    stickyHeight: sticky ? Math.round(sticky.getBoundingClientRect().height) : null,
    clipping,
  };
});
console.log(JSON.stringify(out, null, 1));
await b.close();
