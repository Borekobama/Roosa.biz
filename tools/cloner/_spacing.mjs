import { chromium } from 'playwright';
/**
 * Document position of a set of anchors on both sides, and the spacing between
 * consecutive anchors. Spacing is what localises drift: an absolute offset just
 * inherits every error above it.
 */
const KEYS = [
  ['hero', 'Daily well-being requires'],
  ['fading', 'One formula'],
  ['pinned', 'Well-being that'],
  ['benefits', 'Real clarity begins'],
  ['solg7', 'the most awarded formula'],
  ['ingredients', 'Ingredients'],
  ['reviews', 'listen'],
  ['offer', 'Daily Multivitamin'],
  ['faq', 'Frequently'],
  ['blog', 'regenerative'],
];
const b = await chromium.launch();
const res = {};
for (const [base, tag] of [['https://solene.framer.ai', 'src'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'cln']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + (process.argv[2] ?? '/'), { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 450) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(900);
  res[tag] = await p.evaluate((keys) => {
    const out = {};
    for (const [name, k] of keys) {
      // match the element that owns the text, not an ancestor that contains it
      const hit = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span,div,li')]
        .filter(x => [...x.childNodes].some(n => n.nodeType === 3 && n.textContent.includes(k)))
        .map(x => x.getBoundingClientRect())
        .filter(r => r.width > 0 && r.height > 0)
        .sort((a, b) => a.top - b.top)[0];
      out[name] = hit ? Math.round(hit.top + scrollY) : null;
    }
    out.__height = document.documentElement.scrollHeight;
    return out;
  }, KEYS);
  await p.context().close();
}
const names = KEYS.map(k => k[0]);
console.log('anchor'.padEnd(13), 'src'.padStart(7), 'cln'.padStart(7), 'dPos'.padStart(6), '| gap src'.padStart(10), 'gap cln'.padStart(9), 'dGap'.padStart(6));
let prev = null;
for (const n of [...names, '__height']) {
  const s = res.src[n], c = res.cln[n];
  let gs = '-', gc = '-', dg = '-';
  if (prev && s != null && c != null && res.src[prev] != null && res.cln[prev] != null) {
    gs = s - res.src[prev]; gc = c - res.cln[prev]; dg = gc - gs;
  }
  console.log(n.padEnd(13), String(s ?? '-').padStart(7), String(c ?? '-').padStart(7),
    String(s != null && c != null ? c - s : '-').padStart(6), '|', String(gs).padStart(8), String(gc).padStart(9),
    String(dg).padStart(6), (dg !== '-' && Math.abs(dg) > 24) ? '  <<<' : '');
  if (s != null && c != null) prev = n;
}
await b.close();
