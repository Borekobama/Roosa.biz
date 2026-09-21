import { chromium } from 'playwright';
/** Identify the 56x56 image the source draws under the offer guarantee. */
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto('https://solene.framer.ai/', { waitUntil: 'domcontentloaded', timeout: 120000 });
await p.waitForTimeout(2500);
await p.evaluate(async () => { for (let y = 0; y < 18000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } });
await p.evaluate(() => window.scrollTo(0, 0));
await p.waitForTimeout(700);
const out = await p.evaluate(() => {
  const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
  return [...document.querySelectorAll('img')]
    .filter(i => Math.abs(i.offsetWidth - 56) < 4 && Math.abs(i.offsetHeight - 56) < 4)
    .map(i => ({ y: Math.round(docTop(i)), x: Math.round(i.getBoundingClientRect().left), src: i.currentSrc, alt: i.alt }));
});
out.forEach(o => console.log(`  56x56 at x=${o.x} y=${o.y}  alt="${o.alt}"  ${o.src.split('/').pop().slice(0, 46)}`));
await b.close();
