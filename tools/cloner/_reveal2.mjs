import { chromium } from 'playwright';
/**
 * Capture a reveal in flight: fresh load, walk down in small steps, and sample
 * the element's transform as it crosses into view. Sweeping first and coming
 * back would have already fired it.
 */
const KEY = process.argv[2] ?? 'Recovery boost';
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2600);
  const rows = [];
  let seen = 0;
  // the closing block sits near 12800, well past the old 8000 ceiling
  const LIMIT = Number(process.env.LIMIT ?? 8000);
  for (let y = 0; y < LIMIT && seen < 14; y += 120) {
    await p.evaluate(v => window.scrollTo(0, v), y);
    await p.waitForTimeout(70);
    const r = await p.evaluate(({ KEY, LAST }) => {
      // must own the text, or this matches a wrapper at the top of the page
      const els = [...document.querySelectorAll('*')]
        .filter(x => [...x.childNodes].some(n => n.nodeType === 3 && n.textContent.includes(KEY)))
        .filter(x => x.getBoundingClientRect().width > 0)
        .sort((a, c) => a.getBoundingClientRect().top - c.getBoundingClientRect().top);
      // LAST=1 for text that appears more than once — the closing heading
      // repeats the hero's wording, and taking the first match finds the hero.
      const el = LAST ? els[els.length - 1] : els[0];
      if (!el) return null;
      // climb to whichever ancestor carries a transform
      let n = el, t = 'none', op = '1', who = '';
      for (let i = 0; i < 6 && n; i++) {
        const s = getComputedStyle(n);
        if (s.transform !== 'none' || s.scale !== 'none' || +s.opacity < 1) {
          t = s.transform; op = s.opacity; who = n.tagName + (s.scale !== 'none' ? ` scale=${s.scale}` : ''); break;
        }
        n = n.parentElement;
      }
      const box = el.getBoundingClientRect();
      return { t, op, who, top: Math.round(box.top), left: Math.round(box.left) };
    }, { KEY, LAST: !!process.env.LAST });
    if (!r || r.top > 900 || r.top < -200) continue;
    let dx = 0, dy = 0;
    const m = r.t.match(/matrix\(([^)]+)\)/);
    if (m) { const v = m[1].split(',').map(Number); dx = Math.round(v[4]); dy = Math.round(v[5]); }
    const m3 = r.t.match(/matrix3d\(([^)]+)\)/);
    if (m3) { const v = m3[1].split(',').map(Number); dx = Math.round(v[12]); dy = Math.round(v[13]); }
    rows.push(`y=${y} top=${String(r.top).padStart(4)} left=${String(r.left).padStart(4)} dx=${String(dx).padStart(5)} dy=${String(dy).padStart(4)} op=${Number(r.op).toFixed(2)} ${r.who}`);
    seen++;
  }
  console.log('=== ' + tag + ' ' + KEY + ' ==='); rows.forEach(r => console.log('  ' + r));
  await ctx.close();
}
await b.close();
