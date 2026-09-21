import { chromium } from 'playwright';
/** Pill geometry and paint, with text colour, on a given route. */
const route = process.argv[2] ?? '/';
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 450) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  await p.waitForTimeout(500);
  const rows = await p.evaluate(() => [...document.querySelectorAll('a,button')].map(el => {
    const s = getComputedStyle(el); const r = el.getBoundingClientRect();
    if (!(parseFloat(s.borderRadius) > 15 && r.height > 20 && r.width > 40)) return null;
    return `${(el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 20).padEnd(22)} ${Math.round(r.width)}x${Math.round(r.height)} rad=${s.borderRadius} pad=${s.paddingTop}/${s.paddingRight} fs=${s.fontSize}/${s.lineHeight} fw=${s.fontWeight} ls=${s.letterSpacing} bg=${s.backgroundColor} col=${s.color}`;
  }).filter(Boolean));
  console.log('=== ' + tag + ' ' + route + ' ==='); [...new Set(rows)].forEach(r => console.log('  ' + r));
  await p.context().close();
}
await b.close();
