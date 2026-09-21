import { chromium } from 'playwright';
/** Is the pinned track's inline transform actually changing frame to frame? */
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto((process.env.CLONE_BASE ?? 'http://localhost:3111') + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
await p.waitForTimeout(2200);
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
await p.evaluate(() => window.scrollTo(0, 2000));
await p.waitForTimeout(1500);
console.log(await p.evaluate(async () => {
  const tracks = [...document.querySelectorAll('div')].filter(d => (d.style.transform || '').includes('translate3d'));
  if (!tracks.length) return 'no element with an inline translate3d';
  const t = tracks[0];
  const out = [`found ${tracks.length} track(s); first: "${t.style.transform}" class="${t.className.slice(0, 40)}"`];
  const samples = [];
  const t0 = performance.now();
  window.scrollTo(0, 3000);
  await new Promise((res) => {
    const step = () => {
      samples.push(`${Math.round(performance.now() - t0)}:${t.style.transform.replace(/translate3d\(|, 0px, 0px\)|%/g, '')}`);
      if (performance.now() - t0 < 400) requestAnimationFrame(step); else res();
    };
    requestAnimationFrame(step);
  });
  out.push(samples.filter((_, i) => i % 3 === 0).join('  '));
  return out.join('\n');
}));
await b.close();
