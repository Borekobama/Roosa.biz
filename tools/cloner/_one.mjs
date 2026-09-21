import { chromium } from 'playwright';
/** One element's box and type at a given viewport, both sides. */
const KEY = process.argv[2] ?? 'should never feel complicated';
const VW = Number(process.env.VW ?? 390);
const VH = Number(process.env.VH ?? 844);
const route = process.env.ROUTE ?? '/';
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: VW, height: VH }, isMobile: VW < 700, hasTouch: VW < 700 })).newPage();
  await p.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2400);
  for (let pass = 0; pass < 2; pass++) {
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
    await p.waitForTimeout(600);
  }
  console.log(`${tag}`, await p.evaluate((KEY) => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const el = [...document.querySelectorAll('*')]
      .filter(x => [...x.childNodes].some(n => n.nodeType === 3 && n.textContent.includes(KEY)))
      .filter(x => x.offsetWidth > 0 && !x.closest('footer'))[0];
    if (!el) return 'not found';
    const s = getComputedStyle(el);
    return `docY ${Math.round(docTop(el))} ${el.offsetWidth}x${el.offsetHeight} ${s.fontSize}/${s.lineHeight} maxw=${s.maxWidth}`;
  }, KEY));
  await p.context().close();
}
await b.close();
