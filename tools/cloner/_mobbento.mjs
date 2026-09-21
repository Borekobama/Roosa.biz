import { chromium } from 'playwright';
/** Blocks between the benefits heading and the ingredients eyebrow on a phone. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2600);
  for (let pass = 0; pass < 2; pass++) {
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
    await p.waitForTimeout(700);
  }
  const out = await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    // include h5/h6/li: the source's section eyebrow is one of those, and a
    // narrower list falls through to the footer's nav link of the same name
    const pick = (k, tags = 'h1,h2,h3,h4,h5,h6,p,span,div,li') => {
      const els = [...document.querySelectorAll(tags)]
        .filter(x => [...x.childNodes].some(n => n.nodeType === 3 && n.textContent.includes(k)))
        .filter(x => x.offsetWidth > 0 && !x.closest('footer')).sort((a, c) => docTop(a) - docTop(c));
      return els.length ? docTop(els[0]) : null;
    };
    const from = pick('Real clarity begins') ?? 0;
    const to = pick('Ingredients') ?? from + 6000;
    const rows = [];
    for (const el of document.querySelectorAll('h1,h2,h3,h4,img,div')) {
      const y = docTop(el);
      if (y <= from || y >= to) continue;
      const s = getComputedStyle(el);
      const painted = s.backgroundColor !== 'rgba(0, 0, 0, 0)' && parseFloat(s.borderRadius) >= 8;
      const isImg = el.tagName === 'IMG' && el.offsetHeight > 120;
      const owns = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      if (!painted && !isImg && !(owns && /H\d/.test(el.tagName))) continue;
      rows.push(`${String(Math.round(y)).padStart(6)}  ${el.offsetWidth}x${el.offsetHeight}  ${isImg ? 'IMG' : painted ? 'CARD' : el.tagName} ${owns ? '"' + el.textContent.trim().replace(/\s+/g, ' ').slice(0, 26) + '"' : ''}`);
    }
    return { from: Math.round(from), to: Math.round(to), span: Math.round(to - from), rows: [...new Set(rows)] };
  });
  console.log(`=== ${tag} benefits ${out.from} -> ingredients ${out.to} (span ${out.span}) ===`);
  out.rows.slice(0, 22).forEach(o => console.log('  ' + o));
  await p.context().close();
}
await b.close();
