"use client";

import { useCart } from "@/components/CartProvider";
import styles from "@/components/Commerce.module.css";
import type { Product } from "@/types/content";

export function StickyPurchaseBar({ product }: { product: Product }) {
  const { addItem } = useCart();
  const stockLabel = product.inStock === true ? "available" : product.inStock === false ? "unavailable" : "inventory pending";

  return (
    <aside className={styles.stickyBar} aria-label="Quick purchase">
      <div className={styles.stickyInner}>
        <div className={styles.stickyInfo}>
          <strong>{product.name}</strong>
          <span>{product.displayPrice} · {stockLabel}</span>
        </div>
        <button className={styles.buttonPrimary} type="button" onClick={() => addItem(product)} disabled={product.inStock === false}>Add demo item</button>
      </div>
    </aside>
  );
}
