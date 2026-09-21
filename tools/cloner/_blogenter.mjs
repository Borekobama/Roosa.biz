import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/blog', { waitUntil:'domcontentloaded', timeout:90000 });
  const rows=[];
  for (let i=0;i<14;i++) {
    const s = await p.evaluate(()=>{
      const hdr=[...document.querySelectorAll('header,nav')].map(e=>e.getBoundingClientRect()).filter(r=>r.width>800)[0];
      const h=[...document.querySelectorAll('h1,h2')].find(e=>/Resources and insights/i.test(e.textContent||''));
      let op=1,n=h; for(let k=0;k<5&&n;k++){op*=Number(getComputedStyle(n).opacity);n=n.parentElement;}
      const card=[...document.querySelectorAll('main img')].map(i=>i.getBoundingClientRect()).filter(r=>r.width>400)[0];
      return [hdr?Math.round(hdr.top):null, h?Math.round(h.getBoundingClientRect().top):null, op.toFixed(2), card?Math.round(card.top):null].join('/');
    });
    rows.push(s);
    await p.waitForTimeout(110);
  }
  console.log(label.padEnd(4), rows.join(' '));
  await p.context().close();
}
await b.close();
