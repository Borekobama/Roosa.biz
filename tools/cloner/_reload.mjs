import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/', { waitUntil:'domcontentloaded', timeout:90000 });
  const rows=[];
  for (let i=0;i<16;i++) {
    const s = await p.evaluate(()=>{
      const hdr=[...document.querySelectorAll('header,nav')].map(e=>e.getBoundingClientRect()).filter(r=>r.width>800)[0];
      const h1=[...document.querySelectorAll('h1,h2')].find(e=>/Daily well-being requires/i.test(e.textContent||''));
      const img=[...document.querySelectorAll('img')].map(i=>i.getBoundingClientRect()).filter(r=>r.width>500)[0];
      const f = (e)=> e ? Math.round(e.top) : null;
      const op = (el)=> el ? Number(getComputedStyle(el).opacity).toFixed(2) : '-';
      return [f(hdr), h1?Math.round(h1.getBoundingClientRect().top):null, op(h1), img?Math.round(img.top):null].join('/');
    });
    rows.push(s);
    await p.waitForTimeout(110);
  }
  console.log(label.padEnd(4), rows.join(' '));
  await p.context().close();
}
await b.close();
