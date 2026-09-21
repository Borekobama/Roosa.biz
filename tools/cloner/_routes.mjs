import { chromium } from 'playwright';
/** Document height per route on both sides — a cheap first signal for layout
 *  drift outside the home page. */
const ROUTES = ['/', '/science', '/merch', '/blog', '/privacy-policy', '/cookies-policy'];
const b = await chromium.launch();
const res = {};
for (const [base, tag] of [['https://solene.framer.ai', 'src'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'cln']]) {
  const VW = Number(process.env.VW ?? 1440);
  const VH = Number(process.env.VH ?? 900);
  const ctx = await b.newContext({ viewport: { width: VW, height: VH }, isMobile: VW < 700, hasTouch: VW < 700 });
  res[tag] = {};
  for (const r of ROUTES) {
    const p = await ctx.newPage();
    try {
      await p.goto(base + r, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await p.waitForTimeout(2200);
      // Sweep twice: lazy content expands the document as it mounts, so a
      // single fast pass reports a height that is still growing. The source's
      // home page reads 14443 on one pass and 14583 on a thorough one.
      for (let pass = 0; pass < 2; pass++) {
        await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); } });
        await p.waitForTimeout(900);
      }
      res[tag][r] = await p.evaluate(() => document.documentElement.scrollHeight);
    } catch { res[tag][r] = null; }
    await p.close();
  }
  await ctx.close();
}
console.log('route'.padEnd(18), 'src'.padStart(7), 'cln'.padStart(7), 'delta'.padStart(7));
for (const r of ROUTES) {
  const s = res.src[r], c = res.cln[r];
  const d = s != null && c != null ? c - s : null;
  console.log(r.padEnd(18), String(s ?? '-').padStart(7), String(c ?? '-').padStart(7),
    String(d ?? '-').padStart(7), d != null && Math.abs(d) > 40 ? ' <<<' : '');
}
await b.close();
