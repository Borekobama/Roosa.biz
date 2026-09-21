import { chromium } from 'playwright';

/**
 * Catch a one-shot scroll reveal.
 *
 * Earlier probes swept the whole page first so lazy content would mount, which
 * also fires any reveal that only runs once. This walks down to the target in
 * steps from a fresh load and samples as it enters, so a one-shot effect is
 * still armed when it comes into view.
 */
const b = await chromium.launch();
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2800);

  const state = () => p.evaluate(()=>{
    const h=[...document.querySelectorAll('h1,h2')]
      .filter(e=>/Daily well-being requires real/i.test(e.textContent||''))
      .sort((a,z)=>z.getBoundingClientRect().top-a.getBoundingClientRect().top)[0];
    if(!h) return null;
    const r=h.getBoundingClientRect();
    let n=h, op=1, tf='none';
    for(let i=0;i<6&&n;i++){ const c=getComputedStyle(n); op*=Number(c.opacity);
      if (c.scale && c.scale!=='none') tf='scale:'+c.scale;
      else if (c.transform!=='none' && tf==='none') tf=c.transform.slice(0,24);
      n=n.parentElement; }
    return { top: Math.round(r.top), op: op.toFixed(2), tf };
  });

  const seen=[];
  for (let y=0; y<20000; y+=450) {
    await p.evaluate(v=>window.scrollTo(0,v), y);
    await p.waitForTimeout(240);
    const s = await state();
    if (!s) continue;
    // record only while it is near or inside the viewport
    if (s.top < 1500 && s.top > -400) seen.push(`top=${s.top} op=${s.op} ${s.tf}`);
    if (s.top < -200) break;
  }
  console.log('=== '+label);
  seen.slice(0, 8).forEach(x=>console.log('   '+x));
  await p.context().close();
}
await b.close();
