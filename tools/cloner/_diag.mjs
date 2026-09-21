import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3111/', { waitUntil: 'networkidle' });
await p.evaluate(() => document.querySelector('#faq')?.scrollIntoView({ block: 'center', behavior: 'instant' }));
await p.waitForTimeout(1000);
const out = await p.evaluate(() => {
  const h = document.querySelector('#faq h2');
  if (!h) return { error: 'no #faq h2' };
  const chain = [];
  let n = h;
  while (n && n !== document.body) {
    chain.push({ tag: n.tagName, cls: (typeof n.className === 'string' ? n.className : '').slice(0, 40), inlineOpacity: n.style.opacity, computed: getComputedStyle(n).opacity });
    n = n.parentElement;
  }
  return { chain, marquee: document.querySelectorAll('.animate-marquee').length };
});
console.log(JSON.stringify(out, null, 1));
await b.close();
