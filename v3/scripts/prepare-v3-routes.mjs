import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDir, "..");
const publicDir = join(root, "public");

const replacements = new Map([
  ["PRODUCT_PRICE", "Price at launch"],
  ["BUNDLE_PRICE", "Price at launch"],
  ["SUBSCRIPTION_PRICE", "Terms at launch"],
  ["B2B_QUOTE", "Request a quotation"],
  ["PACK_SIZE", "Pack details pending"],
  ["ROLL_COUNT", "Roll count pending"],
  ["BUNDLE_PACK_SIZE", "Bundle details pending"],
  ["BUNDLE_ROLL_COUNT", "Roll count pending"],
  ["SUBSCRIPTION_PACK_SIZE", "Delivery details pending"],
  ["B2B_MINIMUM_QUANTITY", "Minimum pending"],
  ["DELIVERY_REGION", "Regions by quotation"],
  ["DELIVERY_FREQUENCY", "Frequency pending"],
  ["STOCK_STATUS", "Availability pending"],
  ["SUBSCRIPTION_STATUS", "Not active"],
  ["B2B_AVAILABILITY", "By quotation"],
  ["SHEETS_PER_ROLL", "Specification pending"],
  ["PLY_COUNT", "Specification pending"],
  ["PAPER_MATERIAL", "Specification pending"],
  ["MANUFACTURING_COUNTRY", "Manufacturing detail pending"],
  ["CONTRIBUTION_AMOUNT", "Amount pending approval"],
  ["CONTRIBUTION_UNIT", "basis pending approval"],
  ["PARTNER_NAME", "Partner pending approval"],
  ["TRANSFER_FREQUENCY", "Schedule pending approval"],
  ["CERTIFICATION_STATUS", "Document pending"],
  ["CERTIFICATE_URL", "Link pending"],
  ["SHOPIFY_SUBTOTAL", "Calculated at checkout"],
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
