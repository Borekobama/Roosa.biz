import { chromium } from 'playwright';

/**
 * Enumerate the source's SOL-G7 panel subtree: every descendant with its
 * computed paint properties, so the darkening mechanism is read off the DOM
 * rather than guessed from pixels.
 */
const base = process.env.BASE ?? 'https://solene.framer.ai';
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
await p.waitForTimeout(2500);
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
await p.waitForTimeout(600);

const out = await p.evaluate(() => {
  const leaf = [...document.querySelectorAll('*')].filter(x => x.children.length === 0 && /SOL-G7/.test(x.textContent || ''))[0];
  let panel = leaf;
  for (let i = 0; i < 9 && panel; i++) { const r = panel.getBoundingClientRect(); if (r.width > 1300 && r.height > 600) break; panel = panel.parentElement; }
  const pr = panel.getBoundingClientRect();
  const rows = [];
  const desc = (el, depth) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const interesting =
      (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent') ||
      s.backgroundImage !== 'none' || s.filter !== 'none' || s.backdropFilter !== 'none' ||
      s.mixBlendMode !== 'normal' || s.opacity !== '1' || el.tagName === 'IMG' || el.tagName === 'CANVAS' || el.tagName === 'SVG';
    if (interesting) {
      rows.push({
        d: depth, tag: el.tagName, cls: (el.className.baseVal ?? el.className ?? '').toString().slice(0, 60),
        box: [Math.round(r.left - pr.left), Math.round(r.top - pr.top), Math.round(r.width), Math.round(r.height)],
        bg: s.backgroundColor, bgi: s.backgroundImage.slice(0, 120), op: s.opacity,
        blend: s.mixBlendMode, filt: s.filter, bfilt: s.backdropFilter,
        src: el.tagName === 'IMG' ? el.currentSrc.slice(-150) : '',
        ofit: el.tagName === 'IMG' ? s.objectFit : '', z: s.zIndex, pos: s.position,
      });
    }
    for (const c of el.children) desc(c, depth + 1);
  };
  desc(panel, 0);
  // ancestors too
  const anc = [];
  let a = panel;
  while (a && a !== document.documentElement) {
    const s = getComputedStyle(a);
    anc.push({ tag: a.tagName, cls: (a.className ?? '').toString().slice(0, 50), bg: s.backgroundColor, filt: s.filter, blend: s.mixBlendMode, op: s.opacity, iso: s.isolation });
    a = a.parentElement;
  }
  // pseudo elements on the panel and its first two levels
  const pseudo = [];
  const walk = (el, path) => {
    for (const pe of ['::before', '::after']) {
      const s = getComputedStyle(el, pe);
      if (s.content !== 'none' && s.content !== 'normal') {
        pseudo.push({ path, pe, content: s.content.slice(0, 40), bg: s.backgroundColor, bgi: s.backgroundImage.slice(0, 100), blend: s.mixBlendMode, op: s.opacity, w: s.width, h: s.height, ins: [s.top, s.right, s.bottom, s.left].join(' '), filt: s.filter, bfilt: s.backdropFilter });
      }
    }
    if (path.split('>').length < 4) [...el.children].forEach((c, i) => walk(c, path + '>' + c.tagName + i));
  };
  walk(panel, 'PANEL');
  return { panelBox: [Math.round(pr.left), Math.round(pr.top + scrollY), Math.round(pr.width), Math.round(pr.height)], rows, anc, pseudo };
});

console.log('panel box', out.panelBox.join(','));
console.log('\n--- ancestors (outward) ---');
out.anc.forEach(a => console.log(`${a.tag}.${a.cls} bg=${a.bg} filter=${a.filt} blend=${a.blend} op=${a.op} iso=${a.iso}`));
console.log('\n--- painted descendants ---');
out.rows.forEach(r => console.log(`${'  '.repeat(r.d)}${r.tag} [${r.box.join(',')}] bg=${r.bg} op=${r.op} blend=${r.blend} filt=${r.filt} bfilt=${r.bfilt} z=${r.z} pos=${r.pos}\n${'  '.repeat(r.d)}   bgi=${r.bgi}\n${'  '.repeat(r.d)}   src=${r.src} ofit=${r.ofit}`));
console.log('\n--- pseudo elements ---');
out.pseudo.forEach(p => console.log(`${p.path}${p.pe} content=${p.content} bg=${p.bg} bgi=${p.bgi} blend=${p.blend} op=${p.op} ${p.w}x${p.h} inset=${p.ins} filt=${p.filt} bfilt=${p.bfilt}`));
await b.close();
