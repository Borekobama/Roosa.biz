import { chromium } from 'playwright';
import fs from 'node:fs';
/** Capture both sides around the SOL-G7 panel with 120px of margin above and
 *  below, so the foliage bleed outside the rounded panel is visible. */
const dir = process.env.OUT ?? 'docs/research/_compare/bleed';
fs.mkdirSync(dir, { recursive: true });
const b = await chromium.launch();
for (const [base, label] of [['https://solene.framer.ai', 'src'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'cln']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 1100 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  const top = await p.evaluate(() => {
    const e = [...document.querySelectorAll('*')].filter(x => x.children.length === 0 && /SOL-G7/.test(x.textContent || ''))[0];
    let n = e; for (let i = 0; i < 9 && n; i++) { const r = n.getBoundingClientRect(); if (r.width > 1300 && r.height > 600) break; n = n.parentElement; }
    return Math.round(n.getBoundingClientRect().top + window.scrollY);
  });
  await p.evaluate(v => window.scrollTo(0, v - 140), top);
  await p.waitForTimeout(900);
  fs.writeFileSync(`${dir}/${label}.png`, await p.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 1090 } }));
  await p.context().close();
}
await b.close();
console.log('wrote', dir);
