import { chromium } from 'playwright';
/** The bento's card boxes at phone, both sides: each card's top, height and
 *  the container's floor, to see where the band actually ends. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < 16000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } });
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(700);
  const out = await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const titles = ['Daily vitamins that support', 'Recovery boost', 'Cognitive clarity', 'Immune strength', 'Energy support'];
    const rows = [];
    for (const t of titles) {
      const h = [...document.querySelectorAll('h1,h2,h3,h4,h5')].find(x => (x.textContent || '').trim().startsWith(t));
      if (!h) continue;
      // The card is the nearest ancestor about 358 wide with a radius.
      let c = h.parentElement, guard = 0, card = null;
      while (c && guard++ < 6) {
        const s = getComputedStyle(c);
        if (Math.abs(c.offsetWidth - 358) < 4 && parseFloat(s.borderRadius) > 4) { card = c; break; }
        c = c.parentElement;
      }
      rows.push({ t: t.slice(0, 18), y: card ? docTop(card) : docTop(h), h: card ? card.offsetHeight : null, r: card ? getComputedStyle(card).borderRadius.split(' ')[0] : '-' });
    }
    return rows;
  });
  console.log(`=== ${tag} ===`);
  let prev = null;
  for (const r of out) { console.log(`  ${r.t.padEnd(20)} card y=${r.y} h=${r.h} r=${r.r}${prev !== null ? `  pitch ${r.y - prev}` : ''}  bottom ${r.y + (r.h || 0)}`); prev = r.y; }
  await p.context().close();
}
await b.close();
