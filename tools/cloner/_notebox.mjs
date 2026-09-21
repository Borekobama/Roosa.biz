import { chromium } from 'playwright';
/** The deck statement panel's own box chain on the clone, to find where the
 *  note's 294 comes from when the panel should give it 326. */
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
await p.goto((process.env.CLONE_BASE ?? 'http://localhost:3111') + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
await p.waitForTimeout(2500);
await p.evaluate(async () => { for (let y = 0; y < 9000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } window.scrollTo(0, 0); });
await p.waitForTimeout(700);
const out = await p.evaluate(() => {
  const notes = [...document.querySelectorAll('p')].filter(x => (x.textContent || '').trim().startsWith('Because with Solene'));
  return notes.map((n, i) => {
    const chain = [];
    let el = n, guard = 0;
    while (el && guard++ < 6) {
      const s = getComputedStyle(el);
      chain.push(`${el.tagName} ${el.offsetWidth}x${el.offsetHeight} pad=${s.paddingLeft}/${s.paddingRight} maxw=${s.maxWidth} disp=${s.display} cls=${(el.className || '').toString().slice(0, 34)}`);
      el = el.parentElement;
    }
    return { i, chain };
  });
});
for (const n of out) { console.log(`--- note ${n.i}`); n.chain.forEach(c => console.log('   ' + c)); }
await b.close();
