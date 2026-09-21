import { chromium } from 'playwright';
/** Exact boxes of the phone deck: each sticky's top/height/padding, the panel
 *  it holds, and where the column sits between the statement above it and the
 *  benefits heading below. Read at scroll 0 so no sticky offset pollutes it. */
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
await p.goto('https://solene.framer.ai/', { waitUntil: 'domcontentloaded', timeout: 120000 });
await p.waitForTimeout(2600);
await p.evaluate(async () => { for (let y = 0; y < 6000; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
await p.waitForTimeout(1000);
const out = await p.evaluate(() => {
  const at = (el) => Math.round(el.getBoundingClientRect().top + window.scrollY);
  const st = [...document.querySelectorAll('*')].filter(e => getComputedStyle(e).position === 'sticky' && e.offsetHeight > 700 && e.offsetWidth > 300);
  const box = (e) => { const s = getComputedStyle(e); return { y: at(e), w: e.offsetWidth, h: e.offsetHeight, top: s.top, z: s.zIndex, pad: s.padding, radius: s.borderRadius, bg: s.backgroundColor }; };
  const panels = st.map(e => {
    const kid = e.firstElementChild ? [...e.querySelectorAll('*')].find(k => k.offsetHeight > 200 && k.offsetWidth > 200) : null;
    const img = e.querySelector('img');
    const head = e.querySelector('h1,h2,h3');
    return {
      sticky: box(e),
      inner: kid ? box(kid) : null,
      img: img ? { y: at(img), w: img.offsetWidth, h: img.offsetHeight, fit: getComputedStyle(img).objectFit } : null,
      heading: head ? (head.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 46) : null,
      texts: [...e.querySelectorAll('h1,h2,h3,h4,p,li')].slice(0, 8).map(t => `${t.tagName} ${Math.round(t.getBoundingClientRect().width)}w "${(t.textContent||'').trim().replace(/\s+/g,' ').slice(0,42)}"`),
    };
  });
  const col = st[0] ? st[0].parentElement : null;
  const stmt = [...document.querySelectorAll('h1,h2,h3')].find(x => (x.textContent||'').includes('One formula'));
  const bene = [...document.querySelectorAll('h1,h2,h3')].find(x => (x.textContent||'').includes('Real clarity begins'));
  return {
    column: col ? { ...box(col), cls: (col.className||'').toString().slice(0,30) } : null,
    statement: stmt ? at(stmt) : null,
    benefits: bene ? at(bene) : null,
    panels,
  };
});
console.log('column   ', JSON.stringify(out.column));
console.log('statement', out.statement, ' benefits', out.benefits);
for (const [i, pa] of out.panels.entries()) {
  console.log(`\n--- panel ${i + 1} ---`);
  console.log('  sticky', JSON.stringify(pa.sticky));
  console.log('  inner ', JSON.stringify(pa.inner));
  console.log('  img   ', JSON.stringify(pa.img));
  for (const t of pa.texts) console.log('   ', t);
}
await b.close();
