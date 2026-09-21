import { chromium } from 'playwright';
const b = await chromium.launch();
const out = {};
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,55));}});
  await p.waitForTimeout(700);
  out[label] = await p.evaluate(()=>{
    const res={};
    // FAQ: question column geometry and the six questions
    const qs=[...document.querySelectorAll('h5,h3')].map(e=>e.textContent.trim()).filter(t=>t.endsWith('?'));
    const q1=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/take Solene daily/i.test(e.textContent||''))[0];
    res.faq = { count: qs.length, first: qs[0]?.slice(0,34),
      x: q1? Math.round(q1.getBoundingClientRect().x):null,
      fs: q1? getComputedStyle(q1).fontSize:null, color: q1? getComputedStyle(q1).color:null };
    // Regenerative news card: the inset overlay block
    const card=[...document.querySelectorAll('a')].filter(a=>/Sustained energy/i.test(a.innerText||''))[0];
    if (card) {
      const cr=card.getBoundingClientRect();
      const box=[...card.querySelectorAll('div')].map(d=>({d,r:d.getBoundingClientRect()}))
        .filter(o=>o.r.width>300&&o.r.height<200).sort((a,b)=>b.r.top-a.r.top)[0];
      res.news = { card: Math.round(cr.width)+'x'+Math.round(cr.height),
        inset: box? [Math.round(box.r.x-cr.x), Math.round(cr.bottom-box.r.bottom), Math.round(box.r.width), Math.round(box.r.height)].join(',') : 'none',
        radius: box? getComputedStyle(box.d).borderRadius : null,
        bg: box? getComputedStyle(box.d).backgroundColor : null };
    }
    return res;
  });
  await p.context().close();
}
console.log('FAQ  src', JSON.stringify(out.src.faq));
console.log('FAQ  cln', JSON.stringify(out.cln.faq));
console.log('NEWS src', JSON.stringify(out.src.news));
console.log('NEWS cln', JSON.stringify(out.cln.news));
await b.close();
