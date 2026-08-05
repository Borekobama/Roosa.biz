import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDir, "..");
const publicDir = join(root, "public");

const replacements = new Map([
  ["PRODUCT_PRICE", "CHF 12.90 · demo"],
  ["BUNDLE_PRICE", "CHF 39.90 · demo"],
  ["SUBSCRIPTION_PRICE", "CHF 11.60 · demo delivery"],
  ["B2B_QUOTE", "Request a quotation"],
  ["PACK_SIZE", "8-roll pack"],
  ["ROLL_COUNT", "8"],
  ["BUNDLE_PACK_SIZE", "4 × 8-roll packs"],
  ["BUNDLE_ROLL_COUNT", "32"],
  ["SUBSCRIPTION_PACK_SIZE", "8-roll delivery"],
  ["B2B_MINIMUM_QUANTITY", "From 6 cases"],
  ["DELIVERY_REGION", "Switzerland · demo"],
  ["DELIVERY_FREQUENCY", "Every 4 or 8 weeks"],
  ["STOCK_STATUS", "In stock · demo inventory"],
  ["SUBSCRIPTION_STATUS", "Available in demo mode"],
  ["B2B_AVAILABILITY", "Quotation demo available"],
  ["SHEETS_PER_ROLL", "150 · demo catalog value"],
  ["PLY_COUNT", "3"],
  ["PAPER_MATERIAL", "Soft embossed tissue · demo copy"],
  ["MANUFACTURING_COUNTRY", "Switzerland · demo catalog value"],
  ["CONTRIBUTION_AMOUNT", "CHF 1.00 · demo allocation"],
  ["CONTRIBUTION_UNIT", "demo pack sold"],
  ["PARTNER_NAME", "Bündnis Kinderschutz Schweiz · demo record"],
  ["TRANSFER_FREQUENCY", "Monthly · demo schedule"],
  ["CERTIFICATION_STATUS", "Document library demo"],
  ["CERTIFICATE_URL", "Available in the demo impact record"],
  ["SHOPIFY_SUBTOTAL", "Demo subtotal"],
  ["SHIPPING_RATE", "CHF 6.90 · waived from CHF 60"],
  ["TAX_AMOUNT", "included in demo prices"],
]);

function humanStatus(token) {
  return replacements.get(token) ?? `${token.toLowerCase().replaceAll("_", " ")} pending approval`;
}

function refine(text) {
  return text
    .replaceAll("/v2-shop/", "/v3-shop/")
    .replaceAll("/v2-product/", "/v3-product/")
    .replaceAll("/v2-cart/", "/v3-cart/")
    .replace(/\[([A-Z][A-Z0-9_]+)\]/g, (_match, token) => humanStatus(token));
}

async function refineTree(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await refineTree(path);
    else if ([".html", ".js", ".css", ".ts", ".tsx"].includes(extname(path))) {
      const source = await readFile(path, "utf8");
      const output = refine(source);
      if (output !== source) await writeFile(path, output, "utf8");
    }
  }
}

for (const name of ["shop", "product", "cart"]) {
  const source = join(publicDir, `v2-${name}`);
  const target = join(publicDir, `v3-${name}`);
  await mkdir(target, { recursive: true });
  await cp(source, target, { recursive: true, force: true });
  await refineTree(target);
}

await refineTree(join(root, "src"));
console.log("Prepared V3 commerce and application routes.");
