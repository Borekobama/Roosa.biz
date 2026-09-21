import { chromium } from 'playwright';
/** Rotation of the scattered gummies over the foliage panel, both sides.
 *  Tailwind compiles rotate utilities to the `rotate` property, not `transform`,
 *  so read both. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
  await p.waitForTimeout(700);
  const out = await p.evaluate(() => {
    const bg = [...document.querySelectorAll('img')].map(i => i.getBoundingClientRect())
      .filter(r => r.width > 1300 && r.height > 1200)[0];
    if (!bg) return ['no backdrop'];
    const top = bg.top + scrollY, bottom = top + bg.height;
    return [...document.querySelectorAll('img')]
      .filter(i => {
        const r = i.getBoundingClientRect(); const y = r.top + scrollY;
        return r.width > 60 && r.width < 240 && y > top && y < bottom;
      })
      .map(i => {
        const s = getComputedStyle(i); const r = i.getBoundingClientRect();
        // derive the angle from the matrix when there is one
        let deg = 0;
        const m = s.transform;
        if (m && m !== 'none') {
          const v = m.match(/matrix\(([^)]+)\)/);
          if (v) { const [a, bb] = v[1].split(',').map(Number); deg = Math.round(Math.atan2(bb, a) * 180 / Math.PI * 10) / 10; }
        }
        return `${Math.round(r.width)}x${Math.round(r.height)} rotate=${s.rotate} matrixDeg=${deg} ${decodeURIComponent(i.currentSrc || '').split('/').pop().replace(/[?&].*$/, '').slice(0, 18)}`;
      });
  });
  console.log('=== ' + tag + ' ==='); [...new Set(out)].slice(0, 10).forEach(o => console.log('  ' + o));
  await p.context().close();
}
await b.close();
