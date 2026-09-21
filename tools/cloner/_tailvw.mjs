import { chromium } from 'playwright';
/**
 * The tail of the home page at a given viewport, by offsetTop so transforms and
 * sticky do not distort it. Landmarks are matched by ratio, not fixed pixels,
 * because everything here scales with viewport width.
 */
const VW = Number(process.env.VW ?? 1680);
const VH = Number(process.env.VH ?? 1050);
const b = await chromium.launch();
const res = {};
for (const [base, tag] of [['https://solene.framer.ai', 'src'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'cln']]) {
  const p = await (await b.newContext({ viewport: { width: VW, height: VH } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2400);
  for (let pass = 0; pass < 2; pass++) {
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 65)); } });
    await p.waitForTimeout(800);
  }
  res[tag] = await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const vw = window.innerWidth;
    const near = (a, bb, tol) => Math.abs(a - bb) <= tol;
    const byText = (k) => {
      const els = [...document.querySelectorAll('h1,h2,h3,p,span,div')]
        .filter(x => [...x.childNodes].some(n => n.nodeType === 3 && n.textContent.includes(k)))
        .filter(x => x.offsetWidth > 0 && !x.closest('footer')).sort((a, c) => docTop(a) - docTop(c));
      return els.length ? Math.round(docTop(els[els.length - 1])) : null;
    };
    const grass = [...document.querySelectorAll('img')]
      .filter(i => near(i.offsetWidth, vw - 64, 12) && near(i.offsetHeight / i.offsetWidth, 766 / 1376, 0.03))
      .sort((a, c) => docTop(a) - docTop(c))[0];
    const foot = document.querySelector('footer');
    const mark = [...document.querySelectorAll('img')]
      .filter(i => near(i.offsetHeight / i.offsetWidth, 311 / 1312, 0.05) && i.offsetWidth > 600)
      .sort((a, c) => docTop(a) - docTop(c)).pop();
    return {
      blog: byText('regenerative'),
      closingHead: byText('requires real vitamins'),
      grassTop: grass ? Math.round(docTop(grass)) : null,
      grassH: grass ? grass.offsetHeight : null,
      footTop: foot ? Math.round(docTop(foot)) : null,
      footH: foot ? Math.round(foot.getBoundingClientRect().height) : null,
      markH: mark ? mark.offsetHeight : null,
      height: document.documentElement.scrollHeight,
    };
  });
  await p.context().close();
}
const keys = Object.keys(res.src);
console.log(`viewport ${VW}x${VH}`);
for (const k of keys) {
  const s = res.src[k], c = res.cln[k];
  console.log('  ' + k.padEnd(12), String(s ?? '-').padStart(7), String(c ?? '-').padStart(7),
    String(s != null && c != null ? c - s : '-').padStart(6), s != null && c != null && Math.abs(c - s) > 10 ? ' <<<' : '');
}
await b.close();
