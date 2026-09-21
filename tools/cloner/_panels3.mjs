import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto((process.env.CLONE_BASE??'http://localhost:3111')+'/merch/daily-multivitamin', { waitUntil:'domcontentloaded' });
await p.waitForTimeout(1600);
const state = () => p.evaluate(()=>[...document.querySelectorAll('[aria-expanded]')]
  .filter(e=>/Benefits|Ingredients|Quality/.test(e.textContent||''))
  .map(e=>e.textContent.trim().split('\n')[0]+'='+e.getAttribute('aria-expanded')));
console.log('closed      ', JSON.stringify(await state()));
await p.getByRole('button', { name: /Benefits/ }).first().click(); await p.waitForTimeout(600);
console.log('+Benefits   ', JSON.stringify(await state()));
await p.getByRole('button', { name: /Ingredients/ }).first().click(); await p.waitForTimeout(600);
console.log('+Ingredients', JSON.stringify(await state()));
await p.getByRole('button', { name: /Quality/ }).first().click(); await p.waitForTimeout(600);
console.log('+Quality    ', JSON.stringify(await state()));
await b.close();
