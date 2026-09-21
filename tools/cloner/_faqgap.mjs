import { chromium } from 'playwright';
/** Around the FAQ block on a route, both sides: the accordion container's box
 *  and the space above and below it. */
const ROUTE = process.env.ROUTE ?? '/';
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: Number(process.env.VW ?? 1440), height: 900 } })).newPage();
  await p.goto(base + ROUTE, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let y = 0; y < 16000; y += 380) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 48)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(600);
  const out = await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const first = [...document.querySelectorAll('h3,h4,h5,button,span,p,div')]
      .filter(x => (x.textContent || '').trim().startsWith('How should I take Solene daily') && x.offsetHeight > 10)
      .sort((a, c) => a.offsetHeight - c.offsetHeight)[0];
    let box = first, guard = 0;
    while (box && guard++ < 8 && !/Are the ingredients natural/i.test(box.textContent || '')) box = box.parentElement;
    const lede = [...document.querySelectorAll('p')].find(x => /simple, honest answers/i.test(x.textContent || ''));
    const next = [...document.querySelectorAll('h1,h2')].find(x => /latest regenerative|Daily well-being requires/i.test(x.textContent || '') && docTop(x) > docTop(box));
    return {
      box: box ? { y: Math.round(docTop(box)), h: box.offsetHeight, bottom: Math.round(docTop(box) + box.offsetHeight) } : null,
      lede: lede ? { y: Math.round(docTop(lede)), h: lede.offsetHeight, bottom: Math.round(docTop(lede) + lede.offsetHeight) } : null,
      next: next ? { y: Math.round(docTop(next)), t: (next.textContent || '').trim().slice(0, 26) } : null,
    };
  });
  const b2 = out.box, n = out.next;
  console.log(`${tag}  accordion ${b2.y}..${b2.bottom} (h ${b2.h})   lede ends ${out.lede ? out.lede.bottom : '-'}   next "${n ? n.t : '-'}" at ${n ? n.y : '-'}   gap below ${n && b2 ? n.y - b2.bottom : '-'}`);
  await p.context().close();
}
await b.close();
