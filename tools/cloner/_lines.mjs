import { chromium } from 'playwright';
/** Line boxes of a heading, so wrapping can be compared rather than eyeballed. */
const KEY = process.argv[2] ?? 'One formula';
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
  await p.waitForTimeout(700);
  console.log('=== ' + tag + ' ===', await p.evaluate((KEY) => {
    const el = [...document.querySelectorAll('h1,h2,h3,p')]
      .filter(x => (x.textContent || '').includes(KEY))
      .sort((a, c) => a.getBoundingClientRect().width - c.getBoundingClientRect().width)[0];
    if (!el) return 'not found';
    const s = getComputedStyle(el); const r = el.getBoundingClientRect();
    // walk the text nodes and break them into visual lines by rect top
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const lines = new Map();
    let n;
    while ((n = walker.nextNode())) {
      const txt = n.textContent;
      for (let i = 0; i < txt.length; i++) {
        const rg = document.createRange();
        rg.setStart(n, i); rg.setEnd(n, i + 1);
        const rr = rg.getBoundingClientRect();
        if (!rr.width && !rr.height) continue;
        const key = Math.round(rr.top);
        if (!lines.has(key)) lines.set(key, '');
        lines.set(key, lines.get(key) + txt[i]);
      }
    }
    const out = [...lines.entries()].sort((a, c) => a[0] - c[0])
      .map(([y, t]) => `\n    ${String(y).padStart(5)}: "${t}"`).join('');
    return `box ${Math.round(r.width)}x${Math.round(r.height)} ${s.fontSize}/${s.lineHeight} maxw=${s.maxWidth}${out}`;
  }, KEY));
  await p.context().close();
}
await b.close();
