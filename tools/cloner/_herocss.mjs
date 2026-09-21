import { chromium } from 'playwright';
/** Computed sizing of the source hero and its ancestors at two viewport sizes. */
const b = await chromium.launch();
for (const [w, h] of [[1440, 900], [1440, 1100]]) {
  const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
  await p.goto((process.env.BASE ?? 'https://solene.framer.ai') + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2600);
  console.log(`=== ${w}x${h} ===`);
  console.log(await p.evaluate(() => {
    const img = [...document.querySelectorAll('img')]
      .map(i => ({ i, r: i.getBoundingClientRect() }))
      .filter(o => o.r.width > 700 && o.r.top < 400)
      .sort((a, c) => c.r.width - a.r.width)[0];
    if (!img) return 'no hero';
    const out = [];
    let n = img.i;
    for (let k = 0; k < 5 && n; k++) {
      const s = getComputedStyle(n); const r = n.getBoundingClientRect();
      out.push(`  <${n.tagName}> rect ${Math.round(r.width)}x${Math.round(r.height)} @${Math.round(r.top)}  h=${s.height} w=${s.width} minH=${s.minHeight} maxH=${s.maxHeight} aspect=${s.aspectRatio} pad=${s.paddingTop}/${s.paddingBottom} pos=${s.position} ofit=${s.objectFit} rad=${s.borderRadius}`);
      n = n.parentElement;
    }
    return out.join('\n');
  }));
  await p.context().close();
}
await b.close();
