import { chromium } from 'playwright';
/** The SOL-G7 panel box at phone, and where the mark sits inside it. */
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
    // The panel is the nearest ancestor whose width is the full 358 and which is rounded.
    let panel = head, guard = 0;
    while (panel && guard++ < 8) {
      const s = getComputedStyle(panel);
      if (panel.offsetWidth >= 340 && parseFloat(s.borderRadius) > 8) break;
      panel = panel.parentElement;
    }
    const pr = panel ? { y: docTop(panel), w: panel.offsetWidth, h: panel.offsetHeight, r: getComputedStyle(panel).borderRadius.split(' ')[0] } : null;
    const mark = [...document.querySelectorAll('img')].filter(i => i.offsetWidth > 120 && i.offsetWidth < 300 && i.offsetHeight > 80 && i.offsetHeight < 400)
      .map(i => ({ w: i.offsetWidth, h: i.offsetHeight, y: docTop(i), x: Math.round(i.getBoundingClientRect().left), src: i.currentSrc.split('/').pop().slice(0, 18) }));
    return { head: docTop(head), panel: pr, mark };
  });
  console.log(`=== ${tag} ===`);
  console.log(`  heading y=${out.head}`);
  console.log(`  panel ${out.panel ? `y=${out.panel.y} ${out.panel.w}x${out.panel.h} r=${out.panel.r}  heading inset ${out.head - out.panel.y}` : 'not found'}`);
  out.mark.forEach(m => console.log(`  mark ${m.w}x${m.h} at x=${m.x} y=${m.y} (${out.panel ? m.y - out.panel.y : '?'} into the panel)  ${m.src}`));
  await p.context().close();
}
await b.close();
