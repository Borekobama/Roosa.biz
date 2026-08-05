"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import styles from "@/components/Commerce.module.css";
import { localizedPath } from "@/lib/i18n";
import type { Locale, Product } from "@/types/content";

export function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const { addItem } = useCart();
  const [message, setMessage] = useState("");
  const productPath = localizedPath(locale, `/product/${product.slug}`);
  const stockLabel = product.inStock === true ? "Available" : product.inStock === false ? "Currently unavailable" : "Inventory confirmation pending";

  function addToDemoCart() {
    addItem(product);
    setMessage(`${product.name} added to the demo cart.`);
  }

  return (
    <article className={styles.productCard}>
      <Link className={styles.cardMedia} href={productPath} aria-label={`View ${product.name}`}>
        <Image className={styles.cardPrimary} src={product.image} alt={product.name} fill sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw" />
        <Image className={styles.cardAlternate} src={product.alternateImage} alt="" fill sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw" />
      </Link>
      <div className={styles.cardBody}>
        <div className={styles.cardHeadingRow}>
          <h2 className={styles.cardTitle}><Link href={productPath}>{product.name}</Link></h2>
          <strong>{product.displayPrice}</strong>
        </div>
        <p className={styles.cardMeta}>{product.packSize} · {product.rolls} rolls · {product.ply}-ply</p>
        <p className={styles.status}>{stockLabel}</p>
        <div className={styles.cardActions}>
          <button className={styles.cardButton} type="button" onClick={addToDemoCart} disabled={product.inStock === false}>Add to demo cart</button>
          <Link className={styles.buttonSecondary} href={productPath}>View product</Link>
        </div>
        <p className="sr-only" aria-live="polite">{message}</p>
      </div>
    </article>
  );
}
