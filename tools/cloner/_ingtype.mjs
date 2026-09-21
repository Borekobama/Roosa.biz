import { chromium } from 'playwright';
/** The stacked ingredient rows at three widths, both sides: row type, row box
 *  and the pitch between rows. */
const b = await chromium.launch();
for (const [w, tag] of [[390, 'PHONE  '], [768, 'TABLET '], [1440, 'DESKTOP']]) {
  for (const [base, side] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
    const p = await (await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 720, hasTouch: w < 720 })).newPage();
    await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await p.waitForTimeout(2400);
    await p.evaluate(async () => { for (let y = 0; y < 16000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } });
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(700);
    const out = await p.evaluate(() => {
      const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
      const names = ['Vitamins', 'Probiotics', 'Antioxidants', 'Guarana extract', 'Passionfruit powder'];
      const rows = [];
      for (const n of names) {
        const el = [...document.querySelectorAll('h1,h2,h3,li,p,span,div')].find(x => (x.textContent || '').trim() === n && x.offsetHeight > 10);
        if (!el) continue;
        const s = getComputedStyle(el);
        rows.push({ n, y: Math.round(docTop(el)), h: el.offsetHeight, fs: parseFloat(s.fontSize), lh: Math.round(parseFloat(s.lineHeight) * 10) / 10, ls: parseFloat(s.letterSpacing) || 0, fam: s.fontFamily.split(',')[0].replace(/"/g, '').slice(0, 9) });
      }
      return rows;
    });
    const pitches = out.slice(1).map((r, i) => r.y - out[i].y);
    console.log(`${tag} ${side}  ${out.length ? `${out[0].fs}/${out[0].lh} ls=${out[0].ls} ${out[0].fam}  h=${out[0].h}  pitch ${pitches.join(',')}` : 'not found'}`);
    await p.context().close();
  }
}
await b.close();
