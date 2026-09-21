import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/science', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2600);
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,55));}});
  // park on the ingredient strip
  await p.evaluate(()=>{
    const e=[...document.querySelectorAll('*')].filter(x=>x.children.length===0&&/Natural Ingredients/i.test(x.textContent||''))[0];
    if(e) window.scrollTo(0, e.getBoundingClientRect().top+window.scrollY-200);
  });
  await p.waitForTimeout(1200);
  const xs=[];
  for (let i=0;i<6;i++) {
    const x = await p.evaluate(()=>{
      const i=[...document.querySelectorAll('img')].map(n=>({n,r:n.getBoundingClientRect()}))
        .filter(o=>o.r.width>200&&o.r.width<500&&o.r.top>0&&o.r.top<900)
        .sort((a,b)=>a.r.x-b.r.x)[0];
      return i? Math.round(i.r.x) : null;
    });
    xs.push(x);
    await p.waitForTimeout(500);
  }
  const deltas = xs.slice(1).map((v,i)=> (v!=null&&xs[i]!=null)? v-xs[i] : null);
  console.log(label.padEnd(4), xs.join(' '), '| px per 500ms:', deltas.join(','));
  await p.context().close();
}
await b.close();
