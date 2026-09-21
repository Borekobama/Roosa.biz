import { chromium } from 'playwright';
/**
 * True bitmap size of every large image, by decoding currentSrc rather than
 * reading naturalWidth.
 *
 * naturalWidth is NOT the bitmap size when a srcset `w` descriptor is used: the
 * UA divides the intrinsic size by the density it derived from the chosen
 * candidate and `sizes`. A 1536px bitmap picked as a 1920w candidate at
 * sizes=100vw on a 1440 viewport reports naturalWidth 1152 (1536 / (1920/1440)),
 * which reads as a 1.22x upscale that is not happening.
 */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 450) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  await p.waitForTimeout(600);
  const rows = await p.evaluate(async () => {
    const out = [];
    for (const i of document.querySelectorAll('img')) {
      const r = i.getBoundingClientRect();
      if (r.width < 600) continue;
      let bw = 0, bh = 0;
      try {
        const blob = await (await fetch(i.currentSrc)).blob();
        const bm = await createImageBitmap(blob);
        bw = bm.width; bh = bm.height; bm.close();
      } catch { /* cross-origin or blocked: fall back to naturalWidth */ bw = i.naturalWidth; bh = i.naturalHeight; }
      const stem = decodeURIComponent(i.currentSrc).split('/').pop().replace(/[?&].*$/, '').slice(0, 28);
      const up = bw ? r.width / bw : 0;
      out.push(`${stem.padEnd(30)} rendered ${Math.round(r.width)}x${Math.round(r.height)}  bitmap ${bw}x${bh}  naturalWidth ${i.naturalWidth}  scale ${up.toFixed(2)}x${up > 1.05 ? '  <<< UPSCALED' : ''}`);
    }
    return out;
  });
  console.log('=== ' + tag + ' ==='); [...new Set(rows)].forEach(r => console.log('  ' + r));
  await p.context().close();
}
await b.close();
