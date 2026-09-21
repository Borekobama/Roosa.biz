import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('https://solene.framer.ai/', { waitUntil: 'domcontentloaded', timeout: 90000 });
await p.evaluate(async () => {
  for (const i of document.querySelectorAll('img')) i.loading = 'eager';
  for (let y = 0; y < 6000; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 180)); }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 700));
});
const out = await p.evaluate(() => {
  // The 4260px scroll container that holds the pinned panels.
  const tall = [...document.querySelectorAll('body *')].find(el => {
    const r = el.getBoundingClientRect();
    return Math.abs(r.height - 4260) < 40 && r.width > 900 && el.children.length === 4;
  });
  if (!tall) return { error: 'container not found' };
  return {
    containerTop: Math.round(tall.getBoundingClientRect().top + scrollY),
    panels: [...tall.children].map((c, i) => {
      const r = c.getBoundingClientRect();
      const imgs = [...c.querySelectorAll('img')].map(im => ({
        file: (() => { try { return new URL(im.currentSrc || im.src).pathname.split('/').pop().slice(0,30); } catch { return '?' } })(),
        w: Math.round(im.getBoundingClientRect().width),
        h: Math.round(im.getBoundingClientRect().height),
        alt: (im.alt || '').slice(0, 40),
      }));
      const svgs = [...c.querySelectorAll('svg')].map(sv => ({
        w: Math.round(sv.getBoundingClientRect().width),
        h: Math.round(sv.getBoundingClientRect().height),
        vb: sv.getAttribute('viewBox'),
        paths: sv.querySelectorAll('path,line,circle,ellipse').length,
      })).filter(sv => sv.w > 80);
      const heads = [...c.querySelectorAll('h1,h2,h3,h4')].map(h => ({
        tag: h.tagName, size: getComputedStyle(h).fontSize,
        align: getComputedStyle(h).textAlign, color: getComputedStyle(h).color,
        text: (h.textContent||'').trim().slice(0, 56),
      }));
      return { i, h: Math.round(r.height), bg: getComputedStyle(c).backgroundColor, imgs, svgs, heads };
    }),
  };
});
console.log(JSON.stringify(out, null, 1).slice(0, 4000));
await b.close();
