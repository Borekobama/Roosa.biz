import { chromium } from 'playwright';
/** Second method on the phone panel region: instead of measuring where blocks
 *  land, read the boxes themselves — ancestors of each panel image, their
 *  position/overflow/height, and whether any of them is sticky with a tall
 *  spacer. A stacked layout has no sticky ancestor; a pinned one does. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2600);
  for (let pass = 0; pass < 2; pass++) {
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
    await p.waitForTimeout(700);
  }
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(400);
  const out = await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const head = [...document.querySelectorAll('h1,h2,h3')].find(x => (x.textContent || '').includes('Real clarity begins'));
    const limit = head ? docTop(head) : 99999;
    const imgs = [...document.querySelectorAll('img')].filter(i => {
      const y = docTop(i);
      return y > 700 && y < limit && i.offsetHeight > 400 && i.offsetWidth > 300;
    });
    const rows = [];
    for (const img of imgs) {
      const chain = [];
      let n = img.parentElement, depth = 0;
      while (n && n !== document.body && depth < 9) {
        const s = getComputedStyle(n);
        chain.push({
          d: depth,
          pos: s.position,
          h: n.offsetHeight,
          w: n.offsetWidth,
          ov: s.overflow,
          tr: s.transform === 'none' ? '-' : s.transform.replace(/matrix\(1, 0, 0, 1, /, 't(').slice(0, 30),
          top: s.top,
          cls: (n.className || '').toString().slice(0, 24),
        });
        n = n.parentElement; depth++;
      }
      rows.push({ y: Math.round(docTop(img)), size: `${img.offsetWidth}x${img.offsetHeight}`, chain });
    }
    return { limit: Math.round(limit), rows, sticky: [...document.querySelectorAll('*')].filter(e => getComputedStyle(e).position === 'sticky').map(e => ({ y: Math.round(docTop(e)), h: e.offsetHeight, ph: e.parentElement ? e.parentElement.offsetHeight : 0, cls: (e.className || '').toString().slice(0, 30) })).filter(e => e.y < 99999) };
  });
  console.log(`=== ${tag} (benefits heading at ${out.limit}) ===`);
  for (const r of out.rows) {
    console.log(`  IMG ${r.size} at ${r.y}`);
    for (const c of r.chain) console.log(`      ${c.d}  ${c.pos.padEnd(8)} ${String(c.w).padStart(4)}x${String(c.h).padStart(5)}  ov=${c.ov.padEnd(8)} top=${String(c.top).padEnd(7)} tr=${c.tr.padEnd(20)} ${c.cls}`);
  }
  console.log('  -- sticky elements on the page --');
  for (const s of out.sticky) console.log(`      y=${String(s.y).padStart(6)} h=${String(s.h).padStart(5)} parent h=${String(s.ph).padStart(6)}  ${s.cls}`);
  await p.context().close();
}
await b.close();
