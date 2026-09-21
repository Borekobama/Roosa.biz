import { chromium } from 'playwright';
/** Which panel layout the source uses at each width: the stacked sticky deck
 *  or the horizontal track. Our own switch is at Tailwind's md (768); the
 *  source's type steps at 720, so the two may disagree in between. */
const b = await chromium.launch();
for (const w of [390, 719, 720, 768, 1024, 1199, 1200, 1440]) {
  const p = await (await b.newContext({ viewport: { width: w, height: 844 }, isMobile: w < 720, hasTouch: w < 720 })).newPage();
  await p.goto('https://solene.framer.ai/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2300);
  await p.evaluate(async () => { for (let y = 0; y < 9000; y += 350) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 45)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(700);
  const r = await p.evaluate(() => {
    const st = [...document.querySelectorAll('*')].filter(e => getComputedStyle(e).position === 'sticky' && e.offsetHeight > 500 && e.offsetWidth > 250);
    const tall = st.map(e => `${e.offsetWidth}x${e.offsetHeight}@${Math.round(e.getBoundingClientRect().top + scrollY)}`);
    const panel = [...document.querySelectorAll('img')].find(i => i.currentSrc.includes('ucdAClc5'));
    return { stickies: tall, panelBox: panel ? `${panel.offsetWidth}x${panel.offsetHeight}` : '—', docH: document.body.scrollHeight };
  });
  console.log(`${String(w).padStart(5)} | stickies ${String(r.stickies.length).padStart(2)} ${r.stickies.slice(0, 3).join(' ').padEnd(46)} tennis panel ${r.panelBox.padEnd(10)} doc ${r.docH}`);
  await p.context().close();
}
await b.close();
