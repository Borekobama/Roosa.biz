import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2600);
  await p.evaluate(()=>window.scrollTo(0,1500));
  await p.waitForTimeout(900);
  const r = await p.evaluate(()=>{
    const out={};
    // anything painting a band across the top
    const bands=[];
    for (const e of document.querySelectorAll('*')) {
      const r=e.getBoundingClientRect(); const c=getComputedStyle(e);
      if (r.top>-10 && r.top<12 && r.width>1200 && r.height<200 &&
          (c.backgroundColor!=='rgba(0, 0, 0, 0)' || c.backdropFilter!=='none'))
        bands.push(`<${e.tagName}> ${Math.round(r.width)}x${Math.round(r.height)} bg=${c.backgroundColor} blur=${c.backdropFilter} pos=${c.position}`);
    }
    out.topBands=[...new Set(bands)].slice(0,4);
    // what sits directly under the header's midpoint
    const hit=document.elementFromPoint(720,35);
    out.under = hit ? `${hit.tagName}.${String(hit.className).slice(0,50)}` : null;
    // the pixel colour just below the header, at the page's left edge
    return out;
  });
  console.log('=== '+label, JSON.stringify(r,null,1));
  await p.context().close();
}
await b.close();
