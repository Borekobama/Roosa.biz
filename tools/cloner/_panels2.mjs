import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [base,route,label] of [
  ['https://solene.framer.ai','/merch/daily-multivitamin%E2%84%A2','src'],
  [process.env.CLONE_BASE??'http://localhost:3111','/merch/daily-multivitamin','cln'],
]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+route, { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2600);
  const heights = () => p.evaluate(()=>{
    const out={};
    for (const name of ['Benefits','Ingredients','Quality and Certification']) {
      const h=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&(e.textContent||'').trim()===name)[0];
      if(!h){out[name]='-';continue;}
      // the row's own height grows when its panel opens
      let n=h; for(let i=0;i<5&&n;i++){const r=n.getBoundingClientRect(); if(r.width>400) break; n=n.parentElement;}
      out[name]=Math.round(n.getBoundingClientRect().height);
    }
    return out;
  });
  const click = async (name) => {
    await p.evaluate((n)=>{
      const h=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&(e.textContent||'').trim()===n)[0];
      let t=h; for(let i=0;i<5&&t;i++){ if(t.tagName==='BUTTON'||t.getAttribute('role')==='button') break; t=t.parentElement; }
      (t??h).dispatchEvent(new MouseEvent('click',{bubbles:true}));
      (t??h).click?.();
    }, name);
    await p.waitForTimeout(900);
  };
  console.log('=== '+label);
  console.log('  closed      ', JSON.stringify(await heights()));
  await click('Benefits');
  console.log('  +Benefits   ', JSON.stringify(await heights()));
  await click('Ingredients');
  console.log('  +Ingredients', JSON.stringify(await heights()));
  await p.context().close();
}
await b.close();
