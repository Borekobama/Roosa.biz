import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(3000);
  const r = await p.evaluate(()=>{
    const out={};
    const big=[...document.querySelectorAll('img')].map(i=>({i,r:i.getBoundingClientRect()}))
      .filter(x=>x.r.width>500 && x.r.top<900 && x.r.bottom>0)
      .sort((a,b)=>a.r.top-b.r.top)[0];
    if (big) { const c=getComputedStyle(big.i);
      out.heroImage={x:Math.round(big.r.x),y:Math.round(big.r.y),w:Math.round(big.r.width),h:Math.round(big.r.height),r:c.borderRadius}; }
    // the panel that holds it
    if (big) { let n=big.i; for(let k=0;k<5;k++){const q=n.parentElement; if(!q)break; n=q; const rr=q.getBoundingClientRect();
      if (rr.width>=big.r.width && rr.height>=big.r.height) { out.heroBox={x:Math.round(rr.x),y:Math.round(rr.y),w:Math.round(rr.width),h:Math.round(rr.height),r:getComputedStyle(q).borderRadius}; break; } } }
    return out;
  });
  console.log(label, JSON.stringify(r));
  await p.context().close();
}
await b.close();
