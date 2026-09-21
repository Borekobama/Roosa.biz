import { chromium } from 'playwright';
import fs from 'node:fs';
/** Both sides at the scroll offset where the first pinned panel is flush. */
const dir = 'docs/research/_compare/pinned';
fs.mkdirSync(dir, { recursive: true });
const b = await chromium.launch();
for (const [base, tag, pat] of [
  ['https://solene.framer.ai', 'src', 'HmBptSSqZF2BuLVPrA1rifChmQ'],
  [process.env.CLONE_BASE ?? 'http://localhost:3111', 'cln', 'ynjap27ce8p5ymgbOTb5sMmKMGQ|HmBptSSqZF2BuLVPrA1rifChmQ'],
]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 450) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  let best = null;
  for (let y = 1200; y < 2600; y += 40) {
    await p.evaluate(v => window.scrollTo(0, v), y);
    await p.waitForTimeout(60);
    const x = await p.evaluate((pat) => {
      const re = new RegExp(pat);
      const img = [...document.querySelectorAll('img')]
        .filter(i => re.test(decodeURIComponent(i.currentSrc || i.src || '')) && i.getBoundingClientRect().width > 300)[0];
      return img ? img.getBoundingClientRect().x : null;
    }, pat);
    if (x != null && (best === null || Math.abs(x) < Math.abs(best.x))) best = { x, y };
  }
  await p.evaluate(v => window.scrollTo(0, v), best.y);
  await p.waitForTimeout(700);
  console.log(`${tag} flush at y=${best.y} x=${Math.round(best.x)}`);
  fs.writeFileSync(`${dir}/${tag}.png`, await p.screenshot());
  await p.context().close();
}
await b.close();
console.log('wrote', dir);
