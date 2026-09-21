import { chromium } from 'playwright';
/** The principle cards on /science at phone width, both sides. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
  await p.goto(base + '/science', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2400);
  for (let pass = 0; pass < 2; pass++) {
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
    await p.waitForTimeout(700);
  }
  console.log(`=== ${tag} ===`, await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const pick = (k) => [...document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span,div,li')]
      .filter(x => [...x.childNodes].some(n => n.nodeType === 3 && n.textContent.includes(k)))
      .filter(x => x.offsetWidth > 0 && !x.closest('footer'))
      .sort((a, c) => docTop(a) - docTop(c))[0];
    const a = pick('Rooted in science'), z = pick('Inside each');
    if (!a || !z) return 'anchors missing';
    const from = docTop(a), to = docTop(z);
    const rows = [];
    for (const el of document.querySelectorAll('*')) {
      const y = docTop(el);
      if (y < from || y > to) continue;
      const s = getComputedStyle(el);
      const painted = s.backgroundColor !== 'rgba(0, 0, 0, 0)' && el.offsetHeight > 60;
      const owns = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      if (!painted && !owns) continue;
      rows.push(`${String(Math.round(y)).padStart(5)} ${el.offsetWidth}x${el.offsetHeight} ${s.fontSize}${painted ? ' pad=' + s.padding + ' rad=' + s.borderRadius : ''}${owns ? ' "' + el.textContent.trim().replace(/\s+/g, ' ').slice(0, 20) + '"' : ''}`);
    }
    return `span ${to - from}\n   ` + [...new Set(rows)].slice(0, 12).join('\n   ');
  }));
  await p.context().close();
}
await b.close();
