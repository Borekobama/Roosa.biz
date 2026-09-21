import { chromium } from 'playwright';
/** The SOL-G7 band at phone width, both sides: every box it holds, with its
 *  position relative to the band's heading so the two orders can be compared. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: Number(process.env.VW ?? 390), height: 844 }, isMobile: !process.env.VW, hasTouch: !process.env.VW })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < 16000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } });
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(700);
  const out = await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const head = [...document.querySelectorAll('h1,h2,h3')].find(x => (x.textContent || '').trim().startsWith('Know more about'));
    if (!head) return { miss: true };
    const y0 = docTop(head);
    const rows = [];
    for (const el of document.querySelectorAll('h1,h2,h3,h4,h5,p,img,svg,div')) {
      const isSvg = el.tagName === 'svg';
      const r = isSvg ? el.getBoundingClientRect() : null;
      const y = isSvg ? r.top + window.scrollY : docTop(el);
      const h = isSvg ? Math.round(r.height) : el.offsetHeight;
      const wd = isSvg ? Math.round(r.width) : el.offsetWidth;
      if (y < y0 - 60 || y > y0 + 720 || h < 12) continue;
      const s = getComputedStyle(el);
      const txt = (el.textContent || '').trim().replace(/\s+/g, ' ');
      const paints = el.tagName === 'IMG' || isSvg || s.backgroundColor !== 'rgba(0, 0, 0, 0)' || s.backgroundImage !== 'none';
      const leaf = !el.children.length || ![...el.children].some(c => c.getBoundingClientRect().height > 4);
      if (!paints && !leaf) continue;
      const kind = el.tagName === 'IMG' ? `IMG ${wd}x${h}` : isSvg ? `SVG ${wd}x${h}`
        : leaf && txt ? `${el.tagName} "${txt.slice(0, 34)}"` : `${el.tagName} ${wd}x${h} bg=${s.backgroundColor} r=${s.borderRadius.split(' ')[0]}`;
      rows.push(`  ${String(Math.round(y - y0)).padStart(5)} h=${String(h).padStart(4)} w=${String(wd).padStart(4)}  ${kind}`);
    }
    return { y0: Math.round(y0), rows: rows.slice(0, 22) };
  });
  console.log(`=== ${tag} (heading at ${out.y0}) ===`);
  out.rows.forEach(r => console.log(r));
  await p.context().close();
}
await b.close();
