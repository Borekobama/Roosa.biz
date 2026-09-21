import { chromium } from 'playwright';
import fs from 'node:fs';
/** Zoom on the feature columns of a pinned panel, both sides, plus a dump of
 *  every svg/img actually inside those columns. */
const dir = 'docs/research/_compare/picons';
fs.mkdirSync(dir, { recursive: true });
const b = await chromium.launch();
for (const [base, label] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
  await p.waitForTimeout(800);
  for (const stem of ['HmBptSSqZF2BuLVPrA1rifChmQ', 'ucdAClc5UOgVXbayLZKuFLA0ucI']) {
    const info = await p.evaluate((stem) => {
      const img = [...document.querySelectorAll('img')].find(i => (i.currentSrc || i.src).includes(stem));
      if (!img) return null;
      let panel = img;
      for (let i = 0; i < 10 && panel.parentElement; i++) {
        const r = panel.getBoundingClientRect();
        if (r.width > 1200 && r.height > 700 && (panel.textContent || '').trim().length > 40) break;
        panel = panel.parentElement;
      }
      const pr = panel.getBoundingClientRect();
      const marks = [...panel.querySelectorAll('svg, img, canvas')].map(el => {
        const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
        return `${el.tagName} [${Math.round(r.left - pr.left)},${Math.round(r.top - pr.top)},${Math.round(r.width)},${Math.round(r.height)}] fill=${s.fill} stroke=${s.stroke} sw=${s.strokeWidth} paths=${el.querySelectorAll ? el.querySelectorAll('path,circle,rect,line,polyline,ellipse,g').length : 0} src=${(el.currentSrc || '').split('/').pop().slice(0, 26)}`;
      });
      return { box: [pr.left, pr.top, pr.width, pr.height], marks };
    }, stem);
    if (!info) { console.log(label, stem, 'NOT FOUND'); continue; }
    console.log(`=== ${label} ${stem} ===`);
    info.marks.forEach(m => console.log('  ' + m));
    const [x, y, w, h] = info.box;
    // the feature columns: x 590..1410 of the panel, its lower third
    const clip = { x: Math.max(0, x + 575), y: Math.max(0, y + h - 240), width: Math.min(850, 1440 - (x + 575)), height: 230 };
    if (clip.y >= 0 && clip.height > 0 && clip.width > 0)
      fs.writeFileSync(`${dir}/${label.trim()}-${stem.slice(0, 8)}.png`, await p.screenshot({ clip }));
  }
  await p.context().close();
}
await b.close();
console.log('wrote', dir);
