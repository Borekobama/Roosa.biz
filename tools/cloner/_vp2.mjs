import { chromium } from 'playwright';
/**
 * Home-page parity at a second viewport size.
 *
 * The hero and the pinned track are sized from the viewport now, so agreeing
 * at 1440x900 no longer implies agreeing anywhere else — this is the failure
 * mode that change introduced.
 */
const SIZES = [[1440, 900], [1512, 982], [1680, 1050]];
const b = await chromium.launch();
for (const [w, h] of SIZES) {
  const res = {};
  for (const [base, tag] of [['https://solene.framer.ai', 'src'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'cln']]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
    await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
    await p.waitForTimeout(2400);
    for (let pass = 0; pass < 2; pass++) {
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 65)); } });
      await p.waitForTimeout(800);
    }
    res[tag] = await p.evaluate(() => {
      const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
      const byImg = (pred) => { const i = [...document.querySelectorAll('img')].filter(pred).sort((a, c) => docTop(a) - docTop(c))[0]; return i ? Math.round(docTop(i)) : null; };
      // these elements scale with the viewport width, so fixed pixel sizes
      // stop matching on any screen that is not 1440 wide
      const vw = window.innerWidth;
      const near = (a, bb, tol) => Math.abs(a - bb) <= tol;
      return {
        height: document.documentElement.scrollHeight,
        plate: byImg(i => near(i.offsetWidth, vw, 8) && near(i.offsetHeight / i.offsetWidth, 931 / 1440, 0.04)),
        closing: byImg(i => near(i.offsetWidth, vw - 64, 10) && near(i.offsetHeight / i.offsetWidth, 766 / 1376, 0.03)),
        hero: byImg(i => near(i.offsetWidth, vw - 64, 10) && i.offsetHeight > 600 && docTop(i) < 400),
      };
    });
    await p.context().close();
  }
  const d = (k) => (res.src[k] != null && res.cln[k] != null ? res.cln[k] - res.src[k] : '-');
  console.log(`${w}x${h}  height ${res.src.height}/${res.cln.height} (${d('height')})   plate ${res.src.plate}/${res.cln.plate} (${d('plate')})   closing ${res.src.closing}/${res.cln.closing} (${d('closing')})   hero ${res.src.hero}/${res.cln.hero} (${d('hero')})`);
}
await b.close();
