import { chromium } from 'playwright';
/** Are panels 1 and 3 really the same headline, or is one of them a stacked
 *  Framer variant? List every h1/h2 in each sticky with its own box. */
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
await p.goto('https://solene.framer.ai/', { waitUntil: 'domcontentloaded', timeout: 120000 });
await p.waitForTimeout(2600);
await p.evaluate(async () => { for (let y = 0; y < 6000; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
await p.waitForTimeout(1000);
const out = await p.evaluate(() => {
  const st = [...document.querySelectorAll('*')].filter(e => getComputedStyle(e).position === 'sticky' && e.offsetHeight > 700 && e.offsetWidth > 300);
  return st.map((e) => [...e.querySelectorAll('h1,h2,h3,p')].map(t => {
    const r = t.getBoundingClientRect(); const s = getComputedStyle(t);
    return `${t.tagName} ${Math.round(r.width)}x${Math.round(r.height)} vis=${s.visibility} op=${s.opacity} parentcls=${(t.parentElement.className||'').toString().slice(0,26)} :: "${(t.textContent||'').trim().replace(/\s+/g,' ').slice(0,60)}"`;
  }));
});
for (const [i, rows] of out.entries()) { console.log(`=== panel ${i + 1} ===`); rows.forEach(r => console.log('  ' + r)); }
await b.close();
