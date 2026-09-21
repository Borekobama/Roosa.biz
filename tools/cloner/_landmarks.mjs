import { chromium } from 'playwright';
/** Layout position (offsetTop chain) of every heading and large image on a
 *  route, both sides, matched up by text so sections can be compared. */
const route = process.argv[2] ?? '/science';
// The blog posts are original here, so the two sides have different slugs.
// SRC_ROUTE/CLN_ROUTE let the same template be compared across differing URLs.
const routeFor = (tag) => (tag === 'src' ? process.env.SRC_ROUTE : process.env.CLN_ROUTE) ?? route;
const b = await chromium.launch();
const res = {};
for (const [base, tag] of [['https://solene.framer.ai', 'src'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'cln']]) {
  const VW = Number(process.env.VW ?? 1440);
  const VH = Number(process.env.VH ?? 900);
  const p = await (await b.newContext({ viewport: { width: VW, height: VH }, isMobile: VW < 700, hasTouch: VW < 700 })).newPage();
  await p.goto(base + routeFor(tag), { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2200);
  for (let pass = 0; pass < 2; pass++) {
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 70)); } });
    await p.waitForTimeout(800);
  }
  // Back to the top before measuring. offsetTop on a position:sticky element
  // reports where it is currently stuck, not where it sits in the flow, so
  // reading at the foot of the page puts the phone deck's first panel at 2965
  // instead of 1149 and makes a pinned column look like a plain stack.
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(600);
  res[tag] = await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const out = [];
    for (const el of document.querySelectorAll('h1,h2,h3,h4')) {
      const t = (el.textContent || '').trim().replace(/\s+/g, ' ');
      if (!t || el.offsetWidth === 0) continue;
      out.push({ y: docTop(el), k: t.slice(0, 30), kind: 'H' });
    }
    for (const i of document.querySelectorAll('img')) {
      if (i.offsetWidth < 300) continue;
      out.push({ y: docTop(i), k: `IMG ${i.offsetWidth}x${i.offsetHeight}`, kind: 'I' });
    }
    out.sort((a, c) => a.y - c.y);
    return { marks: out, h: document.documentElement.scrollHeight };
  });
  await p.context().close();
}
// match headings by text, report the rest positionally
if (process.env.DUMP) {
  for (const t of ['src', 'cln']) {
    console.log(`=== ${t} (height ${res[t].h}) ===`);
    for (const m of res[t].marks) console.log(`  ${String(m.y).padStart(6)}  ${m.kind}  ${m.k}`);
  }
  process.exit(0);
}
const srcH = res.src.marks.filter(m => m.kind === 'H');
const clnH = res.cln.marks.filter(m => m.kind === 'H');
console.log(`heights: src ${res.src.h}  cln ${res.cln.h}  delta ${res.cln.h - res.src.h}\n`);
console.log('src y'.padStart(7), 'cln y'.padStart(7), 'd'.padStart(6), 'gap d'.padStart(7), '  heading');
let prevS = null, prevC = null;
// Walk both sides forward together and consume each clone heading once. A
// plain find() returns the first heading with that text wherever it sits, and
// this page repeats one: the source runs "Intelligent nutrition..." on two
// panels, so both source rows matched the same clone row and reported a 1842px
// error beside a -1816px one. The closing "Daily well-being..." matched the
// opening one the same way, for a 13249px phantom.
let cursor = 0;
for (const s of srcH) {
  const key = s.k.slice(0, 14).toLowerCase();
  const idx = clnH.findIndex((x, i) => i >= cursor && x.k.slice(0, 14).toLowerCase() === key);
  const c = idx === -1 ? null : clnH[idx];
  if (c) cursor = idx + 1;
  if (!c) { console.log(String(s.y).padStart(7), '      -', '     -', '      -', '  ' + s.k + '   [no match]'); continue; }
  const dg = prevS != null ? (c.y - prevC) - (s.y - prevS) : null;
  console.log(String(s.y).padStart(7), String(c.y).padStart(7), String(c.y - s.y).padStart(6),
    String(dg ?? '-').padStart(7), '  ' + s.k, dg != null && Math.abs(dg) > 30 ? ' <<<' : '');
  prevS = s.y; prevC = c.y;
}
await b.close();
