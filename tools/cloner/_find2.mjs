import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('https://solene.framer.ai/', { waitUntil:'domcontentloaded', timeout:90000 });
await p.waitForTimeout(2500);
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}});
await p.waitForTimeout(900);
const q = process.argv[2];
const r = await p.evaluate((q)=>[...document.querySelectorAll('*')]
  .filter(e=>e.children.length===0 && (e.textContent||'').toLowerCase().includes(q.toLowerCase()))
  .map(e=>`<${e.tagName}> "${e.textContent.trim().slice(0,60)}"`), q);
console.log([...new Set(r)].join('\n'));
await b.close();
