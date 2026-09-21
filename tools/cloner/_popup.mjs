import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/science', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2600);
  const target = await p.evaluate(()=>{
    const e=[...document.querySelectorAll('*')].filter(x=>x.children.length===0&&/^4\.2h$/.test((x.textContent||'').trim()))[0];
    return e? Math.round(e.getBoundingClientRect().top+window.scrollY) : null;
  });
  if (target==null) { console.log(label,'stat not found'); await p.context().close(); continue; }
  const sample = async (off) => {
    await p.evaluate(v=>window.scrollTo(0,v), target-off);
    await p.waitForTimeout(520);
    return p.evaluate(()=>{
      const e=[...document.querySelectorAll('*')].filter(x=>x.children.length===0&&/^4\.2h$/.test((x.textContent||'').trim()))[0];
      let n=e, op=1, tr='none';
      for (let i=0;i<7&&n;i++){ const c=getComputedStyle(n); op*=Number(c.opacity);
        if (c.transform!=='none') tr=c.transform.slice(0,30); if (c.scale && c.scale!=='none') tr='scale:'+c.scale; n=n.parentElement; }
      return op.toFixed(2)+' '+tr;
    });
  };
  console.log(label.padEnd(4), 'far:', await sample(1000), '| near:', await sample(600), '| in view:', await sample(300));
  await p.context().close();
}
await b.close();
