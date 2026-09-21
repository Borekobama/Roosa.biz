import { chromium } from 'playwright';
/**
 * How the statement overlap behaves as viewport height changes.
 *
 * Width is held at 1440 so only height varies. If the source's overlap is a
 * fixed pixel amount and this clone scales it with vh, the gap between the
 * pinned container's end and the benefits heading will track at 900 and drift
 * everywhere else.
 */
const b = await chromium.launch();
for (const h of [900, 982, 1100]) {
  const row = {};
  for (const [base, tag] of [['https://solene.framer.ai', 'src'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'cln']]) {
    const p = await (await b.newContext({ viewport: { width: 1440, height: h } })).newPage();
    await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await p.waitForTimeout(2400);
    for (let pass = 0; pass < 2; pass++) {
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 65)); } });
      await p.waitForTimeout(700);
    }
    row[tag] = await p.evaluate(() => {
      const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
      const head = [...document.querySelectorAll('h1,h2,h3')].find(x => (x.textContent || '').includes('Real clarity begins'));
      const sticky = [...document.querySelectorAll('*')].filter(el => {
        const s = getComputedStyle(el);
        return s.position === 'sticky' && el.getBoundingClientRect().height > 400;
      }).sort((a, c) => c.parentElement.getBoundingClientRect().height - a.parentElement.getBoundingClientRect().height)[0];
      const cont = sticky ? sticky.parentElement : null;
      return {
        trackTop: cont ? Math.round(docTop(cont)) : null,
        trackH: cont ? Math.round(cont.getBoundingClientRect().height) : null,
        benefits: head ? Math.round(docTop(head)) : null,
      };
    });
    await p.context().close();
  }
  const s = row.src, c = row.cln;
  const gap = (r) => (r.trackTop != null && r.benefits != null ? r.benefits - (r.trackTop + r.trackH) : null);
  console.log(`1440x${h}  trackEnd ${s.trackTop + s.trackH}/${c.trackTop + c.trackH}   benefits ${s.benefits}/${c.benefits} (${c.benefits - s.benefits})   endToHeading ${gap(s)}/${gap(c)} (${gap(c) - gap(s)})`);
}
await b.close();
