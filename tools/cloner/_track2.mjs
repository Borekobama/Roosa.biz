import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [base,label,pat] of [['https://solene.framer.ai','src','HmBptSSqZF2BuLVPrA1rifChmQ'],[process.env.CLONE_BASE??'http://localhost:3111','cln','HmBptSSqZF2BuLVPrA1rifChmQ']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2200);
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,50));}});
  await p.waitForTimeout(700);
  const rows=[];
  for (let y=1500; y<=8000; y+=100) {
    await p.evaluate(v=>window.scrollTo(0,v), y);
    await p.waitForTimeout(140);
    const s = await p.evaluate((pat)=>{
      const img=[...document.querySelectorAll('img')].filter(i=>new RegExp(pat).test(i.currentSrc||'')).filter(i=>i.getBoundingClientRect().width>100)[0];
      if(!img) return null; const r=img.getBoundingClientRect();
      return {x:Math.round(r.x), y:Math.round(r.y), w:Math.round(r.width)};
    }, pat);
    if (s) rows.push([y,s.x,s.y,s.w]);
  }
  // pin range: y stays constant
  const pinned = rows.filter(r=>Math.abs(r[2]-rows[Math.floor(rows.length/3)][2])<12);
  const first=rows.find(r=>r[1]>-30&&r[1]<30);
  const last=rows.filter(r=>r[2]===(pinned[0]||[])[2]).pop();
  console.log(label, 'samples', rows.length, 'panelW', rows[0][3]);
  console.log('  x@1st', rows[0], 'x@last', rows[rows.length-1]);
  // ratio over pinned span
  const p1=pinned[0], p2=pinned[pinned.length-1];
  if (p1&&p2&&p2[0]!==p1[0]) console.log('  pinned scroll', p1[0], '->', p2[0], 'x', p1[1], '->', p2[1], 'ratio', ((p1[1]-p2[1])/(p2[0]-p1[0])).toFixed(3));
  await p.context().close();
}
await b.close();
