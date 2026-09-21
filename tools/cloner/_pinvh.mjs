import { chromium } from 'playwright';
/** Pinned sticky and panel geometry at two viewport heights, both sides. */
const b = await chromium.launch();
for (const [w, h] of [[1440, 900], [1440, 1100]]) {
  for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
    await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
    await p.waitForTimeout(2400);
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
    await p.waitForTimeout(500);
    console.log(`${w}x${h} ${tag}`, await p.evaluate(() => {
      // the clone has a second sticky earlier in the DOM (the fading statement),
      // so pick the one whose scroll container is tallest — the pinned track
      const sticky = [...document.querySelectorAll('*')].filter(el => {
        const s = getComputedStyle(el);
        return s.position === 'sticky' && el.getBoundingClientRect().height > 400;
      }).sort((a, c) => c.parentElement.getBoundingClientRect().height - a.parentElement.getBoundingClientRect().height)[0];
      if (!sticky) return 'no sticky';
      const sr = sticky.getBoundingClientRect(); const ss = getComputedStyle(sticky);
      const panel = [...sticky.querySelectorAll('img')].map(i => i.getBoundingClientRect())
        .filter(r => r.width > 900)[0];
      const container = sticky.parentElement.getBoundingClientRect();
      return `sticky ${Math.round(sr.width)}x${Math.round(sr.height)} maxH=${ss.maxHeight} pad=${ss.padding} | panel ${panel ? Math.round(panel.width) + 'x' + Math.round(panel.height) : '-'} | container h=${Math.round(container.height)}`;
    }));
    await p.context().close();
  }
}
await b.close();
