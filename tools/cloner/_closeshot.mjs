import { chromium } from 'playwright';
import fs from 'node:fs';
/** Both sides with the closing plate's top at the viewport top. */
const dir = 'docs/research/_compare/closing';
fs.mkdirSync(dir, { recursive: true });
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'src'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'cln']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 820 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  const top = await p.evaluate(() => {
    const o = [...document.querySelectorAll('img')].map(i => i.getBoundingClientRect())
      // the hero is also 1376 wide but 830 tall; the closing plate is 766
      .filter(r => Math.round(r.width) === 1376 && Math.abs(r.height - 766) < 12).pop();
    return Math.round(o.top + scrollY);
  });
  await p.evaluate(v => window.scrollTo(0, v), top);
  await p.waitForTimeout(900);
  fs.writeFileSync(`${dir}/${tag}.png`, await p.screenshot());
  await p.context().close();
}
await b.close();
console.log('wrote', dir);
