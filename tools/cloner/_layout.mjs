import { chromium } from 'playwright';
/**
 * Document position from the offsetTop chain rather than getBoundingClientRect.
 *
 * Several landmarks sit inside position:sticky wrappers (the reviews heading,
 * the offer column) or inside reveal transforms, so their client rect depends
 * on where the page happens to be scrolled and on whether a one-shot reveal has
 * run. offsetTop is pure layout and has neither problem.
 */
const MARKS = [
  ['pinned', 'Well-being that'],
  ['benefits', 'Real clarity begins'],
  ['plate', 'img1440x931'], ['ingr eyebrow', 'Ingredients'], ['reviews head', 'just from us'],
  ['backdrop', 'img>1300x1200'], ['offer head', 'Daily Multivitamin'], ['ingr row1', 'Vitamins'],
  ['faq eyebrow', 'FAQ'], ['blog eyebrow', 'Blog'], ['closing plate', 'img1376x766'],
];
const b = await chromium.launch();
const res = {};
for (const [base, tag] of [['https://solene.framer.ai', 'src'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'cln']]) {
  const VW = Number(process.env.VW ?? 1440);
  const VH = Number(process.env.VH ?? 900);
  const p = await (await b.newContext({ viewport: { width: VW, height: VH } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
  await p.waitForTimeout(800);
  res[tag] = await p.evaluate((marks) => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const byText = (k) => [...document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span,div,li')]
      .filter(x => [...x.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().includes(k)))
      .filter(x => x.offsetWidth > 0 && !x.closest('footer'))
      .map(x => ({ x, y: docTop(x) })).sort((a, c) => a.y - c.y)[0];
    const byImg = (w, h, tol = 6) => [...document.querySelectorAll('img')]
      .filter(i => Math.abs(i.offsetWidth - w) < tol && Math.abs(i.offsetHeight - h) < tol)
      .map(i => ({ x: i, y: docTop(i) })).sort((a, c) => a.y - c.y)[0];
    const out = {};
    for (const [name, key] of marks) {
      let hit = null;
      if (key === 'img1440x931') hit = byImg(1440, 931);
      else if (key === 'img>1300x1200') hit = [...document.querySelectorAll('img')]
        .filter(i => i.offsetWidth > 1300 && i.offsetHeight > 1200)
        .map(i => ({ x: i, y: docTop(i) })).sort((a, c) => a.y - c.y)[0];
      else if (key === 'img1376x766') hit = byImg(1376, 766);
      else hit = byText(key);
      out[name] = hit ? Math.round(hit.y) : null;
    }
    out['__height'] = document.documentElement.scrollHeight;
    return out;
  }, MARKS);
  await p.context().close();
}
const keys = [...MARKS.map(m => m[0]), '__height'];
console.log('mark'.padEnd(15), 'src'.padStart(7), 'cln'.padStart(7), 'd'.padStart(6), 'gap src'.padStart(9), 'gap cln'.padStart(9), 'dGap'.padStart(6));
let prev = null;
for (const k of keys) {
  const s = res.src[k], c = res.cln[k];
  let gs = '-', gc = '-', dg = '-';
  if (prev && s != null && c != null) { gs = s - res.src[prev]; gc = c - res.cln[prev]; dg = gc - gs; }
  console.log(k.padEnd(15), String(s ?? '-').padStart(7), String(c ?? '-').padStart(7),
    String(s != null && c != null ? c - s : '-').padStart(6), String(gs).padStart(9), String(gc).padStart(9),
    String(dg).padStart(6), (dg !== '-' && Math.abs(dg) > 6) ? ' <<<' : '');
  if (s != null && c != null) prev = k;
}
await b.close();
