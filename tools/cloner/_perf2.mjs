import { chromium } from 'playwright';
const b = await chromium.launch();
const run = async (base, label, rate) => {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate });
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(3500);
  const res = await p.evaluate(async () => {
    const frames = [];
    let last = performance.now(), raf = 0;
    const tick = (t) => { frames.push(t - last); last = t; raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    for (let y = 0; y < 9000; y += 150) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 16));
    }
    cancelAnimationFrame(raf);
    const f = frames.slice(5).sort((a, b) => a - b);
    return {
      median: +(f[Math.floor(f.length/2)] ?? 0).toFixed(1),
      p95: +(f[Math.floor(f.length*0.95)] ?? 0).toFixed(1),
      worst: +(f[f.length-1] ?? 0).toFixed(1),
      over50: f.filter(x => x > 50).length,
    };
  });
  await ctx.close();
  console.log(`${label} @${rate}x throttle`, JSON.stringify(res));
};
await run('https://solene.framer.ai', 'SOURCE', 4);
await run('http://localhost:3111', 'CLONE ', 4);
await b.close();
