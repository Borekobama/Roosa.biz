import { chromium } from 'playwright';
/**
 * Blocks between two text anchors on a phone, both sides.
 *
 * Anchors exclude the footer and use a wide tag list: several section eyebrows
 * repeat as footer nav links, and a narrow list silently anchors on the wrong
 * one.
 */
const FROM = process.argv[2] ?? 'Ingredients';
const TO = process.argv[3] ?? 'Daily Multivitamin';
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2600);
  for (let pass = 0; pass < 2; pass++) {
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
    await p.waitForTimeout(700);
  }
  const out = await p.evaluate(({ FROM, TO }) => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const pick = (k) => {
      const els = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span,div,li')]
        .filter(x => [...x.childNodes].some(n => n.nodeType === 3 && n.textContent.includes(k)))
        .filter(x => x.offsetWidth > 0 && !x.closest('footer'))
        .sort((a, c) => docTop(a) - docTop(c));
      return els.length ? docTop(els[0]) : null;
    };
    const from = pick(FROM), to = pick(TO);
    if (from == null || to == null) return { err: `anchor missing from=${from} to=${to}` };
    const rows = [];
    for (const el of document.querySelectorAll('h1,h2,h3,h4,img,div,section')) {
      const y = docTop(el);
      if (y < from - 20 || y > to + 20) continue;
      const s = getComputedStyle(el);
      const isImg = el.tagName === 'IMG' && el.offsetHeight > 150;
      const painted = s.backgroundColor !== 'rgba(0, 0, 0, 0)' && el.offsetHeight > 200;
      const owns = /H\d/.test(el.tagName) && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      if (!isImg && !painted && !owns) continue;
      rows.push(`${String(Math.round(y)).padStart(6)}  ${el.offsetWidth}x${el.offsetHeight}  ${isImg ? 'IMG' : owns ? el.tagName : 'BLOCK'} ${owns ? '"' + el.textContent.trim().replace(/\s+/g, ' ').slice(0, 24) + '"' : ''}`);
    }
    return { from: Math.round(from), to: Math.round(to), span: Math.round(to - from), rows: [...new Set(rows)] };
  }, { FROM, TO });
  if (out.err) { console.log(`=== ${tag} === ${out.err}`); await p.context().close(); continue; }
  console.log(`=== ${tag}  ${FROM} ${out.from} -> ${TO} ${out.to}  span ${out.span} ===`);
  out.rows.slice(0, 12).forEach(o => console.log('  ' + o));
  await p.context().close();
}
await b.close();
