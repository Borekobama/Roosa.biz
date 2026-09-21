import { chromium } from 'playwright';
/** The "Know more" button inside the SOL-G7 panel at phone: its box and the
 *  space above and below it, both sides. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < 16000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } });
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(700);
  const out = await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const head = [...document.querySelectorAll('h1,h2,h3')].find(x => (x.textContent || '').trim().startsWith('Know more about'));
    const y0 = docTop(head), hb = y0 + head.offsetHeight;
    const btn = [...document.querySelectorAll('a,button')].map(e => ({ e, y: docTop(e) }))
      .filter(o => o.y > hb - 10 && o.y < hb + 160 && o.e.offsetHeight > 20 && (o.e.textContent || '').trim().length > 2)
      .sort((a, c) => a.y - c.y)[0];
    const stat = [...document.querySelectorAll('h1,h2,h3,p')].find(x => (x.textContent || '').trim().startsWith('3—5x'));
    const foot = [...document.querySelectorAll('p')].find(x => (x.textContent || '').trim().startsWith('*For'));
    const body = [...document.querySelectorAll('p')].find(x => (x.textContent || '').trim().startsWith('More efficient'));
    const s = foot ? getComputedStyle(foot) : null;
    return {
      headBottom: hb - y0,
      btn: btn ? { y: btn.y - y0, h: btn.e.offsetHeight, text: (btn.e.textContent || '').trim().slice(0, 14) } : null,
      stat: stat ? docTop(stat) - y0 : null,
      body: body ? { y: docTop(body) - y0, h: body.offsetHeight } : null,
      foot: foot ? { y: docTop(foot) - y0, h: foot.offsetHeight, fs: s.fontSize, lh: s.lineHeight } : null,
    };
  });
  console.log(`=== ${tag} ===`);
  console.log(`  heading bottom ${out.headBottom}`);
  console.log(`  button  ${out.btn ? `y=${out.btn.y} h=${out.btn.h} "${out.btn.text}"  gap above ${out.btn.y - out.headBottom}, below ${out.stat - (out.btn.y + out.btn.h)}` : 'not found'}`);
  console.log(`  stat    y=${out.stat}`);
  console.log(`  body    y=${out.body.y} h=${out.body.h}   gap ${out.body.y - out.stat - 42}`);
  console.log(`  foot    y=${out.foot.y} h=${out.foot.h} ${out.foot.fs}/${out.foot.lh}  gap ${out.foot.y - (out.body.y + out.body.h)}`);
  await p.context().close();
}
await b.close();
