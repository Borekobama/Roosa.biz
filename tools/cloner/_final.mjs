import { chromium } from 'playwright';
const b = await chromium.launch();
const R = {};
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const ctx = await b.newContext({viewport:{width:1440,height:900}});
  const p = await ctx.newPage();
  const r = {};

  // A. comparison table geometry
  await p.goto(base+'/science', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(x=>setTimeout(x,55));}});
  await p.evaluate(()=>{const e=[...document.querySelectorAll('*')].filter(x=>x.children.length===0&&/outperforms/.test(x.textContent||''))[0];
    if(e) window.scrollTo(0, e.getBoundingClientRect().top+window.scrollY-140);});
  await p.waitForTimeout(900);
  r.cmp = await p.evaluate(()=>{
    const row=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/High potency/.test(e.textContent||''))[0];
    const others=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/^Uncommon$/.test((e.textContent||'').trim()))[0];
    const marks=[...document.querySelectorAll('svg')].map(s=>s.getBoundingClientRect()).filter(x=>x.width>50&&x.width<120&&x.height<60);
    return { label: row? Math.round(row.getBoundingClientRect().x)+'/'+getComputedStyle(row).fontSize : null,
      others: others? Math.round(others.getBoundingClientRect().x)+'/'+getComputedStyle(others).fontSize : null,
      marks: marks.length? Math.round(marks[0].width)+'x'+Math.round(marks[0].height)+' n='+marks.length : 'none' };
  });

  // B. homepage news card overlay
  await p.goto(base+'/', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(x=>setTimeout(x,55));}});
  await p.evaluate(()=>{const e=[...document.querySelectorAll('*')].filter(x=>x.children.length===0&&/regenerative/.test(x.textContent||''))[0];
    if(e) window.scrollTo(0, e.getBoundingClientRect().top+window.scrollY-60);});
  await p.waitForTimeout(900);
  r.news = await p.evaluate(()=>{
    const card=[...document.querySelectorAll('a')].filter(a=>/Sustained energy/i.test(a.innerText||''))[0];
    if(!card) return 'none';
    const cr=card.getBoundingClientRect();
    const box=[...card.querySelectorAll('div')].map(d=>({d,r:d.getBoundingClientRect(),c:getComputedStyle(d)}))
      .filter(o=>o.c.backgroundColor!=='rgba(0, 0, 0, 0)')[0];
    return { card: Math.round(cr.width)+'x'+Math.round(cr.height),
      box: box? `inset ${Math.round(box.r.x-cr.x)},${Math.round(cr.bottom-box.r.bottom)} ${Math.round(box.r.width)}x${Math.round(box.r.height)} r=${box.c.borderRadius} ${box.c.backgroundColor}` : 'none' };
  });
  R[label]=r;
  await ctx.close();
}
console.log('COMPARISON src', JSON.stringify(R.src.cmp));
console.log('COMPARISON cln', JSON.stringify(R.cln.cmp));
console.log('NEWS CARD  src', JSON.stringify(R.src.news));
console.log('NEWS CARD  cln', JSON.stringify(R.cln.news));
await b.close();
