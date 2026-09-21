import { chromium } from 'playwright';
/** What each phone panel actually shows: visible text only, with its box and
 *  type, plus any icon-sized svg. The ssr-variant duplicates Framer leaves in
 *  the DOM are hidden, so anything with no box is skipped. */
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
await p.goto('https://solene.framer.ai/', { waitUntil: 'domcontentloaded', timeout: 120000 });
await p.waitForTimeout(2600);
await p.evaluate(async () => { for (let y = 0; y < 6000; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
await p.waitForTimeout(1000);
const out = await p.evaluate(() => {
  const st = [...document.querySelectorAll('*')].filter(e => getComputedStyle(e).position === 'sticky' && e.offsetHeight > 700 && e.offsetWidth > 300);
  return st.map((e) => {
    const base = e.getBoundingClientRect().top;
    const rows = [];
    for (const t of e.querySelectorAll('h1,h2,h3,h4,h5,p,li,span,img,svg')) {
      const r = t.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) continue;
      const s = getComputedStyle(t);
      if (s.visibility === 'hidden' || s.display === 'none') continue;
      if (t.tagName !== 'IMG' && t.tagName !== 'SVG' && t.children.length && [...t.children].some(c => c.getBoundingClientRect().height > 4)) continue;
      const txt = t.tagName === 'IMG' ? `IMG ${t.offsetWidth}x${t.offsetHeight} ${(t.src||'').split('/').pop().slice(0,22)}`
        : t.tagName.toLowerCase() === 'svg' ? `SVG ${Math.round(r.width)}x${Math.round(r.height)}`
        : `${t.tagName} "${(t.textContent||'').trim().replace(/\s+/g,' ').slice(0,56)}"`;
      rows.push(`  dy=${String(Math.round(r.top - base)).padStart(4)} x=${String(Math.round(r.left)).padStart(3)} ${String(Math.round(r.width)).padStart(3)}x${String(Math.round(r.height)).padStart(3)} ${s.fontSize}/${s.lineHeight} ${s.color} :: ${txt}`);
    }
    return rows;
  });
});
for (const [i, rows] of out.entries()) { console.log(`=== panel ${i + 1} ===`); rows.forEach(r => console.log(r)); }
await b.close();
