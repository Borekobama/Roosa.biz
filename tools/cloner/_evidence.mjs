import { chromium } from 'playwright';
const BASE = process.env.CLONE_BASE ?? 'http://localhost:3111';
const b = await chromium.launch();
const ctx = await b.newContext({viewport:{width:1440,height:900}});
const p = await ctx.newPage();

// 1. cart: add a line, adjust, check out
await p.goto(BASE+'/merch/cap', { waitUntil:'domcontentloaded' });
await p.waitForTimeout(1400);
await p.getByRole('button', { name: 'Buy Now' }).first().click();
await p.waitForTimeout(800);
let s = await p.evaluate(()=>{
  const a=document.querySelector('aside[aria-label="Your cart"]');
  return { open: a?.getBoundingClientRect().x < 1440, text: (a?.innerText||'').replace(/\s+/g,' ').slice(0,90) };
});
console.log('CART after add   ', JSON.stringify(s));
await p.getByRole('button', { name: /Increase|\+/ }).first().click().catch(()=>{});
await p.waitForTimeout(500);
s = await p.evaluate(()=>({ text:(document.querySelector('aside[aria-label="Your cart"]')?.innerText||'').replace(/\s+/g,' ').slice(0,90) }));
console.log('CART after qty+  ', JSON.stringify(s));
await p.getByRole('button', { name: /Checkout/i }).first().click().catch(()=>{});
await p.waitForTimeout(900);
s = await p.evaluate(()=>({ text:(document.querySelector('aside[aria-label="Your cart"]')?.innerText||'').replace(/\s+/g,' ').slice(0,80) }));
console.log('CART after check ', JSON.stringify(s));

// 2. blog card hover zoom
await p.goto(BASE+'/blog', { waitUntil:'domcontentloaded' });
await p.waitForTimeout(1500);
await p.evaluate(()=>window.scrollTo(0,330));
await p.waitForTimeout(500);
const before = await p.evaluate(()=>{const i=[...document.querySelectorAll('main img')].filter(x=>x.getBoundingClientRect().width>400)[0];
  return getComputedStyle(i).transform;});
await p.locator('main a[href*="/blog/"]').first().hover();
await p.waitForTimeout(800);
const after = await p.evaluate(()=>{const i=[...document.querySelectorAll('main img')].filter(x=>x.getBoundingClientRect().width>400)[0];
  return getComputedStyle(i).transform;});
console.log('BLOG hover       ', before, '->', after, '| zooms:', before!==after);

// 3+4. science: benefit cards pop in, nutrition rows rise
await p.goto(BASE+'/science', { waitUntil:'domcontentloaded' });
await p.waitForTimeout(1500);
for (const [label, marker] of [['benefit card','Natural energy'],['nutrition row','Calories']]) {
  await p.evaluate(()=>window.scrollTo(0,0));
  await p.waitForTimeout(400);
  const target = await p.evaluate((m)=>{
    const e=[...document.querySelectorAll('*')].filter(x=>x.children.length===0&&(x.textContent||'').trim().startsWith(m))[0];
    return e? Math.round(e.getBoundingClientRect().top+window.scrollY) : null;
  }, marker);
  // park just above it, then scroll it into the reveal band and sample
  await p.evaluate(v=>window.scrollTo(0,v-950), target);
  await p.waitForTimeout(600);
  const t0 = await p.evaluate((m)=>{
    const e=[...document.querySelectorAll('*')].filter(x=>x.children.length===0&&(x.textContent||'').trim().startsWith(m))[0];
    let n=e; for(let i=0;i<5&&n;i++){const c=getComputedStyle(n); if(c.transform!=='none'||c.opacity!=='1') return c.opacity+' '+c.transform.slice(0,34); n=n.parentElement;}
    return '1 none';
  }, marker);
  await p.evaluate(v=>window.scrollTo(0,v-450), target);
  await p.waitForTimeout(900);
  const t1 = await p.evaluate((m)=>{
    const e=[...document.querySelectorAll('*')].filter(x=>x.children.length===0&&(x.textContent||'').trim().startsWith(m))[0];
    let n=e; for(let i=0;i<5&&n;i++){const c=getComputedStyle(n); if(c.transform!=='none'||c.opacity!=='1') return c.opacity+' '+c.transform.slice(0,34); n=n.parentElement;}
    return '1 none';
  }, marker);
  console.log((label+'   ').slice(0,17), 'before:', t0, '| after:', t1, '| animates:', t0!==t1);
}
await b.close();
