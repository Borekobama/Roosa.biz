import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/blog', { waitUntil:'domcontentloaded', timeout:90000 });
  const samples=[];
  for (let i=0;i<14;i++) {
    const r = await p.evaluate(()=>{
      const h=[...document.querySelectorAll('h1,h2')].find(e=>/Resources and insights/i.test(e.textContent||''));
      if(!h) return null;
      const c=getComputedStyle(h); const r=h.getBoundingClientRect();
      return { y: Math.round(r.y), op: Number(c.opacity).toFixed(2) };
    });
    samples.push(r ? r.y+'/'+r.op : '-');
    await p.waitForTimeout(120);
  }
  console.log(label, samples.join('  '));
  await p.context().close();
}
await b.close();
