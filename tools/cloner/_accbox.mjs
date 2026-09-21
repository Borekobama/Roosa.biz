import { chromium } from 'playwright';
/** The FAQ accordion container and its first row, both sides: where the
 *  container starts relative to the column's other content, and how the first
 *  trigger sits inside it. */
const ROUTE = process.env.ROUTE ?? '/science';
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: Number(process.env.VW ?? 1440), height: 900 } })).newPage();
  await p.goto(base + ROUTE, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let y = 0; y < 14000; y += 380) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(600);
  const out = await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const first = [...document.querySelectorAll('h3,h4,h5,button,span,p,div')]
      .filter(x => (x.textContent || '').trim().startsWith('How should I take Solene daily') && x.offsetHeight > 10)
      .sort((a, c) => a.offsetHeight - c.offsetHeight)[0];
    if (!first) return { miss: true };
    // Walk up until the element holds every question.
    let box = first, guard = 0;
    while (box && guard++ < 8 && !/Are the ingredients natural/i.test(box.textContent || '')) box = box.parentElement;
    const bs = box ? getComputedStyle(box) : null;
    const eye = [...document.querySelectorAll('p,div,span')].filter(x => (x.textContent || '').trim() === 'FAQ' && x.offsetHeight > 8).map(x => Math.round(docTop(x)))[0];
    return {
      eye,
      first: Math.round(docTop(first)),
      box: box ? { y: Math.round(docTop(box)), h: box.offsetHeight, w: box.offsetWidth, bt: bs.borderTopWidth, pt: bs.paddingTop, mt: bs.marginTop } : null,
    };
  });
  if (out.miss) { console.log(`${tag}  first question not found`); continue; }
  console.log(`${tag}  eyebrow ${out.eye}  container ${out.box ? `y=${out.box.y} ${out.box.w}x${out.box.h} border-top=${out.box.bt} padding-top=${out.box.pt} margin-top=${out.box.mt}` : '-'}  first trigger ${out.first} (container+${out.first - (out.box ? out.box.y : 0)})`);
  await p.context().close();
}
await b.close();
