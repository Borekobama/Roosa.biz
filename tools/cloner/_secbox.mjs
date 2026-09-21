import { chromium } from 'playwright';
/** For each anchor, the box and vertical padding of the section that holds it,
 *  both sides — so spacing drift can be traced to a padding rather than a gap. */
const KEYS = [
  ['benefits', 'Real clarity begins'], ['solg7', 'the most awarded formula'],
  ['ingredients', 'Ingredients'], ['reviews', 'listen'],
  ['offer', 'Daily Multivitamin'], ['faq', 'Frequently'],
  ['blog', 'regenerative'], ['closing', 'requires real vitamins'],
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
  res[tag] = await p.evaluate((keys) => {
    const out = {};
    for (const [name, k] of keys) {
      const el = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span,div,li')]
        .filter(x => [...x.childNodes].some(n => n.nodeType === 3 && n.textContent.includes(k)))
        .filter(x => { const r = x.getBoundingClientRect(); return r.width > 0 && r.height > 0; })
        .sort((a, c) => a.getBoundingClientRect().top - c.getBoundingClientRect().top)[0];
      if (!el) { out[name] = null; continue; }
      // climb to the widest ancestor that is still narrower than the page and
      // taller than the anchor — the band the anchor belongs to
      let band = el;
      while (band.parentElement && band.getBoundingClientRect().width < 1430) band = band.parentElement;
      const r = band.getBoundingClientRect(); const s = getComputedStyle(band);
      const ar = el.getBoundingClientRect();
      out[name] = {
        top: Math.round(r.top + scrollY), h: Math.round(r.height),
        pt: s.paddingTop, pb: s.paddingBottom, mt: s.marginTop, mb: s.marginBottom,
        into: Math.round(ar.top - r.top), tag: band.tagName,
      };
    }
    return out;
  }, KEYS);
  await p.context().close();
}
console.log('anchor'.padEnd(12), 'side', 'band top'.padStart(9), 'band h'.padStart(7), 'anchor into'.padStart(12), ' pad t/b', ' margin t/b');
for (const [name] of KEYS) {
  for (const t of ['src', 'cln']) {
    const v = res[t][name];
    console.log(name.padEnd(12), t, v ? String(v.top).padStart(9) : '        -', v ? String(v.h).padStart(7) : '      -',
      v ? String(v.into).padStart(12) : '           -', v ? ` ${v.pt}/${v.pb}` : '', v ? ` ${v.mt}/${v.mb}  <${v.tag}>` : '');
  }
}
await b.close();
