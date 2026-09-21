import { chromium } from 'playwright';
/** Entry travel of every bento card on the source, captured on a fresh load. */
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto('https://solene.framer.ai/', { waitUntil: 'domcontentloaded', timeout: 90000 });
await p.waitForTimeout(2600);
const seen = new Map();
for (let y = 4600; y < 7000; y += 120) {
  await p.evaluate(v => window.scrollTo(0, v), y);
  await p.waitForTimeout(70);
  const rows = await p.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('div')) {
      const s = getComputedStyle(el); const r = el.getBoundingClientRect();
      if (parseFloat(s.borderRadius) < 12 || r.width < 380 || r.height < 300 || r.height > 400) continue;
      if (s.backgroundColor === 'rgba(0, 0, 0, 0)' && s.backgroundImage === 'none') continue;
      let n = el, t = 'none';
      for (let i = 0; i < 5 && n; i++) { const cs = getComputedStyle(n); if (cs.transform !== 'none') { t = cs.transform; break; } n = n.parentElement; }
      let dx = 0, dy = 0;
      const m = t.match(/matrix\(([^)]+)\)/); if (m) { const v = m[1].split(',').map(Number); dx = Math.round(v[4]); dy = Math.round(v[5]); }
      const m3 = t.match(/matrix3d\(([^)]+)\)/); if (m3) { const v = m3[1].split(',').map(Number); dx = Math.round(v[12]); dy = Math.round(v[13]); }
      out.push({ key: `${Math.round(r.width)}w@${Math.round(r.left - dx)}`, top: Math.round(r.top), dx, dy, op: getComputedStyle(el).opacity });
    }
    return out;
  });
  for (const r of rows) {
    if (r.top > 900 || r.top < -100) continue;
    if (!seen.has(r.key)) seen.set(r.key, []);
    const a = seen.get(r.key);
    if (a.length < 9) a.push(`top=${String(r.top).padStart(4)} dx=${String(r.dx).padStart(4)} dy=${String(r.dy).padStart(4)}`);
  }
}
for (const [k, v] of seen) console.log(k.padEnd(12), v.join('  '));
await b.close();
