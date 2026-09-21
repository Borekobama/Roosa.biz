import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto((process.env.CLONE_BASE??'http://localhost:3111')+'/merch/daily-multivitamin', { waitUntil:'domcontentloaded' });
await p.waitForTimeout(1600);
const read = () => p.evaluate(()=>{
  const main=[...document.querySelectorAll('img')].filter(i=>i.getBoundingClientRect().width>300)[0];
  const thumbs=[...document.querySelectorAll('button img')].map(i=>{const r=i.getBoundingClientRect();
    return Math.round(r.x)+','+Math.round(r.y)+' '+Math.round(r.width)+'x'+Math.round(r.height);});
  return { main: decodeURIComponent(main?.currentSrc||'').split('/').pop().slice(0,40), thumbs };
});
const before = await read();
console.log('BEFORE', JSON.stringify(before));
const t = p.locator('button:has(img)').nth(1);
if (await t.count()) { await t.click(); await p.waitForTimeout(700); }
const after = await read();
console.log('AFTER ', JSON.stringify(after));
console.log('CHANGED', before.main !== after.main);
await b.close();
