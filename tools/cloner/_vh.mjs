import { chromium } from 'playwright';
/**
 * Hero geometry across viewport sizes.
 *
 * If the source sizes the hero to the viewport and the clone uses a fixed
 * aspect ratio, the two agree at whatever size the clone was measured at and
 * diverge everywhere else — which is what "it fits the screen on the source"
 * describes.
 */
const SIZES = [[1440, 900], [1440, 1000], [1512, 982], [1680, 1050], [1280, 800], [1920, 1080]];
const b = await chromium.launch();
const res = {};
for (const [base, tag] of [['https://solene.framer.ai', 'src'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'cln']]) {
  res[tag] = {};
  for (const [w, h] of SIZES) {
    const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
    await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
    await p.waitForTimeout(2600);
    res[tag][`${w}x${h}`] = await p.evaluate(() => {
      const img = [...document.querySelectorAll('img')]
        .map(i => ({ i, r: i.getBoundingClientRect() }))
        .filter(o => o.r.width > 700 && o.r.top < 400)
        .sort((a, c) => c.r.width - a.r.width)[0];
      if (!img) return null;
      const r = img.r; const s = getComputedStyle(img.i);
      return {
        box: `${Math.round(r.width)}x${Math.round(r.height)}`,
        top: Math.round(r.top + scrollY),
        bottom: Math.round(r.bottom + scrollY),
        rad: s.borderRadius,
        fitsScreen: Math.round(r.bottom) <= innerHeight,
      };
    });
    await p.context().close();
  }
}
console.log('viewport'.padEnd(11), 'source box'.padEnd(12), 'fits', '  ', 'clone box'.padEnd(12), 'fits', '  src bottom / cln bottom');
for (const [w, h] of SIZES) {
  const k = `${w}x${h}`; const s = res.src[k], c = res.cln[k];
  console.log(k.padEnd(11), (s?.box ?? '-').padEnd(12), String(s?.fitsScreen ?? '-').padEnd(5),
    ' ', (c?.box ?? '-').padEnd(12), String(c?.fitsScreen ?? '-').padEnd(5),
    ` ${s?.bottom ?? '-'} / ${c?.bottom ?? '-'}`, s && c && s.box !== c.box ? ' <<<' : '');
}
console.log('\nradius  source', res.src['1440x900']?.rad, ' clone', res.cln['1440x900']?.rad);
await b.close();
