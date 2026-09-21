import { chromium } from 'playwright';
/** The top of the SOL-G7 panel on both sides at phone: the panel box, the
 *  eyebrow that opens it, and where the heading falls relative to both. */
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
    const hy = docTop(head);
    // The panel: the nearest ancestor 358 wide and 571 tall.
    let panel = head, guard = 0, found = null;
    while (panel && guard++ < 10) {
      if (Math.abs(panel.offsetWidth - 358) < 3 && Math.abs(panel.offsetHeight - 571) < 6) { found = panel; break; }
      panel = panel.parentElement;
    }
    const eye = [...document.querySelectorAll('p,span,div')].map(e => ({ e, y: docTop(e) }))
      .filter(o => (o.e.textContent || '').trim().startsWith('SOL-G7') && o.y < hy && hy - o.y < 120 && o.e.offsetHeight > 10)
      .sort((a, c) => c.y - a.y)[0];
    const es = eye ? getComputedStyle(eye.e) : null;
    return {
      panel: found ? { y: docTop(found), h: found.offsetHeight } : null,
      head: hy,
      eye: eye ? { y: eye.y, h: eye.e.offsetHeight, w: eye.e.offsetWidth, bg: es.backgroundColor, pad: es.padding, fs: es.fontSize } : null,
    };
  });
  const pt = out.panel ? out.panel.y : null;
  console.log(`=== ${tag} ===`);
  console.log(`  panel y=${pt} h=${out.panel && out.panel.h}`);
  console.log(`  eyebrow ${out.eye ? `y=${out.eye.y} (panel+${out.eye.y - pt}) ${out.eye.w}x${out.eye.h} fs=${out.eye.fs} bg=${out.eye.bg} pad=${out.eye.pad}` : 'not found'}`);
  console.log(`  heading y=${out.head} (panel+${out.head - pt})`);
  await p.context().close();
}
await b.close();
