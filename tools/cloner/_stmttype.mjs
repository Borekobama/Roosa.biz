import { chromium } from 'playwright';
/** Type and colour of the statement panel's headline and note, both widths,
 *  both sides — anchored on the text itself so no ancestor walk can miss. */
const b = await chromium.launch();
for (const c of [{ w: 1440, h: 900, mobile: false, tag: 'DESKTOP', y: 2500 }, { w: 390, h: 844, mobile: true, tag: 'PHONE  ', y: 2200 }]) {
  for (const [base, side] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
    const p = await (await b.newContext({ viewport: { width: c.w, height: c.h }, isMobile: c.mobile, hasTouch: c.mobile })).newPage();
    await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await p.waitForTimeout(2500);
    await p.evaluate(async () => { for (let y = 0; y < 9000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
    await p.evaluate((v) => window.scrollTo(0, v), c.y);
    await p.waitForTimeout(700);
    const out = await p.evaluate(() => {
      const pick = (frag) => [...document.querySelectorAll('h1,h2,h3,p')].find(x => (x.textContent || '').trim().startsWith(frag));
      const desc = (el) => {
        if (!el) return 'not found';
        const s = getComputedStyle(el), r = el.getBoundingClientRect();
        return `${el.tagName} ${Math.round(r.width)}x${Math.round(r.height)} ${s.fontSize}/${s.lineHeight} w=${s.fontWeight} ls=${s.letterSpacing} ${s.color} align=${s.textAlign} fam=${s.fontFamily.split(',')[0]}`;
      };
      return { head: desc(pick('Small habits')), note: desc(pick('Because with Solene')) };
    });
    console.log(`${c.tag} ${side}  head: ${out.head}`);
    console.log(`${c.tag} ${side}  note: ${out.note}`);
    await p.context().close();
  }
}
await b.close();
