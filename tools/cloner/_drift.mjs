import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [base,label,stem] of [
  ['https://solene.framer.ai','src','Mzgz4AmB2aupraPExmtQhpMELI'],
  [process.env.CLONE_BASE??'http://localhost:3111','cln','Mzgz4AmB2aupraPExmtQhpMELI'],
]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,55));}});
  await p.waitForTimeout(700);
  const anchor = await p.evaluate(()=>{
    const i=[...document.querySelectorAll('img')].find(x=>/IxYJnqJjzU3Q0N8ifNUIKEjtxn0/.test(decodeURIComponent(x.currentSrc||x.src||'')));
    return i? Math.round(i.getBoundingClientRect().top+window.scrollY) : null;
  });
  const rows=[];
  for (const d of [0,120,240,360,480]) {
    await p.evaluate(v=>window.scrollTo(0,v), anchor+d);
    await p.waitForTimeout(520);
    const y = await p.evaluate((stem)=>{
      const i=[...document.querySelectorAll('img')].filter(x=>new RegExp(stem).test(decodeURIComponent(x.currentSrc||x.src||'')))
        .map(x=>x.getBoundingClientRect()).filter(r=>r.width>60&&r.top>-200&&r.top<1100).sort((a,b)=>a.top-b.top)[0];
      return i? Math.round(i.top) : null;
    }, stem);
    rows.push(d+':'+y);
  }
  // per-120 delta tells the drift: 120 means static, 96 means 0.2x parallax
  const ys = rows.map(r=>Number(r.split(':')[1]));
  const deltas = ys.slice(1).map((v,i)=>ys[i]-v);
  console.log(label, rows.join('  '), '| deltas', deltas.join(','));
  await p.context().close();
}
await b.close();
