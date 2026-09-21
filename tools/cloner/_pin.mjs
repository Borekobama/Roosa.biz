import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [base,label,pat] of [
  ['https://solene.framer.ai','src','HmBptSSqZF2BuLVPrA1rifChmQ'],
  [process.env.CLONE_BASE??'http://localhost:3111','cln','ynjap27ce8p5ymgbOTb5sMmKMGQ|HmBptSSqZF2BuLVPrA1rifChmQ'],
]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,55));}});
  await p.waitForTimeout(700);
  let first=null, last=null;
  for (let y=400; y<=5600; y+=100) {
    await p.evaluate(v=>window.scrollTo(0,v), y);
    await p.waitForTimeout(260);
    const t = await p.evaluate((pat)=>{
      const re=new RegExp(pat);
      const i=[...document.querySelectorAll('img')].filter(x=>re.test(decodeURIComponent(x.currentSrc||x.src||'')) && x.getBoundingClientRect().width>300)[0];
      return i? Math.round(i.getBoundingClientRect().top) : null;
    }, pat);
    if (t!=null && t>=0 && t<=120) { if (first==null) first=y; last=y; }
  }
  console.log(label, 'pinned from', first, 'to', last, '=> range', last-first);
  await p.context().close();
}
await b.close();
