import { chromium } from 'playwright';
/** Tail bands: where each of the offer, FAQ, blog and closing blocks starts and
 *  ends, measured from real painted content rather than from section wrappers,
 *  which nest differently on the two sides. */
const MARKS = [
  ['offer head', 'Daily Multivitamin'],
  ['faq eyebrow', 'FAQ'],
  ['faq head', 'Frequently'],
  ['faq last row', 'Can I take Solene'],
  ['blog eyebrow', 'Blog'],
  ['blog head', 'regenerative'],
  ['closing head', 'requires real vitamins'],
];
const b = await chromium.launch();
const res = {};
for (const [base, tag] of [['https://solene.framer.ai', 'src'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'cln']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 450) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(800);
  res[tag] = await p.evaluate((marks) => {
    const out = {};
    for (const [name, k] of marks) {
      const el = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span,div,li,button')]
        .filter(x => [...x.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().includes(k)))
        .filter(x => { const r = x.getBoundingClientRect(); return r.width > 0 && r.height > 0; })
        .sort((a, c) => a.getBoundingClientRect().top - c.getBoundingClientRect().top);
      const pick = name === 'faq last row' ? el[el.length - 1] : el[0];
      out[name] = pick ? Math.round(pick.getBoundingClientRect().top + scrollY) : null;
    }
    // the big closing plate and the footer
    const plate = [...document.querySelectorAll('img')].map(i => i.getBoundingClientRect())
      .filter(r => Math.round(r.width) === 1376 && Math.abs(r.height - 766) < 6)[0];
    out['closing plate'] = plate ? Math.round(plate.top + scrollY) : null;
    const foot = document.querySelector('footer');
    out['footer'] = foot ? Math.round(foot.getBoundingClientRect().top + scrollY) : null;
    out['__height'] = document.documentElement.scrollHeight;
    return out;
  }, MARKS);
  await p.context().close();
}
const names = [...MARKS.map(m => m[0]), 'closing plate', 'footer', '__height'];
console.log('mark'.padEnd(15), 'src'.padStart(7), 'cln'.padStart(7), 'dPos'.padStart(6), 'gap src'.padStart(9), 'gap cln'.padStart(9), 'dGap'.padStart(6));
let prev = null;
for (const n of names) {
  const s = res.src[n], c = res.cln[n];
  let gs = '-', gc = '-', dg = '-';
  if (prev && s != null && c != null) { gs = s - res.src[prev]; gc = c - res.cln[prev]; dg = gc - gs; }
  console.log(n.padEnd(15), String(s ?? '-').padStart(7), String(c ?? '-').padStart(7),
    String(s != null && c != null ? c - s : '-').padStart(6), String(gs).padStart(9), String(gc).padStart(9),
    String(dg).padStart(6), (dg !== '-' && Math.abs(dg) > 20) ? ' <<<' : '');
  if (s != null && c != null) prev = n;
}
await b.close();
