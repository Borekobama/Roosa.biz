import { chromium } from 'playwright';
/** The opening statement at desktop: its section box, the text box inside it,
 *  and where the hero above ends. Measured at scroll 0 so nothing is stuck. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: Number(process.env.VW ?? 1440), height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < 6000; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(900);
  const out = await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const h2 = [...document.querySelectorAll('h1,h2,h3')].find(x => (x.textContent || '').includes('One formula'));
    // The hero image above it.
    const hero = [...document.querySelectorAll('img')].filter(i => docTop(i) < 900 && i.offsetHeight > 300).sort((a, c) => docTop(c) - docTop(a))[0];
    // Walk up from the statement to the tall section.
    let sec = h2, guard = 0, tall = null;
    while (sec && guard++ < 8) { if (sec.offsetHeight > 1200) { tall = sec; break; } sec = sec.parentElement; }
    const s = getComputedStyle(h2);
    return {
      hero: hero ? { y: docTop(hero), h: hero.offsetHeight, bottom: docTop(hero) + hero.offsetHeight } : null,
      section: tall ? { y: docTop(tall), h: tall.offsetHeight } : null,
      text: { y: docTop(h2), h: h2.offsetHeight, w: h2.offsetWidth, fs: parseFloat(s.fontSize), lh: Math.round(parseFloat(s.lineHeight) * 10) / 10 },
    };
  });
  console.log(`=== ${tag} ===`);
  console.log(`  hero image ${out.hero ? `${out.hero.y}..${out.hero.bottom} (h ${out.hero.h})` : '-'}`);
  console.log(`  tall section ${out.section ? `y=${out.section.y} h=${out.section.h}` : 'not found'}`);
  console.log(`  statement y=${out.text.y} ${out.text.w}x${out.text.h} ${out.text.fs}/${out.text.lh}` + (out.section ? `  (section+${out.text.y - out.section.y})` : ''));
  await p.context().close();
}
await b.close();
