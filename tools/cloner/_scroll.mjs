import { chromium } from 'playwright';

/**
 * Scroll cost, measured the same way on both sides: CPU throttled 6x, then a
 * scripted scroll down the whole page one viewport at a time, recording how
 * long each step's frame took and how many long tasks the main thread ran.
 */
const b = await chromium.launch();
for (const [base,label] of [['https://solene.framer.ai','source'],[process.env.CLONE_BASE??'http://localhost:3111','clone']]) {
  const ctx = await b.newContext({viewport:{width:1440,height:900}});
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
  await p.goto(base+'/', { waitUntil:'domcontentloaded', timeout:120000 });
  await p.waitForTimeout(3500);
  const out = await p.evaluate(async () => {
    const long = [];
    const po = new PerformanceObserver((l)=>{ for (const e of l.getEntries()) long.push(Math.round(e.duration)); });
    try { po.observe({ entryTypes: ['longtask'] }); } catch {}
    const frames = [];
    const h = document.documentElement.scrollHeight;
    const t0 = performance.now();
    for (let y = 0; y < h; y += 600) {
      const a = performance.now();
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      frames.push(performance.now() - a);
    }
    const total = performance.now() - t0;
    po.disconnect();
    frames.sort((x, y) => x - y);
    return {
      steps: frames.length,
      totalMs: Math.round(total),
      medianFrameMs: Math.round(frames[Math.floor(frames.length / 2)]),
      p95FrameMs: Math.round(frames[Math.floor(frames.length * 0.95)]),
      worstFrameMs: Math.round(frames[frames.length - 1]),
      longTasks: long.length,
      longTaskMs: long.reduce((a, b) => a + b, 0),
      docHeight: h,
    };
  });
  console.log(label.padEnd(7), JSON.stringify(out));
  await ctx.close();
}
await b.close();
