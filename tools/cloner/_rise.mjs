import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/blog', { waitUntil:'domcontentloaded', timeout:90000 });
  const rows=[];
  for (let i=0;i<10;i++) {
    rows.push(await p.evaluate(()=>{
      const h=[...document.querySelectorAll('h1,h2')].find(e=>/Resources and insights/i.test(e.textContent||''));
      if(!h) return '-';
      // fold any translate on the heading or its wrappers
      let dy=0, n=h;
      for (let k=0;k<5&&n;k++){
        const m=new DOMMatrixReadOnly(getComputedStyle(n).transform);
        dy += m.m42; n=n.parentElement;
      }
      return Math.round(dy);
    }));
    await p.waitForTimeout(110);
  }
  console.log(label.padEnd(4), 'translateY:', rows.join(' '));
  await p.context().close();
}
await b.close();
