import { chromium } from 'playwright';
/**
 * Step response of the pinned track, sampled in-page with rAF so the
 * timestamps are real rather than a CDP round trip.
 *
 * Pick a jump that stays inside one leg of the travel. The track holds still
 * through its dwell (progress .403-.597, roughly scrollY 2318 to 2970), so a
 * jump spanning that measures the hold and reads as a stalled animation.
 */
const FROM = Number(process.env.FROM ?? 1200);
const TO = Number(process.env.TO ?? 1600);
const b = await chromium.launch();
for (const [base, tag, pat] of [
  ['https://solene.framer.ai', 'SOURCE', 'HmBptSSqZF2BuLVPrA1rifChmQ'],
  [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ', 'ynjap27ce8p5ymgbOTb5sMmKMGQ|HmBptSSqZF2BuLVPrA1rifChmQ'],
]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  await p.evaluate((v) => window.scrollTo(0, v), FROM);
  await p.waitForTimeout(1600);
  const trace = await p.evaluate(async ({ pat, FROM, TO }) => {
    const re = new RegExp(pat);
    const img = [...document.querySelectorAll('img')]
      .filter(i => re.test(decodeURIComponent(i.currentSrc || i.src || '')) && i.getBoundingClientRect().width > 300)[0];
    if (!img) return null;
    const start = img.getBoundingClientRect().x;
    const samples = [];
    const t0 = performance.now();
    window.scrollTo(0, TO);
    await new Promise((res) => {
      const step = () => {
        const t = performance.now() - t0;
        samples.push([Math.round(t), img.getBoundingClientRect().x]);
        if (t < 900) requestAnimationFrame(step); else res();
      };
      requestAnimationFrame(step);
    });
    const end = samples[samples.length - 1][1];
    const at = [50, 100, 200, 350, 550, 800].map((ms) => {
      const s = samples.reduce((a, c) => (Math.abs(c[0] - ms) < Math.abs(a[0] - ms) ? c : a));
      return `${ms}ms:${(((s[1] - start) / (end - start || 1)) * 100).toFixed(0)}%`;
    });
    return { start: Math.round(start), end: Math.round(end), at: at.join('  ') };
  }, { pat, FROM, TO });
  console.log(`${tag} ${trace ? `${trace.start} -> ${trace.end}   ${trace.at}` : 'not found'}`);
  await p.context().close();
}
await b.close();
