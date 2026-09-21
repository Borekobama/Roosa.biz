import { chromium } from 'playwright';
/** The home page's first news card, both sides: every element inside it with a
 *  box, whatever its tag. A date line could sit in a <time> or a <div>, which a
 *  heading-and-paragraph sweep would not see. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: Number(process.env.VW ?? 390), height: 900 }, isMobile: !process.env.VW, hasTouch: !process.env.VW })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < 18000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } });
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(700);
  const out = await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const head = [...document.querySelectorAll('h1,h2,h3,h4,h5')].find(x => /Sustained energy and the nutrients/i.test(x.textContent || ''));
    if (!head) return { miss: true };
    // Card = nearest ancestor that also contains the 500-tall image.
    let card = head.parentElement, guard = 0;
    while (card && guard++ < 6 && !card.querySelector('img')) card = card.parentElement;
    if (!card) return { miss: true };
    const c0 = docTop(card);
    const rows = [];
    for (const el of card.querySelectorAll('*')) {
      const h = el.offsetHeight, w = el.offsetWidth;
      if (h < 10 || w < 10) continue;
      const leaf = !el.children.length || ![...el.children].some(c => c.offsetHeight > 4);
      if (!leaf && el.tagName !== 'IMG') continue;
      const s = getComputedStyle(el);
      const txt = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30);
      rows.push(`  +${String(docTop(el) - c0).padStart(4)} ${String(w).padStart(4)}x${String(h).padStart(4)} ${el.tagName.padEnd(5)} ${parseFloat(s.fontSize)}px  "${txt}"`);
    }
    return { c0, h: card.offsetHeight, w: card.offsetWidth, rows: rows.slice(0, 10) };
  });
  console.log(`=== ${tag} ${out.miss ? 'card not found' : `card ${out.w}x${out.h} at ${out.c0}`} ===`);
  (out.rows || []).forEach(r => console.log(r));
  await p.context().close();
}
await b.close();
