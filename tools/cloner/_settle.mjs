import { chromium } from 'playwright';
/**
 * After a scroll jump, how does the track's x approach its target?
 *
 * A direct mapping lands immediately. A damped follower lags and converges,
 * which is what "weight" and "on rails" feel like. Sampling at one fixed delay
 * cannot tell the two apart — that is why the earlier pass mistook the lag for
 * a probe artifact and retracted a real difference.
 */
const DELAYS = [0, 50, 100, 200, 350, 550, 800, 1200];
const b = await chromium.launch();
for (const [base, tag, pat] of [
  ['https://solene.framer.ai', 'SOURCE', 'HmBptSSqZF2BuLVPrA1rifChmQ'],
  [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ', 'ynjap27ce8p5ymgbOTb5sMmKMGQ|HmBptSSqZF2BuLVPrA1rifChmQ'],
]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  await p.waitForTimeout(600);
  const x = () => p.evaluate((pat) => {
    const re = new RegExp(pat);
    const img = [...document.querySelectorAll('img')]
      .filter(i => re.test(decodeURIComponent(i.currentSrc || i.src || '')) && i.getBoundingClientRect().width > 300)[0];
    return img ? Math.round(img.getBoundingClientRect().x) : null;
  }, pat);
  // settle at 2000, then jump to 3000 and watch it approach
  await p.evaluate(() => window.scrollTo(0, 2000));
  await p.waitForTimeout(1500);
  const from = await x();
  const rows = [];
  for (const d of DELAYS) {
    await p.evaluate(() => window.scrollTo(0, 2000));
    await p.waitForTimeout(1200);
    await p.evaluate(() => window.scrollTo(0, 3000));
    await p.waitForTimeout(d);
    rows.push(`${d}ms:${await x()}`);
  }
  await p.evaluate(() => window.scrollTo(0, 3000));
  await p.waitForTimeout(1500);
  console.log(`${tag} from ${from} -> target ${await x()}   ` + rows.join('  '));
  await p.context().close();
}
await b.close();
