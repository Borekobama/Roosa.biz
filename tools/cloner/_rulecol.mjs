import { chromium } from 'playwright';
/** Sample the stat-row divider on the source: is it solid or dashed, and what
 *  colour? The element is an svg, so computed style tells us nothing. */
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto('https://solene.framer.ai/', { waitUntil: 'domcontentloaded', timeout: 90000 });
await p.waitForTimeout(2400);
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 70)); } });
await p.waitForTimeout(800);
const info = await p.evaluate(() => {
  const el = [...document.querySelectorAll('svg')]
    .map(s => ({ s, r: s.getBoundingClientRect() }))
    .filter(o => o.r.width <= 4 && o.r.height > 150)[0];
  if (!el) return null;
  return { top: Math.round(el.r.top + scrollY), left: Math.round(el.r.left), html: el.s.outerHTML.slice(0, 400) };
});
if (!info) { console.log('rule not found'); await b.close(); }
else {
  console.log('rule at', info.left, info.top);
  console.log('markup:', info.html.replace(/\s+/g, ' '));
  await p.evaluate(v => window.scrollTo(0, v - 200), info.top);
  await p.waitForTimeout(700);
  const shot = (await p.screenshot({ clip: { x: info.left - 3, y: 200, width: 9, height: 160 } })).toString('base64');
  const c = await (await b.newContext()).newPage();
  await c.setContent('<canvas id="c"></canvas>');
  console.log(await c.evaluate(async (b64) => {
    const img = await new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = 'data:image/png;base64,' + b64; });
    const cv = document.getElementById('c'); cv.width = img.width; cv.height = img.height;
    const g = cv.getContext('2d'); g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, img.width, img.height).data;
    const col = [];
    for (let y = 0; y < img.height; y += 4) {
      let best = null;
      for (let x = 0; x < img.width; x++) {
        const i = (y * img.width + x) * 4;
        const lum = d[i] + d[i + 1] + d[i + 2];
        if (!best || lum < best.lum) best = { lum, rgb: [d[i], d[i + 1], d[i + 2]], x };
      }
      col.push(`y${y}:rgb(${best.rgb.join(',')})@x${best.x}`);
    }
    return col.join('  ');
  }, shot));
  await b.close();
}
