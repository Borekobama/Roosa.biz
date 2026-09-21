import { chromium } from 'playwright';
/** The stats row at phone width, both sides: the rule above it if any, and
 *  each stat's value, label and body with the gaps between them. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: Number(process.env.VW ?? 390), height: 844 }, isMobile: (process.env.VW ?? '390') < '720', hasTouch: true })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < 16000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } });
  await p.waitForTimeout(800);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(600);
  const out = await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const first = [...document.querySelectorAll('p,span,div,h3')].find(x => (x.textContent || '').trim() === '72%');
    if (!first) return { miss: true };
    const y0 = docTop(first);
    // Walk up for the row container, then list its own borders.
    let box = first, rules = [];
    for (let i = 0; i < 6 && box.parentElement; i++) {
      box = box.parentElement;
      const s = getComputedStyle(box);
      if (parseFloat(s.borderTopWidth) > 0) rules.push(`border-top ${s.borderTopWidth} ${s.borderTopColor} at ${docTop(box)} (width ${box.offsetWidth})`);
      if (parseFloat(s.paddingTop) > 0) rules.push(`padding-top ${s.paddingTop} on a ${box.offsetWidth}x${box.offsetHeight} box at ${docTop(box)}`);
    }
    // The bento's last card image, to anchor what comes before.
    const img = [...document.querySelectorAll('img')].find(i => Math.abs(i.offsetWidth - 336) < 6 && Math.abs(i.offsetHeight - 262) < 6);
    const rows = [];
    for (const t of ['72%', '52%', '45%']) {
      const v = [...document.querySelectorAll('p,span,div,h3')].find(x => (x.textContent || '').trim() === t);
      if (!v) continue;
      rows.push({ t, y: docTop(v), h: v.offsetHeight });
    }
    return {
      imgBottom: img ? docTop(img) + img.offsetHeight : null,
      y0, rules, rows,
    };
  });
  console.log(`=== ${tag} ===`);
  console.log(`  bento last image bottom: ${out.imgBottom}   first stat value at ${out.y0}  (gap ${out.y0 - out.imgBottom})`);
  out.rules.forEach(r => console.log('   ' + r));
  let prev = null;
  for (const r of out.rows) { console.log(`   ${r.t} at ${r.y} h=${r.h}${prev ? `  pitch ${r.y - prev}` : ''}`); prev = r.y; }
  await p.context().close();
}
await b.close();
