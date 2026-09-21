import { chromium } from 'playwright';
/** The /science band at desktop, both sides: plate box, panel box and the gap
 *  from the plate's floor to the FAQ heading. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/science', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let y = 0; y < 12000; y += 380) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(600);
  const out = await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const head = [...document.querySelectorAll('h2')].find(x => /outperforms other probiotics/i.test(x.textContent || ''));
    const faq = [...document.querySelectorAll('h2')].find(x => /Frequently\s*asked questions/i.test(x.textContent || ''));
    const imgs = [...document.querySelectorAll('img')].map(i => ({ y: docTop(i), w: i.offsetWidth, h: i.offsetHeight }))
      .filter(o => o.h > 500 && o.w > 900 && head && o.y > docTop(head) - 700 && o.y < docTop(head) + 400)
      .sort((a, c) => a.y - c.y);
    return {
      head: head ? Math.round(docTop(head)) : null,
      faq: faq ? Math.round(docTop(faq)) : null,
      imgs: imgs.map(o => `${o.w}x${o.h}@${Math.round(o.y)} bottom ${Math.round(o.y + o.h)}`),
    };
  });
  const last = out.imgs.length ? out.imgs[0] : null;
  console.log(`=== ${tag} ===`);
  console.log(`  heading ${out.head}  FAQ ${out.faq}  span ${out.faq - out.head}`);
  out.imgs.forEach(i => console.log(`  plate ${i}`));
  await p.context().close();
}
await b.close();
