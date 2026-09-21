import { chromium } from 'playwright';
/** The testimonial plate at both widths, both sides: its box, radius and the
 *  space between the pinned heading and it. */
const b = await chromium.launch();
for (const [w, tag] of [[390, 'PHONE  '], [1440, 'DESKTOP']]) {
  for (const [base, side] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
    const p = await (await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 720, hasTouch: w < 720 })).newPage();
    await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await p.waitForTimeout(2400);
    await p.evaluate(async () => { for (let y = 0; y < 16000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } });
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(700);
    const out = await p.evaluate(() => {
      const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
      const head = [...document.querySelectorAll('h1,h2,h3')].find(x => /listen just from us/i.test(x.textContent || ''));
      const plate = [...document.querySelectorAll('img')].find(i => i.offsetHeight > 1200 && i.offsetWidth > 300);
      if (!plate) return { miss: true };
      // the plate's clipping box
      let clip = plate.parentElement, guard = 0, box = null;
      while (clip && guard++ < 5) {
        const s = getComputedStyle(clip);
        if (s.overflow === 'hidden' || parseFloat(s.borderRadius) > 2) { box = clip; break; }
        clip = clip.parentElement;
      }
      const bs = box ? getComputedStyle(box) : null;
      return {
        head: head ? { y: docTop(head), h: head.offsetHeight } : null,
        plate: { y: docTop(plate), w: plate.offsetWidth, h: plate.offsetHeight, x: Math.round(plate.getBoundingClientRect().left) },
        box: box ? { w: box.offsetWidth, h: box.offsetHeight, r: bs.borderRadius.split(' ')[0], x: Math.round(box.getBoundingClientRect().left) } : null,
      };
    });
    if (out.miss) { console.log(`${tag} ${side}  plate not found`); continue; }
    const gap = out.head ? out.plate.y - (out.head.y + out.head.h) : null;
    console.log(`${tag} ${side}  heading y=${out.head && out.head.y} h=${out.head && out.head.h}  plate ${out.plate.w}x${out.plate.h} at x=${out.plate.x} y=${out.plate.y}  gap ${gap}  clip ${out.box ? `${out.box.w}x${out.box.h} r=${out.box.r} x=${out.box.x}` : '-'}`);
    await p.context().close();
  }
}
await b.close();
