import { chromium } from 'playwright';
/** Does the phone image panel carry a scrim as a pseudo-element? A plain
 *  descendant sweep cannot see ::before/::after, and dropping a scrim that is
 *  really there would leave white text on a bare photo. */
const b = await chromium.launch();
for (const [w, tag] of [[390, 'PHONE  '], [1440, 'DESKTOP']]) {
  const p = await (await b.newContext({ viewport: { width: w, height: 844 }, isMobile: w < 720, hasTouch: w < 720 })).newPage();
  await p.goto('https://solene.framer.ai/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let y = 0; y < 9000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 45)); } });
  await p.evaluate(() => window.scrollTo(0, w => w));
  await p.waitForTimeout(600);
  const out = await p.evaluate(() => {
    const img = [...document.querySelectorAll('img')].find(i => i.currentSrc.includes('ucdAClc5'));
    if (!img) return { miss: true };
    const rows = [];
    let n = img.parentElement, d = 0;
    while (n && d < 6) {
      for (const pseudo of ['::before', '::after']) {
        const s = getComputedStyle(n, pseudo);
        if (s.content && s.content !== 'none' && (s.backgroundImage !== 'none' || s.backgroundColor !== 'rgba(0, 0, 0, 0)')) {
          rows.push(`  depth ${d} ${pseudo} bg=${s.backgroundColor} img=${s.backgroundImage.slice(0, 70)} h=${s.height}`);
        }
      }
      const s = getComputedStyle(n);
      if (s.backgroundImage.includes('gradient')) rows.push(`  depth ${d} element bg-image ${s.backgroundImage.slice(0, 70)}`);
      n = n.parentElement; d++;
    }
    // Also sample the rendered pixel under the headline against the photo above it.
    return { rows, filter: getComputedStyle(img).filter };
  });
  console.log(`=== ${tag} ===`);
  if (out.miss) console.log('  panel image not found');
  else { console.log('  img filter:', out.filter); out.rows.length ? out.rows.forEach(r => console.log(r)) : console.log('  no gradient on any ancestor or pseudo-element'); }
  await p.context().close();
}
await b.close();
