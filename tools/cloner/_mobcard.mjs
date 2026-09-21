import { chromium } from 'playwright';
/** One merch card's children at phone width, both sides. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
  await p.goto(base + '/merch', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2400);
  for (let pass = 0; pass < 2; pass++) {
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
    await p.waitForTimeout(700);
  }
  console.log(`=== ${tag} ===`, await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const imgs = [...document.querySelectorAll('img')].filter(i => i.offsetWidth === 326 && i.offsetHeight === 437);
    if (imgs.length < 2) return 'cards not found';
    const from = docTop(imgs[0]), to = docTop(imgs[1]);
    const rows = [];
    for (const el of document.querySelectorAll('*')) {
      const y = docTop(el);
      if (y < from || y >= to) continue;
      const s = getComputedStyle(el);
      const owns = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      const painted = s.backgroundColor !== 'rgba(0, 0, 0, 0)' && el.offsetHeight > 20;
      if (!owns && !painted && el.tagName !== 'IMG') continue;
      rows.push(`${String(Math.round(y)).padStart(5)} ${el.offsetWidth}x${el.offsetHeight} ${s.fontSize}${owns ? ' "' + el.textContent.trim().replace(/\s+/g, ' ').slice(0, 18) + '"' : painted ? ' bg=' + s.backgroundColor : ' IMG'}`);
    }
    return `pitch ${to - from}\n   ` + [...new Set(rows)].slice(0, 10).join('\n   ');
  }));
  await p.context().close();
}
await b.close();
