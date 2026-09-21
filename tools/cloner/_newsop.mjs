import { chromium } from 'playwright';
/** Opacity of a heading block against scroll, both sides. Pass a substring. */
const KEY = process.argv[2] ?? 'regenerative';
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
  await p.waitForTimeout(600);
  const top = await p.evaluate((KEY) => {
    const hs = [...document.querySelectorAll('h1,h2,h3')].filter(x => (x.textContent || '').includes(KEY));
    const h = hs[hs.length - 1];
    return h ? Math.round(h.getBoundingClientRect().top + scrollY) : null;
  }, KEY);
  if (top == null) { console.log(tag, 'heading not found'); await p.context().close(); continue; }
  const rows = [];
  for (let d = -700; d <= 300; d += 100) {
    await p.evaluate(v => window.scrollTo(0, Math.max(0, v)), top - 500 + d);
    await p.waitForTimeout(260);
    rows.push(`${d >= 0 ? '+' : ''}${d}:${await p.evaluate((KEY) => {
      const h = [...document.querySelectorAll('h1,h2,h3')].find(x => (x.textContent || '').includes(KEY));
      let n = h, op = 1;
      for (let i = 0; i < 6 && n; i++) { op *= parseFloat(getComputedStyle(n).opacity); n = n.parentElement; }
      return op.toFixed(2);
    }, KEY)}`);
  }
  console.log(`${tag} heading y=${top}  ` + rows.join('  '));
  await p.context().close();
}
await b.close();
