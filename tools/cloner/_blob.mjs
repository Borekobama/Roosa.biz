import { chromium } from 'playwright';
/** The ellipse behind the statement headline: does its colour, size or offset
 *  change with scroll? Sampled across the panel's whole dwell at both widths. */
const b = await chromium.launch();
for (const c of [{ w: 1440, h: 900, mobile: false, tag: 'DESKTOP', from: 1500, to: 5200, step: 200 },
                 { w: 390, h: 844, mobile: true, tag: 'PHONE  ', from: 1800, to: 3000, step: 100 }]) {
  const p = await (await b.newContext({ viewport: { width: c.w, height: c.h }, isMobile: c.mobile, hasTouch: c.mobile })).newPage();
  await p.goto('https://solene.framer.ai/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2600);
  await p.evaluate(async () => { for (let y = 0; y < 9000; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(900);
  console.log(`=== ${c.tag} ===`);
  for (let y = c.from; y <= c.to; y += c.step) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await p.waitForTimeout(120);
    const row = await p.evaluate(() => {
      const head = [...document.querySelectorAll('h1,h2,h3')].find(x => (x.textContent || '').trim().startsWith('Small habits'));
      if (!head) return null;
      let panel = head.parentElement;
      while (panel && getComputedStyle(panel).backgroundColor === 'rgba(0, 0, 0, 0)') panel = panel.parentElement;
      if (!panel) return null;
      const pr = panel.getBoundingClientRect();
      const blob = [...panel.querySelectorAll('div')].find(n => getComputedStyle(n).borderRadius.startsWith('100'));
      if (!blob) return { none: true };
      const s = getComputedStyle(blob), r = blob.getBoundingClientRect();
      return { x: Math.round(r.left - pr.left), y: Math.round(r.top - pr.top), w: Math.round(r.width), h: Math.round(r.height), bg: s.backgroundColor, op: s.opacity, tr: s.transform.slice(0, 44), ph: Math.round(pr.height), pt: Math.round(pr.top) };
    });
    if (row) console.log(`  scroll ${String(y).padStart(5)}  ${row.none ? 'no ellipse' : `${String(row.x).padStart(5)},${String(row.y).padStart(4)} ${row.w}x${row.h} ${row.bg} op=${row.op} ${row.tr}`}`);
  }
  await p.context().close();
}
await b.close();
