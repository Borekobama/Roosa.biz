import { chromium } from 'playwright';
import fs from 'node:fs';
/**
 * Sample a grid across the SOL-G7 panel plus the foliage bleed bands above and
 * below it, so a residual colour gap can be localised instead of guessed.
 * Both sides are captured with the panel top at y=140 in a 1440x1090 frame.
 */
const b = await chromium.launch();
const shots = {};
for (const [base, label] of [['https://solene.framer.ai', 'src'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'cln']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 1100 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  const top = await p.evaluate(() => {
    const e = [...document.querySelectorAll('*')].filter(x => x.children.length === 0 && /SOL-G7/.test(x.textContent || ''))[0];
    let n = e; for (let i = 0; i < 9 && n; i++) { const r = n.getBoundingClientRect(); if (r.width > 1300 && r.height > 600) break; n = n.parentElement; }
    return Math.round(n.getBoundingClientRect().top + window.scrollY);
  });
  await p.evaluate(v => window.scrollTo(0, v - 140), top);
  await p.waitForTimeout(900);
  shots[label] = (await p.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 1090 } })).toString('base64');
  await p.context().close();
}

// regions in frame coordinates: panel occupies x 32..1408, y 140..943
const R = [];
R.push(['bleed above  ', 500, 95, 400, 40]);
R.push(['bleed below  ', 500, 950, 400, 40]);
R.push(['bleed left   ', 2, 400, 26, 200]);
R.push(['bleed right  ', 1412, 400, 26, 200]);
for (let ry = 0; ry < 4; ry++) for (let rx = 0; rx < 4; rx++)
  R.push([`cell ${rx},${ry}    `, 60 + rx * 340, 170 + ry * 190, 300, 160]);

const ctx = await b.newContext();
const page = await ctx.newPage();
await page.setContent('<canvas id="c"></canvas>');
const out = await page.evaluate(async ({ shots, regions }) => {
  const load = (b64) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = 'data:image/png;base64,' + b64; });
  const c = document.getElementById('c'); const g = c.getContext('2d', { willReadFrequently: true });
  const imgs = { src: await load(shots.src), cln: await load(shots.cln) };
  // Framer's unlicensed-demo watermarks sit over the source's lower corners.
  // They are skipped on BOTH images so the two averages stay comparable: a
  // near-white banner inside a sample region reads as a 25-RGB tint gap that
  // is not in the design at all.
  const MASK = [[0, 838, 280, 252], [1264, 1032, 176, 58]];
  const avg = (img, [, x, y, w, h]) => {
    c.width = img.width; c.height = img.height;
    g.clearRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0);
    const d = g.getImageData(x, y, w, h).data;
    let r = 0, gr = 0, bl = 0, n = 0;
    for (let i = 0; i < d.length; i += 4) {
      const px = x + (i / 4) % w, py = y + Math.floor((i / 4) / w);
      if (MASK.some(([mx, my, mw, mh]) => px >= mx && px < mx + mw && py >= my && py < my + mh)) continue;
      r += d[i]; gr += d[i + 1]; bl += d[i + 2]; n++;
    }
    return n ? [Math.round(r / n), Math.round(gr / n), Math.round(bl / n)] : [0, 0, 0];
  };
  return regions.map(reg => {
    const s = avg(imgs.src, reg), k = avg(imgs.cln, reg);
    return `${reg[0]} src(${String(s[0]).padStart(3)},${String(s[1]).padStart(3)},${String(s[2]).padStart(3)})  cln(${String(k[0]).padStart(3)},${String(k[1]).padStart(3)},${String(k[2]).padStart(3)})  d ${k.map((v, i) => String(v - s[i]).padStart(4)).join(',')}`;
  });
}, { shots, regions: R });
out.forEach(x => console.log(x));
fs.mkdirSync('docs/research/_compare/bleed', { recursive: true });
for (const k of ['src', 'cln']) fs.writeFileSync(`docs/research/_compare/bleed/${k}.png`, Buffer.from(shots[k], 'base64'));
await b.close();
