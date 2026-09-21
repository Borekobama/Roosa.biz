import { chromium } from 'playwright';
/**
 * Where the testimonial panel meets its heading: does the panel cover the
 * heading, or does the heading stay on top?
 *
 * Sampled by pixel, not by z-index — the two sides structure this differently
 * and computed z-index says nothing about what actually paints.
 */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
  await p.waitForTimeout(700);
  const bg = await p.evaluate(() => {
    const i = [...document.querySelectorAll('img')].map(x => x.getBoundingClientRect())
      .filter(r => r.width > 1300 && r.height > 1200)[0];
    return i ? Math.round(i.top + scrollY) : null;
  });
  if (bg == null) { console.log(tag, 'backdrop not found'); await p.context().close(); continue; }
  const rows = [];
  for (const off of [-500, -350, -200, -100, -20]) {
    await p.evaluate(v => window.scrollTo(0, v), bg + off);
    await p.waitForTimeout(450);
    const r = await p.evaluate(() => {
      const hs = [...document.querySelectorAll('h1,h2,h3')].filter(x => /listen/i.test(x.textContent || ''));
      const h = hs.find(x => x.getBoundingClientRect().width > 0);
      if (!h) return null;
      const b = h.getBoundingClientRect();
      return { top: Math.round(b.top), left: Math.round(b.left + b.width / 2), h: Math.round(b.height) };
    });
    if (!r || r.top < -50 || r.top > 860) { rows.push(`${off}: heading off-screen`); continue; }
    const shot = await p.screenshot({ clip: { x: Math.max(0, r.left - 60), y: Math.max(0, r.top + r.h / 2 - 6), width: 120, height: 12 } });
    rows.push(`${off}: headingTop=${r.top} strip=${shot.toString('base64').length}b`);
    rows.push(`   ${await (async () => {
      const c = await (await b.newContext()).newPage();
      await c.setContent('<canvas id="c"></canvas>');
      const v = await c.evaluate(async (b64) => {
        const img = await new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = 'data:image/png;base64,' + b64; });
        const cv = document.getElementById('c'); cv.width = img.width; cv.height = img.height;
        const g = cv.getContext('2d'); g.drawImage(img, 0, 0);
        const d = g.getImageData(0, 0, img.width, img.height).data;
        let dark = 0, n = 0, sr = 0, sg = 0, sb = 0;
        for (let i = 0; i < d.length; i += 4) { sr += d[i]; sg += d[i + 1]; sb += d[i + 2]; n++; if (d[i] + d[i + 1] + d[i + 2] < 300) dark++; }
        return `avg rgb(${Math.round(sr / n)},${Math.round(sg / n)},${Math.round(sb / n)}) darkPx=${Math.round(dark / n * 100)}%`;
      }, shot.toString('base64'));
      await c.context().close();
      return v;
    })()}`);
  }
  console.log('=== ' + tag + ' ==='); rows.forEach(r => console.log('  ' + r));
  await p.context().close();
}
await b.close();
