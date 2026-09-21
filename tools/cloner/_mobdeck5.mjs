import { chromium } from 'playwright';
/** Does the phone panel carry a scrim over the photo, and what is the middle
 *  panel's overflowing image? Lists every gradient background in the deck. */
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
await p.goto('https://solene.framer.ai/', { waitUntil: 'domcontentloaded', timeout: 120000 });
await p.waitForTimeout(2600);
await p.evaluate(async () => { for (let y = 0; y < 6000; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
await p.waitForTimeout(1000);
const out = await p.evaluate(() => {
  const st = [...document.querySelectorAll('*')].filter(e => getComputedStyle(e).position === 'sticky' && e.offsetHeight > 700 && e.offsetWidth > 300);
  return st.map((e, i) => {
    const base = e.getBoundingClientRect().top;
    const grads = [...e.querySelectorAll('*')].filter(n => {
      const s = getComputedStyle(n);
      return s.backgroundImage.includes('gradient') || (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && n.offsetHeight > 100);
    }).map(n => {
      const s = getComputedStyle(n), r = n.getBoundingClientRect();
      return `dy=${Math.round(r.top - base)} ${Math.round(r.width)}x${Math.round(r.height)} bg=${s.backgroundColor} img=${s.backgroundImage.slice(0, 90)} ov=${s.overflow}`;
    });
    const imgs = [...e.querySelectorAll('img')].map(n => `${n.offsetWidth}x${n.offsetHeight} ${n.currentSrc.slice(0, 110)}`);
    return { i, grads, imgs, innerOverflow: getComputedStyle(e.firstElementChild).overflow };
  });
});
for (const o of out) { console.log(`=== panel ${o.i + 1} (inner overflow=${o.innerOverflow}) ===`); o.grads.forEach(g => console.log('  ' + g)); o.imgs.forEach(g => console.log('  IMG ' + g)); }
await b.close();
