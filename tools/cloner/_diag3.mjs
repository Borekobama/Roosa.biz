import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3111/', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(2500);
const out = await p.evaluate(() => {
  const rootFont = getComputedStyle(document.documentElement).fontSize;
  const all = [...document.querySelectorAll('.t-ingredient')].map(e => ({
    tag: e.tagName, font: getComputedStyle(e).fontSize,
    text: (e.textContent||'').trim().slice(0,20),
    w: Math.round(e.getBoundingClientRect().width),
  }));
  const sec = document.querySelector('section[aria-label="How Solene fits your day"]');
  const kids = sec ? [...sec.children].map(c => ({
    tag: c.tagName, cls: (typeof c.className === 'string' ? c.className : '').slice(0, 60),
    pos: getComputedStyle(c).position,
    h: Math.round(c.getBoundingClientRect().height),
  })) : [];
  const probe = document.createElement('div');
  probe.style.fontSize = 'clamp(2.25rem, 1.67rem + 2.35vw, 3.5rem)';
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).fontSize;
  probe.remove();
  return { rootFont, clampResolves: resolved, ingredients: all, sequenceChildren: kids };
});
console.log(JSON.stringify(out, null, 1));
await b.close();
