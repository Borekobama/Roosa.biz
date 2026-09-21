import { chromium } from 'playwright';
/** The stretch between the foliage plate and the offer heading, settled.
 *  Everything is measured after parking on each landmark so one-shot reveals
 *  have run and the boxes are layout, not mid-transform. */
const b = await chromium.launch();
const res = {};
for (const [base, tag] of [['https://solene.framer.ai', 'src'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'cln']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 70)); } });
  await p.waitForTimeout(1200);
  res[tag] = await p.evaluate(() => {
    const top = (el) => el ? Math.round(el.getBoundingClientRect().top + scrollY) : null;
    const owns = (k, tags = 'h1,h2,h3,h4,h5,h6,p,span,div,li') => [...document.querySelectorAll(tags)]
      .filter(x => [...x.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().includes(k)))
      .filter(x => x.getBoundingClientRect().width > 0)
      .sort((a, c) => a.getBoundingClientRect().top - c.getBoundingClientRect().top)[0];
    const plate = [...document.querySelectorAll('img')].map(i => i.getBoundingClientRect())
      .filter(r => Math.round(r.width) === 1440 && Math.abs(r.height - 931) < 4)[0];
    const backdrop = [...document.querySelectorAll('img')].map(i => i.getBoundingClientRect())
      .filter(r => r.width > 1300 && r.height > 1200)[0];
    // the ingredient rows: big display lines in that band
    const rows = [...document.querySelectorAll('*')]
      .filter(x => { const s = getComputedStyle(x); return parseFloat(s.fontSize) > 44 && x.children.length === 0 && (x.textContent || '').trim(); })
      .map(x => ({ y: Math.round(x.getBoundingClientRect().top + scrollY), t: x.textContent.trim().slice(0, 14) }))
      .filter(r => plate && r.y > plate.bottom + scrollY && backdrop && r.y < backdrop.top + scrollY);
    return {
      'plate bottom': plate ? Math.round(plate.bottom + scrollY) : null,
      'ingr eyebrow': top(owns('Ingredients')),
      'first row': rows.length ? rows[0].y : null,
      'last row': rows.length ? rows[rows.length - 1].y : null,
      'row count': rows.length,
      'backdrop top': backdrop ? Math.round(backdrop.top + scrollY) : null,
      'backdrop h': backdrop ? Math.round(backdrop.height) : null,
      'reviews head': top(owns('listen')),
      'offer head': top(owns('Daily Multivitamin')),
    };
  });
  await p.context().close();
}
const keys = Object.keys(res.src);
console.log('mark'.padEnd(15), 'src'.padStart(7), 'cln'.padStart(7), 'd'.padStart(6), 'gap src'.padStart(9), 'gap cln'.padStart(9), 'dGap'.padStart(6));
let prev = null;
for (const k of keys) {
  const s = res.src[k], c = res.cln[k];
  let gs = '-', gc = '-', dg = '-';
  if (prev && s != null && c != null && k !== 'row count' && k !== 'backdrop h') { gs = s - res.src[prev]; gc = c - res.cln[prev]; dg = gc - gs; }
  console.log(k.padEnd(15), String(s ?? '-').padStart(7), String(c ?? '-').padStart(7),
    String(s != null && c != null ? c - s : '-').padStart(6), String(gs).padStart(9), String(gc).padStart(9), String(dg).padStart(6),
    (dg !== '-' && Math.abs(dg) > 6) ? ' <<<' : '');
  if (s != null && c != null && k !== 'row count' && k !== 'backdrop h') prev = k;
}
await b.close();
