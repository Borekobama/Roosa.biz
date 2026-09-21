import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('https://solene.framer.ai/', { waitUntil:'domcontentloaded', timeout:90000 });
await p.waitForTimeout(2500);
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}});
await p.waitForTimeout(800);
// anchor: the routine panel image
const anchor = await p.evaluate(()=>{
  const img=[...document.querySelectorAll('img')].find(i=>/HmBptSSqZF2BuLVPrA1rifChmQ/.test(i.currentSrc||''));
  return img? true:false;
});
console.log('anchor', anchor);
for (let y=3000; y<=9000; y+=250) {
  await p.evaluate(v=>window.scrollTo(0,v), y);
  await p.waitForTimeout(500);
  const s = await p.evaluate(()=>{
    const img=[...document.querySelectorAll('img')].find(i=>/HmBptSSqZF2BuLVPrA1rifChmQ/.test(i.currentSrc||''));
    if(!img) return 'n/a';
    const r=img.getBoundingClientRect();
    return `x=${r.x.toFixed(0)} y=${r.y.toFixed(0)} ${r.width.toFixed(0)}x${r.height.toFixed(0)}`;
  });
  console.log(y, s);
}
await b.close();
