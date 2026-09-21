import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('https://solene.framer.ai/', { waitUntil: 'domcontentloaded', timeout: 90000 });
await p.waitForTimeout(2000);
const out = await p.evaluate(() => {
  const h = document.querySelector('header') || document.body.firstElementChild;
  const link = h.querySelector('a');
  const svg = link?.querySelector('svg');
  const cs = link ? getComputedStyle(link) : null;
  return {
    linkHtml: link ? link.innerHTML.slice(0, 600) : null,
    hasSvg: !!svg,
    svgViewBox: svg?.getAttribute('viewBox') ?? null,
    svgPaths: svg ? svg.querySelectorAll('path').length : 0,
    linkText: (link?.textContent || '').trim(),
    bgImage: cs?.backgroundImage?.slice(0, 120) ?? null,
    childTags: link ? [...link.children].map(c => c.tagName) : [],
  };
});
console.log(JSON.stringify(out, null, 1).slice(0, 1600));
await b.close();
