import { chromium } from 'playwright';
/** The eyebrow-to-heading distance at both widths, via the offsetTop chain: a
 *  reveal leaves the source's eyebrow transform-shifted at scroll 0, so a
 *  rect reading of it is not its settled position. */
const b = await chromium.launch();
for (const [w, tag] of [[390, 'PHONE  '], [1440, 'DESKTOP']]) {
  for (const [base, side] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
    const p = await (await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 720, hasTouch: w < 720 })).newPage();
    await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await p.waitForTimeout(2400);
    await p.evaluate(async () => { for (let y = 0; y < 16000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 45)); } });
    await p.waitForTimeout(800);
    const out = await p.evaluate(() => {
      const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
      const head = [...document.querySelectorAll('h1,h2,h3')].find(x => (x.textContent || '').trim().startsWith('Real clarity begins'));
      if (!head) return { miss: true };
      // The eyebrow is the nearest preceding element whose text is just "Benefits".
      const all = [...document.querySelectorAll('p,div,span')].filter(e => (e.textContent || '').trim() === 'Benefits' && e.offsetHeight > 4);
      const hy = docTop(head);
      const eb = all.map(e => ({ e, y: docTop(e) })).filter(o => o.y < hy && hy - o.y < 400).sort((a, c) => c.y - a.y)[0];
      return {
        head: hy, headH: head.offsetHeight,
        eye: eb ? eb.y : null, eyeH: eb ? eb.e.offsetHeight : null,
        gap: eb ? hy - (eb.y + eb.e.offsetHeight) : null,
      };
    });
    console.log(`${tag} ${side}  eyebrow y=${String(out.eye).padStart(5)} h=${out.eyeH}   heading y=${String(out.head).padStart(5)} h=${out.headH}   gap=${out.gap}`);
    await p.context().close();
  }
}
await b.close();
