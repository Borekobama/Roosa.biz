import { chromium } from 'playwright';
const KEYS = ['One formula','Well-being that','Small habits','Intelligent nutrition','elevates your everyday',
              'Real clarity','Know more about','Ingredients','listen','Frequently asked','regenerative','Daily well-being requires'];
const b = await chromium.launch();
const res = {};
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,55));}});
  await p.evaluate(()=>window.scrollTo(0,0));
  await p.waitForTimeout(900);
  res[label] = await p.evaluate((keys)=>{
    const out={};
    for (const k of keys) {
      const e=[...document.querySelectorAll('h1,h2,h3,h4,h5,p,span,div')]
        .filter(x=>x.children.length===0 && (x.textContent||'').includes(k))
        .map(x=>x.getBoundingClientRect()).filter(r=>r.width>0).sort((a,b)=>a.top-b.top)[0];
      out[k] = e ? Math.round(e.top+window.scrollY) : null;
    }
    out['__height'] = document.documentElement.scrollHeight;
    return out;
  }, KEYS);
  await p.context().close();
}
console.log('key'.padEnd(26), 'source'.padStart(7), 'clone'.padStart(7), 'delta'.padStart(7));
for (const k of [...KEYS,'__height']) {
  const s=res.src[k], c=res.cln[k];
  console.log(k.padEnd(26), String(s??'-').padStart(7), String(c??'-').padStart(7), (s!=null&&c!=null?String(c-s):'-').padStart(7));
}
await b.close();
