import { chromium } from 'playwright';
/** Type of the benefits band's lede and card body at phone and desktop, both
 *  sides. The source's home page carries a 12/14.4 role at 390 that this clone
 *  uses nowhere, and these are the blocks measuring tallest against it. */
const b = await chromium.launch();
for (const [w, tag] of [[390, 'PHONE  '], [768, 'TABLET '], [1440, 'DESKTOP']]) {
  for (const [base, side] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
    const p = await (await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 720, hasTouch: w < 720 })).newPage();
    await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await p.waitForTimeout(2400);
    await p.evaluate(async () => { for (let y = 0; y < 16000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 45)); } });
    await p.waitForTimeout(800);
    const out = await p.evaluate(() => {
      const d = (frag) => {
        const el = [...document.querySelectorAll('p,h3,h4,h5')].find(x => (x.textContent || '').trim().startsWith(frag));
        if (!el) return '  not found';
        const s = getComputedStyle(el), r = el.getBoundingClientRect();
        return `${String(parseFloat(s.fontSize)).padStart(4)}/${String(Math.round(parseFloat(s.lineHeight) * 10) / 10).padStart(5)} ls=${String(parseFloat(s.letterSpacing) || 0).padStart(5)} box ${Math.round(r.width)}x${Math.round(r.height)}`;
      };
      return {
        lede: d('For best results'),
        card: d('Nutrients assist muscle'),
        title: d('Recovery boost'),
      };
    });
    console.log(`${tag} ${side}  lede ${out.lede}`);
    console.log(`${tag} ${side}  card ${out.card}`);
    await p.context().close();
  }
}
await b.close();
