import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/science', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2600);
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,55));}});
  await p.waitForTimeout(700);
  const r = await p.evaluate(()=>{
    const h=[...document.querySelectorAll('h1,h2,h3')].find(e=>/Chosen by people/i.test(e.textContent||''));
    if(!h) return null;
    const c=getComputedStyle(h); const rect=h.getBoundingClientRect();
    // count the rendered lines
    const range=document.createRange(); range.selectNodeContents(h);
    return { x:Math.round(rect.x), w:Math.round(rect.width), h:Math.round(rect.height),
      fs:c.fontSize, lh:c.lineHeight, lines: Math.round(rect.height/parseFloat(c.lineHeight)),
      textW: Math.round(range.getBoundingClientRect().width) };
  });
  console.log(label, JSON.stringify(r));
  await p.context().close();
}
await b.close();
