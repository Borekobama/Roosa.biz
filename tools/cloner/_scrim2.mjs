import { chromium } from 'playwright';
/** Two methods on the panel scrim. First the DOM: every descendant of the
 *  panel, siblings included, not just the image's ancestors. Then the pixels:
 *  sample the rendered photo at the headline and well above it. A scrim makes
 *  the lower sample markedly darker and pulls it toward olive; without one the
 *  two samples track the photo alone. */
const b = await chromium.launch();
for (const [w, tag, y] of [[390, 'PHONE  ', 2900], [1440, 'DESKTOP', 4200]]) {
  const p = await (await b.newContext({ viewport: { width: w, height: 844 }, isMobile: w < 720, hasTouch: w < 720 })).newPage();
  await p.goto('https://solene.framer.ai/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let v = 0; v < 9000; v += 350) { window.scrollTo(0, v); await new Promise(r => setTimeout(r, 45)); } });
  await p.evaluate((v) => window.scrollTo(0, v), y);
  await p.waitForTimeout(900);
  const dom = await p.evaluate(() => {
    const img = [...document.querySelectorAll('img')].find(i => i.currentSrc.includes('ucdAClc5'));
    if (!img) return { miss: true };
    let panel = img.parentElement;
    for (let i = 0; i < 3 && panel.parentElement; i++) panel = panel.parentElement;
    const rows = [];
    for (const n of panel.querySelectorAll('*')) {
      const s = getComputedStyle(n);
      if (s.backgroundImage.includes('gradient')) {
        const r = n.getBoundingClientRect();
        rows.push(`  ${Math.round(r.width)}x${Math.round(r.height)} op=${s.opacity} ${s.backgroundImage.slice(0, 96)}`);
      }
    }
    const ir = img.getBoundingClientRect();
    return { rows, box: `${Math.round(ir.left)},${Math.round(ir.top)} ${Math.round(ir.width)}x${Math.round(ir.height)}` };
  });
  console.log(`=== ${tag} (img at ${dom.box}) ===`);
  dom.rows.length ? dom.rows.forEach(r => console.log(r)) : console.log('  DOM: no gradient anywhere in the panel');
  // Pixel method: read the screenshot buffer directly.
  const shot = await p.screenshot({ type: 'png' });
  const { createCanvas, loadImage } = await import('canvas').catch(() => ({}));
  if (!createCanvas) { console.log('  (pixel pass skipped: canvas not installed)'); await p.context().close(); continue; }
  const im = await loadImage(shot);
  const cv = createCanvas(im.width, im.height); const cx = cv.getContext('2d'); cx.drawImage(im, 0, 0);
  const sample = (px, py) => { const d = cx.getImageData(px, py, 1, 1).data; return `${d[0]},${d[1]},${d[2]}`; };
  const cxs = Math.round(im.width / 2);
  console.log(`  pixels down the panel centre: ` + [0.15, 0.4, 0.65, 0.8, 0.9, 0.97].map(f => `${Math.round(f * 100)}%=${sample(cxs, Math.round(im.height * f))}`).join('  '));
  await p.context().close();
}
await b.close();
