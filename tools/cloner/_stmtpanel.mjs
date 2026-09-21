import { chromium } from 'playwright';
/** The statement panel's internals at both widths, on both sides: every box
 *  with a background or text inside it, positioned against the panel's own
 *  top-left, so a desktop-only or phone-only element shows up plainly. */
const b = await chromium.launch();
const cases = [
  { w: 1440, h: 900, mobile: false, tag: 'DESKTOP' },
  { w: 390, h: 844, mobile: true, tag: 'PHONE  ' },
];
for (const c of cases) {
  for (const [base, side] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
    const p = await (await b.newContext({ viewport: { width: c.w, height: c.h }, isMobile: c.mobile, hasTouch: c.mobile })).newPage();
    await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await p.waitForTimeout(2600);
    await p.evaluate(async () => { for (let y = 0; y < 9000; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
    await p.waitForTimeout(900);
    const out = await p.evaluate(() => {
      const head = [...document.querySelectorAll('h1,h2,h3')].find(x => (x.textContent || '').trim().startsWith('Small habits'));
      if (!head) return { miss: true };
      // Walk up to the panel: the first ancestor with a non-transparent background.
      let panel = head.parentElement;
      while (panel && getComputedStyle(panel).backgroundColor === 'rgba(0, 0, 0, 0)') panel = panel.parentElement;
      if (!panel) return { miss: true };
      const pr = panel.getBoundingClientRect();
      const rows = [];
      for (const n of panel.querySelectorAll('*')) {
        const s = getComputedStyle(n), r = n.getBoundingClientRect();
        if (r.width < 6 || r.height < 6) continue;
        const paints = s.backgroundColor !== 'rgba(0, 0, 0, 0)' || s.backgroundImage !== 'none' || n.tagName === 'IMG' || n.tagName === 'svg';
        const text = !n.children.length && (n.textContent || '').trim();
        if (!paints && !text) continue;
        rows.push(`  ${String(Math.round(r.left - pr.left)).padStart(5)},${String(Math.round(r.top - pr.top)).padStart(4)} ${String(Math.round(r.width)).padStart(4)}x${String(Math.round(r.height)).padStart(4)} r=${s.borderRadius.split(' ')[0].padEnd(5)} bg=${s.backgroundColor.padEnd(22)} ${n.tagName}${text ? ` "${text.replace(/\s+/g, ' ').slice(0, 40)}" ${s.fontSize}/${s.lineHeight}` : ''}`);
      }
      return { panel: `${Math.round(pr.width)}x${Math.round(pr.height)} bg=${getComputedStyle(panel).backgroundColor} r=${getComputedStyle(panel).borderRadius.split(' ')[0]}`, rows };
    });
    console.log(`=== ${c.tag} ${side} ===`);
    if (out.miss) { console.log('  statement panel not found'); } else {
      console.log('  panel ' + out.panel);
      out.rows.slice(0, 14).forEach(r => console.log(r));
    }
    await p.context().close();
  }
}
await b.close();
