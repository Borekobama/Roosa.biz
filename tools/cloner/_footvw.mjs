import { chromium } from 'playwright';
/** Footer panel and wordmark widths at two viewports, to find what the source
 *  caps when the window grows. */
const b = await chromium.launch();
for (const [w, h] of [[1440, 900], [1680, 1050]]) {
  for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
    await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
    await p.waitForTimeout(2400);
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
    await p.waitForTimeout(700);
    console.log(`${w}x${h} ${tag}`, await p.evaluate(() => {
      const f = document.querySelector('footer');
      if (!f) return 'no footer';
      const fr = f.getBoundingClientRect();
      const panel = [...f.querySelectorAll('div')]
        .map(d => ({ d, r: d.getBoundingClientRect() }))
        .filter(o => o.r.width > 800 && getComputedStyle(o.d).backgroundColor !== 'rgba(0, 0, 0, 0)')
        .sort((a, c) => c.r.width - a.r.width)[0];
      const mark = [...f.querySelectorAll('img,svg')]
        .map(i => ({ i, r: i.getBoundingClientRect() }))
        .filter(o => o.r.width > 400).sort((a, c) => c.r.width - a.r.width)[0];
      const ps = panel ? getComputedStyle(panel.d) : null;
      return `footer ${Math.round(fr.width)}x${Math.round(fr.height)} | panel ${panel ? Math.round(panel.r.width) + 'x' + Math.round(panel.r.height) + ' maxw=' + ps.maxWidth + ' pad=' + ps.paddingLeft : '-'} | mark ${mark ? Math.round(mark.r.width) + 'x' + Math.round(mark.r.height) + ' maxw=' + getComputedStyle(mark.i).maxWidth : '-'}`;
    }));
    await p.context().close();
  }
}
await b.close();
