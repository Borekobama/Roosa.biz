import { chromium } from 'playwright';
const CLN = process.env.CLONE_BASE ?? 'http://localhost:3111';
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();

// 1. merch: click an item from the listing, land on its page, buy, check out
await p.goto(CLN+'/merch', { waitUntil:'domcontentloaded' });
await p.waitForTimeout(1500);
const first = p.locator('main a[href*="/merch/"]').first();
const href = await first.getAttribute('href');
await first.click();
await p.waitForTimeout(1400);
const landed = await p.evaluate(()=>({
  url: location.pathname,
  title: document.querySelector('h3')?.textContent?.trim().slice(0,28),
  price: [...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/^\$\d/.test(e.textContent.trim()))[0]?.textContent.trim(),
  cta: [...document.querySelectorAll('button')].map(e=>e.textContent.trim()).find(t=>/Buy Now|Out of Stock/.test(t)),
}));
console.log('MERCH click ->', href, JSON.stringify(landed));
if (landed.cta === 'Buy Now') {
  await p.getByRole('button', { name: 'Buy Now' }).first().click();
  await p.waitForTimeout(800);
  const inCart = await p.evaluate(()=>(document.querySelector('aside[aria-label="Your cart"]')?.innerText||'').replace(/\s+/g,' ').slice(0,64));
  await p.getByRole('button', { name: /Checkout/i }).first().click();
  await p.waitForTimeout(900);
  const done = await p.evaluate(()=>(document.querySelector('aside[aria-label="Your cart"]')?.innerText||'').replace(/\s+/g,' ').slice(0,44));
  console.log('MERCH buy   ->', JSON.stringify(inCart), '->', JSON.stringify(done));
}

// 2. the benefits cards must zoom as they are reached
await p.goto(CLN+'/', { waitUntil:'domcontentloaded' });
await p.waitForTimeout(1500);
const target = await p.evaluate(()=>{
  const e=[...document.querySelectorAll('h3')].find(x=>/Recovery boost/.test(x.textContent||''));
  return e? Math.round(e.getBoundingClientRect().top+window.scrollY) : null;
});
const read = async (off) => {
  await p.evaluate(v=>window.scrollTo(0,v), target-off);
  await p.waitForTimeout(520);
  return p.evaluate(()=>{
    const e=[...document.querySelectorAll('h3')].find(x=>/Recovery boost/.test(x.textContent||''));
    let n=e; for(let i=0;i<6&&n;i++){const c=getComputedStyle(n); if(c.opacity!=='1'||c.transform!=='none') return c.opacity+' '+c.transform.slice(0,30); n=n.parentElement;}
    return '1 none';
  });
};
console.log('BENTO zoom  far:', await read(1100), '| in view:', await read(400));

// 3. mobile menu open
const m = await (await b.newContext({viewport:{width:390,height:844}})).newPage();
await m.goto(CLN+'/', { waitUntil:'domcontentloaded' });
await m.waitForTimeout(1500);
const before = await m.evaluate(()=>document.querySelectorAll('#mobile-menu').length);
await m.getByRole('button', { name: 'Open menu' }).click();
await m.waitForTimeout(700);
const after = await m.evaluate(()=>{
  const el=document.querySelector('#mobile-menu');
  if(!el) return 'none';
  const links=[...el.querySelectorAll('a')].map(a=>a.textContent.trim());
  return links.join(',')+' | h='+Math.round(el.getBoundingClientRect().height);
});
console.log('MENU        before panels:', before, '| after:', after);
await b.close();
