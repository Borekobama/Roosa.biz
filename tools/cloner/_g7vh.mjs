import { chromium } from 'playwright';
/** SOL-G7 plate and panel at two viewport heights, both sides. */
const b = await chromium.launch();
for (const [w, h] of [[1440, 900], [1440, 1100]]) {
  for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
    await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
    await p.waitForTimeout(2400);
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
    await p.waitForTimeout(600);
    console.log(`${w}x${h} ${tag}`, await p.evaluate(() => {
      const ov = [...document.querySelectorAll('img')]
        .find(i => decodeURIComponent(i.currentSrc || '').includes('rt7EhbM0b89GV3Exm5VCRoV728Q'));
      if (!ov) return 'overlay not found';
      const r = ov.getBoundingClientRect();
      const plate = [...document.querySelectorAll('img')]
        .map(i => i.getBoundingClientRect())
        .filter(x => x.width > 1400 && x.height > 800 && Math.abs(x.top - r.top) < 200)[0];
      return `panel ${Math.round(r.width)}x${Math.round(r.height)} | plate ${plate ? Math.round(plate.width) + 'x' + Math.round(plate.height) : '-'}`;
    }));
    await p.context().close();
  }
}
await b.close();
