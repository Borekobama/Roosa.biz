import { chromium } from 'playwright';
/** Section shape of a legal page, both sides: for each heading, the blocks
 *  under it with their heights, so a missing paragraph shows as a count. */
const ROUTE = process.env.ROUTE ?? '/cookies-policy';
const b = await chromium.launch();
const res = {};
for (const [base, tag] of [['https://solene.framer.ai', 'src'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'cln']]) {
  const p = await (await b.newContext({ viewport: { width: Number(process.env.VW ?? 390), height: 844 }, isMobile: true, hasTouch: true })).newPage();
  await p.goto(base + ROUTE, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let y = 0; y < 9000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(600);
  res[tag] = await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const heads = [...document.querySelectorAll('h2,h3')].filter(h => h.offsetHeight > 10)
      .map(h => ({ t: (h.textContent || '').trim().slice(0, 30), y: docTop(h), h: h.offsetHeight }));
    const paras = [...document.querySelectorAll('p,li')].filter(x => x.offsetHeight > 10 && parseFloat(getComputedStyle(x).fontSize) < 20)
      .map(x => ({ y: docTop(x), h: x.offsetHeight, tag: x.tagName }));
    return heads.map((h, i) => {
      const next = heads[i + 1] ? heads[i + 1].y : h.y + 600;
      const inside = paras.filter(x => x.y > h.y && x.y < next);
      return { t: h.t, y: h.y, h: h.h, blocks: inside.map(x => `${x.tag}${x.h}`), total: inside.reduce((a, c) => a + c.h, 0) };
    });
  });
  await p.context().close();
}
const n = Math.max(res.src.length, res.cln.length);
console.log(`sections: src ${res.src.length}  cln ${res.cln.length}`);
for (let i = 0; i < n; i++) {
  const s = res.src[i], c = res.cln[i];
  console.log(`\n  ${(s ? s.t : '—').padEnd(32)} src y=${s ? s.y : '-'}  cln y=${c ? c.y : '-'}`);
  console.log(`    src ${s ? `${s.blocks.length} blocks [${s.blocks.join(' ')}] = ${s.total}` : '-'}`);
  console.log(`    cln ${c ? `${c.blocks.length} blocks [${c.blocks.join(' ')}] = ${c.total}` : '-'}`);
}
await b.close();
