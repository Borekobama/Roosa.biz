import { chromium } from 'playwright';
/** Body type on a legal page at phone width, both sides. */
const route = process.argv[2] ?? '/privacy-policy';
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
  await p.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
  await p.waitForTimeout(700);
  console.log(`=== ${tag} ===`, await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const rows = [];
    for (const el of document.querySelectorAll('h1,h2,h3,p')) {
      if (el.closest('footer')) continue;
      const t = (el.textContent || '').trim();
      if (!t || el.offsetWidth === 0) continue;
      const s = getComputedStyle(el);
      rows.push(`${String(Math.round(docTop(el))).padStart(5)} ${el.tagName} ${el.offsetWidth}x${el.offsetHeight} ${s.fontSize}/${s.lineHeight} "${t.slice(0, 22)}"`);
    }
    return rows.slice(0, 8).join('\n   ');
  }));
  await p.context().close();
}
await b.close();
