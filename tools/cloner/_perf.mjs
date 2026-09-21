import { chromium } from 'playwright';
const b = await chromium.launch();
const run = async (base, label) => {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  const res = await p.evaluate(async () => {
    const frames = [];
    let last = performance.now();
    let raf = 0;
    const tick = (t) => { frames.push(t - last); last = t; raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    // Steady scroll through the page.
    for (let y = 0; y < 9000; y += 120) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 16));
    }
    cancelAnimationFrame(raf);
    const sorted = frames.slice(5).sort((a, b) => a - b);
    const pct = (q) => sorted[Math.floor(sorted.length * q)] ?? 0;
    const longFrames = sorted.filter(f => f > 50).length;
    return {
      frames: sorted.length,
      median: +pct(0.5).toFixed(1),
      p95: +pct(0.95).toFixed(1),
      worst: +(sorted[sorted.length - 1] ?? 0).toFixed(1),
      over50ms: longFrames,
    };
  });
  await p.close();
  console.log(label, JSON.stringify(res));
};
await run('https://solene.framer.ai', 'SOURCE');
await run('http://localhost:3111', 'CLONE ');
await b.close();
