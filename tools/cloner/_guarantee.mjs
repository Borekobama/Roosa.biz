import { chromium } from 'playwright';
/** The offer panel's guarantee line and anything after it, both sides. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: Number(process.env.VW ?? 1440), height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < 18000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } });
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(700);
  const out = await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    // Smallest element that still carries the whole line: a loose match walks
    // up to the page body, whose textContent also contains it.
    const g = [...document.querySelectorAll('p,div,span')]
      .filter(x => /risk-free guarantee/i.test(x.textContent || '') && x.offsetHeight > 10 && x.offsetHeight < 90 && x.offsetWidth < 700)
      .sort((a, c) => (a.offsetWidth * a.offsetHeight) - (c.offsetWidth * c.offsetHeight))[0];
    if (!g) return { miss: true };
    const s = getComputedStyle(g);
    const after = [...document.querySelectorAll('img,svg')].map(e => {
      const r = e.getBoundingClientRect();
      return { y: e.tagName === 'svg' ? r.top + window.scrollY : docTop(e), w: Math.round(r.width), h: Math.round(r.height), t: e.tagName };
    }).filter(o => o.y > docTop(g) && o.y < docTop(g) + 260 && o.w > 20).sort((a, c) => a.y - c.y).slice(0, 4);
    return {
      y: docTop(g), w: g.offsetWidth, h: g.offsetHeight, fs: parseFloat(s.fontSize),
      lh: Math.round(parseFloat(s.lineHeight) * 10) / 10, pad: s.padding, bg: s.backgroundColor,
      text: (g.textContent || '').trim().replace(/\s+/g, ' '),
      after,
    };
  });
  console.log(`=== ${tag} ===`);
  if (out.miss) { console.log('  not found'); continue; }
  console.log(`  y=${out.y} ${out.w}x${out.h} ${out.fs}/${out.lh} pad=${out.pad} bg=${out.bg}`);
  console.log(`  "${out.text}"`);
  out.after.forEach(a => console.log(`    then ${a.t} ${a.w}x${a.h} at ${a.y} (+${a.y - out.y})`));
  await p.context().close();
}
await b.close();
