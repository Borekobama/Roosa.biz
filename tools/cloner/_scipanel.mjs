import { chromium } from 'playwright';
/** The science page's frosted panel: full paint stack around the rt7Eh overlay,
 *  both sides, in panel-relative coordinates. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/science', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2200);
  for (let pass = 0; pass < 2; pass++) {
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 70)); } });
    await p.waitForTimeout(700);
  }
  const out = await p.evaluate(() => {
    const ov = [...document.querySelectorAll('img')]
      .find(i => decodeURIComponent(i.currentSrc || i.src || '').includes('rt7EhbM0b89GV3Exm5VCRoV728Q'));
    if (!ov) return ['overlay not found'];
    // climb to the band that holds the overlay, not past it to <body>
    let root = ov;
    for (let i = 0; i < 8 && root.parentElement; i++) {
      const r = root.getBoundingClientRect();
      if (r.width > 1380 && r.height > 700) break;
      root = root.parentElement;
    }
    const orr = ov.getBoundingClientRect();
    const rows = [`overlay ${Math.round(orr.width)}x${Math.round(orr.height)} at x=${Math.round(orr.left)}`];
    const walk = (el, d) => {
      const s = getComputedStyle(el); const r = el.getBoundingClientRect();
      const paints = s.backgroundColor !== 'rgba(0, 0, 0, 0)' || s.backgroundImage !== 'none' ||
        s.filter !== 'none' || s.backdropFilter !== 'none' || s.mixBlendMode !== 'normal' ||
        +s.opacity < 0.999 || el.tagName === 'IMG';
      if (paints) rows.push(`${'  '.repeat(d)}${el.tagName} [${Math.round(r.left)},${Math.round(r.top - orr.top)},${Math.round(r.width)},${Math.round(r.height)}] bg=${s.backgroundColor} op=${s.opacity} blend=${s.mixBlendMode} filt=${s.filter} bfilt=${s.backdropFilter} rad=${s.borderRadius}${el.tagName === 'IMG' ? ' SRC=' + decodeURIComponent(el.currentSrc || '').split('/').pop().replace(/[?&].*$/, '').slice(0, 26) + ' ofit=' + s.objectFit : ''}`);
      for (const c of el.children) walk(c, d + 1);
    };
    walk(root, 0);
    return rows;
  });
  console.log('=== ' + tag + ' ==='); out.slice(0, 18).forEach(o => console.log('  ' + o));
  await p.context().close();
}
await b.close();
