import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

/*
 * Pulls full-resolution originals from the live ROOSA site (roosa.net) into
 * public/media. Supersedes archive/first-pass-2026-07-22/scripts/download-assets.mjs,
 * which took WordPress's generated -388x449 and -768x768 crops — far too small
 * for the layouts here, so Next/Image had nothing to scale down from.
 *
 * WordPress keeps the original upload at the same path without the generated
 * size suffix, which is what every URL below points at.
 */
const assets = [
  // Journal / press photography (1200x742 originals)
  ["journal/little-fighter.jpg", "https://roosa.net/wp-content/uploads/2026/05/logan-titel-1.jpg"],
  ["journal/field-team.jpg", "https://roosa.net/wp-content/uploads/2026/05/haustuerverkaeufer.jpg"],
  ["journal/family-support.jpg", "https://roosa.net/wp-content/uploads/2026/04/berlin-titel.jpg"],
  ["journal/galileo.jpg", "https://roosa.net/wp-content/uploads/2026/04/galileo-titel.jpg"],
  ["journal/hoodie.jpg", "https://roosa.net/wp-content/uploads/2026/04/Hoodie-Titel-2.jpg"],

  // Product photography (1080x1080 and 2048px originals, previously 768x768)
  ["products/pink-pack.jpg", "https://roosa.net/wp-content/uploads/2026/06/roosa_rosa_stahl.jpg"],
  ["products/white-pack.jpg", "https://roosa.net/wp-content/uploads/2026/05/roosa_weiss_stahl.jpg"],
  ["products/pack-72.jpg", "https://roosa.net/wp-content/uploads/2026/05/roosa-72-1.jpg"],
  ["products/pink-roll.webp", "https://roosa.net/wp-content/uploads/2026/03/ROOSA_2.webp"],
  ["products/roll-detail-3.webp", "https://roosa.net/wp-content/uploads/2026/03/ROOSA_3.webp"],
  ["products/roll-detail-4.webp", "https://roosa.net/wp-content/uploads/2026/03/ROOSA_4.webp"],
  ["products/roll-detail-5.webp", "https://roosa.net/wp-content/uploads/2026/03/ROOSA_5.webp"],
  ["products/roll-single.webp", "https://roosa.net/wp-content/uploads/2026/04/WCPFA_Rolle_01_2048x.webp"],
  ["products/embossed-roll.webp", "https://roosa.net/wp-content/uploads/2026/04/4-lagigesWC-Papier-Praegung_2048x.webp"],

  // Brand
  ["brand/roosa-wordmark.png", "https://roosa.net/wp-content/uploads/2026/03/ROOSA_Schriftzug-1024x213-1.png"],
];

const root = join(process.cwd(), "public/media");
const concurrency = 4;

async function download([target, url]) {
  const response = await fetch(url, { headers: { "user-agent": "ROOSA redesign asset migration" } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const output = join(root, target);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, bytes);
  return `${target} (${(bytes.length / 1024).toFixed(0)} KB)`;
}

for (let i = 0; i < assets.length; i += concurrency) {
  const done = await Promise.all(assets.slice(i, i + concurrency).map(download));
  done.forEach((line) => console.log(`fetched ${line}`));
}
