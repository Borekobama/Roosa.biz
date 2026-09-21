import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,55));}});
  await p.evaluate(()=>window.scrollTo(0,0));
  await p.waitForTimeout(900);
  // group images by their document row
  const r = await p.evaluate(()=>{
    const rows={};
    for (const i of document.querySelectorAll('img')) {
      const rect=i.getBoundingClientRect();
      if (rect.width<150 || rect.width>500) continue;
      const y=Math.round((rect.y+window.scrollY)/40)*40;
      (rows[y] ||= []).push(Math.round(rect.width)+'x'+Math.round(rect.height));
    }
    return Object.entries(rows).filter(([,v])=>v.length>=3).map(([y,v])=>y+': '+v.length+' tiles '+v.slice(0,4).join(' '));
  });
  console.log('=== '+label); r.forEach(x=>console.log('  '+x));
  await p.context().close();
}
await b.close();
