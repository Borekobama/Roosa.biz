import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto((process.env.CLONE_BASE??'http://localhost:3111')+'/', { waitUntil:'domcontentloaded', timeout:60000 });
await p.waitForTimeout(1800);
const r = await p.evaluate(()=>{
  const a=[...document.querySelectorAll('nav[aria-label="Primary"] a')].find(x=>x.textContent.trim()==='Science');
  if(!a) return 'no link';
  const r=a.getBoundingClientRect();
  const cx=r.x+r.width/2, cy=r.y+r.height/2;
  const hit=document.elementFromPoint(cx,cy);
  return {rect:[Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)],
    hit: hit? `${hit.tagName}.${hit.className}`.slice(0,120):'none',
    isLink: hit===a || a.contains(hit)};
});
console.log(JSON.stringify(r,null,1));
await b.close();
