import { chromium } from 'playwright';
/** Does the comparison table's last row clear the band below it? */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
  await p.goto(base + '/science', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let y = 0; y < 12000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(600);
  const out = await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const last = [...document.querySelectorAll('*')].find(x => /^Broad lifestyle/i.test((x.textContent || '').trim()) && x.offsetHeight > 10);
    const plate = [...document.querySelectorAll('img')].find(i => Math.abs(i.offsetWidth - 390) < 3 && i.offsetHeight > 800);
    if (!last || !plate) return { miss: true };
    const lr = last.getBoundingClientRect();
    return {
      textTop: Math.round(docTop(last)), textH: Math.round(lr.height),
      textBottom: Math.round(docTop(last) + lr.height),
      plateTop: Math.round(docTop(plate)),
    };
  });
  if (out.miss) { console.log(`${tag} not found`); continue; }
  console.log(`${tag}  last label ${out.textTop}..${out.textBottom} (h ${out.textH})   plate top ${out.plateTop}   clearance ${out.plateTop - out.textBottom}`);
  await p.context().close();
}
await b.close();
