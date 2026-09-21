import { chromium } from 'playwright';
/** The seam either side of the SOL-G7 band: panel bottom, plate bottom, and
 *  where the ingredients content actually starts. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 450) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(800);
  const out = await p.evaluate(() => {
    const abs = (r) => [Math.round(r.top + scrollY), Math.round(r.bottom + scrollY)];
    const plate = [...document.querySelectorAll('img')]
      .map(i => ({ i, r: i.getBoundingClientRect() }))
      .filter(o => Math.round(o.r.width) === 1440 && Math.abs(o.r.height - 931) < 4)[0];
    const overlay = [...document.querySelectorAll('img')]
      .map(i => ({ i, r: i.getBoundingClientRect() }))
      .filter(o => Math.round(o.r.width) === 1376 && Math.abs(o.r.height - 803) < 4)[0];
    const ing = [...document.querySelectorAll('h1,h2,h3,p,span,div')]
      .filter(x => [...x.childNodes].some(n => n.nodeType === 3 && n.textContent.trim() === 'Ingredients'))
      .filter(x => x.getBoundingClientRect().width > 0)[0];
    // first painted thing below the plate
    const plateBottom = plate ? plate.r.bottom + scrollY : 0;
    const rows = [];
    rows.push(`plate   ${plate ? abs(plate.r).join('..') : '-'}`);
    rows.push(`panel   ${overlay ? abs(overlay.r).join('..') : '-'}`);
    if (ing) {
      const r = ing.getBoundingClientRect();
      rows.push(`"Ingredients" top ${Math.round(r.top + scrollY)}  (${Math.round(r.top + scrollY - plateBottom)} below plate)`);
      let sec = ing; while (sec && sec.tagName !== 'SECTION' && sec.parentElement) sec = sec.parentElement;
      if (sec && sec.tagName === 'SECTION') {
        const sr = sec.getBoundingClientRect(); const ss = getComputedStyle(sec);
        rows.push(`its <section> ${abs(sr).join('..')} pad=${ss.paddingTop}/${ss.paddingBottom} mt=${ss.marginTop}`);
      }
    }
    return rows;
  });
  console.log('=== ' + tag + ' ==='); out.forEach(o => console.log('  ' + o));
  await p.context().close();
}
await b.close();
