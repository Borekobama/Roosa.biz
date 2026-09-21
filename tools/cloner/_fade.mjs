import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2600);
  const rows=[];
  for (let y=500; y<=2200; y+=150) {
    await p.evaluate(v=>window.scrollTo(0,v), y);
    await p.waitForTimeout(420);
    const s = await p.evaluate(()=>{
      const e=[...document.querySelectorAll('h1,h2,h3')].find(x=>/One formula/i.test(x.textContent||''));
      if(!e) return '-';
      const r=e.getBoundingClientRect();
      // opacity can sit on any ancestor, so fold them together
      let op=1, n=e;
      for (let i=0;i<6&&n;i++){ op *= Number(getComputedStyle(n).opacity); n=n.parentElement; }
      return Math.round(r.top)+'/'+op.toFixed(2);
    });
    rows.push(y+':'+s);
  }
  console.log(label.padEnd(4), rows.join('  '));
  await p.context().close();
}
await b.close();
