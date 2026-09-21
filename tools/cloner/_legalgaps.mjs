import { chromium } from 'playwright';
/** Legal page spacing, both sides: heading type, the gap from a heading to its
 *  first body block, and the gap from a section's last block to the next
 *  heading. If these agree, what is left is body length alone. */
const ROUTE = process.env.ROUTE ?? '/cookies-policy';
const b = await chromium.launch();
const res = {};
for (const [base, tag] of [['https://solene.framer.ai', 'src'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'cln']]) {
  const p = await (await b.newContext({ viewport: { width: Number(process.env.VW ?? 1440), height: 900 }, isMobile: (process.env.VW ?? '1440') === '390', hasTouch: false })).newPage();
  await p.goto(base + ROUTE, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let y = 0; y < 9000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(600);
  res[tag] = await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const heads = [...document.querySelectorAll('h2,h3')].filter(h => h.offsetHeight > 10 && docTop(h) < 3000);
    const paras = [...document.querySelectorAll('p,li')].filter(x => x.offsetHeight > 10 && parseFloat(getComputedStyle(x).fontSize) < 20);
    return heads.map((h, i) => {
      const y = docTop(h), next = heads[i + 1] ? docTop(heads[i + 1]) : y + 700;
      const inside = paras.map(x => ({ y: docTop(x), h: x.offsetHeight })).filter(x => x.y > y && x.y < next).sort((a, c) => a.y - c.y);
      const s = getComputedStyle(h);
      const last = inside[inside.length - 1];
      return {
        t: (h.textContent || '').trim().slice(0, 24),
        fs: parseFloat(s.fontSize), lh: Math.round(parseFloat(s.lineHeight) * 10) / 10, hh: h.offsetHeight,
        toBody: inside.length ? inside[0].y - (y + h.offsetHeight) : null,
        toNext: last ? next - (last.y + last.h) : null,
      };
    });
  });
  await p.context().close();
}
console.log('heading                   src fs/lh h  toBody toNext   |  cln fs/lh h  toBody toNext');
for (let i = 0; i < Math.max(res.src.length, res.cln.length); i++) {
  const s = res.src[i], c = res.cln[i];
  const f = (o) => o ? `${String(o.fs).padStart(4)}/${String(o.lh).padStart(5)} ${String(o.hh).padStart(3)}  ${String(o.toBody).padStart(5)}  ${String(o.toNext).padStart(5)}` : '            -           ';
  console.log(`${((s && s.t) || (c && c.t) || '').padEnd(26)}${f(s)}  |  ${f(c)}`);
}
await b.close();
