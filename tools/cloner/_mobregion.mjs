import { chromium } from 'playwright';
/** Every block between two anchors, both sides, in document order.
 *
 *  Usage: FROM="Real clarity" TO="Know more about" VW=390 node _mobregion.mjs
 *
 *  Measured at scroll 0: offsetTop on a position:sticky element reports where
 *  it is currently stuck, so reading at the foot of the page turns a pinned
 *  column into what looks like a plain stack. */
const FROM = process.env.FROM ?? 'One formula';
const TO = process.env.TO ?? 'Real clarity begins';
const VW = Number(process.env.VW ?? 390), VH = Number(process.env.VH ?? 844);
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: VW, height: VH }, isMobile: VW < 720, hasTouch: VW < 720 })).newPage();
  await p.goto(base + (process.env.ROUTE ?? '/'), { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2500);
  for (let pass = 0; pass < 2; pass++) {
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
    await p.waitForTimeout(700);
  }
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(600);
  const out = await p.evaluate(([from, to]) => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    // Take the TO anchor that falls after the FROM one. Several headings on
    // this page repeat -- the closing "Daily well-being requires real vitamins"
    // is also the hero's -- and picking the first match gave a span of -11832.
    const all = (frag) => [...document.querySelectorAll('h1,h2,h3,h4,p')]
      .filter(x => (x.textContent || '').trim().startsWith(frag))
      .map(x => docTop(x)).sort((m, n) => m - n);
    const froms = all(from), tos = all(to);
    const lo = froms.length ? froms[0] : 0;
    const hi = tos.find(y => y > lo) ?? 1e9;
    const seen = [];
    for (const el of document.querySelectorAll('h1,h2,h3,h4,h5,p,img,svg,li')) {
      // SVG elements carry no offset* properties; fall back to the rect,
      // which is safe here because the page is measured at scroll 0.
      const isSvg = el.tagName === 'svg';
      const r = isSvg ? el.getBoundingClientRect() : null;
      const y = isSvg ? r.top + window.scrollY : docTop(el);
      const h = isSvg ? Math.round(r.height) : el.offsetHeight;
      if (y < lo || y > hi || h < 14) continue;
      if (el.tagName !== 'IMG' && el.tagName !== 'svg' && el.children.length && [...el.children].some(c => c.offsetHeight > 4)) continue;
      const t = el.tagName === 'IMG' ? `IMG ${el.offsetWidth}x${el.offsetHeight}`
        : isSvg ? `SVG ${Math.round(r.width)}x${Math.round(r.height)}`
        : `${el.tagName} "${(el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 36)}"`;
      seen.push({ y: Math.round(y), h, t });
    }
    seen.sort((x, y2) => x.y - y2.y);
    return { lo: Math.round(lo), hi: Math.round(hi), seen };
  }, [FROM, TO]);
  console.log(`=== ${tag}  ${out.lo} -> ${out.hi}  (span ${out.hi - out.lo}) ===`);
  let prev = out.lo;
  for (const s of out.seen.slice(0, 30)) {
    console.log(`  ${String(s.y).padStart(6)} +${String(s.y - prev).padStart(4)} h=${String(s.h).padStart(4)}  ${s.t}`);
    prev = s.y;
  }
  await p.context().close();
}
await b.close();
