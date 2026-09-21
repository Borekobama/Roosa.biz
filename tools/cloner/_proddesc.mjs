import { chromium } from 'playwright';
/** Is the product description rendered on the source's product page, and at
 *  which widths? Searched by its opening words wherever they sit. */
const b = await chromium.launch();
for (const w of [390, 768, 1440]) {
  const p = await (await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 720, hasTouch: w < 720 })).newPage();
  await p.goto('https://solene.framer.ai/merch/daily-multivitamin%E2%84%A2', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let y = 0; y < 6000; y += 320) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(600);
  const out = await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const hits = [...document.querySelectorAll('p,div,span')]
      .filter(x => /^A clean, daily multivitamin crafted/i.test((x.textContent || '').trim()))
      .map(x => ({ y: Math.round(docTop(x)), h: x.offsetHeight, w: x.offsetWidth, fs: parseFloat(getComputedStyle(x).fontSize), vis: getComputedStyle(x).visibility }))
      .filter(o => o.h > 4);
    const price = [...document.querySelectorAll('p,span,div')].find(x => (x.textContent || '').trim() === '$87');
    return { hits: hits.slice(0, 3), price: price ? Math.round(docTop(price)) : null };
  });
  console.log(`${String(w).padStart(5)}  price at ${out.price}   description: ${out.hits.length ? out.hits.map(h => `y=${h.y} ${h.w}x${h.h} ${h.fs}px`).join(' | ') : 'not rendered'}`);
  await p.context().close();
}
await b.close();
