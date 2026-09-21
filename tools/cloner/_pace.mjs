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
  const rows=[];
  for (let y=1000; y<=4600; y+=300) {
    await p.evaluate(v=>window.scrollTo(0,v), y);
    await p.waitForTimeout(650);
    const s = await p.evaluate((pat)=>{
      const re=new RegExp(pat);
      const img=[...document.querySelectorAll('img')]
        .filter(i=>re.test(decodeURIComponent(i.currentSrc||i.src||'')) && i.getBoundingClientRect().width>300)[0];
      if(!img) return null;
      const r=img.getBoundingClientRect();
      return Math.round(r.x)+'/'+Math.round(r.y);
    }, pat);
    rows.push(y+':'+(s??'-'));
  }
  console.log(label, rows.join('  '));
  await p.context().close();
}
await b.close();
