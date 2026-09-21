import { chromium } from 'playwright';
/** Third method on the phone panel region: watch the panels move. Sticky
 *  offsetTop lies once an element is stuck, so this samples rect.top against
 *  scrollY and reports where each panel pins, for how long, and whether the
 *  next one covers it. */
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
await p.goto('https://solene.framer.ai/', { waitUntil: 'domcontentloaded', timeout: 120000 });
await p.waitForTimeout(2600);
await p.evaluate(async () => { for (let y = 0; y < 6000; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
await p.waitForTimeout(900);
const samples = [];
for (let y = 600; y <= 4200; y += 100) {
  await p.evaluate((v) => window.scrollTo(0, v), y);
  await p.waitForTimeout(90);
  const row = await p.evaluate(() => {
    const st = [...document.querySelectorAll('*')].filter(e => getComputedStyle(e).position === 'sticky' && e.offsetHeight > 700 && e.offsetWidth > 300);
    return st.map(e => {
      const r = e.getBoundingClientRect();
      const im = e.querySelector('img');
      return { top: Math.round(r.top), h: Math.round(r.height), z: getComputedStyle(e).zIndex, img: im ? `${im.offsetWidth}x${im.offsetHeight}` : '-' };
    });
  });
  samples.push({ y, row });
}
console.log('scrollY |  panel rect.top (viewport)         | sizes');
for (const s of samples) {
  console.log(String(s.y).padStart(7) + ' | ' + s.row.map(r => String(r.top).padStart(6)).join(' ') + '  | ' + s.row.map(r => r.img).join(' '));
}
await b.close();
