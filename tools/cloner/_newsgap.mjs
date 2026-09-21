import { chromium } from 'playwright';
/** Distance from the last news card's floor to the closing heading, and from
 *  the offer panel to the news heading, both sides at both widths. */
const b = await chromium.launch();
for (const w of [390, 1440]) {
  for (const [base, side] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
    const p = await (await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 720, hasTouch: w < 720 })).newPage();
    await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await p.waitForTimeout(2500);
    await p.evaluate(async () => { for (let y = 0; y < 18000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } });
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(700);
    const out = await p.evaluate(() => {
      const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
      // News cards: images exactly 500 tall.
      const cards = [...document.querySelectorAll('img')].filter(i => Math.abs(i.offsetHeight - 500) < 3).map(i => docTop(i) + i.offsetHeight);
      const floor = cards.length ? Math.max(...cards) : null;
      const closing = [...document.querySelectorAll('h1,h2')].map(x => ({ x, y: docTop(x) }))
        .filter(o => /Daily well-being requires/i.test(o.x.textContent || '')).sort((a, c) => c.y - a.y)[0];
      const newsHead = [...document.querySelectorAll('h1,h2')].find(x => /latest regenerative/i.test(x.textContent || ''));
      return { floor, closing: closing ? closing.y : null, newsHead: newsHead ? docTop(newsHead) : null };
    });
    console.log(`${String(w).padStart(5)} ${side}  news heading ${out.newsHead}  card floor ${out.floor}  closing ${out.closing}  gap ${out.closing - out.floor}`);
    await p.context().close();
  }
}
await b.close();
