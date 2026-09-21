import { chromium } from 'playwright';
/** The source's product and article URLs, which differ from this clone's
 *  because its copy is original. */
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
for (const route of ['/merch', '/blog']) {
  await p.goto('https://solene.framer.ai' + route, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2200);
  const urls = await p.evaluate(() => {
    // Absolute or relative, and possibly on a wrapper rather than the card.
    return [...new Set([...document.querySelectorAll('a[href]')]
      .map(a => a.href)
      .filter(h => /solene\.framer\.ai\/(merch|blog)\/./.test(h))
      .map(h => h.replace('https://solene.framer.ai', '')))];
  });
  console.log(`=== ${route} ===`);
  urls.forEach(u => console.log('  ' + u));
}
await b.close();
