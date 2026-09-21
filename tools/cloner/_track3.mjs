import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('https://solene.framer.ai/', { waitUntil:'domcontentloaded', timeout:90000 });
await p.waitForTimeout(2500);
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}});
await p.evaluate(()=>window.scrollTo(0,3000));
await p.waitForTimeout(900);
const r = await p.evaluate(()=>{
  const img=[...document.querySelectorAll('img')].find(i=>/HmBptSSqZF2BuLVPrA1rifChmQ/.test(i.currentSrc||''));
  let panel=img; for(let i=0;i<8;i++){ const q=panel.parentElement; if(!q) break; const rr=q.getBoundingClientRect(); if(rr.width>2000) { panel=q; break; } panel=q; }
  const tr=panel.getBoundingClientRect();
  const kids=[...panel.children].map(k=>{const r=k.getBoundingClientRect();
    return {x:Math.round(r.x-tr.x), w:Math.round(r.width), h:Math.round(r.height), text:(k.innerText||'').replace(/\s+/g,' ').slice(0,60)};});
  return {track:{x:Math.round(tr.x),w:Math.round(tr.width),h:Math.round(tr.height)}, kids};
});
console.log(JSON.stringify(r,null,1));
await b.close();
