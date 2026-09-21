import { chromium } from 'playwright';

/** Does the site animate when navigating between pages, or just swap? */
const b = await chromium.launch();
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(3200);
  // click through to Science and watch the header + first heading settle
  await p.locator('nav a', { hasText: 'Science' }).first().click().catch(async()=>{
    await p.locator('a', { hasText: 'Science' }).first().click();
  });
  const rows=[];
  for (let i=0;i<12;i++) {
    rows.push(await p.evaluate(()=>{
      const hdr=[...document.querySelectorAll('header,nav')].map(e=>e.getBoundingClientRect()).filter(r=>r.width>800)[0];
      const h=[...document.querySelectorAll('h1')].find(e=>/brazil/i.test(e.textContent||''));
      let op=1,n=h,dy=0;
      for(let k=0;k<5&&n;k++){ const c=getComputedStyle(n); op*=Number(c.opacity);
        dy += new DOMMatrixReadOnly(c.transform).m42; n=n.parentElement; }
      return (hdr?Math.round(hdr.top):'-')+'/'+(h?Math.round(h.getBoundingClientRect().top):'-')+'/'+op.toFixed(2)+'/'+Math.round(dy);
    }));
    await p.waitForTimeout(110);
  }
  console.log(label.padEnd(4), rows.join(' '));
  await p.context().close();
}
await b.close();
