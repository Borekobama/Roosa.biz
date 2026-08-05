import { products } from "@/lib/content";

export const shopifyConfigured = Boolean(
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN && process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
);

export async function getProducts() {
  // The local catalogue preserves layout and interaction behavior without inventing live commerce data.
  // Replace with Storefront API queries when client credentials and product handles are available.
  return products;
}
