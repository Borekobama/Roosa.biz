import { chromium } from 'playwright';
/** The ellipse renders as a soft wash, so read its filter/opacity/blend at
 *  both widths, and the bottom art's asset, before rebuilding it. */
const b = await chromium.launch();
for (const c of [{ w: 1440, h: 900, mobile: false, tag: 'DESKTOP', y: 2500 }, { w: 390, h: 844, mobile: true, tag: 'PHONE  ', y: 2200 }]) {
  const p = await (await b.newContext({ viewport: { width: c.w, height: c.h }, isMobile: c.mobile, hasTouch: c.mobile })).newPage();
  await p.goto('https://solene.framer.ai/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2600);
  await p.evaluate(async () => { for (let y = 0; y < 9000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  await p.evaluate((v) => window.scrollTo(0, v), c.y);
  await p.waitForTimeout(800);
  const out = await p.evaluate(() => {
    const head = [...document.querySelectorAll('h1,h2,h3')].find(x => (x.textContent || '').trim().startsWith('Small habits'));
    let panel = head.parentElement;
    while (panel && getComputedStyle(panel).backgroundColor === 'rgba(0, 0, 0, 0)') panel = panel.parentElement;
    const blob = [...panel.querySelectorAll('div')].find(n => getComputedStyle(n).borderRadius.startsWith('100'));
    const s = getComputedStyle(blob);
    const par = getComputedStyle(blob.parentElement);
    const pr = blob.parentElement.getBoundingClientRect(), br = blob.getBoundingClientRect();
    return {
      blob: { filter: s.filter, opacity: s.opacity, blend: s.mixBlendMode, bg: s.backgroundColor, z: s.zIndex, pos: s.position, inset: `${s.left}/${s.top}/${s.right}/${s.bottom}`, w: s.width, h: s.height },
      wrapper: { w: Math.round(pr.width), h: Math.round(pr.height), ov: par.overflow, filter: par.filter, cls: (blob.parentElement.className || '').toString().slice(0, 30), dx: Math.round(br.left - pr.left), dy: Math.round(br.top - pr.top) },
      art: [...panel.querySelectorAll('img')].map(i => `${i.offsetWidth}x${i.offsetHeight} ${i.currentSrc.split('/').pop().slice(0, 40)}`),
    };
  });
  console.log(`=== ${c.tag} ===`);
  console.log('  blob   ', JSON.stringify(out.blob));
  console.log('  wrapper', JSON.stringify(out.wrapper));
  console.log('  art    ', out.art.join(' | '));
  await p.context().close();
}
await b.close();
